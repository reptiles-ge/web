import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import {
  downloadRecording,
  forgetXenoCantoKey,
  readXenoCantoKey,
  saveXenoCantoKey,
  searchXenoCantoSounds,
  XenoCantoKeyError,
} from "./sounds";

const API = "https://xeno-canto.org/api/3/recordings";

function recording(id: string, cnt: string) {
  return {
    cnt,
    date: "2025-06-07",
    file: `https://xeno-canto.org/${id}/download`,
    "file-name": `XC${id}.mp3`,
    gen: "Picus",
    id,
    lat: "41.7",
    length: "0:30",
    lic: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    loc: "Tbilisi",
    lon: "44.8",
    q: "B",
    rec: "Ana",
    sp: "viridis",
    type: "song",
  };
}

describe("searchXenoCantoSounds", () => {
  it("searches from the browser with the key, falls back to tags and puts Georgia first", async () => {
    const seen: URL[] = [];
    server.use(
      http.get(API, ({ request }) => {
        const url = new URL(request.url);
        seen.push(url);
        return url.searchParams.get("query")?.startsWith("gen:")
          ? HttpResponse.json({
              numPages: 2,
              numRecordings: "60",
              page: 2,
              recordings: [recording("1", "Iran"), recording("2", "Georgia")],
            })
          : HttpResponse.json({
              numPages: 0,
              numRecordings: "0",
              page: 2,
              recordings: [],
            });
      }),
    );
    const page = await searchXenoCantoSounds("Picus viridis", 2, "secret");
    expect(page.total).toBe(60);
    expect(page.recordings.map((item) => item.id)).toStrictEqual(["2", "1"]);
    expect(
      seen.map((url) => [
        url.searchParams.get("query"),
        url.searchParams.get("page"),
        url.searchParams.get("per_page"),
        url.searchParams.get("key"),
      ]),
    ).toStrictEqual([
      ['sp:"picus viridis"', "2", "50", "secret"],
      ['gen:"picus" sp:"viridis"', "2", "50", "secret"],
    ]);
  });

  it("reports a refused key apart from other failures", async () => {
    server.use(
      http.get(API, () =>
        HttpResponse.json(
          { error: "client_error", message: "Missing or invalid 'key'" },
          { status: 401 },
        ),
      ),
    );
    await expect(
      searchXenoCantoSounds("Picus viridis", 1, "x"),
    ).rejects.toBeInstanceOf(XenoCantoKeyError);
    server.use(
      http.get(API, () =>
        HttpResponse.json({
          error: "client_error",
          message: "Invalid key parameter",
        }),
      ),
    );
    await expect(
      searchXenoCantoSounds("Picus viridis", 1, "x"),
    ).rejects.toBeInstanceOf(XenoCantoKeyError);
    server.use(
      http.get(API, () => new HttpResponse("<html>Access Denied</html>")),
    );
    await expect(
      searchXenoCantoSounds("Picus viridis", 1, "x"),
    ).rejects.toThrow("xeno-canto search failed: 200");
    server.use(http.get(API, () => HttpResponse.error()));
    await expect(
      searchXenoCantoSounds("Picus viridis", 1, "x"),
    ).rejects.toThrow("did not answer");
  });
});

describe("downloadRecording", () => {
  it("returns the file and reports a failed download", async () => {
    server.use(
      http.get("https://xeno-canto.org/5/download", () =>
        HttpResponse.arrayBuffer(new Uint8Array([1, 2, 3]).buffer),
      ),
      http.get("https://xeno-canto.org/6/download", () =>
        HttpResponse.text("no", { status: 404 }),
      ),
    );
    const blob = await downloadRecording({
      fileUrl: "https://xeno-canto.org/5/download",
    });
    expect(blob.size).toBe(3);
    await expect(
      downloadRecording({ fileUrl: "https://xeno-canto.org/6/download" }),
    ).rejects.toThrow("404");
  });
});

describe("xeno-canto key storage", () => {
  it("does nothing when the browser has no storage", () => {
    expect(() => saveXenoCantoKey("abc")).not.toThrow();
    expect(readXenoCantoKey()).toBeNull();
    expect(() => forgetXenoCantoKey()).not.toThrow();
  });
});
