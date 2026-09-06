import { describe, expect, it } from "vitest";

import { loadSearchDocuments } from "@/lib/loadSearchIndex";

describe("loadSearchDocuments", () => {
  it("returns the requested locale index", async () => {
    const ka = await loadSearchDocuments("ka");
    const en = await loadSearchDocuments("en");
    expect(ka.some((item) => item.id === "macrovipera-lebetina")).toBe(true);
    expect(en.some((item) => item.id === "macrovipera-lebetina")).toBe(true);
    const kaGiurza = ka.find((item) => item.id === "macrovipera-lebetina");
    const enGiurza = en.find((item) => item.id === "macrovipera-lebetina");
    expect(kaGiurza?.title).toBe("გიურზა");
    expect(enGiurza?.title).toBe("Levantine viper");
  });
});
