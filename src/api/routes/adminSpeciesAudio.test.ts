import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { SpeciesRecord } from "../db/speciesRows";
import type { ApiBindings } from "../env";

import { adminSessionHeaders } from "../testing/adminSession";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const ADMIN_ORIGIN = "https://admin.reptiles.ge";
const ID = "macrovipera-lebetina";
const TOKEN = "test-token";

const MP3 = new Uint8Array(4096);
MP3.set([0x49, 0x44, 0x33, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a]);
MP3.set([0xff, 0xfb, 0x90, 0x64], 20);

type Upstream = ReturnType<
  typeof vi.fn<(url: string, init?: RequestInit) => Promise<Response>>
>;

let env: ApiBindings;
let session: Record<string, string>;
let upstream: Upstream;
let xenoCanto: (url: URL) => Response;

async function record() {
  const { body } = await requestJson<{
    data: { record: SpeciesRecord; version: number };
  }>(`/v1/admin/species/${ID}`, env, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return body.data;
}

function recording(id: string, cnt: string, q: string) {
  return {
    cnt,
    date: "2020-04-00",
    en: "Levant Viper",
    file: `https://xeno-canto.org/${id}/download`,
    "file-name": `XC${id} - Levant Viper.mp3`,
    gen: "Macrovipera",
    id,
    lat: "41.7",
    length: "1:05",
    lic: "//creativecommons.org/licenses/by-nc-sa/4.0/",
    loc: "Vashlovani",
    lon: "46.3",
    q,
    rec: "Ana Recordist",
    sono: { small: `//xeno-canto.org/sounds/${id}-small.png` },
    sp: "lebetinus",
    type: "call",
  };
}

function search(page?: number) {
  return requestJson<
    ErrorBody & {
      data: {
        page: number;
        query: string;
        recordings: Array<{
          country: string;
          date?: string;
          durationSeconds: number;
          fileUrl: string;
          format: string;
          id: string;
          licence: string;
          sonogram?: string;
        }>;
        total: number;
      };
    }
  >(
    `/v1/admin/species/${ID}/sounds/xeno-canto${page ? `?page=${page}` : ""}`,
    env,
    { headers: { ...session, Origin: ADMIN_ORIGIN } },
  );
}

function upload(
  fields: Record<string, string>,
  bytes: Uint8Array<ArrayBuffer> = MP3,
  headers: Record<string, string> = { ...session, Origin: ADMIN_ORIGIN },
) {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.append(key, value);
  body.append("file", new File([bytes], "sound.mp3", { type: "audio/mpeg" }));
  return requestJson<
    ErrorBody & {
      data: { audio: Record<string, string>; previous: null | string };
    }
  >(`/v1/admin/species/${ID}/audio`, env, {
    body,
    headers,
    method: "POST",
  });
}

beforeEach(async () => {
  const database = createSpeciesTestDatabase();
  xenoCanto = () =>
    Response.json({
      numPages: 1,
      numRecordings: "2",
      page: 1,
      recordings: [
        recording("111", "Armenia", "A"),
        recording("222", "Georgia", "B"),
      ],
    });
  upstream = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
    async (url) => {
      const parsed = new URL(url);
      if (parsed.hostname === "xeno-canto.org") return xenoCanto(parsed);
      return new Response(null, { status: 201 });
    },
  );
  vi.stubGlobal("fetch", upstream);
  env = {
    ALLOWED_ORIGINS: ADMIN_ORIGIN,
    API_WRITE_TOKEN: TOKEN,
    BUNNY_STORAGE_ACCESS_KEY: "bunny-key",
    BUNNY_STORAGE_ZONE: "reptiles",
    DB: database.db,
    XENO_CANTO_API_KEY: "xc-key",
  };
  session = await adminSessionHeaders(database.sqlite);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("GET /v1/admin/species/:id/sounds/xeno-canto", () => {
  it("searches by the scientific name with the secret key, Georgia first", async () => {
    const { body, response } = await search();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    const url = new URL(upstream.mock.calls[0]![0]);
    expect(url.searchParams.get("query")).toBe('sp:"macrovipera lebetinus"');
    expect(url.searchParams.get("key")).toBe("xc-key");
    expect(body.data.total).toBe(2);
    expect(body.data.recordings.map((item) => item.id)).toStrictEqual([
      "222",
      "111",
    ]);
    expect(body.data.recordings[0]).toMatchObject({
      country: "Georgia",
      date: "2020-04",
      durationSeconds: 65,
      fileUrl: "https://xeno-canto.org/222/download",
      format: "mp3",
      licence: "CC BY-NC-SA 4.0",
      sonogram: "https://xeno-canto.org/sounds/222-small.png",
    });
    expect(JSON.stringify(body)).not.toContain("xc-key");
  });

  it("falls back to genus and epithet tags when the name finds nothing", async () => {
    xenoCanto = (url) =>
      url.searchParams.get("query")?.startsWith("gen:")
        ? Response.json({
            numPages: 1,
            numRecordings: 1,
            page: 2,
            recordings: [recording("333", "Iran", "A")],
          })
        : Response.json({
            numPages: 0,
            numRecordings: 0,
            page: 2,
            recordings: [],
          });
    const { body } = await search(2);
    expect(body.data.query).toBe('gen:"macrovipera" sp:"lebetinus"');
    expect(body.data.recordings.map((item) => item.id)).toStrictEqual(["333"]);
    expect(new URL(upstream.mock.calls[1]![0]).searchParams.get("page")).toBe(
      "2",
    );
  });

  it("answers 503 without a key and 502 when xeno-canto fails", async () => {
    env.XENO_CANTO_API_KEY = undefined;
    expect((await search()).response.status).toBe(503);
    env.XENO_CANTO_API_KEY = "xc-key";
    vi.spyOn(console, "error").mockImplementation(() => {});
    xenoCanto = () =>
      Response.json({ error: "client_error", message: "bad" }, { status: 400 });
    const { body, response } = await search();
    expect(response.status).toBe(502);
    expect(body.error.code).toBe("upstream_failed");
  });

  it("needs an admin", async () => {
    const response = await requestJson(
      `/v1/admin/species/${ID}/sounds/xeno-canto`,
      env,
    );
    expect(response.response.status).toBe(401);
  });
});

describe("POST /v1/admin/species/:id/audio", () => {
  it("stores the MP3 under audio/ and sets the species sound", async () => {
    const before = await record();
    const { body, response } = await upload({
      date: "2020-04",
      expectedVersion: String(before.version),
      location: "Vashlovani, Georgia",
      recordist: "Ana Recordist",
      xenoCantoId: "222",
    });
    expect(response.status).toBe(201);
    const put = upstream.mock.calls.find(([, init]) => init?.method === "PUT");
    expect(put?.[0]).toBe(
      `https://storage.bunnycdn.com/reptiles/audio/${ID}-xc222.mp3`,
    );
    expect((put?.[1]?.headers as Record<string, string>)["Content-Type"]).toBe(
      "audio/mpeg",
    );
    const audio = {
      date: "2020-04",
      location: "Vashlovani, Georgia",
      recordist: "Ana Recordist",
      src: `https://cdn.reptiles.ge/audio/${ID}-xc222.mp3`,
      url: "https://xeno-canto.org/222",
    };
    expect(body.data.audio).toStrictEqual(audio);
    const after = await record();
    expect(after.version).toBe(before.version + 1);
    expect(after.record.base.audio).toStrictEqual(audio);
  });

  it("refuses a file that is not an MP3 and stores nothing", async () => {
    const before = await record();
    const { body, response } = await upload(
      {
        expectedVersion: String(before.version),
        recordist: "Ana",
        xenoCantoId: "222",
      },
      new Uint8Array(4096).fill(7),
    );
    expect(response.status).toBe(400);
    expect(body.error.message).toContain("MP3");
    expect(upstream).not.toHaveBeenCalled();
  });

  it("refuses an old version", async () => {
    const before = await record();
    const { response } = await upload({
      expectedVersion: String(before.version + 1),
      recordist: "Ana",
      xenoCantoId: "222",
    });
    expect(response.status).toBe(409);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("needs an admin session from the admin origin", async () => {
    const { response } = await upload(
      { expectedVersion: "1", recordist: "Ana", xenoCantoId: "222" },
      MP3,
      { Authorization: `Bearer ${TOKEN}`, Origin: ADMIN_ORIGIN },
    );
    expect([401, 403]).toContain(response.status);
  });
});
