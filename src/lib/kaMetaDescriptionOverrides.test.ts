import { describe, expect, it } from "vitest";

import {
  KA_META_DESCRIPTION_OVERRIDES,
  kaMetaDescriptionOverride,
} from "@/lib/kaMetaDescriptionOverrides";

const entries = Object.entries(KA_META_DESCRIPTION_OVERRIDES);

describe("KA_META_DESCRIPTION_OVERRIDES", () => {
  it("keeps every description within the KA snippet limit", () => {
    for (const [path, description] of entries) {
      expect(description, path).toBe(description.trim());
      expect(description.length, path).toBeGreaterThanOrEqual(60);
      expect(description.length, path).toBeLessThanOrEqual(160);
    }
  });

  it("never repeats a description", () => {
    const descriptions = entries.map(([, description]) => description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("keys by unprefixed KA public paths", () => {
    for (const [path] of entries) {
      expect(path.startsWith("/"), path).toBe(true);
      expect(path === "/" || !path.endsWith("/"), path).toBe(true);
      expect(/^\/(ka|en|ru|tr)(\/|$)/.test(path), path).toBe(false);
    }
  });

  it.each([
    ["/gvelebi/giurza", "გიურზა"],
    ["/prinvelebi/xoxobi", "ხოხობი"],
    ["/prinvelebi/tetri-qarqati", "თეთრი ყარყატი"],
    ["/prinvelebi/svavi", "სვავი"],
    ["/prinvelebi/choti", "ჭოტი"],
    ["/prinvelebi/shavi-dzera", "შავი ძერა"],
    ["/prinvelebi/mimino", "მიმინო"],
    ["/dzuzumtsovrebi/fotsxveri", "ფოცხვერი"],
    ["/dzuzumtsovrebi/evropuli-shveli", "შველი"],
    ["/dzuzumtsovrebi/dedofala", "დედოფალა"],
    ["/dzuzumtsovrebi/ketilshobili-iremi", "კეთილშობილი ირემი"],
    ["/dzuzumtsovrebi/chveulebrivi-tura", "ტურა"],
    ["/dzuzumtsovrebi/tura-ezoshi", "ტურა ეზოში"],
    ["/dzuzumtsovrebi/kavkasiuri-tsiqvi", "კავკასიური ციყვი"],
    [
      "/dzuzumtsovrebi/aghmosavletkavkasiuri-jixvi",
      "აღმოსავლეთკავკასიური ჯიხვი",
    ],
    ["/dzuzumtsovrebi/mela", "მელა"],
    ["/mtserebi/chokela", "ჩოქელა"],
  ])("leads %s with the searched name %s", (path, name) => {
    expect(KA_META_DESCRIPTION_OVERRIDES[path]?.startsWith(name)).toBe(true);
  });

  it("leaves news article descriptions to the article MDX", () => {
    for (const [path] of entries) {
      expect(path.startsWith("/news/"), path).toBe(false);
    }
  });

  it("separates the jackal profile from the jackal yard guide", () => {
    const profile =
      KA_META_DESCRIPTION_OVERRIDES["/dzuzumtsovrebi/chveulebrivi-tura"];
    const guide = KA_META_DESCRIPTION_OVERRIDES["/dzuzumtsovrebi/tura-ezoshi"];
    expect(profile).not.toContain("ეზო");
    expect(guide).toContain("112");
  });
});

describe("kaMetaDescriptionOverride", () => {
  it("applies only to the KA locale", () => {
    expect(kaMetaDescriptionOverride("ka", "/gvelebi/giurza", "x")).toBe(
      KA_META_DESCRIPTION_OVERRIDES["/gvelebi/giurza"],
    );
    expect(kaMetaDescriptionOverride("en", "/gvelebi/giurza", "x")).toBe("x");
    expect(kaMetaDescriptionOverride("ka", "/missing", "x")).toBe("x");
  });
});
