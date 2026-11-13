import { describe, expect, it } from "vitest";

import { app } from "../app";
import { NO_STORE } from "../lib/cache";
import { createTestDatabase } from "../testing/sqliteDatabase";

const ENV = { API_WRITE_TOKEN: "test-token" };
const AUTH = { Authorization: "Bearer test-token" };
const JSON_HEADERS = { ...AUTH, "Content-Type": "application/json" };

const SRC = "https://cdn.reptiles.ge/bufo-viridis-1.jpg";

const entry = {
  configFingerprint: "fp",
  derivatives: [400, 800].flatMap((width) =>
    (["avif", "webp"] as const).map((format) => ({
      byteSize: 100,
      format,
      height: width / 2,
      key: `optimized/bufo-viridis-1-${width}.${format}`,
      width,
    })),
  ),
  height: 400,
  originalKey: "bufo-viridis-1.jpg",
  originalSize: 1000,
  sourceHash: "hash",
  updatedAt: "2026-11-14T00:00:00.000Z",
  width: 800,
};

const asset = {
  formats: ["avif", "webp"],
  height: 400,
  path: "bufo-viridis-1",
  width: 800,
  widths: [400, 800],
};

const crops = (["16x9", "4x3", "1x1"] as const).map((ratio) => ({
  height: ratio === "16x9" ? 675 : ratio === "4x3" ? 900 : 1200,
  ratio,
  url: `https://cdn.reptiles.ge/schema/${ratio}/bufo-viridis-1.jpg`,
  width: 1200,
}));

function put(path: string, body: unknown, db: unknown) {
  return app.request(
    path,
    { body: JSON.stringify(body), headers: JSON_HEADERS, method: "PUT" },
    { ...ENV, DB: db },
  );
}

describe("/v1/admin/images/manifest", () => {
  it("refuses requests without the write token", async () => {
    const { db } = createTestDatabase();
    const listed = await app.request(
      "/v1/admin/images/manifest",
      {},
      { ...ENV, DB: db },
    );
    expect(listed.status).toBe(401);
    const written = await app.request(
      "/v1/admin/images/manifest",
      {
        body: JSON.stringify({ images: [] }),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      },
      { ...ENV, DB: db },
    );
    expect(written.status).toBe(401);
  });

  it("rejects a malformed entry", async () => {
    const { db } = createTestDatabase();
    const response = await put(
      "/v1/admin/images/manifest",
      {
        images: [{ asset, entry: { ...entry, width: 0 }, key: "a", src: SRC }],
      },
      db,
    );
    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: { code: string } };
    expect(body.error.code).toBe("invalid_request");
  });

  it("stores the manifest entry and the optimized asset, and lists them back", async () => {
    const { db } = createTestDatabase();
    const response = await put(
      "/v1/admin/images/manifest",
      { images: [{ asset, entry, key: "bufo-viridis-1.jpg", src: SRC }] },
      db,
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(NO_STORE);
    expect(await response.json()).toStrictEqual({
      data: { purge: "not_configured", written: 1 },
    });

    const listed = await app.request(
      "/v1/admin/images/manifest",
      { headers: AUTH },
      { ...ENV, DB: db },
    );
    expect(listed.headers.get("Cache-Control")).toBe(NO_STORE);
    expect(await listed.json()).toStrictEqual({
      data: [{ entry, key: "bufo-viridis-1.jpg", src: SRC }],
      total: 1,
    });

    const images = await app.request("/v1/images", {}, { ...ENV, DB: db });
    expect(await images.json()).toStrictEqual({
      data: [{ ...asset, src: SRC }],
      total: 1,
    });
  });

  it("removes the optimized asset when a later entry has no gain", async () => {
    const { db } = createTestDatabase();
    await put(
      "/v1/admin/images/manifest",
      { images: [{ asset, entry, key: "bufo-viridis-1.jpg", src: SRC }] },
      db,
    );
    const response = await put(
      "/v1/admin/images/manifest",
      {
        images: [
          {
            asset: null,
            entry: { ...entry, sourceHash: "new" },
            key: "bufo-viridis-1.jpg",
            src: SRC,
          },
        ],
      },
      db,
    );
    expect(response.status).toBe(200);
    const images = await app.request("/v1/images", {}, { ...ENV, DB: db });
    expect(await images.json()).toStrictEqual({ data: [], total: 0 });
    const listed = await app.request(
      "/v1/admin/images/manifest",
      { headers: AUTH },
      { ...ENV, DB: db },
    );
    const body = (await listed.json()) as {
      data: Array<{ entry: { sourceHash: string } }>;
    };
    expect(body.data[0]?.entry.sourceHash).toBe("new");
  });
});

describe("/v1/admin/images/schema-crops", () => {
  it("refuses requests without the write token", async () => {
    const { db } = createTestDatabase();
    const response = await app.request(
      "/v1/admin/images/schema-crops",
      {},
      { ...ENV, DB: db },
    );
    expect(response.status).toBe(401);
  });

  it("needs all three ratios", async () => {
    const { db } = createTestDatabase();
    const response = await put(
      "/v1/admin/images/schema-crops",
      { images: [{ crops: crops.slice(0, 2), src: SRC }] },
      db,
    );
    expect(response.status).toBe(400);
  });

  it("replaces the crops of a photo and lists them in ratio order", async () => {
    const { db } = createTestDatabase();
    const first = await put(
      "/v1/admin/images/schema-crops",
      { images: [{ crops: [...crops].reverse(), src: SRC }] },
      db,
    );
    expect(first.status).toBe(200);
    expect(await first.json()).toStrictEqual({
      data: { purge: "not_configured", written: 1 },
    });

    const replaced = crops.map((crop) => ({
      ...crop,
      url: crop.url.replace(".jpg", "-v2.jpg"),
    }));
    await put(
      "/v1/admin/images/schema-crops",
      { images: [{ crops: replaced, src: SRC }] },
      db,
    );

    const listed = await app.request(
      "/v1/admin/images/schema-crops",
      { headers: AUTH },
      { ...ENV, DB: db },
    );
    expect(listed.headers.get("Cache-Control")).toBe(NO_STORE);
    expect(await listed.json()).toStrictEqual({
      data: [{ crops: replaced, src: SRC }],
      total: 1,
    });
    const shared = await app.request(
      "/v1/images/schema-crops",
      {},
      { ...ENV, DB: db },
    );
    expect(await shared.json()).toStrictEqual({
      data: [{ crops: replaced, src: SRC }],
      total: 1,
    });
  });
});
