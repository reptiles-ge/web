import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SpeciesRecord } from "../db/speciesRows";
import type { ApiBindings } from "../env";

import { app } from "../app";
import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const TOKEN = "test-token";
const ID = "macrovipera-lebetina";
const auth = { Authorization: `Bearer ${TOKEN}` };

let env: ApiBindings;
let siteFetch: ReturnType<
  typeof vi.fn<(request: Request) => Promise<Response>>
>;
let pending: Array<Promise<unknown>>;

const executionCtx = {
  passThroughOnException: () => {},
  props: {},
  waitUntil: (promise: Promise<unknown>) => {
    pending.push(promise);
  },
};

async function action<T>(name: string, body: Record<string, unknown>) {
  const response = await app.request(
    `/v1/admin/species/${ID}/photos/${name}`,
    {
      body: JSON.stringify({ actor: "nika", ...body }),
      headers: { ...auth, "Content-Type": "application/json" },
      method: "POST",
    },
    env,
    executionCtx,
  );
  return { body: (await response.json()) as T, response };
}

async function record() {
  const { body } = await requestJson<{
    data: { record: SpeciesRecord; version: number };
  }>(`/v1/admin/species/${ID}`, env, { headers: auth });
  return body.data;
}

beforeEach(() => {
  pending = [];
  siteFetch = vi.fn<(request: Request) => Promise<Response>>(
    async () => new Response(null, { status: 204 }),
  );
  env = {
    API_WRITE_TOKEN: TOKEN,
    DB: createSpeciesTestDatabase().db,
    REVALIDATE_TOKEN: "site",
    SITE: { fetch: siteFetch },
  };
});

describe("photo actions", () => {
  it("sets the desktop cover with the photo credit and revalidates", async () => {
    const before = await record();
    const photo = before.record.base.gallery.at(-1)!;
    const { body, response } = await action<{
      data: { image: string; version: number };
    }>("cover", { src: photo.src, target: "desktop" });
    expect(response.status).toBe(200);
    expect(body.data).toMatchObject({ image: photo.src, version: 2 });
    const after = await record();
    expect(after.record.base.image).toBe(photo.src);
    expect(after.record.base.imageCredit).toStrictEqual(photo.credit);
    expect(after.record.base.mobileImage).toBe(before.record.base.mobileImage);
    await Promise.all(pending);
    expect(siteFetch).toHaveBeenCalledTimes(1);
  });

  it("updates an existing translated cover credit from that locale's overlay", async () => {
    const { record: current } = await record();
    const locale = (["en", "ru", "tr"] as const).find(
      (entry) =>
        current.translations[entry].imageCredit &&
        current.translations[entry].gallery?.some((item) => item.credit),
    );
    if (!locale) return;
    const overlay = current.translations[locale].gallery!.find(
      (item) => item.credit,
    )!;
    await action("cover", { src: overlay.src, target: "both" });
    const after = (await record()).record;
    expect(after.translations[locale].imageCredit).toStrictEqual(
      overlay.credit,
    );
    expect(after.base.mobileImage).toBe(overlay.src);
  });

  it("reorders the gallery and rejects a partial order", async () => {
    const { record: current } = await record();
    const srcs = current.base.gallery.map((item) => item.src).reverse();
    expect((await action("order", { srcs })).response.status).toBe(200);
    expect(
      (await record()).record.base.gallery.map((item) => item.src),
    ).toEqual(srcs);
    const partial = await action<ErrorBody>("order", { srcs: srcs.slice(1) });
    expect(partial.response.status).toBe(400);
  });

  it("removes a photo and moves the cover to the next one", async () => {
    const { record: current } = await record();
    const cover = current.base.image;
    const index = current.base.gallery.findIndex((item) => item.src === cover);
    const { body, response } = await action<{
      data: { coverReassigned: boolean; image: string };
    }>("remove", { src: cover });
    expect(response.status).toBe(200);
    const after = (await record()).record;
    expect(after.base.gallery.some((item) => item.src === cover)).toBe(false);
    const next =
      after.base.gallery[Math.min(index, after.base.gallery.length - 1)]!;
    expect(body.data).toMatchObject({ coverReassigned: true, image: next.src });
    expect(after.base.imageCredit).toStrictEqual(next.credit);
    for (const locale of ["en", "ru", "tr"] as const) {
      expect(
        after.translations[locale].gallery?.some(
          (item) => item.src === cover,
        ) ?? false,
      ).toBe(false);
    }
  });

  it("refuses to delete the last photo", async () => {
    const { record: current } = await record();
    const srcs = current.base.gallery.map((item) => item.src);
    for (const src of srcs.slice(1)) await action("remove", { src });
    const last = await action<ErrorBody>("remove", { src: srcs[0] });
    expect(last.response.status).toBe(400);
    expect(last.body.error.message).toBe(
      "Cannot delete the last gallery photo",
    );
  });

  it("sets and clears coordinates, also on the matching cover credit", async () => {
    const { record: current } = await record();
    const cover = current.base.image;
    const set = await action<{ data: { credit: Record<string, unknown> } }>(
      "coordinates",
      { coordinates: { lat: 41.7, lng: 44.8 }, src: cover },
    );
    expect(set.body.data.credit).toMatchObject({ lat: 41.7, lng: 44.8 });
    let after = (await record()).record;
    expect(after.base.imageCredit).toMatchObject({ lat: 41.7, lng: 44.8 });
    await action("coordinates", { coordinates: null, src: cover });
    after = (await record()).record;
    const credit = after.base.gallery.find(
      (item) => item.src === cover,
    )?.credit;
    expect(credit?.lat).toBeUndefined();
    expect(after.base.imageCredit?.lat).toBeUndefined();
  });

  it("answers 404 for an unknown photo and 401 without the token", async () => {
    const unknown = await action<ErrorBody>("cover", {
      src: "https://cdn.reptiles.ge/missing.jpg",
      target: "both",
    });
    expect(unknown.response.status).toBe(404);
    expect(unknown.body.error.code).toBe("not_found");
    const anonymous = await app.request(
      `/v1/admin/species/${ID}/photos/order`,
      {
        body: JSON.stringify({ actor: "x", srcs: ["a", "b"] }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
      env,
    );
    expect(anonymous.status).toBe(401);
    expect((await record()).version).toBe(1);
  });
});
