import { describe, expect, it } from "vitest";

import { app } from "../app";
import { PUBLIC_CACHE } from "../lib/cache";
import { createTestDatabase } from "../testing/sqliteDatabase";

function insert(
  sqlite: ReturnType<typeof createTestDatabase>["sqlite"],
  src: string,
) {
  sqlite
    .prepare(
      "INSERT INTO optimized_images (src, path, width, height, widths, formats, created_at) VALUES (?, ?, 800, 600, '[320,400,640,800]', '[\"avif\",\"webp\"]', '2026-10-24T10:00:00.000Z')",
    )
    .run(src, src.slice("https://cdn.reptiles.ge/".length, -4));
}

describe("GET /v1/images", () => {
  it("returns an empty list before any upload", async () => {
    const { db } = createTestDatabase();
    const response = await app.request("/v1/images", {}, { DB: db });
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(PUBLIC_CACHE);
    expect(await response.json()).toStrictEqual({ data: [], total: 0 });
  });

  it("lists every optimized photo ordered by src", async () => {
    const { db, sqlite } = createTestDatabase();
    insert(sqlite, "https://cdn.reptiles.ge/vipera-eriwanensis-1.jpg");
    insert(sqlite, "https://cdn.reptiles.ge/bufo-viridis-1.jpg");
    const response = await app.request("/v1/images", {}, { DB: db });
    expect(await response.json()).toStrictEqual({
      data: [
        {
          formats: ["avif", "webp"],
          height: 600,
          path: "bufo-viridis-1",
          src: "https://cdn.reptiles.ge/bufo-viridis-1.jpg",
          width: 800,
          widths: [320, 400, 640, 800],
        },
        {
          formats: ["avif", "webp"],
          height: 600,
          path: "vipera-eriwanensis-1",
          src: "https://cdn.reptiles.ge/vipera-eriwanensis-1.jpg",
          width: 800,
          widths: [320, 400, 640, 800],
        },
      ],
      total: 2,
    });
  });

  it("answers 404 for an unknown path below it", async () => {
    const { db } = createTestDatabase();
    const response = await app.request("/v1/images/nope", {}, { DB: db });
    expect(response.status).toBe(404);
  });
});
