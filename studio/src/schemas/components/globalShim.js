// Polyfill the Node `global` identifier used by older CommonJS deps
// (here: convert-units → lodash.support) when bundled by Vite for the browser.
// Must be imported before any module that touches `global` at top level.
if (typeof window !== "undefined" && typeof window.global === "undefined") {
  window.global = window;
}
