import { describe, it, expect } from "vitest";
import {
  convertCups,
  valueFraction,
  filterAmounts,
} from "../amountHelpers.js";

describe("convertCups", () => {
  it("converts cups to metric weight (grams)", () => {
    const result = convertCups(2, 120, "Weight", "Metric");
    expect(result.value).toBe(240);
  });

  it("converts cups to imperial weight (oz)", () => {
    const result = convertCups(1, 120, "Weight", "Imperial");
    expect(result.value).toBe(parseInt(120 / 28.35));
  });

  it("converts cups to metric volume (ml)", () => {
    const result = convertCups(1, 120, "Volume", "Metric");
    expect(result.value).toBe(250);
  });

  it("converts cups to imperial volume (fl oz)", () => {
    const result = convertCups(1, 120, "Volume", "Imperial");
    expect(result.value).toBe(parseInt(8.32674));
  });

  it("returns empty object for unknown cup type", () => {
    expect(convertCups(1, 120, "Unknown", "Metric")).toEqual({});
  });
});

describe("valueFraction", () => {
  it("converts 0.5 to ½", () => {
    expect(valueFraction(0.5)).toBe("½");
  });

  it("converts 0.25 to ¼", () => {
    expect(valueFraction(0.25)).toBe("¼");
  });

  it("converts 0.75 to ¾", () => {
    expect(valueFraction(0.75)).toBe("¾");
  });

  it("converts 1.5 to 1½", () => {
    expect(valueFraction(1.5)).toBe("1½");
  });

  it("returns whole numbers as-is", () => {
    expect(valueFraction(2)).toBe(2);
  });
});

describe("filterAmounts", () => {
  const amounts = [
    { unit: "cup", standard: "Metric", value: 250 },
    { unit: "cup", standard: "Imperial", value: 8 },
    { unit: "tbsp", standard: "Metric", value: 15 },
  ];

  it("filters by single key", () => {
    expect(filterAmounts(amounts, { unit: "tbsp" })).toEqual({
      unit: "tbsp",
      standard: "Metric",
      value: 15,
    });
  });

  it("filters by multiple keys", () => {
    expect(filterAmounts(amounts, { unit: "cup", standard: "Imperial" })).toEqual({
      unit: "cup",
      standard: "Imperial",
      value: 8,
    });
  });

  it("returns empty object when no match", () => {
    expect(filterAmounts(amounts, { unit: "kg" })).toEqual({});
  });

  it("returns empty object for empty array", () => {
    expect(filterAmounts([], { unit: "cup" })).toEqual({});
  });
});
