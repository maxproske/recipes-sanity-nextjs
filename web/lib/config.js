const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
if (!projectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Copy .env.example to .env.local and fill in values.'
  )
}

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId,
  apiVersion: "2025-03-01",
  useCdn: process.env.NODE_ENV === "production",
};
