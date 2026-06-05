import { createClient } from "@sanity/client";
import { config } from "./config";

// Set up the client for fetching data in the getProps page functions
export const sanityClient = createClient(config);

// Set up a preview client with serverless authentication for drafts.
// perspective: 'drafts' returns the draft overlay (falling back to published).
// Required since @sanity/client v7 / apiVersion 2025-03-01 default to 'published',
// which strips drafts and would make preview mode show published content only.
export const previewClient = createClient({
  ...config,
  useCdn: false,
  perspective: "drafts",
  token: process.env.SANITY_API_TOKEN,
});

// Helper function for easily switching between normal client and preview client
export const getClient = (usePreview) =>
  usePreview ? previewClient : sanityClient;
