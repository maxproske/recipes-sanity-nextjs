import { createClient } from "@sanity/client";
import { config as sanityConfig } from "../../../lib/config";
import { extractRecipeFromImage } from "../../../lib/recipeExtraction/openai";
import {
  buildIngredientHaystack,
  matchIngredient,
} from "../../../lib/recipeExtraction/fuzzyMatchIngredients";
import {
  buildRecipeDraft,
  validateIngredientCoverage,
} from "../../../lib/recipeExtraction/buildRecipeDraft";
import { applyCors } from "../../../lib/recipeExtraction/cors";

export const config = { api: { bodyParser: { sizeLimit: "12mb" } } };

function titleCase(s) {
  return String(s || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expected = process.env.STUDIO_SHARED_SECRET;
  const provided = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!expected || !provided || provided !== expected) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { imageBase64, mediaType, targetDocumentId } = req.body || {};
  if (!imageBase64 || !mediaType) {
    return res.status(400).json({ error: "Missing imageBase64 or mediaType" });
  }
  if (!mediaType.startsWith("image/")) {
    return res.status(400).json({ error: "mediaType must be image/*" });
  }
  if (targetDocumentId && typeof targetDocumentId !== "string") {
    return res.status(400).json({ error: "targetDocumentId must be a string" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Server missing OPENAI_API_KEY" });
  }
  const writeToken =
    process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
  if (!writeToken) {
    return res.status(500).json({ error: "Server missing SANITY_WRITE_TOKEN" });
  }

  const writeClient = createClient({
    ...sanityConfig,
    useCdn: false,
    token: writeToken,
  });
  const warnings = [];

  try {
    // Fetch categories + ingredients first so we can prime the AI call.
    const [ingredientDocs, categoryDocs] = await Promise.all([
      writeClient.fetch(
        `*[_type=='ingredient']{ _id, title, plural, alternativeNames }`,
      ),
      writeClient.fetch(
        `*[_type=='category']{ _id, title, plural } | order(title asc)`,
      ),
    ]);
    if (categoryDocs.length === 0) {
      return res.status(500).json({
        error: "No categories found in dataset — at least one is required",
      });
    }
    const categoryTitles = categoryDocs.map((c) => c.title);

    const extracted = await extractRecipeFromImage({
      imageBase64,
      mediaType,
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL,
      categoryTitles,
    });

    // Bail out if the image isn't a recipe — return 422 with the model's reason.
    if (extracted.notARecipeReason) {
      return res
        .status(422)
        .json({ error: extracted.notARecipeReason, notARecipe: true });
    }

    const haystack = buildIngredientHaystack(ingredientDocs);

    const uniqueNames = new Set();
    for (const set of extracted.ingredientSets || []) {
      for (const ing of set.ingredients || []) {
        if (ing.name) uniqueNames.add(ing.name);
      }
    }

    const ingredientResolutions = new Map();
    for (const name of uniqueNames) {
      const match = matchIngredient(name, haystack);
      if (match) {
        const doc = ingredientDocs.find((d) => d._id === match.id);
        ingredientResolutions.set(name, {
          id: match.id,
          title: doc?.title || titleCase(name),
          created: false,
        });
      } else {
        const created = await writeClient.create({
          _type: "ingredient",
          title: titleCase(name),
        });
        ingredientResolutions.set(name, {
          id: created._id,
          title: created.title,
          created: true,
        });
        warnings.push(`Created new ingredient: ${titleCase(name)}`);
      }
    }

    // Category is required + comes from a fixed enum, so this should always match.
    const categoryMatch = categoryDocs.find(
      (c) => c.title === extracted.category,
    );
    if (!categoryMatch) {
      warnings.push(
        `Unexpected category "${extracted.category}" — leaving empty`,
      );
    }

    // Verify every declared ingredient is used in exactly one method step.
    const coverage = validateIngredientCoverage(extracted);
    warnings.push(...coverage.warnings);

    // Intentionally do NOT upload the source photo as featuredImage —
    // the recipe-card snapshot isn't appetizing food photography, so we
    // leave featuredImage blank for the human to set later.
    const draft = buildRecipeDraft({
      extracted,
      ingredientResolutions,
      categoryId: categoryMatch?._id,
      featuredImageAssetId: null,
    });

    let resultId;
    if (targetDocumentId) {
      // Overwrite an existing (typically Untitled) draft in place.
      // Studio reserves an _id locally before persisting — if the user clicks
      // Upload on a brand-new doc, the doc isn't on the backend yet and a
      // bare .patch() throws "document not found". Use a transaction:
      // createIfNotExists with a minimal stub first, THEN patch the fields.
      const { _id, _type, _rev, _createdAt, _updatedAt, ...fields } = draft;
      await writeClient
        .transaction()
        .createIfNotExists({ _id: targetDocumentId, _type: "recipe" })
        .patch(targetDocumentId, (p) => p.set(fields))
        .commit({ autoGenerateArrayKeys: false });
      resultId = targetDocumentId;
    } else {
      const created = await writeClient.createIfNotExists(draft);
      resultId = created._id;
    }

    return res.status(200).json({
      draftId: resultId,
      title: draft.title,
      category: extracted.category,
      warnings,
    });
  } catch (err) {
    console.error("[extract-from-photo] failed", err);
    return res.status(500).json({ error: err.message || "Extraction failed" });
  }
}
