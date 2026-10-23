import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it } from "vitest";

import type { AuthorRecord } from "../db/authors";
import type { ApiBindings } from "../env";

import { authorRecordSchema } from "../schemas/authors";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "test-token";

let sqlite: DatabaseSync;
let env: ApiBindings;

beforeEach(() => {
  const database = createSpeciesTestDatabase();
  sqlite = database.sqlite;
  env = {
    API_WRITE_TOKEN: TOKEN,
    DB: database.db,
    REVALIDATE_TOKEN: "site-secret",
    SITE: { fetch: async () => new Response(null, { status: 204 }) },
  };
});

async function getAuthor(id: string, token: null | string = TOKEN) {
  return requestJson<ErrorBody & { data: AuthorRecord }>(
    `/v1/admin/authors/${id}`,
    env,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  );
}

function linkedMedia(author: string) {
  return (
    sqlite
      .prepare("SELECT COUNT(*) AS n FROM species_media WHERE author_id = ?")
      .get(author) as { n: number }
  ).n;
}

function put(id: string, author: unknown, token: null | string = TOKEN) {
  return requestJson<ErrorBody>(`/v1/admin/authors/${id}`, env, {
    body: JSON.stringify({ author }),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    method: "PUT",
  });
}

describe("author records", () => {
  it("accepts every author as it is today", async () => {
    const ids = sqlite.prepare("SELECT id FROM authors").all() as Array<{
      id: string;
    }>;
    expect(ids.length).toBeGreaterThan(500);
    for (const { id } of ids.slice(0, 60)) {
      const { body } = await getAuthor(id);
      const result = authorRecordSchema.safeParse(body.data);
      expect(result.success, `${id}: ${result.error?.message}`).toBe(true);
    }
    for (const { id } of sqlite
      .prepare("SELECT id FROM authors WHERE is_contributor = 1")
      .all() as Array<{ id: string }>) {
      const { body } = await getAuthor(id);
      expect(authorRecordSchema.safeParse(body.data).success, id).toBe(true);
    }
  });

  it("links every credited photo to an author", () => {
    const unlinked = sqlite
      .prepare(
        "SELECT COUNT(*) AS n FROM species_media WHERE credit_person IS NOT NULL AND author_id IS NULL",
      )
      .get() as { n: number };
    const unlinkedOverlays = sqlite
      .prepare(
        "SELECT COUNT(*) AS n FROM species_media_overlays WHERE credit_person IS NOT NULL AND author_id IS NULL",
      )
      .get() as { n: number };
    expect(unlinked.n).toBe(0);
    expect(unlinkedOverlays.n).toBe(0);
  });
});

describe("PUT /v1/admin/authors/:id", () => {
  it("makes an author a contributor and moves credits with a new alias", async () => {
    const before = linkedMedia("charles-j-sharp");
    expect(before).toBeGreaterThan(0);
    const { body } = await getAuthor("charles-j-sharp");
    const author: AuthorRecord = {
      ...body.data,
      aliases: [...body.data.aliases, "C. J. Sharp"],
      isContributor: true,
      portraitSrc: "https://cdn.reptiles.ge/authors/charles-j-sharp.jpg",
      role: "photographer",
      texts: {
        ...body.data.texts,
        en: { bio: "Wildlife photographer.", name: "Charles J. Sharp" },
      },
    };
    const { response } = await put("charles-j-sharp", author);
    expect(response.status).toBe(200);
    const saved = await getAuthor("charles-j-sharp");
    expect(saved.body.data).toMatchObject({
      isContributor: true,
      role: "photographer",
      texts: { en: { bio: "Wildlife photographer." } },
    });
    expect(saved.body.data.aliases).toContain("C. J. Sharp");

    sqlite
      .prepare(
        "UPDATE species_media SET credit_person = 'C. J. Sharp', author_id = NULL WHERE author_id = 'charles-j-sharp' AND id = (SELECT MIN(id) FROM species_media WHERE author_id = 'charles-j-sharp')",
      )
      .run();
    expect(linkedMedia("charles-j-sharp")).toBe(before - 1);
    await put("charles-j-sharp", author);
    expect(linkedMedia("charles-j-sharp")).toBe(before);
  });

  it("creates a new author", async () => {
    const author: AuthorRecord = {
      affiliations: ["ilia-state-university"],
      aliases: ["Test Person"],
      id: "test-person",
      isContributor: false,
      jobTitle: null,
      kind: "person",
      links: {},
      portraitClass: null,
      portraitSrc: null,
      role: null,
      texts: { ka: { name: "ტესტი" } },
    };
    expect((await put("test-person", author)).response.status).toBe(200);
    expect((await getAuthor("test-person")).body.data).toEqual(author);
  });

  it("refuses an alias that belongs to another author", async () => {
    const { body } = await getAuthor("charles-j-sharp");
    const { body: error, response } = await put("charles-j-sharp", {
      ...body.data,
      aliases: [...body.data.aliases, "Sandro Khakhva"],
    });
    expect(response.status).toBe(400);
    expect(error.error.code).toBe("invalid_request");
    expect(JSON.stringify(error.error.details)).toContain("sandro-khakhva");
  });

  it("refuses a contributor without a portrait, a mismatched id and bad input", async () => {
    const { body } = await getAuthor("charles-j-sharp");
    for (const [id, author] of [
      ["charles-j-sharp", { ...body.data, isContributor: true }],
      ["someone-else", body.data],
      ["charles-j-sharp", { ...body.data, texts: { en: { name: "X" } } }],
    ] as const) {
      const { response } = await put(id, author);
      expect(response.status, id).toBe(400);
    }
  });

  it("needs the token and answers 404 for an unknown author", async () => {
    expect((await getAuthor("charles-j-sharp", null)).response.status).toBe(
      401,
    );
    expect((await put("charles-j-sharp", {}, "wrong")).response.status).toBe(
      401,
    );
    expect((await getAuthor("nobody")).response.status).toBe(404);
  });
});
