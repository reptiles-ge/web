import { afterEach, describe, expect, it, vi } from "vitest";

import { loadSearchDocuments } from "@/lib/loadSearchIndex";

describe("loadSearchDocuments", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches the requested locale index from the site route", async () => {
    const fetch = vi.fn(async () =>
      Response.json([{ id: "macrovipera-lebetina", title: "Levantine viper" }]),
    );
    vi.stubGlobal("fetch", fetch);
    const documents = await loadSearchDocuments("en");
    expect(fetch).toHaveBeenCalledWith("/api/search/en");
    expect(documents[0]?.title).toBe("Levantine viper");
  });

  it("fails loudly when the route errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 500 })),
    );
    await expect(loadSearchDocuments("ka")).rejects.toThrow(
      "Search index answered 500",
    );
  });
});
