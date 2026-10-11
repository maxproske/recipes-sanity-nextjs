import React from "react";
import PropTypes from "prop-types";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import Heading from "../components/Heading";
import RecipeCard from "../components/RecipeCard";
import {
  categorySlug,
  cleanCategoryTitle,
} from "../components/CategoryChips";
import { getClient } from "../lib/sanity.server";
import { allRecipesQuery, categoriesQuery } from "../lib/queries";

export default function Home({ recipeList, categories }) {
  const { query } = useRouter();
  const activeSlug = query.category || null;
  const activeCategory = categories.find(
    (category) => categorySlug(category.title) === activeSlug
  );

  const filteredRecipes = activeCategory
    ? recipeList.filter((recipe) =>
        recipe.categories?.some((c) => c?._id === activeCategory._id)
      )
    : recipeList;

  return (
    <Layout>
      <NextSeo
        title={
          activeCategory ? cleanCategoryTitle(activeCategory.title) : undefined
        }
      />
      <Head>
        <link rel="icon" href="/img/logo-transparent.png" />
      </Head>
      <main className="pb-24">
        {/* Logo + title only on the unfiltered homepage; a category view goes
            straight to its recipes (the underlined icon already says which). */}
        {activeCategory ? (
          <h1 className="sr-only">{cleanCategoryTitle(activeCategory.title)}</h1>
        ) : (
          <div className="p-12 text-center">
            <div className="flex justify-center items-center">
              <div className="w-24 inline-block">
                <Image
                  src="/img/logo-transparent.png"
                  height="360"
                  width="360"
                  alt="Logo"
                  priority
                />
              </div>
              <div>
                <Heading as="h1">
                  Half The Sugar,
                  <br /> Twice The Ginger
                </Heading>
                <span className="text-caramel-300 italic font-xs">
                  {recipeList.length} recipes and counting!
                </span>
              </div>
            </div>
          </div>
        )}

        <div
          className={`w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4 ${
            activeCategory ? "pt-8" : ""
          }`}
        >
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </main>
    </Layout>
  );
}

Home.propTypes = {
  recipeList: PropTypes.array,
  categories: PropTypes.array,
};

export async function getStaticProps({ preview }) {
  const client = getClient(preview);
  const [recipeList, categories] = await Promise.all([
    client.fetch(allRecipesQuery),
    client.fetch(categoriesQuery),
  ]);

  return {
    props: { recipeList, categories },
    revalidate: 60,
  };
}
