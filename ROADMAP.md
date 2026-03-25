# Roadmap

## Deferred Upgrades

### ESLint 9 + Flat Config

Next.js 16 removed `next lint`. ESLint 9 requires flat config (`eslint.config.mjs`) instead of the legacy `eslintConfig` in package.json. Currently pinned to ESLint 8 + eslint-config-next 15 as a workaround.

**When:** When eslint-config-next ships native flat config support, or migrate manually using `@next/eslint-plugin-next` directly.

**Files:** `web/package.json`, new `web/eslint.config.mjs`

### next-sanity Integration Toolkit

The official Sanity + Next.js toolkit (`next-sanity` v12) provides visual editing, live preview, and `sanityFetch` with built-in caching. Currently the project uses raw `@sanity/client` with a 16-line custom integration in `web/lib/sanity.server.js`.

**Why deferred:** next-sanity is built around App Router primitives (`defineLive`, `sanityFetch`, Visual Editing). On Pages Router it provides almost no benefit over the current setup.

**When:** Adopt alongside a Pages Router to App Router migration.

**Files:** `web/package.json`, `web/lib/sanity.server.js`, `web/lib/config.js`, `web/pages/api/preview.js`

### Sanity v5 → v6

Sanity v6 was released March 6, 2026. It's ESM-only, enables the React Compiler, and has stricter TypeScript.

**Why deferred:**

- `sanity-plugin-iframe-pane` may not have a v6-compatible release yet
- React Compiler could surface bugs in custom form components (`IngredientPicker.jsx`) that mutate objects
- `structureTool` API may have breaking changes
- v5.18 is current and fully supported

**When:** After the plugin ecosystem catches up (check `sanity-plugin-iframe-pane` compatibility first).

**Files:** `studio/package.json`, `studio/sanity.config.js`, `studio/src/desk-structure/index.js`, custom schema components

### Tailwind CSS v4 — `@apply` with Custom Theme Utilities

Custom `@theme` values like `text-2xs` and `tracking-mega` don't work with `@apply` in Tailwind v4 (likely due to the leading digit in `2xs`). Worked around by replacing `@apply` in `label.css` with plain CSS using `var()`. The utility classes work fine in JSX.

**When:** Tailwind v4 fixes `@apply` resolution for custom `@theme`-defined utilities, or rename `2xs` to `xxs` across the codebase.

### Pages Router → App Router

Next.js 16 supports both routers. The App Router enables React Server Components, streaming, and better data fetching patterns. Currently using Pages Router with `getStaticProps` / `getStaticPaths`.

**When:** When there's a concrete feature need (e.g., visual editing with next-sanity, RSC benefits). This is the largest migration and should be done alongside next-sanity adoption.
