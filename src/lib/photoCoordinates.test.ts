import { describe, expect, it } from "vitest";

import {
  hasPhotoCoordinates,
  normalizePhotoCoordinates,
  parsePhotoCoordinatesInput,
  photoMapUrl,
} from "@/lib/photoCoordinates";

describe("parsePhotoCoordinatesInput", () => {
  it("accepts comma decimals and rounds to 5 places", () => {
    expect(parsePhotoCoordinatesInput("41,81667123", "45,35000999")).toEqual({
      lat: 41.81667,
      lng: 45.35001,
    });
  });

  it("returns undefined when both blank", () => {
    expect(parsePhotoCoordinatesInput("  ", "")).toBeUndefined();
  });

  it("rejects a single coordinate", () => {
    expect(() => parsePhotoCoordinatesInput("41.8", "")).toThrow(
      /კოორდინატები/,
    );
  });
});

describe("normalizePhotoCoordinates", () => {
  it("accepts numeric yaml values", () => {
    expect(normalizePhotoCoordinates(41.8, 45.3)).toEqual({
      lat: 41.8,
      lng: 45.3,
    });
  });

  it("drops incomplete pairs", () => {
    expect(normalizePhotoCoordinates(41.8, undefined)).toBeUndefined();
  });
});

describe("hasPhotoCoordinates / photoMapUrl", () => {
  it("builds a google maps query url", () => {
    const credit = { lat: 41.8, lng: 45.3 };
    expect(hasPhotoCoordinates(credit)).toBe(true);
    expect(photoMapUrl(credit)).toBe("https://www.google.com/maps?q=41.8,45.3");
  });
});
