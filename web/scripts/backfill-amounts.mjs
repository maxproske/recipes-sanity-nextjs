// One-off backfill: recompute the cross-standard `amounts` conversion list for
// ingredient amounts imported before buildRecipeDraft generated them. Without
// conversions, the Metric/Imperial toggle has nothing to switch to. Logic mirrors
// web/lib/recipeExtraction/buildRecipeDraft.js (buildConversions) and the studio's
// convertedAmounts.js. Dry-run by default; pass --apply to commit.
import { createClient } from "@sanity/client";
import convert from "convert-units";
import { readFileSync } from "fs";

// Unit metadata — must match web/lib/recipeExtraction/units.js.
const UNITS = {
  cup: { standard: "Traditional", type: "Volume" },
  tsp: { standard: "Traditional", type: "Volume" },
  Tbs: { standard: "Traditional", type: "Volume" },
  g: { standard: "Metric", type: "Weight" },
  ml: { standard: "Metric", type: "Volume" },
  oz: { standard: "Imperial", type: "Weight" },
  "fl-oz": { standard: "Imperial", type: "Volume" },
  quantity: { standard: "Fuzzy" },
  pinch: { standard: "Fuzzy" },
  sprinkle: { standard: "Fuzzy" },
  lb: { standard: "Imperial", type: "Weight" },
  pnt: { standard: "Imperial", type: "Volume" },
  "to-taste": { standard: "Fuzzy" },
};
const DO_NOT_CONVERT = new Set(["Traditional", "Fuzzy"]);

function buildConversions(value, unit) {
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

// An amount that SHOULD carry conversions but doesn't yet.
function needsBackfill(a) {
  if (!a || a.value == null || !a.unit) return false;
  const convertible =
    a.unit === "cup" || ["Imperial", "Metric"].includes(UNITS[a.unit]?.standard);
  if (!convertible) return false;
  const have = a.amounts?.length || 0;
  return have <= 1; // base-only (or empty) → no cross-standard entry stored
}

function getToken() {
  if (process.env.SANITY_WRITE_TOKEN) return process.env.SANITY_WRITE_TOKEN;
  const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const m = env.match(/^SANITY_WRITE_TOKEN=(.+)$/m);
  if (!m) throw new Error("SANITY_WRITE_TOKEN not found");
  return m[1].trim();
}

const APPLY = process.argv.includes("--apply");

const client = createClient({
  projectId: "fymv8y7w",
  dataset: "production",
  apiVersion: "2021-10-21",
  token: getToken(),
  useCdn: false,
  perspective: "raw", // include drafts so published + draft stay in sync
});

const recipes = await client.fetch(
  `*[_type=="recipe"]{ _id, title, ingredientSets[]{ _key, ingredients[]{ _key, amount } } }`,
);

const changes = [];
for (const r of recipes) {
  for (const set of r.ingredientSets || []) {
    for (const ing of set.ingredients || []) {
      const a = ing.amount;
      if (!needsBackfill(a)) continue;
      const next = buildConversions(a.value, a.unit);
      if (next.length <= (a.amounts?.length || 0)) continue; // nothing to add
      const path = `ingredientSets[_key=="${set._key}"].ingredients[_key=="${ing._key}"].amount.amounts`;
      changes.push({ id: r._id, title: r.title, path, value: a.value, unit: a.unit, next });
    }
  }
}

const docs = new Set(changes.map((c) => c.id));
console.log(
  `${APPLY ? "APPLYING" : "DRY RUN"} — ${changes.length} amount(s) across ${docs.size} doc(s) (of ${recipes.length} recipe docs)\n`,
);
for (const c of changes) {
  const draft = c.id.startsWith("drafts.") ? "[draft] " : "";
  const conv = c.next
    .slice(1)
    .map((x) => `${x.value} ${x.unit}`)
    .join(", ");
  console.log(`  ${draft}${c.title}: ${c.value} ${c.unit}  +[${conv}]`);
}

if (APPLY && changes.length) {
  let tx = client.transaction();
  for (const c of changes) tx = tx.patch(c.id, (p) => p.set({ [c.path]: c.next }));
  const res = await tx.commit({ autoGenerateArrayKeys: false });
  console.log(`\nCommitted. Transaction ${res.transactionId}`);
} else if (!APPLY) {
  console.log(`\n(dry run — re-run with --apply to commit)`);
}
