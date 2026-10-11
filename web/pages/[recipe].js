import PropTypes from "prop-types";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import groq from "groq";
import { NextSeo } from "next-seo";

import { urlFor } from "../lib/sanity";
import { filterDataToSingleItem } from "../lib/filterDataToSingleItem";
import { getClient } from "../lib/sanity.server";
import { categoriesQuery, recipeQuery } from "../lib/queries";
import { useStore } from "../hooks/useStore";
import { useChecklist } from "../hooks/useChecklist";

import Layout from "../components/Layout";
import Method from "../components/Method";
import Ingredients from "../components/Ingredients";
import ExitPreview from "../components/ExitPreview";
import Banner from "../components/Banner";
import Controls from "../components/Controls";
import EditInStudio from "../components/EditInStudio";
import { categoriesLabel } from "../components/CategoryChips";

const featuredImageSize = {
  width: 1200,
  height: 600,
};
export default function Recipe({ data, preview }) {
  const page = data.page;

  const {
    _id,
    title,
    featuredImage,
    description,
    ingredientSets,
    method,
    categories,
  } = page ?? {};

  // Each recipe starts at 1× with its own saved ticks — the store is global, so
  // without this a 2× from the last recipe would carry over.
  const resetServes = useStore((state) => state.resetServes);
  const loadChecklist = useChecklist((state) => state.load);
  useEffect(() => {
    resetServes();
    if (_id) loadChecklist(_id);
  }, [_id, resetServes, loadChecklist]);

  const featuredImageUrl = useMemo(
    () =>
      featuredImage
        ? urlFor(featuredImage)
            .width(featuredImageSize.width)
            .height(featuredImageSize.height)
            .url()
        : null,
    [featuredImage]
  );

  return (
    <Layout>
      <NextSeo title={title} description={description} />
      {preview && <ExitPreview />}
      <EditInStudio documentId={_id} />
      <main>
        <Banner description={description} category={categoriesLabel(categories)}>
          {title}
        </Banner>
        <Controls />
        <section className="max-w-4xl mx-auto p-4">
          <Ingredients ingredientSets={ingredientSets} />
          {featuredImageUrl && (
            <figure className="w-full h-auto mb-12">
              <Image
                className="object-cover"
                src={featuredImageUrl}
                alt={title}
                width={featuredImageSize.width}
                height={featuredImageSize.height}
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </figure>
          )}
          <Method ingredientSets={ingredientSets} method={method} />
        </section>
      </main>
    </Layout>
  );
}

Recipe.propTypes = {
  recipe: PropTypes.object,
};

export async function getStaticProps({ params, preview = false }) {
  const recipeParams = { slug: params.recipe };
  const [data, categories] = await Promise.all([
    getClient(preview).fetch(recipeQuery, recipeParams),
    getClient(preview).fetch(categoriesQuery),
  ]);

  // Helper function to reduce all returned documents down to just one
  const page = filterDataToSingleItem(data);

  // Unknown slugs come back as an empty array, not null — 404 on either.
  if (!page) return { notFound: true };

  return {
    props: {
      preview,
      categories,
      data: {
        page: page ?? null,
      },
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const allRecipesQuery = groq`*[_type == "recipe" && defined(slug.current)][].slug.current`;
  const allRecipeSlugs = await getClient().fetch(allRecipesQuery);

  // We'll pre-render only these paths at build time.
  // fallback blocking will server-render pages
  // on-demand if the path doesn't exist.
  return {
    paths: allRecipeSlugs.map((slug) => `/${slug}`),
    fallback: "blocking",
  };
}
