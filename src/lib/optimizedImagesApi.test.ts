import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { getUploadedOptimizedImages } from "@/lib/optimizedImagesApi";

import { server } from "../../tests/msw/server";

const URL = "https://api.reptiles.ge/v1/images";

describe("getUploadedOptimizedImages", () => {
  it("maps the API list to entries keyed by src", async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({
          data: [
            {
              formats: ["avif", "webp"],
              height: 750,
              path: "bufo-viridis-ana-1",
              src: "https://cdn.reptiles.ge/bufo-viridis-ana-1.jpg",
              width: 1000,
              widths: [320, 400, 640, 800, 1000],
            },
          ],
          total: 1,
        }),
      ),
    );
    expect(await getUploadedOptimizedImages()).toStrictEqual({
      "https://cdn.reptiles.ge/bufo-viridis-ana-1.jpg": {
        formats: ["avif", "webp"],
        height: 750,
        path: "bufo-viridis-ana-1",
        width: 1000,
        widths: [320, 400, 640, 800, 1000],
      },
    });
  });

  it("reads an empty catalog from the API", async () => {
    expect(await getUploadedOptimizedImages()).toStrictEqual({});
  });

  it("returns null while the API has no images route", async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 404 })));
    expect(await getUploadedOptimizedImages()).toBeNull();
  });

  it("fails on any other error", async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 500 })));
    await expect(getUploadedOptimizedImages()).rejects.toThrow(
      "Optimized images API answered 500",
    );
  });
});
