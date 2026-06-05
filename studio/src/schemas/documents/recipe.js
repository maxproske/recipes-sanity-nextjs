import { FiGrid, FiBox, FiDroplet } from "react-icons/fi";
import { units } from "../components/amountSettings";
import AiImportField from "../components/AiImportField.jsx";
import HeicImageInput from "../components/HeicImageInput.jsx";

function toPlainText(blocks = []) {
  return blocks
    .map((block) => {
      if (block._type !== "block" || !block.children) {
        return "";
      }
      return block.children.map((child) => child.text).join("");
    })
    .join("\n\n");
}

export default {
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    {
      name: "aiImport",
      title: "Create from photo",
      type: "string",
      readOnly: true,
      components: {
        // Hide the default field chrome — the input renders its own card.
        field: (props) => props.children,
        input: AiImportField,
      },
    },
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    },
    {
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      components: {
        input: HeicImageInput,
      },
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      name: "ingredientSets",
      title: "Ingredient Sets",
      type: "array",
      of: [
        {
          name: "set",
          title: "Set",
          type: "object",
          icon: FiBox,
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },
            {
              name: "ingredients",
              title: "Ingredients",
              type: "array",
              of: [
                {
                  name: "ingredient",
                  title: "Ingredient",
                  type: "object",
                  fields: [
                    {
                      name: "amount",
                      title: "Amount",
                      type: "ingredientAmount",
                    },
                    {
                      name: "ingredient",
                      title: "Ingredient",
                      type: "reference",
                      to: [{ type: "ingredient" }],
                    },
                    {
                      name: "note",
                      title: "Note",
                      type: "string",
                    },
                  ],
                  icon: FiDroplet,
                  preview: {
                    select: {
                      ingredient: "ingredient.title",
                      amount: "amount.value",
                      unit: "amount.unit",
                      note: "note",
                    },
                    prepare(selection) {
                      const { ingredient, amount, unit, note } = selection;

                      if (!amount && !unit) {
                        return {
                          title: ingredient,
                        };
                      }

                      const unitLabel =
                        amount !== 1 && units[unit]?.plural
                          ? units[unit].plural
                          : units[unit]?.single;

                      return {
                        title: ingredient,
                        subtitle: [amount, unitLabel, note ? `– ${note}` : ""]
                          .join(" ")
                          .trim(),
                      };
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "method",
      title: "Method",
      type: "array",
      of: [
        {
          name: "component",
          title: "Component",
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },
            {
              name: "ingredients",
              title: "Ingredients",
              type: "ingredientPicker",
            },
            {
              name: "description",
              title: "Description",
              type: "portableText",
            },
          ],
          icon: FiGrid,
          preview: {
            select: {
              description: "description",
            },
            prepare(selection) {
              const { description } = selection;
              return {
                title: toPlainText(description),
                subtitle: "Component",
              };
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
      media: "featuredImage",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title,
        subtitle: `/${subtitle}`,
        media,
      };
    },
  },
};
