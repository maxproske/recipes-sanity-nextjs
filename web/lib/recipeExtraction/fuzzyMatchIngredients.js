function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function singularize(s) {
  if (s.endsWith("ies") && s.length > 3) return s.slice(0, -3) + "y";
  if (s.endsWith("es") && s.length > 3) return s.slice(0, -2);
  if (s.endsWith("s") && s.length > 2) return s.slice(0, -1);
  return s;
}

function bigrams(s) {
  const out = new Set();
  for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
  return out;
}

function dice(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const A = bigrams(a);
  const B = bigrams(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const g of A) if (B.has(g)) inter++;
  return (2 * inter) / (A.size + B.size);
}

const SOURCE_PRIORITY = { title: 3, plural: 2, alt: 1 };

export function buildIngredientHaystack(ingredients) {
  const entries = [];
  for (const doc of ingredients) {
    if (doc.title)
      entries.push({
        id: doc._id,
        source: "title",
        text: singularize(normalize(doc.title)),
      });
    if (doc.plural)
      entries.push({
        id: doc._id,
        source: "plural",
        text: singularize(normalize(doc.plural)),
      });
    for (const alt of doc.alternativeNames || []) {
      if (alt)
        entries.push({
          id: doc._id,
          source: "alt",
          text: singularize(normalize(alt)),
        });
    }
  }
  return entries;
}

export function matchIngredient(name, haystack, threshold = 0.82) {
  const needle = singularize(normalize(name));
  if (!needle) return null;
  let best = null;
  for (const e of haystack) {
    const score = dice(needle, e.text);
    if (score < threshold) continue;
    if (
      !best ||
      score > best.score ||
      (score === best.score &&
        SOURCE_PRIORITY[e.source] > SOURCE_PRIORITY[best.source])
    ) {
      best = { id: e.id, score, source: e.source, text: e.text };
    }
  }
  return best;
}

export const __testing = { normalize, singularize, dice };
