import { describe, expect, it } from "vitest";

import type { SearchDocument } from "@/lib/siteSearch";

import { GET } from "./route";

const request = (locale: string) =>
  GET(new Request(`http://localhost/api/search/${locale}`), {
    params: Promise.resolve({ locale }),
  });

describe("GET /api/search/[locale]", () => {
  it("serves the localized search index from the API catalog", async () => {
    const response = await request("en");
    expect(response.status).toBe(200);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    const documents = (await response.json()) as SearchDocument[];
    const giurza = documents.find(
      (item) => item.key === "species:macrovipera-lebetina",
    );
    expect(giurza?.title).toBe("Levantine viper");
    expect(documents.some((item) => item.kind === "page")).toBe(true);
  });

  it("answers 404 for an unknown locale", async () => {
    const response = await request("de");
    expect(response.status).toBe(404);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });
});
