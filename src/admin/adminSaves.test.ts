import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import { AdminSaveError, SessionExpiredError } from "./adminResponse";
import { saveAuthorTexts } from "./authors";
import { fetchAdminNewsRecord, saveNewsCopy } from "./news";
import { saveSpeciesTexts, type SpeciesTextsInput } from "./species";

const API = "https://api.reptiles.ge/v1/admin";

const TEXTS = {
  behavior: "",
  commonName: "Levantine viper",
  conservation: "",
  description: "",
  diet: "",
  facts: [],
  habitat: "",
  location: "",
  overview: "",
  stats: [],
} satisfies SpeciesTextsInput["texts"];

describe("admin text saves", () => {
  it("posts each editor's body with credentials and returns the new version", async () => {
    const seen: Array<{ body: unknown; credentials: string; path: string }> =
      [];
    server.use(
      http.post(`${API}/*`, async ({ request }) => {
        const path = new URL(request.url).pathname;
        seen.push({
          body: await request.json(),
          credentials: request.credentials,
          path,
        });
        return HttpResponse.json({
          data: path.includes("/species/")
            ? { id: "macrovipera-lebetina", locale: "en", version: 4 }
            : { id: "x", version: 9 },
        });
      }),
    );
    const species = {
      expectedVersion: 3,
      locale: "en" as const,
      summary: "Edit",
      texts: TEXTS,
    };
    expect(await saveSpeciesTexts("macrovipera-lebetina", species)).toEqual({
      id: "macrovipera-lebetina",
      locale: "en",
      version: 4,
    });
    await saveAuthorTexts("sandro-khakhva", { ka: { name: "სანდრო" } });
    const copy = { copy: {}, expectedVersion: 8, summary: "Fix" };
    expect(
      await saveNewsCopy(
        "some-article",
        copy as Parameters<typeof saveNewsCopy>[1],
      ),
    ).toBe(9);
    expect(seen).toEqual([
      {
        body: species,
        credentials: "include",
        path: "/v1/admin/species/macrovipera-lebetina/texts",
      },
      {
        body: { texts: { ka: { name: "სანდრო" } } },
        credentials: "include",
        path: "/v1/admin/authors/sandro-khakhva/texts",
      },
      {
        body: copy,
        credentials: "include",
        path: "/v1/admin/news/some-article/copy",
      },
    ]);
  });

  it("turns a refused save into readable details", async () => {
    server.use(
      http.post(`${API}/authors/a/texts`, () =>
        HttpResponse.json(
          {
            error: {
              code: "invalid_request",
              details: [
                { message: "Too long", path: ["texts", "ka", "bio"] },
                { message: "Alias taken", path: "alias" },
                "plain",
              ],
              message: "The change breaks a content rule",
            },
          },
          { status: 400 },
        ),
      ),
    );
    const error = await saveAuthorTexts("a", { ka: { name: "x" } }).catch(
      (caught: unknown) => caught,
    );
    expect(error).toBeInstanceOf(AdminSaveError);
    expect(error).toMatchObject({
      code: "invalid_request",
      details: ["texts.ka.bio: Too long", "alias: Alias taken", "plain"],
      message: "The change breaks a content rule",
    });
  });

  it("explains a version conflict and survives a body that is not JSON", async () => {
    server.use(
      http.post(`${API}/news/a/copy`, () =>
        HttpResponse.json(
          { error: { code: "version_conflict", message: "changed" } },
          { status: 409 },
        ),
      ),
      http.post(
        `${API}/news/b/copy`,
        () => new HttpResponse("oops", { status: 500 }),
      ),
      http.post(
        `${API}/news/c/copy`,
        () => new HttpResponse(null, { status: 401 }),
      ),
    );
    const body = { copy: {}, expectedVersion: 1, summary: "x" } as Parameters<
      typeof saveNewsCopy
    >[1];
    await expect(saveNewsCopy("a", body)).rejects.toThrow(
      "Someone saved a newer version",
    );
    await expect(saveNewsCopy("b", body)).rejects.toMatchObject({
      code: "unknown",
      details: [],
      message: "Article save failed: 500",
    });
    await expect(saveNewsCopy("c", body)).rejects.toBeInstanceOf(
      SessionExpiredError,
    );
  });

  it("reads one article, or null when it is missing", async () => {
    server.use(
      http.get(`${API}/news/found`, () =>
        HttpResponse.json({ data: { article: { id: "found" }, version: 2 } }),
      ),
      http.get(
        `${API}/news/missing`,
        () => new HttpResponse(null, { status: 404 }),
      ),
      http.get(
        `${API}/news/broken`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );
    expect(await fetchAdminNewsRecord("found")).toEqual({
      article: { id: "found" },
      version: 2,
    });
    expect(await fetchAdminNewsRecord("missing")).toBeNull();
    await expect(fetchAdminNewsRecord("broken")).rejects.toThrow(
      "Article failed: 500",
    );
  });
});
