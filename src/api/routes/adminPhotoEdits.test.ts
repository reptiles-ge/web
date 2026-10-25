import type { DatabaseSync } from "node:sqlite";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SpeciesRecord } from "../db/speciesRows";
import type { ApiBindings } from "../env";

import { adminSessionHeaders } from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const ADMIN_ORIGIN = "https://admin.reptiles.ge";
const ID = "macrovipera-lebetina";
const TOKEN = "test-token";

let sqlite: DatabaseSync;
let env: ApiBindings;
let session: Record<string, string>;
let siteFetch: ReturnType<
  typeof vi.fn<(request: Request) => Promise<Response>>
>;

async function post<T>(
  action: "credit" | "delete",
  body: Record<string, unknown>,
  headers: Record<string, string> = { ...session, Origin: ADMIN_ORIGIN },
  id = ID,
) {
  return requestJson<ErrorBody & { data: T }>(
    `/v1/admin/species/${id}/photos/${action}`,
    env,
    {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", ...headers },
      method: "POST",
    },
  );
}

async function record() {
  const { body } = await requestJson<{
    data: { record: SpeciesRecord; version: number };
  }>(`/v1/admin/species/${ID}`, env, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return body.data;
}

function revision(version: number) {
  return sqlite
    .prepare(
      "SELECT actor, source, summary FROM species_revisions WHERE species_id = ? AND version = ?",
    )
    .get(ID, version);
}

beforeEach(async () => {
  const database = createSpeciesTestDatabase();
  sqlite = database.sqlite;
  siteFetch = vi.fn<(request: Request) => Promise<Response>>(
    async () => new Response(null, { status: 204 }),
  );
  env = {
    ALLOWED_ORIGINS: `https://reptiles.ge,${ADMIN_ORIGIN}`,
    API_WRITE_TOKEN: TOKEN,
    DB: database.db,
    REVALIDATE_TOKEN: "site",
    SITE: { fetch: siteFetch },
  };
  session = await adminSessionHeaders(sqlite);
});

describe("POST /v1/admin/species/:id/photos/credit", () => {
  it("replaces a gallery photo's credit, its cover credit and the English overlay", async () => {
    const before = await record();
    const cover = before.record.base.image;
    const photo = before.record.base.gallery.find(
      (item) => item.src === cover,
    )!;
    const { body, response } = await post<{
      credit: Record<string, unknown>;
      version: number;
    }>("credit", {
      credit: {
        date: "2026-05-10",
        georgiaField: true,
        lat: "41.5",
        lng: "45.1",
        location: "ვაშლოვანი",
        locationEn: "Vashlovani",
        photographer: "ანა",
        photographerEn: "Ana",
        url: "https://example.org/ana",
      },
      expectedVersion: before.version,
      src: photo.src,
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const ka = {
      date: "2026-05-10",
      lat: 41.5,
      lng: 45.1,
      location: "ვაშლოვანი",
      photoConfidence: "georgia-field",
      photographer: "ანა",
      url: "https://example.org/ana",
    };
    const en = { ...ka, location: "Vashlovani", photographer: "Ana" };
    expect(body.data).toEqual({ credit: ka, version: before.version + 1 });
    const after = (await record()).record;
    const edited = after.base.gallery.find((item) => item.src === photo.src)!;
    expect(edited.credit).toMatchObject(ka);
    expect(after.base.imageCredit).toMatchObject(ka);
    expect(
      after.translations.en.gallery?.find((item) => item.src === photo.src)
        ?.credit,
    ).toMatchObject(en);
    expect(after.translations.en.imageCredit).toMatchObject(en);
    expect(after.base.gallery.map((item) => item.src)).toEqual(
      before.record.base.gallery.map((item) => item.src),
    );
    expect(revision(before.version + 1)).toEqual({
      actor: "Admin",
      source: "admin",
      summary: "Edit photo credit",
    });
    expect(siteFetch).not.toHaveBeenCalled();
  });

  it("drops the English overlay when it matches the Georgian credit", async () => {
    const before = await record();
    const photo = before.record.base.gallery.at(-1)!;
    await post("credit", {
      credit: { georgiaField: false, photographer: "Ana" },
      expectedVersion: before.version,
      src: photo.src,
    });
    const first = await record();
    expect(
      first.record.translations.en.gallery?.some(
        (item) => item.src === photo.src,
      ) ?? false,
    ).toBe(false);
    await post("credit", {
      credit: {
        georgiaField: false,
        photographer: "ანა",
        photographerEn: "Ana",
      },
      expectedVersion: first.version,
      src: photo.src,
    });
    await post("credit", {
      credit: { georgiaField: false, photographer: "Ana" },
      expectedVersion: first.version + 1,
      src: photo.src,
    });
    const after = (await record()).record;
    expect(
      after.translations.en.gallery?.some((item) => item.src === photo.src) ??
        false,
    ).toBe(false);
    expect(
      after.base.gallery.find((item) => item.src === photo.src)?.credit,
    ).toMatchObject({ photographer: "Ana" });
  });

  it("refuses a Georgia field photo without a place", async () => {
    const before = await record();
    const { body, response } = await post("credit", {
      credit: { georgiaField: true, photographer: "ანა" },
      expectedVersion: before.version,
      src: before.record.base.gallery[0]!.src,
    });
    expect(response.status).toBe(400);
    expect(body.error.code).toBe("invalid_request");
    expect((await record()).version).toBe(before.version);
  });

  it("answers 409 on a stale version and 404 on an unknown photo", async () => {
    const before = await record();
    const stale = await post("credit", {
      credit: { georgiaField: false },
      expectedVersion: before.version + 5,
      src: before.record.base.gallery[0]!.src,
    });
    expect(stale.response.status).toBe(409);
    const unknown = await post("credit", {
      credit: { georgiaField: false },
      expectedVersion: before.version,
      src: "https://cdn.reptiles.ge/nope.jpg",
    });
    expect(unknown.response.status).toBe(404);
    const species = await post(
      "credit",
      {
        credit: { georgiaField: false },
        expectedVersion: 1,
        src: "x",
      },
      undefined,
      "nope",
    );
    expect(species.response.status).toBe(404);
  });

  it("needs an admin session from the admin origin", async () => {
    const before = await record();
    const body = {
      credit: { georgiaField: false },
      expectedVersion: before.version,
      src: before.record.base.gallery[0]!.src,
    };
    expect(
      (
        await post("credit", body, {
          Authorization: `Bearer ${TOKEN}`,
          Origin: ADMIN_ORIGIN,
        })
      ).response.status,
    ).toBe(401);
    expect(
      (
        await post("credit", body, {
          ...session,
          Origin: "https://evil.example",
        })
      ).response.status,
    ).toBe(403);
  });
});

describe("POST /v1/admin/species/:id/photos/delete", () => {
  it("removes a gallery photo and moves the cover to the next one", async () => {
    const before = await record();
    const cover = before.record.base.image;
    const { body, response } = await post<{
      coverReassigned: boolean;
      image: string;
      version: number;
    }>("delete", { expectedVersion: before.version, src: cover });
    expect(response.status).toBe(200);
    expect(body.data.coverReassigned).toBe(true);
    expect(body.data.version).toBe(before.version + 1);
    const after = (await record()).record;
    expect(after.base.gallery.some((item) => item.src === cover)).toBe(false);
    expect(after.base.gallery).toHaveLength(
      before.record.base.gallery.length - 1,
    );
    expect(after.base.image).toBe(body.data.image);
    expect(after.base.image).not.toBe(cover);
    expect(revision(before.version + 1)).toEqual({
      actor: "Admin",
      source: "admin",
      summary: "Remove gallery photo",
    });
    expect(siteFetch).not.toHaveBeenCalled();
  });

  it("answers 409 on a stale version and needs a session", async () => {
    const before = await record();
    const src = before.record.base.gallery[0]!.src;
    expect(
      (await post("delete", { expectedVersion: before.version + 1, src }))
        .response.status,
    ).toBe(409);
    expect(
      (
        await post(
          "delete",
          { expectedVersion: before.version, src },
          { Authorization: `Bearer ${TOKEN}`, Origin: ADMIN_ORIGIN },
        )
      ).response.status,
    ).toBe(401);
    expect((await record()).record.base.gallery).toHaveLength(
      before.record.base.gallery.length,
    );
  });
});
