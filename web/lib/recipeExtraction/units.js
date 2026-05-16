// Keep in sync with studio/src/schemas/components/amountSettings.js.
// Only the metadata the API route needs (standard/type) is duplicated here.
export const UNITS = {
  cup: { standard: "Traditional", type: "Volume" },
  tsp: { standard: "Traditional", type: "Volume" },
  Tbs: { standard: "Traditional", type: "Volume" },
  g: { standard: "Metric", type: "Weight" },
  ml: { standard: "Metric", type: "Volume" },
  oz: { standard: "Imperial", type: "Weight" },
  "fl-oz": { standard: "Imperial", type: "Volume" },
  quantity: { standard: "Fuzzy" },
  pinch: { standard: "Fuzzy" },
  sprinkle: { standard: "Fuzzy" },
  lb: { standard: "Imperial", type: "Weight" },
  pnt: { standard: "Imperial", type: "Volume" },
  "to-taste": { standard: "Fuzzy" },
};

export const UNIT_KEYS = Object.keys(UNITS);
