import type { DatabaseSync } from "node:sqlite";

import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { SpeciesRecord } from "../db/speciesRows";
import type { ApiBindings } from "../env";

import { app } from "../app";
import { adminSessionHeaders } from "../testing/adminSession";
import { testImage, type TestImageFormat } from "../testing/images";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const ADMIN_ORIGIN = "https://admin.reptiles.ge";
const ID = "macrovipera-lebetina";
const TOKEN = "test-token";
const WIDTHS = [320, 400, 640, 800, 1000];

type Upload = {
  derivatives: Array<{ bytes: Uint8Array<ArrayBuffer>; name: string }>;
  original: Uint8Array<ArrayBuffer>;
};

let sqlite: DatabaseSync;
let env: ApiBindings;
let session: Record<string, string>;
let siteFetch: ReturnType<
  typeof vi.fn<(request: Request) => Promise<Response>>
>;
let storageFetch: ReturnType<
  typeof vi.fn<(url: string, init: RequestInit) => Promise<Response>>
>;
let photo: Upload;

function form(fields: Record<string, string>, files: Upload) {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  body.append("original", new File([files.original], "original.jpg"));
  for (const item of files.derivatives) {
    body.append("derivatives", new File([item.bytes], item.name));
  }
  return body;
}

async function image(format: TestImageFormat, width: number, height: number) {
  return testImage(format, width, height);
}

function puts() {
  return storageFetch.mock.calls
    .filter(([, init]) => init.method === "PUT")
    .map(([url, init]) => ({
      contentType: (init.headers as Record<string, string>)["Content-Type"],
      key: url.replace("https://storage.bunnycdn.com/reptiles/", ""),
    }));
}

async function record() {
  const { body } = await requestJson<{
    data: { record: SpeciesRecord; version: number };
  }>(`/v1/admin/species/${ID}`, env, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return body.data;
}

async function send(
  fields: Record<string, string> = { photographer: "ანა" },
  files: Upload = photo,
  headers: Record<string, string> = { ...session, Origin: ADMIN_ORIGIN },
  id = ID,
) {
  return requestJson<
    ErrorBody & {
      data: {
        optimized: boolean;
        photo: { credit?: Record<string, unknown>; src: string };
        version: number;
      };
    }
  >(`/v1/admin/species/${id}/photos`, env, {
    body: form(fields, files),
    headers,
    method: "POST",
  });
}

async function upload1000x750(): Promise<Upload> {
  const derivatives = await Promise.all(
    WIDTHS.flatMap((width) =>
      (["avif", "webp"] as const).map(async (format) => ({
        bytes: await image(format, width, Math.round((750 * width) / 1000)),
        name: `${width}.${format}`,
      })),
    ),
  );
  return { derivatives, original: await image("jpeg", 1000, 750) };
}

beforeAll(async () => {
  photo = await upload1000x750();
});

beforeEach(async () => {
  const database = createSpeciesTestDatabase();
  sqlite = database.sqlite;
  siteFetch = vi.fn<(request: Request) => Promise<Response>>(
    async () => new Response(null, { status: 204 }),
  );
  storageFetch = vi.fn<(url: string, init: RequestInit) => Promise<Response>>(
    async (url, init) =>
      init.method === "GET"
        ? Response.json([
            { IsDirectory: false, ObjectName: `${ID}-ana-1.jpg` },
            { IsDirectory: true, ObjectName: "optimized" },
          ])
        : new Response(null, { status: 201 }),
  );
  vi.stubGlobal("fetch", storageFetch);
  env = {
    ALLOWED_ORIGINS: `https://reptiles.ge,${ADMIN_ORIGIN}`,
    API_WRITE_TOKEN: TOKEN,
    BUNNY_STORAGE_ACCESS_KEY: "bunny-key",
    BUNNY_STORAGE_ZONE: "reptiles",
    DB: database.db,
    REVALIDATE_TOKEN: "site",
    SITE: { fetch: siteFetch },
  };
  session = await adminSessionHeaders(sqlite);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /v1/admin/species/:id/photos", () => {
  it("stores the photo with its derivatives and adds it to the gallery without clearing the cache", async () => {
    const before = await record();
    const { body, response } = await send({
      date: "2026-05-10",
      lat: "41.81667",
      lng: "45.35",
      location: "ვაშლოვანი",
      locationEn: "Vashlovani",
      photographer: "ანა",
      photographerEn: "Ana",
    });
    expect(response.status).toBe(201);
    const src = `https://cdn.reptiles.ge/${ID}-ana-2.jpg`;
    expect(body.data).toStrictEqual({
      optimized: true,
      photo: {
        credit: {
          date: "2026-05-10",
          lat: 41.81667,
          lng: 45.35,
          location: "ვაშლოვანი",
          photographer: "ანა",
        },
        src,
      },
      version: before.version + 1,
    });
    expect(puts()).toStrictEqual([
      { contentType: "image/jpeg", key: `${ID}-ana-2.jpg` },
      ...WIDTHS.flatMap((width) => [
        {
          contentType: "image/avif",
          key: `optimized/${ID}-ana-2-${width}.avif`,
        },
        {
          contentType: "image/webp",
          key: `optimized/${ID}-ana-2-${width}.webp`,
        },
      ]),
    ]);
    for (const [, init] of storageFetch.mock.calls) {
      expect((init.headers as Record<string, string>).AccessKey).toBe(
        "bunny-key",
      );
    }
    const after = await record();
    expect(after.record.base.gallery).toHaveLength(
      before.record.base.gallery.length + 1,
    );
    expect(after.record.base.gallery.at(-1)?.src).toBe(src);
    expect(after.record.translations.en.gallery?.at(-1)).toMatchObject({
      credit: { location: "Vashlovani", photographer: "Ana" },
      src,
    });
    expect(after.record.base.image).toBe(before.record.base.image);
    expect(
      sqlite
        .prepare(
          "SELECT path, width, height, widths, formats FROM optimized_images WHERE src = ?",
        )
        .get(src),
    ).toEqual({
      formats: '["avif","webp"]',
      height: 750,
      path: `${ID}-ana-2`,
      width: 1000,
      widths: "[320,400,640,800,1000]",
    });
    expect(
      sqlite
        .prepare(
          "SELECT actor, source, summary FROM species_revisions WHERE species_id = ? ORDER BY version DESC LIMIT 1",
        )
        .get(ID),
    ).toMatchObject({
      actor: expect.stringMatching(/@reptiles\.ge$/),
      source: "admin",
      summary: "Add gallery photo",
    });
    expect(siteFetch).not.toHaveBeenCalled();
  });

  it("adds no English overlay when the English credit is the same", async () => {
    const before = await record();
    const { response } = await send({});
    expect(response.status).toBe(201);
    const after = await record();
    expect(after.record.base.gallery.at(-1)).toStrictEqual({
      src: `https://cdn.reptiles.ge/${ID}-1.jpg`,
    });
    expect(after.record.translations.en.gallery).toStrictEqual(
      before.record.translations.en.gallery,
    );
  });

  it("rejects a missing derivative before storing anything", async () => {
    const { body, response } = await send(undefined, {
      ...photo,
      derivatives: photo.derivatives.slice(1),
    });
    expect(response.status).toBe(400);
    expect(body.error.code).toBe("invalid_request");
    expect(body.error.details).toStrictEqual({ missing: ["avif@320"] });
    expect(storageFetch).not.toHaveBeenCalled();
  });

  it("rejects a derivative at a width the ladder does not have", async () => {
    const odd = { bytes: await image("webp", 500, 375), name: "500.webp" };
    const { body, response } = await send(undefined, {
      ...photo,
      derivatives: [...photo.derivatives, odd],
    });
    expect(response.status).toBe(400);
    expect(body.error.message).toBe("Unexpected derivative webp@500");
  });

  it("rejects a derivative that changes the aspect ratio", async () => {
    const squashed = photo.derivatives.map((item) => item);
    squashed[0] = { bytes: await image("avif", 320, 100), name: "320.avif" };
    const { body, response } = await send(undefined, {
      ...photo,
      derivatives: squashed,
    });
    expect(response.status).toBe(400);
    expect(body.error.message).toBe(
      "Derivative avif@320 does not keep the aspect ratio",
    );
  });

  it("rejects an original that is not a JPEG or PNG", async () => {
    const { body, response } = await send(undefined, {
      ...photo,
      original: await image("webp", 1000, 750),
    });
    expect(response.status).toBe(400);
    expect(body.error.message).toBe("The original must be a JPEG or PNG");
  });

  it("rejects a derivative that is not AVIF or WebP", async () => {
    const derivatives = photo.derivatives.map((item) => item);
    derivatives[0] = { bytes: await image("jpeg", 320, 240), name: "320.avif" };
    const { body, response } = await send(undefined, { ...photo, derivatives });
    expect(response.status).toBe(400);
    expect(body.error.message).toBe(
      "Every derivative must be an AVIF or WebP image",
    );
  });

  it("rejects a Georgia field photo without a place", async () => {
    const { body, response } = await send({
      georgiaField: "1",
      photographer: "ანა",
    });
    expect(response.status).toBe(400);
    expect(body.error.code).toBe("invalid_request");
    expect(storageFetch).not.toHaveBeenCalled();
  });

  it("rejects an upload without the original", async () => {
    const body = new FormData();
    body.append("photographer", "ანა");
    const response = await app.request(
      `/v1/admin/species/${ID}/photos`,
      { body, headers: { ...session, Origin: ADMIN_ORIGIN }, method: "POST" },
      env,
    );
    expect(response.status).toBe(400);
  });

  it("answers 404 for an unknown species", async () => {
    const { body, response } = await send(undefined, photo, undefined, "nope");
    expect(response.status).toBe(404);
    expect(body.error.code).toBe("not_found");
  });

  it("needs an admin session, not the write token", async () => {
    const { response } = await send(undefined, photo, {
      Authorization: `Bearer ${TOKEN}`,
      Origin: ADMIN_ORIGIN,
    });
    expect(response.status).toBe(401);
  });

  it("refuses another origin", async () => {
    const { body, response } = await send(undefined, photo, {
      ...session,
      Origin: "https://evil.example",
    });
    expect(response.status).toBe(403);
    expect(body.error.code).toBe("forbidden");
  });

  it("answers 429 when the upload limit is reached", async () => {
    env.UPLOAD_LIMITER = { limit: async () => ({ success: false }) };
    const { body, response } = await send();
    expect(response.status).toBe(429);
    expect(body.error.code).toBe("rate_limited");
  });

  it("answers 503 when photo storage is not configured", async () => {
    delete env.BUNNY_STORAGE_ACCESS_KEY;
    const { body, response } = await send();
    expect(response.status).toBe(503);
    expect(body.error.code).toBe("storage_unavailable");
  });

  it("answers 502 and leaves the gallery alone when storage fails", async () => {
    storageFetch.mockImplementation(async (_url, init) =>
      init.method === "GET"
        ? Response.json([])
        : new Response(null, { status: 401 }),
    );
    const before = await record();
    const { body, response } = await send();
    expect(response.status).toBe(502);
    expect(body.error.code).toBe("storage_failed");
    expect((await record()).version).toBe(before.version);
  });
});
