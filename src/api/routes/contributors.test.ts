import { describe, expect, it } from "vitest";

import type { ContributorProfile } from "@/data/authors";

import { getCreditAuthorCards } from "@/lib/creditAuthors";

import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const env = { DB: createSpeciesTestDatabase().db };

type Contributor = ContributorProfile & { speciesCount: number };

type ListBody = { data: Contributor[]; locale: string; total: number };

function list(query = "", locale = "ka") {
  return requestJson<ErrorBody & ListBody>(`/v1/contributors${query}`, env, {
    headers: { "X-Locale": locale },
  });
}

describe("GET /v1/contributors", () => {
  it("returns every contributor as a full profile, most photos first", async () => {
    const { body, response } = await list();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("s-maxage");
    expect(response.headers.get("Content-Language")).toBe("ka");
    expect(body.total).toBe(17);
    expect(body.data).toHaveLength(17);
    expect(body.data.every((author) => author.isContributor)).toBe(true);
    expect(body.data.every((author) => author.portraitSrc && author.role)).toBe(
      true,
    );
    expect(
      body.data.every(
        (author) =>
          author.publishedAt &&
          author.updatedAt &&
          author.updatedAt >= author.publishedAt,
      ),
    ).toBe(true);
    const order = body.data.map(({ id, photoCount }) => ({ id, photoCount }));
    expect(order).toEqual(
      [...order].sort(
        (a, b) => b.photoCount - a.photoCount || a.id.localeCompare(b.id),
      ),
    );
  });

  it.each(["ka", "en", "ru", "tr"])(
    "matches each author profile (%s)",
    async (locale) => {
      const { body } = await list("", locale);
      for (const { speciesCount, ...profile } of body.data) {
        const single = await requestJson<{ data: unknown }>(
          `/v1/authors/${profile.id}`,
          env,
          { headers: { "X-Locale": locale } },
        );
        expect(profile).toStrictEqual(single.body.data);
        expect(speciesCount).toBeGreaterThanOrEqual(0);
      }
    },
  );

  it("counts photos and species the way the site's contributor cards do", async () => {
    const { body } = await list();
    const catalog = await requestJson<{
      data: Parameters<typeof getCreditAuthorCards>[1];
    }>("/v1/catalog?view=photos", env);
    const cards = getCreditAuthorCards(body.data, catalog.body.data);
    expect(
      body.data.map(({ id, photoCount, speciesCount }) => ({
        id,
        photoCount,
        speciesCount,
      })),
    ).toEqual(
      cards.map(({ author, photoCount, speciesCount }) => ({
        id: author.id,
        photoCount,
        speciesCount,
      })),
    );
  });

  it("returns only the first contributors with limit", async () => {
    const all = await list();
    const { body } = await list("?limit=2");
    expect(body.data).toEqual(all.body.data.slice(0, 2));
    expect(body.total).toBe(17);
  });

  it.each(["?limit=0", "?limit=101", "?limit=two"])(
    "rejects %s",
    async (query) => {
      const { body, response } = await list(query);
      expect(response.status).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    },
  );

  it("rejects an unknown locale", async () => {
    const { response } = await list("", "de");
    expect(response.status).toBe(400);
  });
});

describe("GET /v1/contributors/:id", () => {
  it.each(["ka", "en", "ru", "tr"])(
    "returns the same profile as the list (%s)",
    async (locale) => {
      const { body } = await list("", locale);
      for (const entry of body.data) {
        const single = await requestJson<{ data: Contributor; locale: string }>(
          `/v1/contributors/${entry.id}`,
          env,
          { headers: { "X-Locale": locale } },
        );
        expect(single.response.status).toBe(200);
        expect(single.response.headers.get("Content-Language")).toBe(locale);
        expect(single.body).toStrictEqual({ data: entry, locale });
      }
    },
  );

  it("answers 404 for an author without a contributor page", async () => {
    const { body: authors } = await requestJson<{
      data: Array<{ id: string; isContributor: boolean }>;
    }>("/v1/authors", env);
    const credited = authors.data.find((author) => !author.isContributor);
    expect(credited).toBeDefined();
    const { body, response } = await requestJson<ErrorBody>(
      `/v1/contributors/${credited!.id}`,
      env,
    );
    expect(response.status).toBe(404);
    expect(body.error.code).toBe("not_found");
  });

  it("answers 404 for an unknown id and 400 for a malformed one", async () => {
    const missing = await requestJson<ErrorBody>(
      "/v1/contributors/nobody",
      env,
    );
    expect(missing.response.status).toBe(404);
    const bad = await requestJson<ErrorBody>("/v1/contributors/Bad_Id!", env);
    expect(bad.response.status).toBe(400);
    expect(bad.body.error.code).toBe("invalid_request");
  });
});
