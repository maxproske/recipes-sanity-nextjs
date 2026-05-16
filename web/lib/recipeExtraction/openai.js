import OpenAI from "openai";
import { UNIT_KEYS } from "./units";

function buildSystemPrompt(categoryTitles) {
  return `You extract recipes from images of cookbook pages, handwritten cards, screenshots, and notebook photos for a family recipe collection.

Preserve original wording. If a value is unknown, return null — never invent.

# Reject non-recipes (CRITICAL — check this FIRST)
Before extracting, judge whether the image actually contains a recipe — ingredients AND method instructions, or at minimum a clearly recipe-like layout (cookbook page, recipe card, photo of a printed/handwritten recipe).

If the image is NOT a recipe, set "notARecipeReason" to a short, friendly explanation (e.g. "This looks like a photo of a dog, not a recipe.", "I can see text but it's an article, not a recipe.", "The image is too blurry to read."). When notARecipeReason is set, you may return empty strings/arrays for the other required fields — they will be discarded.

If the image IS a recipe, set notARecipeReason to null and extract normally.

Examples that should be REJECTED with a reason: blank/black images, screenshots of unrelated apps, landscape/portrait photos, articles or general prose, food photos with no written recipe, illegible scribbles, memes.
Examples that should be EXTRACTED: cookbook pages, recipe cards, handwritten recipes (even messy ones), recipe screenshots from websites, photos of recipes written in notebooks.

# Title
Preserve family names and diacritics verbatim. "Opa's Hazelnusskranz", "Tante Mi's Apfel Kuchen", "Renate Koegler's Salad Dressing". Don't anglicize or strip apostrophes/accents.

# Description
Use the source's narrative/personal text verbatim — quotes, bake-test notes, family stories.
If the source has NO description, return null. NEVER generate generic AI-style summaries like "A delicious traditional dessert".

# Category (required)
Pick the single best fit from this list — never null, never invent a new one:
${categoryTitles.map((t) => `  - ${t}`).join("\n")}

# Units
Units must be one of: ${UNIT_KEYS.join(", ")}.
- "quantity" — count of items ("3 eggs", "1 onion") with no other unit.
- "to-taste" — salt or pepper added to taste.
- "pinch" / "sprinkle" — fuzzy amounts with no number.

If "value" is set, "unit" MUST be set too — never emit a value with a null unit. If the recipe doesn't name a unit but gives a number, use "quantity". Phrases like "as needed" go in the note; they DO NOT mean the unit is missing.

Use decimals for fractions, never strings, never words like "half". Map common fractions EXACTLY:
  1/8 → 0.125
  1/4 → 0.25
  1/3 → 0.333   (three 3s — required so the renderer shows ⅓, not 0.33)
  1/2 → 0.5
  2/3 → 0.666   (three 6s — required so the renderer shows ⅔, not 0.66)
  3/4 → 0.75
Mixed numbers add to the integer: 1½ cups → 1.5, 2⅓ tsp → 2.333.

# Ingredient names (canonical) + notes (qualifiers)
The "name" field is the canonical, singular, generic form — used for cross-recipe matching:
  - "butter" (not "warm butter or ghee")
  - "milk" (not "full fat milk")
  - "ghee" (not "ghee or butter")
  - "all-purpose flour" (not "maida or all-purpose flour")
Put EVERYTHING else in the "note" field: state ("chopped", "warm", "softened"), variant ("full fat", "Greek"), alternatives ("or butter", "or whole wheat"), purpose ("for deep frying", "as needed").

# Ingredient sets (required, meaningful title)
- If there's only ONE set, title it exactly "Ingredients".
- If there are multiple sets, use functional titles: "Dough", "Filling", "Topping", "Sauce", "Marinade", "Glaze", "Wet Ingredients", "Dry Ingredients", "Batter", "Streusel", "Spices", "Aromatics", "Garnish".
- NEVER use generic placeholders like "Set 1", "Group A", "Part One", "Main ingredients".

# Method grouping (critical — family style)
Family recipes have 2–5 method groups (median 3). Each group covers a whole vessel or phase, NOT a single instruction. Pack multiple consecutive paragraphs into one group whenever they share a vessel or phase.

Start a NEW group ONLY when:
  1. The vessel changes (bowl → pot → oven → fryer), OR
  2. The phase changes (prep → shape → cook → cool → store), OR
  3. The source explicitly labels a sub-section.

Real examples from this collection:
  - "In a pot" — toast spices, add aromatics, add tomato, add palak, cook (7 paragraphs in ONE group)
  - "In a large bowl" — sift flour, press into pan, bake the crust (5 paragraphs in ONE group)
  - "Shape the Kranz" — grease pan, shape, glaze, cut, bake, cool (7 paragraphs in ONE group)

AVOID one-paragraph groups for sequential steps in the same vessel — that's a red flag you've over-split. Example of WRONG splitting: "Mix dry", "Add ghee", "Add milk", "Rest", "Shape", "Imprint" as 6 separate groups when they all happen in/around the same bowl and could be ONE group "In a bowl" with multiple paragraphs.

# Method (required title + ingredientNames)
Each method group must have:
  - title: prefer "In a [vessel]" when a vessel is involved — "In a large bowl", "In a small saucepan", "In a food processor", "In a stand mixer", "In a large pot". Otherwise a short imperative for a phase: "Assemble", "Shape and imprint", "Fry", "Cool and store", "Make the filling", "Bake". Use sentence-case (capitalize first word only). NOT "In A Large Bowl", NOT "in a large bowl".
  - paragraphs: ALL instructions for that whole vessel/phase, in source's voice. Multiple paragraphs are normal and expected. Do NOT prefix with numbers — write "Mix flour and sugar.", not "1. Mix flour and sugar." The UI numbers them.
  - ingredientNames: every ingredient used across this whole group, by canonical name (matching ingredientSets[].ingredients[].name). MAY be empty for pure-instructional groups ("Bake and cool", "Rest the dough", "Storage").

# Reserved groups (Rules/Lessons/Notes) — only if source has them
If the source contains a "Rules", "Lessons", "Notes", "Tips", or "Storage" section, capture it as a method group using that exact title. Its ingredientNames array is empty. NEVER invent such a section.

# Verification rule (recheck before emitting)
Every ingredient in ingredientSets must appear in exactly ONE method step's ingredientNames, across the ingredient-adding steps. Don't double-count. Pure-instructional steps (Bake, Cool, Rest) and reserved groups (Rules, Notes) have empty ingredientNames and don't count.`;
}

// OpenAI strict mode requires:
//  - every property in `required`
//  - `additionalProperties: false` on every object
//  - optional values typed as ["<type>", "null"]
function buildSchema({ categoryTitles }) {
  const ingredient = {
    type: "object",
    additionalProperties: false,
    required: ["name", "value", "unit", "note"],
    properties: {
      name: { type: "string" },
      value: { type: ["number", "null"] },
      unit: { type: ["string", "null"], enum: [...UNIT_KEYS, null] },
      note: { type: ["string", "null"] },
    },
  };

  const ingredientSet = {
    type: "object",
    additionalProperties: false,
    required: ["title", "ingredients"],
    properties: {
      title: {
        type: "string",
        description: 'Required, meaningful — e.g. "For the dough"',
      },
      ingredients: { type: "array", items: ingredient },
    },
  };

  const methodGroup = {
    type: "object",
    additionalProperties: false,
    required: ["title", "paragraphs", "ingredientNames"],
    properties: {
      title: {
        type: "string",
        description: 'Action/vessel/location — e.g. "In a large bowl"',
      },
      paragraphs: { type: "array", items: { type: "string" } },
      ingredientNames: {
        type: "array",
        items: { type: "string" },
        description:
          "Canonical names of every ingredient used in this step, matching ingredientSets[].ingredients[].name",
      },
    },
  };

  return {
    type: "object",
    additionalProperties: false,
    required: [
      "notARecipeReason",
      "title",
      "description",
      "category",
      "ingredientSets",
      "method",
    ],
    properties: {
      notARecipeReason: {
        type: ["string", "null"],
        description:
          "If the image is NOT a recipe, a short friendly reason. Null if it IS a recipe.",
      },
      title: { type: "string" },
      description: { type: ["string", "null"] },
      category: { type: "string", enum: categoryTitles },
      ingredientSets: { type: "array", items: ingredientSet },
      method: { type: "array", items: methodGroup },
    },
  };
}

export async function extractRecipeFromImage({
  imageBase64,
  mediaType,
  apiKey,
  model,
  categoryTitles,
}) {
  if (!Array.isArray(categoryTitles) || categoryTitles.length === 0) {
    throw new Error("categoryTitles required for extraction");
  }
  const client = new OpenAI({ apiKey });
  const dataUrl = `data:${mediaType};base64,${imageBase64}`;

  const completion = await client.chat.completions.create({
    model: model || "gpt-5.5",
    messages: [
      { role: "system", content: buildSystemPrompt(categoryTitles) },
      {
        role: "user",
        content: [
          { type: "text", text: "Extract this recipe." },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "emit_recipe",
        strict: true,
        schema: buildSchema({ categoryTitles }),
      },
    },
  });

  const message = completion.choices?.[0]?.message;
  if (!message?.content) throw new Error("OpenAI returned no content");
  if (message.refusal) throw new Error(`OpenAI refused: ${message.refusal}`);
  return JSON.parse(message.content);
}
