// One-off: second pass over recipe categories after the multi-category
// migration — fixes misfiled recipes and adds Sauces & Dressings* and
// Holidays*. Each listed recipe gets exactly the categories given (course
// first); unlisted recipes are untouched.
//
// Dry run (default):  npx sanity exec scripts/recategorize-recipes.mjs --with-user-token
// Apply:              npx sanity exec scripts/recategorize-recipes.mjs --with-user-token -- --commit
import { getCliClient } from 'sanity/cli'

const COMMIT = process.argv.includes('--commit')
const client = getCliClient({ apiVersion: '2025-03-01' })

const NEW_CATEGORIES = [
  { _id: 'category-sauces-dressings', title: 'Sauces & Dressings*' },
  { _id: 'category-holidays', title: 'Holidays*' },
]

const SAUCES = 'Sauces & Dressings'
const HOLIDAYS = 'Holidays'

// Recipe title → full category list. Titles without the trailing "*".
const MAPPING = {
  // Misfiled
  'Chocolate Zucchini Cake': ['Desserts'],
  "Opa's Hazelnusskranz": ['Desserts', 'German'],
  'Lemon Curd': ['Preserves'],
  'Irish Mincemeat': ['Preserves', 'Desserts', HOLIDAYS],
  'Cranberry Orange Sauce': ['Preserves', SAUCES, HOLIDAYS],
  'New Zealand Date Scones': ['Brunch'],
  'Starbucks Style Pumpkin Scones': ['Brunch'],
  'Cinnamon Buns': ['Bread', 'Brunch'],
  "Mary Krishe's Awesome Blueberry Coffee Cake": ['Desserts', 'Brunch'],
  "Opa's Pflaumenkuchen": ['Desserts', 'Brunch', 'German'],
  'Old Bay Orzo with Prawns': ['Seafood Recipes', 'Pasta & Pizza'],
  "Cindy's Seafood Pasta Casserole": ['Pasta & Pizza', 'Seafood Recipes'],
  'Lands End Arugula Pasta Salad': ['Salads', 'Pasta & Pizza'],
  "Cousine Edith's Frankfurt Goulash": ['Meat Recipes', 'Soups & Stews', 'German'],

  // Sauces & Dressings
  'Basil Vinaigrette': ['Salads', SAUCES],
  "Mom's Creamy Caesar Salad Dressing": ['Salads', SAUCES],
  "Renate Koegler's Salad Dressing": ['Salads', SAUCES],
  'Pesto Cream Sauce': ['Pasta & Pizza', SAUCES],
  'Quick Hollandaise Sauce': ['Brunch', SAUCES],
  "Rena's Mom's Hungarian Beet Sauce": ['Veggie Recipes', SAUCES],
  'Tomato Pear Ketchup': ['Preserves', SAUCES],

  // Holidays
  "Opa's Weichnachts Stollen": ['Bread', 'German', HOLIDAYS],
  "Opa's Bauern Bissen": ['Cookies, Bars & Muffins', 'German', HOLIDAYS],
  "Opa's Nutty Macroons": ['Cookies, Bars & Muffins', 'German', HOLIDAYS],
  "Opa's Vanille Hörnchen": ['Cookies, Bars & Muffins', 'German', HOLIDAYS],
  'Melting Shortbread': ['Cookies, Bars & Muffins', HOLIDAYS],
  'Christmas Pecan Toffee': ['Desserts', HOLIDAYS],
  'Christmas Morning Blueberry Crêpes': ['Brunch', HOLIDAYS],
  'Holiday Stuffing': ['Meat Recipes', HOLIDAYS],
  'Easy Pumpkin Pie': ['Desserts', HOLIDAYS],
  'No Bake Pumpkin Cheesecake': ['Desserts', HOLIDAYS],
  'Lemon Oregano Pork Stew': ['Soups & Stews', HOLIDAYS],
}

const clean = (title = '') => title.replace(/\*+$/, '').trim()
const ref = (id) => ({
  _type: 'reference',
  _ref: id,
  _key: id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
})

const categories = await client.fetch(`*[_type == "category"]{_id, title}`)
const recipes = await client.fetch(
  `*[_type == "recipe"]{_id, title, categories}`,
  {},
  { perspective: 'raw' },
)

const allCategories = [
  ...categories,
  ...NEW_CATEGORIES.filter((n) => !categories.some((c) => c._id === n._id)),
]
const titleOf = Object.fromEntries(allCategories.map((c) => [c._id, clean(c.title)]))
const errors = []
const categoryId = (name) => {
  const matches = allCategories.filter((c) => clean(c.title) === name)
  if (matches.length !== 1) errors.push(`Category "${name}" matched ${matches.length}`)
  return matches[0]?._id
}

for (const title of Object.keys(MAPPING)) {
  const published = recipes.filter(
    (r) => !r._id.startsWith('drafts.') && r.title?.trim() === title,
  )
  if (published.length !== 1) errors.push(`"${title}" matches ${published.length} recipes`)
}

const plan = recipes
  .filter((r) => MAPPING[r.title?.trim()])
  .map((recipe) => ({
    recipe,
    before: (recipe.categories || []).map((c) => c._ref),
    after: MAPPING[recipe.title.trim()].map(categoryId),
  }))
  .filter(({ before, after }) => before.join() !== after.join())

if (errors.length) {
  console.error(`Refusing to run:\n  ${errors.join('\n  ')}`)
  process.exit(1)
}

for (const { recipe, before, after } of plan) {
  const name = (ids) => ids.map((id) => titleOf[id]).join(' + ') || '(none)'
  console.log(`${recipe._id.startsWith('drafts.') ? '[draft] ' : ''}${recipe.title.trim()}: ${name(before)} → ${name(after)}`)
}
console.log(`\n${plan.length} documents to update. Create: ${NEW_CATEGORIES.map((c) => c.title).join(', ')}.`)

if (!COMMIT) {
  console.log('\nDry run — re-run with -- --commit to apply.')
  process.exit(0)
}

const tx = client.transaction()
NEW_CATEGORIES.forEach((c) => tx.createIfNotExists({ ...c, _type: 'category' }))
plan.forEach(({ recipe, after }) => tx.patch(recipe._id, (p) => p.set({ categories: after.map(ref) })))
const result = await tx.commit({ autoGenerateArrayKeys: false })
console.log(`\nCommitted transaction ${result.transactionId} (${result.results.length} mutations).`)
