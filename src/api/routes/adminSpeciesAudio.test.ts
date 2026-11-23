import { beforeEach, describe, expect, it } from "vitest";

import type { SpeciesRecord } from "../db/speciesRows";
import type { ApiBindings } from "../env";

import { adminSessionHeaders } from "../testing/adminSession";
import { type MemoryBucket, memoryBucket } from "../testing/memoryBucket";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const ADMIN_ORIGIN = "https://admin.reptiles.ge";
const ID = "macrovipera-lebetina";
const TOKEN = "test-token";

const MP3 = new Uint8Array(4096);
MP3.set([0x49, 0x44, 0x33, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a]);
MP3.set([0xff, 0xfb, 0x90, 0x64], 20);

let env: ApiBindings;
let session: Record<string, string>;
let bucket: MemoryBucket;

async function record() {
  const { body } = await requestJson<{
    data: { record: SpeciesRecord; version: number };
  }>(`/v1/admin/species/${ID}`, env, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return body.data;
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
  bucket = memoryBucket();
  env = {
    ALLOWED_ORIGINS: ADMIN_ORIGIN,
    API_WRITE_TOKEN: TOKEN,
    CDN_BUCKET: bucket,
    DB: database.db,
  };
  session = await adminSessionHeaders(database.sqlite);
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
    expect(bucket.puts()).toStrictEqual([
      { contentType: "audio/mpeg", key: `audio/${ID}-xc222.mp3` },
    ]);
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
    expect(bucket.puts()).toStrictEqual([]);
  });

  it("refuses an old version", async () => {
    const before = await record();
    const { response } = await upload({
      expectedVersion: String(before.version + 1),
      recordist: "Ana",
      xenoCantoId: "222",
    });
    expect(response.status).toBe(409);
    expect(bucket.puts()).toStrictEqual([]);
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
