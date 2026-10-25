import { describe, expect, it } from "vitest";

import { GET as getFull } from "@/app/[locale]/llms-full.txt/route";
import { GET as getIndex } from "@/app/[locale]/llms.txt/route";
import { llmsStaticParams } from "@/lib/llmsResponse";

function context(locale: string) {
  return { params: Promise.resolve({ locale }) };
}

describe("locale llms routes", () => {
  it("serves the index and full file for each prefixed locale", async () => {
    for (const locale of ["en", "ru", "tr"]) {
      const index = await getIndex(
        new Request(`https://reptiles.ge/${locale}/llms.txt`),
        context(locale),
      );
      expect(index.status).toBe(200);
      expect(index.headers.get("Content-Type")).toBe(
        "text/plain; charset=utf-8",
      );
      expect(index.headers.get("X-Robots-Tag")).toBeNull();
      expect(index.headers.get("Cache-Control")).toContain("s-maxage=3600");
      expect(await index.text()).toContain(
        `https://reptiles.ge/${locale}/llms-full.txt`,
      );

      const full = await getFull(
        new Request(`https://reptiles.ge/${locale}/llms-full.txt`),
        context(locale),
      );
      expect(full.status).toBe(200);
      expect(full.headers.get("X-Robots-Tag")).toBe("noindex, follow");
      expect(await full.text()).toContain(`Language: `);
    }
  });

  it("redirects the prefixed Georgian files to the canonical ones", async () => {
    const index = await getIndex(
      new Request("https://reptiles.ge/ka/llms.txt"),
      context("ka"),
    );
    expect(index.status).toBe(301);
    expect(index.headers.get("Location")).toBe("https://reptiles.ge/llms.txt");

    const full = await getFull(
      new Request("https://reptiles.ge/ka/llms-full.txt"),
      context("ka"),
    );
    expect(full.status).toBe(301);
    expect(full.headers.get("Location")).toBe(
      "https://reptiles.ge/llms-full.txt",
    );
  });

  it("returns 404 for an unknown locale", async () => {
    const response = await getIndex(
      new Request("https://reptiles.ge/xx/llms.txt"),
      context("xx"),
    );
    expect(response.status).toBe(404);
  });

  it("prerenders only the prefixed locales", () => {
    expect(llmsStaticParams()).toEqual([
      { locale: "en" },
      { locale: "ru" },
      { locale: "tr" },
    ]);
  });
});
