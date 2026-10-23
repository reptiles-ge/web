import { describe, expect, it } from "vitest";

import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const env = { DB: createSpeciesTestDatabase().db };

type AuthorBody = {
  data: {
    aliases: string[];
    bio?: string;
    id: string;
    isContributor: boolean;
    name: string;
    photoCount: number;
  };
  locale: string;
};

type ListBody = {
  data: Array<{
    id: string;
    isContributor: boolean;
    name: string;
    photoCount: number;
  }>;
  locale: string;
  total: number;
};

describe("GET /v1/authors", () => {
  it("lists every credited author and filters contributors", async () => {
    const all = await requestJson<ListBody>("/v1/authors", env);
    expect(all.response.status).toBe(200);
    expect(all.response.headers.get("Cache-Control")).toContain("s-maxage");
    expect(all.body.total).toBe(all.body.data.length);
    expect(all.body.total).toBeGreaterThan(500);
    const ids = all.body.data.map((author) => author.id);
    expect(ids).toEqual([...ids].sort());

    const contributors = await requestJson<ListBody>(
      "/v1/authors?contributor=true",
      env,
      { headers: { "X-Locale": "en" } },
    );
    expect(contributors.body.total).toBe(17);
    expect(contributors.body.data.every((a) => a.isContributor)).toBe(true);
    expect(
      contributors.body.data.find((a) => a.id === "zauri-khachidze"),
    ).toMatchObject({ name: "Zauri Khachidze" });
    expect(contributors.response.headers.get("Content-Language")).toBe("en");
  });

  it("counts the photos linked through photo credits", async () => {
    const { body } = await requestJson<ListBody>("/v1/authors", env);
    const zauri = body.data.find((author) => author.id === "zauri-khachidze");
    expect(zauri?.photoCount).toBeGreaterThan(50);
    expect(body.data.find((a) => a.id === "zauri-khachidze")?.name).toBe(
      "ზაური ხაჩიძე",
    );
  });

  it("rejects an invalid filter or locale", async () => {
    for (const [url, init] of [
      ["/v1/authors?contributor=yes", {}],
      ["/v1/authors", { headers: { "X-Locale": "de" } }],
    ] as const) {
      const { body, response } = await requestJson<ErrorBody>(url, env, init);
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
  });
});

describe("GET /v1/authors/:id", () => {
  it("returns a localized profile with every credit spelling", async () => {
    const { body, response } = await requestJson<AuthorBody>(
      "/v1/authors/sandro-khakhva",
      env,
      { headers: { "X-Locale": "ru" } },
    );
    expect(response.status).toBe(200);
    expect(body.locale).toBe("ru");
    expect(body.data.name).toBe("Сандро Хахва");
    expect(body.data.isContributor).toBe(true);
    expect(body.data.aliases).toContain("Sandro Khakhva");
    expect(body.data.bio).toMatch(/Хахва/);
    expect(body.data.photoCount).toBeGreaterThan(0);
  });

  it("falls back to the Georgian name for a photo-only author", async () => {
    const { body } = await requestJson<AuthorBody>(
      "/v1/authors/charles-j-sharp",
      env,
      { headers: { "X-Locale": "tr" } },
    );
    expect(body.data.name).toBe("Charles J. Sharp");
    expect(body.data.isContributor).toBe(false);
    expect(body.data.bio).toBeUndefined();
  });

  it("answers 404 for an unknown author and 400 for a bad id", async () => {
    const missing = await requestJson<ErrorBody>("/v1/authors/nobody", env);
    expect(missing.response.status).toBe(404);
    expect(missing.body.error.code).toBe("not_found");
    const bad = await requestJson<ErrorBody>("/v1/authors/Bad_Id!", env);
    expect(bad.response.status).toBe(400);
  });
});

describe("photo credits", () => {
  type Credit = { authorId?: string; photographer?: string };
  type CatalogBody = {
    data: Array<{ gallery: Array<{ credit?: Credit }>; id: string }>;
  };

  async function credits(locale: string) {
    const { body } = await requestJson<CatalogBody>(
      "/v1/catalog?view=photos",
      env,
      { headers: { "X-Locale": locale } },
    );
    return body.data.flatMap((item) =>
      item.gallery.flatMap((photo) => (photo.credit ? [photo.credit] : [])),
    );
  }

  it("carries the author id and names the author in each locale", async () => {
    const ka = await credits("ka");
    const zauri = ka.filter((credit) => credit.authorId === "zauri-khachidze");
    expect(zauri.length).toBeGreaterThan(10);
    expect(new Set(zauri.map((credit) => credit.photographer))).toEqual(
      new Set(["ზაური ხაჩიძე"]),
    );
    const en = await credits("en");
    expect(
      new Set(
        en
          .filter((credit) => credit.authorId === "zauri-khachidze")
          .map((credit) => credit.photographer),
      ),
    ).toEqual(new Set(["Zauri Khachidze"]));
    const ru = await credits("ru");
    expect(
      ru.some(
        (credit) =>
          credit.authorId === "zauri-khachidze" &&
          credit.photographer === "Заури Хачидзе",
      ),
    ).toBe(true);
  });

  it("keeps a credit's own text when the author has no name in that locale", async () => {
    const en = await credits("en");
    const sharp = en.find((credit) => credit.authorId === "charles-j-sharp");
    expect(sharp?.photographer).toMatch(/Charles J\. Sharp/);
  });
});
