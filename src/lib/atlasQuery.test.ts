import { describe, expect, it } from "vitest";

import { defaultAtlasFilters } from "@/data/atlasFilters";
import {
  atlasQueryParams,
  defaultAtlasQuery,
  parseAtlasQueryParams,
} from "@/lib/atlasQuery";

describe("atlas query params", () => {
  it("leaves defaults out", () => {
    expect(atlasQueryParams(defaultAtlasQuery).toString()).toBe("");
  });

  it("round-trips filters, search, sort and page", () => {
    const query = {
      filters: {
        danger: "venomous" as const,
        group: "snake" as const,
        habitat: "mountain" as const,
        query: "viper",
        region: "kakheti",
      },
      page: 3,
      sort: "az" as const,
    };
    const params = atlasQueryParams(query);
    expect(params.toString()).toBe(
      "group=snake&danger=venomous&habitat=mountain&region=kakheti&q=viper&sort=az&page=3",
    );
    expect(parseAtlasQueryParams(params)).toEqual(query);
  });

  it("trims the search and drops an empty one", () => {
    const params = atlasQueryParams({
      ...defaultAtlasQuery,
      filters: { ...defaultAtlasFilters, query: "   " },
    });
    expect(params.has("q")).toBe(false);
    expect(
      parseAtlasQueryParams(new URLSearchParams("q=%20giurza%20"))?.filters
        .query,
    ).toBe("giurza");
  });

  it("rejects unknown values", () => {
    for (const search of [
      "group=fish",
      "danger=mild",
      "habitat=desert",
      "region=paris",
      "sort=random",
      "page=0",
      "page=abc",
      `q=${"a".repeat(101)}`,
    ]) {
      expect(parseAtlasQueryParams(new URLSearchParams(search))).toBeNull();
    }
  });
});
