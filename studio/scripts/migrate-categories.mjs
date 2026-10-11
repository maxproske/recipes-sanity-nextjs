// One-off: move recipes from the single `category` reference to a
// multi-select `categories` array, add Indian* and German* categories, split
// up International, and delete the then-empty International category.
//
// Dry run (default) prints every change:  npx sanity exec scripts/migrate-categories.mjs --with-user-token
// Apply in one transaction:               npx sanity exec scripts/migrate-categories.mjs --with-user-token -- --commit
import { getCliClient } from 'sanity/cli'

const COMMIT = process.argv.includes('--commit')
const client = getCliClient({ apiVersion: '2025-03-01' })

// Category titles below are written without the trailing "*" (which marks a
// category as approved); they're matched against the cleaned title.
const NEW_CATEGORIES = [
  { _id: 'category-german', title: 'German*' },
  { _id: 'category-indian', title: 'Indian*' },
]

// Recipe title → categories, course first. Every recipe not listed keeps its
// current single category, now as a one-item array.
const MAPPING = {
  // Indian
  'Butter Chicken': ['Meat Recipes', 'Indian'],
  'Chicken Kosha': ['Meat Recipes', 'Indian'],
  'Egg Chicken Roll': ['Meat Recipes', 'Indian'],
  'Kolkata-Style Chicken Biryani': ['Meat Recipes', 'Indian'],
  'Lamb Curry': ['Meat Recipes', 'Indian'],
  'Malai Chicken Karahi': ['Meat Recipes', 'Indian'],
  'Murgir Jhol': ['Meat Recipes', 'Indian'],
  'IndiGo Chicken Tikka Sandwich': ['Meat Recipes', 'Indian'],
  Ghugni: ['Veggie Recipes', 'Indian'],
  'Jhuri Aloo Bhaja': ['Veggie Recipes', 'Indian'],
  'Paalak Paneer': ['Veggie Recipes', 'Indian'],
  'Shahi Paneer': ['Veggie Recipes', 'Indian'],
  'Potol bhaja': ['Veggie Recipes', 'Indian'],
  Khichdi: ['Soups & Stews', 'Indian'],
  'Musuri Daal': ['Soups & Stews', 'Indian'],
  "Dim'er Devil": ['Appetizers', 'Indian'],
  'Veg Chop': ['Appetizers', 'Indian'],
  'Rice Kheer': ['Desserts', 'Indian'],
  Rosogolla: ['Desserts', 'Indian'],
  Sitabhog: ['Desserts', 'Indian'],
  'Aloo Paratha': ['Bread', 'Indian'],
  Roti: ['Bread', 'Indian'],
  Thekua: ['Cookies, Bars & Muffins', 'Indian'],
  "Sanchi's Masala Chai": ['Beverages', 'Indian'],

  // German
  Bretzels: ['Bread', 'German'],
  "Opa's Hefezopt": ['Bread', 'German'],
  "Opa's Weichnachts Stollen": ['Bread', 'German'],
  "Opa's Bauern Bissen": ['Cookies, Bars & Muffins', 'German'],
  "Opa's Hazelnusskranz": ['Cookies, Bars & Muffins', 'German'],
  "Opa's Nutty Macroons": ['Cookies, Bars & Muffins', 'German'],
  "Opa's Vanille Hörnchen": ['Cookies, Bars & Muffins', 'German'],
  "Opa's Pflaumenkuchen": ['Desserts', 'German'],
  "Tante Mi's Apfel Kuchen": ['Desserts', 'German'],
  "Robin's Marzipan": ['Desserts', 'German'],
  "Cousine Edith's Frankfurt Goulash": ['Meat Recipes', 'German'],
  Spätzle: ['Pasta & Pizza', 'German'],

  // Rest of International → course categories
  'Eggplant Moussaka': ['Meat Recipes'], // two docs share this title
  'Greek Sheet Pan Chicken': ['Meat Recipes'],
  Tourtière: ['Meat Recipes'],
  "Joanie's Spanish (Mega) Paella": ['Meat Recipes'],
  'Thai Red Curry': ['Meat Recipes'],
  'Cornish Pasties': ['Meat Recipes'],
  "Joanie's Roberts Creek Cabbage Rolls": ['Meat Recipes'],
  "Max's Paella": ['Meat Recipes', 'Seafood Recipes'],
  "Gayle's Malaysian Salmon Laksa": ['Soups & Stews', 'Seafood Recipes'],
  Ratatouille: ['Veggie Recipes'],
  'Tomato Pear Ketchup': ['Preserves'],
  'Chili Momos': ['Appetizers'],

  // Strays
  'Half the Sugar, Twice the Ginger Pumpkin Bread': ['Bread'],
  'Rhubarb Ginger Jam': ['Preserves'],
}
const ALLOW_DUPLICATE_TITLES = new Set(['Eggplant Moussaka'])
const RETIRE = 'International Recipes'

const clean = (title = '') => title.replace(/\*+$/, '').trim()
const ref = (id) => ({
  _type: 'reference',
  _ref: id,
  _key: id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
})

const categories = await client.fetch(`*[_type == "category"]{_id, title}`)
// Published and draft recipes, so open drafts don't resurrect `category`.
const recipes = await client.fetch(
  `*[_type == "recipe"]{_id, title, category, categories}`,
  {},
  { perspective: 'raw' },
)

const allCategories = [
  ...categories,
  ...NEW_CATEGORIES.filter((n) => !categories.some((c) => c._id === n._id)),
]
const categoryId = (name) => {
  const matches = allCategories.filter((c) => clean(c.title) === name)
  if (matches.length !== 1) throw new Error(`Category "${name}" matched ${matches.length}`)
  return matches[0]._id
}
const titleOf = Object.fromEntries(allCategories.map((c) => [c._id, clean(c.title)]))
const retireId = categoryId(RETIRE)

// Every mapped title must exist, and only once unless explicitly allowed.
const errors = []
for (const title of Object.keys(MAPPING)) {
  const published = recipes.filter(
    (r) => !r._id.startsWith('drafts.') && r.title?.trim() === title,
  )
  if (published.length === 0) errors.push(`No recipe titled "${title}"`)
  if (published.length > 1 && !ALLOW_DUPLICATE_TITLES.has(title))
    errors.push(`"${title}" matches ${published.length} recipes`)
}

const plan = []
for (const recipe of recipes) {
  const mapped = MAPPING[recipe.title?.trim()]
  const current = recipe.categories?.map((c) => c._ref) ??
    (recipe.category?._ref ? [recipe.category._ref] : [])
  const next = mapped ? mapped.map(categoryId) : current
  if (next.includes(retireId))
    errors.push(`"${recipe.title}" (${recipe._id}) would stay in ${RETIRE} — add it to MAPPING`)
  plan.push({ recipe, before: current, after: next })
}

if (errors.length) {
  console.error(`Refusing to run:\n  ${errors.join('\n  ')}`)
  process.exit(1)
}

for (const { recipe, before, after } of plan) {
  const from = before.map((id) => titleOf[id]).join(' + ') || '(none)'
  const to = after.map((id) => titleOf[id]).join(' + ') || '(none)'
  if (from !== to) console.log(`${recipe._id.startsWith('drafts.') ? '[draft] ' : ''}${recipe.title.trim()}: ${from} → ${to}`)
}
const changed = plan.filter(({ before, after }) => before.join() !== after.join()).length
console.log(`\n${changed} recipes recategorised, ${plan.length} converted to categories[]`)
console.log(`Create: ${NEW_CATEGORIES.map((c) => c.title).join(', ')}. Delete: ${RETIRE} (${retireId}).`)

if (!COMMIT) {
  console.log('\nDry run — re-run with -- --commit to apply.')
  process.exit(0)
}

const tx = client.transaction()
NEW_CATEGORIES.forEach((c) => tx.createIfNotExists({ ...c, _type: 'category' }))
for (const { recipe, after } of plan) {
  tx.patch(recipe._id, (p) =>
    after.length ? p.set({ categories: after.map(ref) }).unset(['category']) : p.unset(['category']),
  )
}
tx.delete(retireId)
const result = await tx.commit({ autoGenerateArrayKeys: false })
console.log(`\nCommitted transaction ${result.transactionId} (${result.results.length} mutations).`)
