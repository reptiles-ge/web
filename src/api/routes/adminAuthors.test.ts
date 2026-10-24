import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AuthorRecord } from "../db/authors";
import type { ApiBindings } from "../env";

import { app } from "../app";
import { authorRecordSchema } from "../schemas/authors";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionHeaders,
} from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "test-token";

let sqlite: DatabaseSync;
let env: ApiBindings;
let siteFetch: ReturnType<
  typeof vi.fn<(request: Request) => Promise<Response>>
>;

beforeEach(() => {
  const database = createSpeciesTestDatabase();
  sqlite = database.sqlite;
  siteFetch = vi.fn<(request: Request) => Promise<Response>>(
    async () => new Response(null, { status: 204 }),
  );
  env = {
    API_WRITE_TOKEN: TOKEN,
    DB: database.db,
    REVALIDATE_TOKEN: "site-secret",
    SITE: { fetch: siteFetch },
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

  it("revalidates the contributor, species and news pages after a write", async () => {
    const { body } = await getAuthor("charles-j-sharp");
    expect((await put("charles-j-sharp", body.data)).response.status).toBe(200);
    expect(siteFetch).toHaveBeenCalledTimes(1);
    const [request] = siteFetch.mock.calls[0]!;
    expect(request.url).toBe("https://reptiles.ge/api/revalidate");
    expect(request.headers.get("Authorization")).toBe("Bearer site-secret");
    expect(await request.json()).toEqual({
      tags: ["authors", "author:charles-j-sharp", "species", "news"],
    });
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
    expect(siteFetch).not.toHaveBeenCalled();
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

const ADMIN_ORIGIN = "https://admin.reptiles.ge";

type AdminAuthorList = {
  data: Array<{
    aliasCount: number;
    id: string;
    image: null | string;
    isContributor: boolean;
    jobTitle: null | string;
    kind: string;
    name: { en: null | string; ka: null | string };
    photoCount: number;
    role: null | string;
  }>;
  limit: number;
  page: number;
  pageCount: number;
  total: number;
};

async function adminAction(path: string, headers?: Record<string, string>) {
  return requestJson<ErrorBody & { data: Record<string, unknown> }>(
    `/v1/admin/authors${path}`,
    env,
    {
      headers: headers ?? {
        ...(await adminSessionHeaders(sqlite)),
        Origin: ADMIN_ORIGIN,
      },
      method: "POST",
    },
  );
}

function countAuthors(where = "") {
  return (
    sqlite.prepare(`SELECT COUNT(*) AS n FROM authors ${where}`).get() as {
      n: number;
    }
  ).n;
}

function listAuthors(
  headers: Record<string, string> = { Authorization: `Bearer ${TOKEN}` },
  query = "",
) {
  return requestJson<AdminAuthorList & ErrorBody>(
    `/v1/admin/authors${query}`,
    env,
    { headers },
  );
}

function listAuthorsWith(query: string) {
  return listAuthors(undefined, query);
}

async function sentTags() {
  const [request] = siteFetch.mock.calls[0]!;
  expect(request.url).toBe("https://reptiles.ge/api/revalidate");
  expect(request.headers.get("Authorization")).toBe("Bearer site-secret");
  return ((await request.json()) as { tags: string[] }).tags;
}

describe("GET /v1/admin/authors", () => {
  it("pages through every author, contributors first, then by photos", async () => {
    const first = await listAuthors();
    expect(first.response.status).toBe(200);
    expect(first.response.headers.get("Cache-Control")).toBe("no-store");
    const total = countAuthors();
    expect(first.body).toMatchObject({
      limit: 50,
      page: 1,
      pageCount: Math.ceil(total / 50),
      total,
    });
    expect(first.body.data).toHaveLength(50);
    const all: AdminAuthorList["data"] = [];
    for (let page = 1; page <= Math.ceil(total / 100); page += 1) {
      const { body } = await listAuthorsWith(`?limit=100&page=${page}`);
      expect(body.page).toBe(page);
      all.push(...body.data);
    }
    expect(all).toHaveLength(total);
    expect(new Set(all.map((item) => item.id)).size).toBe(total);
    expect(all.slice(0, 50)).toEqual(first.body.data);
    const firstOther = all.findIndex((item) => !item.isContributor);
    expect(firstOther).toBeGreaterThan(0);
    expect(all.slice(firstOther).every((item) => !item.isContributor)).toBe(
      true,
    );
    const contributors = all.slice(0, firstOther);
    for (let index = 1; index < contributors.length; index += 1) {
      expect(contributors[index - 1]!.photoCount).toBeGreaterThanOrEqual(
        contributors[index]!.photoCount,
      );
    }
  });

  it("answers an empty page past the end", async () => {
    const { body } = await listAuthorsWith("?page=999");
    expect(body.data).toEqual([]);
    expect(body.total).toBe(countAuthors());
  });

  it("filters by contributor, kind and role", async () => {
    const contributors = await listAuthorsWith("?contributor=true&limit=100");
    expect(contributors.body.total).toBe(
      countAuthors("WHERE is_contributor = 1"),
    );
    expect(contributors.body.data.every((item) => item.isContributor)).toBe(
      true,
    );
    const others = await listAuthorsWith("?contributor=false");
    expect(others.body.total).toBe(countAuthors("WHERE is_contributor = 0"));
    const pages = await listAuthorsWith("?kind=page&limit=100");
    expect(pages.body.total).toBe(countAuthors("WHERE kind_id = 'page'"));
    expect(pages.body.data.every((item) => item.kind === "page")).toBe(true);
    const photographers = await listAuthorsWith("?role=photographer");
    expect(photographers.body.total).toBe(
      countAuthors("WHERE role_id = 'photographer'"),
    );
  });

  it("searches the id and the Georgian and English names", async () => {
    for (const q of ["sandro-khakhva", "Sandro Khak", "სანდრო ხახვა"]) {
      const { body } = await listAuthorsWith(`?q=${encodeURIComponent(q)}`);
      expect(body.data.map((item) => item.id)).toContain("sandro-khakhva");
    }
    const none = await listAuthorsWith("?q=%25_%5C");
    expect(none.body).toMatchObject({ data: [], pageCount: 1, total: 0 });
  });

  it("refuses an invalid page, limit or filter", async () => {
    for (const query of [
      "?page=0",
      "?limit=0",
      "?limit=101",
      "?page=one",
      "?kind=robot",
      "?role=wizard",
      "?contributor=yes",
    ]) {
      const { body, response } = await listAuthorsWith(query);
      expect(response.status, query).toBe(400);
      expect(body.error.code).toBe("invalid_request");
    }
  });

  it("returns the admin fields of an author", async () => {
    const { body } = await listAuthors();
    const sandro = body.data.find((item) => item.id === "sandro-khakhva")!;
    const record = (
      await requestJson<{ data: AuthorRecord }>(
        "/v1/admin/authors/sandro-khakhva",
        env,
        { headers: { Authorization: `Bearer ${TOKEN}` } },
      )
    ).body.data;
    const photos = (
      sqlite
        .prepare(
          "SELECT COUNT(DISTINCT src) AS n FROM species_media WHERE author_id = 'sandro-khakhva' AND role != 'audio'",
        )
        .get() as { n: number }
    ).n;
    expect(sandro).toEqual({
      aliasCount: record.aliases.length,
      id: "sandro-khakhva",
      image: record.portraitSrc,
      isContributor: record.isContributor,
      jobTitle: record.jobTitle,
      kind: record.kind,
      name: { en: record.texts.en?.name ?? null, ka: record.texts.ka.name },
      photoCount: photos,
      role: record.role,
    });
  });

  it("lets a signed-in admin read the list and refuses everyone else", async () => {
    expect(
      (await listAuthors(await adminSessionHeaders(sqlite))).response.status,
    ).toBe(200);
    for (const [headers, status] of [
      [{}, 401],
      [{ Authorization: "Bearer wrong" }, 401],
      [{ Cookie: `${ADMIN_SESSION_COOKIE}=made-up` }, 401],
      [await adminSessionHeaders(sqlite, "editor"), 403],
    ] as Array<[Record<string, string>, number]>) {
      expect((await listAuthors(headers)).response.status).toBe(status);
    }
  });

  it("stays out of the public API document", async () => {
    const response = await app.request("/v1/docs/openapi.json", {}, env);
    const document = (await response.json()) as { paths: object };
    expect(Object.keys(document.paths).join()).not.toContain("/admin/authors");
  });
});

describe("POST /v1/admin/authors/:id/revalidate and /revalidate", () => {
  beforeEach(() => {
    env.ALLOWED_ORIGINS = `https://reptiles.ge,${ADMIN_ORIGIN}`;
  });

  it("revalidates one contributor page", async () => {
    const { body, response } = await adminAction("/sandro-khakhva/revalidate");
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.data).toEqual({ id: "sandro-khakhva" });
    expect(await sentTags()).toEqual(["author:sandro-khakhva"]);
  });

  it("revalidates every page that shows authors", async () => {
    const { body, response } = await adminAction("/revalidate");
    expect(response.status).toBe(200);
    expect(body.data).toEqual({ tags: ["authors"] });
    expect(await sentTags()).toEqual(["authors"]);
  });

  it("answers 404 for an unknown author and 502 when the site fails", async () => {
    expect((await adminAction("/nobody/revalidate")).response.status).toBe(404);
    expect(siteFetch).not.toHaveBeenCalled();
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    siteFetch.mockResolvedValue(new Response(null, { status: 500 }));
    for (const path of ["/sandro-khakhva/revalidate", "/revalidate"]) {
      const { body, response } = await adminAction(path);
      expect(response.status).toBe(502);
      expect(body.error.code).toBe("site_unavailable");
    }
    log.mockRestore();
  });

  it("needs an admin session from an allowed origin and is rate limited", async () => {
    const session = await adminSessionHeaders(sqlite);
    for (const path of ["/sandro-khakhva/revalidate", "/revalidate"]) {
      for (const [headers, status] of [
        [{ Origin: ADMIN_ORIGIN }, 401],
        [{ Authorization: `Bearer ${TOKEN}`, Origin: ADMIN_ORIGIN }, 401],
        [session, 403],
        [{ ...session, Origin: "https://evil.example" }, 403],
      ] as Array<[Record<string, string>, number]>) {
        expect((await adminAction(path, headers)).response.status).toBe(status);
      }
    }
    env.ADMIN_LIMITER = { limit: async () => ({ success: false }) };
    expect((await adminAction("/revalidate")).response.status).toBe(429);
    expect(siteFetch).not.toHaveBeenCalled();
  });
});

describe("GET /v1/admin/authors/:id and /:id/photos", () => {
  type PhotosBody = {
    data: Array<{
      date: null | string;
      location: null | string;
      role: string;
      speciesId: string;
      speciesName: { en: null | string; ka: null | string };
      src: string;
      status: string;
    }>;
    id: string;
    total: number;
  };

  function photos(id: string, headers: Record<string, string>) {
    return requestJson<ErrorBody & PhotosBody>(
      `/v1/admin/authors/${id}/photos`,
      env,
      { headers },
    );
  }

  it("lets a session read an author record, but not write it", async () => {
    const session = await adminSessionHeaders(sqlite);
    const read = await requestJson<{ data: AuthorRecord }>(
      "/v1/admin/authors/sandro-khakhva",
      env,
      { headers: session },
    );
    expect(read.response.status).toBe(200);
    expect(read.body.data.id).toBe("sandro-khakhva");
    const write = await requestJson<ErrorBody>(
      "/v1/admin/authors/sandro-khakhva",
      env,
      {
        body: JSON.stringify({ author: read.body.data }),
        headers: { ...session, "Content-Type": "application/json" },
        method: "PUT",
      },
    );
    expect(write.response.status).toBe(401);
  });

  it("lists every species photo credited to the author in catalog order", async () => {
    const expected = sqlite
      .prepare(
        "SELECT m.species_id AS speciesId, m.role AS role, m.src AS src FROM species_media m JOIN species s ON s.id = m.species_id WHERE m.author_id = 'sandro-khakhva' AND m.role != 'audio' ORDER BY s.catalog_position, m.role, m.position",
      )
      .all() as Array<{ role: string; speciesId: string; src: string }>;
    expect(expected.length).toBeGreaterThan(0);
    const { body, response } = await photos(
      "sandro-khakhva",
      await adminSessionHeaders(sqlite),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.id).toBe("sandro-khakhva");
    expect(body.total).toBe(expected.length);
    expect(
      body.data.map(({ role, speciesId, src }) => ({ role, speciesId, src })),
    ).toEqual(expected);
    const first = body.data[0]!;
    const name = sqlite
      .prepare(
        "SELECT common_name AS name FROM species_texts WHERE species_id = ? AND locale = 'ka'",
      )
      .get(first.speciesId) as { name: string };
    expect(first.speciesName.ka).toBe(name.name);
  });

  it("answers 404 for an unknown author and refuses non-admins", async () => {
    const token = { Authorization: `Bearer ${TOKEN}` };
    expect((await photos("nobody", token)).response.status).toBe(404);
    expect((await photos("sandro-khakhva", {})).response.status).toBe(401);
    expect(
      (
        await photos(
          "sandro-khakhva",
          await adminSessionHeaders(sqlite, "editor"),
        )
      ).response.status,
    ).toBe(403);
  });
});
