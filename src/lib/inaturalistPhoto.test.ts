import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { server } from "../../tests/msw/server";
import {
  fetchINaturalistPhoto,
  iNaturalistPhotoFormData,
  observationIdFromUrl,
} from "./inaturalistPhoto";

const OBSERVATION_API = "https://api.inaturalist.org/v1/observations/42";
const SQUARE =
  "https://inaturalist-open-data.s3.amazonaws.com/photos/7/square.jpeg";
const ORIGINAL =
  "https://inaturalist-open-data.s3.amazonaws.com/photos/7/original.jpeg";
const URL = "https://www.inaturalist.org/observations/42";

function observation(overrides: Record<string, unknown> = {}) {
  return {
    geojson: { coordinates: [45.350004, 41.816671] },
    id: 42,
    observed_on: "2026-05-10",
    photos: [{ id: 7, license_code: "cc-by-nc", url: SQUARE }],
    place_guess: "Vashlovani, Kakheti, Georgia",
    place_ids: [8857],
    user: { login: "ana" },
    ...overrides,
  };
}

function serve(
  body: Record<string, unknown>,
  photo: () => Response = () =>
    new HttpResponse(new Uint8Array([1, 2, 3]), {
      headers: { "Content-Type": "image/jpeg" },
    }),
) {
  server.use(
    http.get(OBSERVATION_API, () => HttpResponse.json({ results: [body] })),
    http.get(ORIGINAL, photo),
  );
}

describe("observationIdFromUrl", () => {
  it("reads the id from an observation URL only", () => {
    expect(observationIdFromUrl(` ${URL}/ `)).toBe(42);
    expect(observationIdFromUrl("https://inaturalist.org/observations/9")).toBe(
      9,
    );
    expect(
      observationIdFromUrl("http://www.inaturalist.org/observations/9"),
    ).toBe(null);
    expect(observationIdFromUrl("https://evil.example/observations/9")).toBe(
      null,
    );
    expect(observationIdFromUrl("https://www.inaturalist.org/photos/9")).toBe(
      null,
    );
    expect(observationIdFromUrl("not a url")).toBe(null);
  });
});

describe("fetchINaturalistPhoto", () => {
  it("downloads the first original photo with the observation's credit", async () => {
    serve(observation());
    const result = await fetchINaturalistPhoto(URL);
    if (!result.ok) throw new Error(result.reason);
    expect(result.file.name).toBe("inaturalist-42-7.jpg");
    expect(result.file.type).toBe("image/jpeg");
    expect(result.file.size).toBe(3);
    expect(result.metadata).toStrictEqual({
      date: "2026-05-10",
      georgiaField: true,
      lat: 41.81667,
      license: "cc-by-nc",
      lng: 45.35,
      location: "Vashlovani",
      photographer: "ana",
      url: "https://www.inaturalist.org/photos/7",
    });
    const form = iNaturalistPhotoFormData(result);
    expect(form.get("photo")).toBeInstanceOf(File);
    expect(JSON.parse(form.get("metadata") as string)).toStrictEqual(
      result.metadata,
    );
  });

  it("leaves hidden coordinates empty and does not mark the photo as Georgian", async () => {
    serve(
      observation({
        obscured: true,
        observed_on: null,
        photos: [{ id: 7, url: SQUARE }],
      }),
    );
    const result = await fetchINaturalistPhoto(URL);
    if (!result.ok) throw new Error(result.reason);
    expect(result.metadata).toMatchObject({
      date: "",
      georgiaField: false,
      lat: "",
      license: "all rights reserved",
      lng: "",
    });
  });

  it("does not mark a country-only place or a captive animal as Georgian", async () => {
    serve(observation({ place_guess: "Georgia" }));
    const countryOnly = await fetchINaturalistPhoto(URL);
    expect(countryOnly.ok && countryOnly.metadata.georgiaField).toBe(false);
    serve(observation({ captive: true }));
    const captive = await fetchINaturalistPhoto(URL);
    expect(captive.ok && captive.metadata.georgiaField).toBe(false);
  });

  it("uses only redirect modes the Workers runtime accepts and never follows one", async () => {
    serve(observation());
    const spy = vi.spyOn(globalThis, "fetch");
    try {
      await fetchINaturalistPhoto(URL);
      expect(spy).toHaveBeenCalledTimes(2);
      for (const [, init] of spy.mock.calls) {
        expect(init?.redirect).toBe("manual");
      }
    } finally {
      spy.mockRestore();
    }
    serve(
      observation(),
      () =>
        new HttpResponse(null, {
          headers: { Location: "https://evil.example/photo.jpg" },
          status: 302,
        }),
    );
    expect(await fetchINaturalistPhoto(URL)).toMatchObject({
      reason: "download_failed",
    });
  });

  it("names each failure", async () => {
    expect(await fetchINaturalistPhoto("https://example.com")).toStrictEqual({
      ok: false,
      reason: "invalid_url",
    });

    server.use(
      http.get(OBSERVATION_API, () => new HttpResponse(null, { status: 404 })),
    );
    expect(await fetchINaturalistPhoto(URL)).toMatchObject({
      reason: "not_found",
    });

    server.use(
      http.get(OBSERVATION_API, () => HttpResponse.json({ results: [] })),
    );
    expect(await fetchINaturalistPhoto(URL)).toMatchObject({
      reason: "not_found",
    });

    serve(observation({ photos: [] }));
    expect(await fetchINaturalistPhoto(URL)).toMatchObject({
      reason: "no_photo",
    });

    serve(
      observation({
        photos: [{ id: 7, url: "https://evil.example/photos/7/square.jpeg" }],
      }),
    );
    expect(await fetchINaturalistPhoto(URL)).toMatchObject({
      reason: "no_photo",
    });

    serve(observation({ user: { login: " " } }));
    expect(await fetchINaturalistPhoto(URL)).toMatchObject({
      reason: "no_photographer",
    });

    serve(observation(), () => new HttpResponse(null, { status: 403 }));
    expect(await fetchINaturalistPhoto(URL)).toMatchObject({
      reason: "download_failed",
    });

    serve(
      observation(),
      () =>
        new HttpResponse("<svg/>", {
          headers: { "Content-Type": "image/svg+xml" },
        }),
    );
    expect(await fetchINaturalistPhoto(URL)).toMatchObject({
      reason: "unsupported_format",
    });

    serve(
      observation(),
      () =>
        new HttpResponse(new Uint8Array([1]), {
          headers: {
            "Content-Length": String(12 * 1024 * 1024 + 1),
            "Content-Type": "image/jpeg",
          },
        }),
    );
    expect(await fetchINaturalistPhoto(URL)).toMatchObject({
      reason: "too_large",
    });

    serve(
      observation(),
      () =>
        new HttpResponse(new Uint8Array(0), {
          headers: { "Content-Type": "image/jpeg" },
        }),
    );
    expect(await fetchINaturalistPhoto(URL)).toMatchObject({
      reason: "too_large",
    });

    server.use(http.get(OBSERVATION_API, () => HttpResponse.error()));
    expect(await fetchINaturalistPhoto(URL)).toMatchObject({
      reason: "unreachable",
    });
  });
});
