import { randomUUID } from "crypto";
import convert from "convert-units";
import { UNITS } from "./units";

const key = () => randomUUID().slice(0, 12);

// Mirrors studio/src/schemas/components/convertedAmounts.js: build the cross-
// standard conversion list the renderer filters by (web/components/Ingredient/
// Amount.js). Without this, imported amounts stored only their base unit and
// the Metric/Imperial toggle had nothing to switch to. Conversions only cross
// standards (Metric <-> Imperial) of the same type; Traditional/Fuzzy units and
// cups keep the studio's special handling.
const DO_NOT_CONVERT = new Set(["Traditional", "Fuzzy"]);

function buildConversions(value, unit) {
  // Cups always carry volume conversions, same as the studio.
  if (unit === "cup") {
    return [
      { value, unit: "cup" },
      { value: parseInt((value * 250).toFixed()), unit: "ml" },
      { value: parseInt((value * 8.32674).toFixed()), unit: "fl-oz" },
    ];
  }
  const thisUnit = UNITS[unit];
  const amounts = [{ value, unit }];
  if (!thisUnit || DO_NOT_CONVERT.has(thisUnit.standard)) return amounts;
  for (const otherKey of Object.keys(UNITS)) {
    const other = UNITS[otherKey];
    if (
      !DO_NOT_CONVERT.has(other.standard) &&
      other.standard !== thisUnit.standard &&
      other.type === thisUnit.type
    ) {
      amounts.push({
        value: parseFloat(convert(value).from(unit).to(otherKey).toFixed(2)),
        unit: otherKey,
      });
    }
  }
  return amounts;
}

function titleCase(s) {
  return String(s || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

// Snap fractional values to the exact decimals the renderer needs for unicode
// fraction display (web/components/Ingredient/amountHelpers.js truncates to 3
// decimal places and matches the last three digits): .125 → ⅛, .250 → ¼,
// .333 → ⅓, .500 → ½, .666 → ⅔, .750 → ¾.
// AIs commonly emit 0.33 or 0.66 which don't match — snap them.
function snapFraction(value) {
  if (value == null) return value;
  const whole = Math.trunc(value);
  const frac = value - whole;
  const targets = [0.125, 0.25, 0.333, 0.5, 0.666, 0.75];
  for (const t of targets) {
    if (Math.abs(frac - t) < 0.01) return whole + t;
  }
  return value;
}

function buildAmount({ value, unit }) {
  if (value == null && !unit) return undefined;
  const snapped = snapFraction(value);
  // If we have a numeric value but no unit, fall back to "quantity" so the
  // renderer's fraction path engages (it needs a unit to look up `standard`).
  const finalUnit = unit || (snapped != null ? "quantity" : undefined);
  const meta = finalUnit && UNITS[finalUnit] ? UNITS[finalUnit] : {};
  // `amounts` carries the cross-standard conversions the renderer filters by
  // (web/components/Ingredient/Amount.js does `amount.amounts.map(...)`), matching
  // what the Studio's IngredientAmount input writes (e.g. cup → ml → fl-oz). When
  // there's a unit but no numeric value, fall back to a single base entry.
  const base = {
    ...(snapped != null ? { value: snapped } : {}),
    ...(finalUnit ? { unit: finalUnit } : {}),
  };
  const amounts = finalUnit
    ? snapped != null
      ? buildConversions(snapped, finalUnit)
      : [base]
    : [];
  return {
    _type: "ingredientAmount",
    ...base,
    ...(meta.standard ? { standard: meta.standard } : {}),
    ...(meta.type ? { type: meta.type } : {}),
    amounts,
  };
}

function paragraphsToBlocks(paragraphs) {
  return (paragraphs || []).map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));
}

const FRAMING_WORDS = new Set([
  "the",
  "a",
  "an",
  "best",
  "perfect",
  "ultimate",
  "amazing",
  "delicious",
  "easy",
  "quick",
  "classic",
  "favourite",
  "favorite",
  "original",
  "authentic",
  "simple",
]);

// Strip leading articles, quality adjectives, and possessive names
// so the slug captures the dish itself, not the framing.
//   "The Best Lemon Bars"          -> "lemon-bars"
//   "Opa's Hazelnusskranz"         -> "hazelnusskranz"
//   "Tante Mi's Apfel Kuchen"      -> "apfel-kuchen"
//   "Renate Koegler's Salad Dressing" -> "salad-dressing"
function slugify(title) {
  if (!title) return "";
  // Normalize curly apostrophes to straight.
  let s = String(title).replace(/[‘’]/g, "'").toLowerCase().trim();

  // Strip one leading possessive phrase: one or more words ending in "'s".
  s = s.replace(/^(?:[a-zà-ÿ]+\s+)*[a-zà-ÿ]+'s\s+/, "");

  // Drop leading framing words (any number, in sequence).
  const tokens = s.split(/\s+/);
  while (tokens.length > 1 && FRAMING_WORDS.has(tokens[0])) tokens.shift();
  s = tokens.join(" ");

  return s
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function nameKey(s) {
  return String(s || "")
    .trim()
    .toLowerCase();
}

export function buildRecipeDraft({
  extracted,
  ingredientResolutions,
  categoryId,
  featuredImageAssetId,
}) {
  // Build ingredient sets, capturing each ingredient's _key + ref + resolved title
  // so the method's ingredientPicker can point back to them.
  const ingredientIndex = new Map(); // nameKey -> { setTitle, key, ref, title }

  const ingredientSets = (extracted.ingredientSets || []).map((set) => {
    const setTitle = set.title || "Ingredients";
    return {
      _type: "set",
      _key: key(),
      title: setTitle,
      ingredients: (set.ingredients || []).map((ing) => {
        const resolved = ingredientResolutions.get(ing.name);
        const ingKey = key();
        if (resolved) {
          ingredientIndex.set(nameKey(ing.name), {
            setTitle,
            key: ingKey,
            ref: resolved.id,
            title: resolved.title || titleCase(ing.name),
          });
        }
        return {
          _type: "ingredient",
          _key: ingKey,
          ...(resolved
            ? {
                ingredient: {
                  _type: "reference",
                  _ref: resolved.id,
                },
              }
            : {}),
          ...(buildAmount(ing) ? { amount: buildAmount(ing) } : {}),
          ...(ing.note ? { note: ing.note } : {}),
        };
      }),
    };
  });

  const method = (extracted.method || []).map((group) => {
    // Build the ingredientPicker JSON: { setTitle: { ingKey: { id, title } } }
    const picker = {};
    for (const rawName of group.ingredientNames || []) {
      const entry = ingredientIndex.get(nameKey(rawName));
      if (!entry) continue;
      if (!picker[entry.setTitle]) picker[entry.setTitle] = {};
      picker[entry.setTitle][entry.key] = { id: entry.ref, title: entry.title };
    }
    const hasPicker = Object.keys(picker).length > 0;

    return {
      _type: "component",
      _key: key(),
      title: group.title || "Step",
      ...(hasPicker ? { ingredients: JSON.stringify(picker) } : {}),
      description: paragraphsToBlocks(group.paragraphs),
    };
  });

  const slugBase = slugify(extracted.title) || `recipe-${Date.now()}`;
  const _id = `drafts.${randomUUID()}`;

  return {
    _id,
    _type: "recipe",
    title: extracted.title,
    slug: { _type: "slug", current: slugBase },
    ...(extracted.description ? { description: extracted.description } : {}),
    ...(featuredImageAssetId
      ? {
          featuredImage: {
            _type: "image",
            asset: { _type: "reference", _ref: featuredImageAssetId },
          },
        }
      : {}),
    ...(categoryId
      ? { category: { _type: "reference", _ref: categoryId } }
      : {}),
    ingredientSets,
    method,
  };
}

export function validateIngredientCoverage(extracted) {
  // Returns { warnings: string[] }
  const warnings = [];
  const declared = new Set();
  for (const set of extracted.ingredientSets || []) {
    for (const ing of set.ingredients || []) {
      if (ing.name) declared.add(nameKey(ing.name));
    }
  }

  const usage = new Map(); // nameKey -> count
  for (const name of declared) usage.set(name, 0);

  for (const group of extracted.method || []) {
    for (const rawName of group.ingredientNames || []) {
      const k = nameKey(rawName);
      if (!declared.has(k)) {
        warnings.push(
          `Method "${group.title}" references "${rawName}" which is not in any ingredient set`,
        );
        continue;
      }
      usage.set(k, (usage.get(k) || 0) + 1);
    }
  }

  for (const [k, count] of usage) {
    if (count === 0) {
      warnings.push(`Ingredient "${k}" is not used in any method step`);
    } else if (count > 1) {
      warnings.push(
        `Ingredient "${k}" is used in ${count} method steps (expected exactly 1)`,
      );
    }
  }

  return { warnings };
}

export const __testing = { titleCase, slugify, key, nameKey };
