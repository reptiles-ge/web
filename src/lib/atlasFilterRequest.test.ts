import { describe, expect, it } from "vitest";

import { isFilteredAtlasRequest } from "./atlasFilterRequest";

function filtered(pathname: string, query = "") {
  return isFilteredAtlasRequest(pathname, new URLSearchParams(query));
}

describe("isFilteredAtlasRequest", () => {
  it.each(["/species", "/en/species", "/ru/species", "/tr/species"])(
    "flags a filtered %s",
    (pathname) => {
      expect(filtered(pathname, "q=giurza")).toBe(true);
      expect(filtered(pathname, "type=snake&region=kakheti")).toBe(true);
    },
  );

  it("leaves the unfiltered atlas indexable", () => {
    expect(filtered("/species")).toBe(false);
    expect(filtered("/species", "q=")).toBe(false);
    expect(filtered("/species", "q=%20")).toBe(false);
    expect(filtered("/species", "utm_source=x")).toBe(false);
  });

  it("ignores other pages", () => {
    expect(filtered("/gvelebi", "q=giurza")).toBe(false);
    expect(filtered("/species/macrovipera-lebetina", "q=giurza")).toBe(false);
    expect(filtered("/ka/species", "q=giurza")).toBe(false);
  });
});
