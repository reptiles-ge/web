import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { EncodedPhoto } from "./photoEncoding";

import { server } from "../../tests/msw/server";
import { SessionExpiredError } from "./adminResponse";
import {
  encodePhotoFile,
  importINaturalistPhoto,
  uploadSpeciesPhoto,
} from "./photos";

const URL = "https://api.reptiles.ge/v1/admin/species/bufo-viridis/photos";

const PHOTO: EncodedPhoto = {
  derivatives: [
    new File(["a"], "320.avif", { type: "image/avif" }),
    new File(["w"], "320.webp", { type: "image/webp" }),
  ],
  height: 240,
  original: new File(["j"], "original.jpg", { type: "image/jpeg" }),
  width: 320,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("uploadSpeciesPhoto", () => {
  it("posts the files and the filled credit fields with credentials", async () => {
    let credentials: string | undefined;
    let fields: Record<string, string[]> = {};
    server.use(
      http.post(URL, async ({ request }) => {
        credentials = request.credentials;
        const form = await request.formData();
        fields = {};
        form.forEach((value, key) => {
          (fields[key] ??= []).push(
            typeof value === "string" ? value : value.name,
          );
        });
        return HttpResponse.json(
          {
            data: {
              optimized: true,
              photo: { src: "https://cdn.reptiles.ge/bufo-viridis-1.jpg" },
              version: 4,
            },
          },
          { status: 201 },
        );
      }),
    );
    const result = await uploadSpeciesPhoto(
      "bufo-viridis",
      { location: "  ", photographer: " ანა ", photographerEn: "Ana" },
      PHOTO,
    );
    expect(result.version).toBe(4);
    expect(credentials).toBe("include");
    expect(fields).toStrictEqual({
      derivatives: ["320.avif", "320.webp"],
      georgiaField: ["0"],
      original: ["original.jpg"],
      photographer: ["ანა"],
      photographerEn: ["Ana"],
    });
  });

  it("shows the API's reason for a rejected photo", async () => {
    server.use(
      http.post(URL, () =>
        HttpResponse.json(
          {
            error: {
              code: "invalid_request",
              message: "Derivatives are missing",
            },
          },
          { status: 400 },
        ),
      ),
    );
    await expect(
      uploadSpeciesPhoto("bufo-viridis", { georgiaField: true }, PHOTO),
    ).rejects.toThrow("Derivatives are missing");
  });

  it.each([401, 403])("reports an expired session on %i", async (status) => {
    server.use(http.post(URL, () => new HttpResponse(null, { status })));
    await expect(
      uploadSpeciesPhoto("bufo-viridis", {}, PHOTO),
    ).rejects.toBeInstanceOf(SessionExpiredError);
  });

  it("fails loudly on any other error", async () => {
    server.use(http.post(URL, () => new HttpResponse(null, { status: 502 })));
    await expect(uploadSpeciesPhoto("bufo-viridis", {}, PHOTO)).rejects.toThrow(
      "Photo upload failed: 502",
    );
  });
});

describe("importINaturalistPhoto", () => {
  const IMPORT_URL = `${URL}/inaturalist`;
  const OBSERVATION = "https://www.inaturalist.org/observations/42";
  const METADATA = {
    date: "2026-05-10",
    georgiaField: true,
    lat: 41.81667,
    license: "cc-by",
    lng: 45.35,
    location: "Vashlovani",
    photographer: "ana",
    url: "https://www.inaturalist.org/photos/7",
  };

  it("posts the URL with credentials and returns the photo and its credit", async () => {
    let credentials: string | undefined;
    let body: unknown;
    server.use(
      http.post(IMPORT_URL, async ({ request }) => {
        credentials = request.credentials;
        body = await request.json();
        const form = new FormData();
        form.set(
          "photo",
          new File(["j"], "inaturalist-42-7.jpg", { type: "image/jpeg" }),
        );
        form.set("metadata", JSON.stringify(METADATA));
        return new HttpResponse(form);
      }),
    );
    const result = await importINaturalistPhoto("bufo-viridis", OBSERVATION);
    expect(credentials).toBe("include");
    expect(body).toStrictEqual({ url: OBSERVATION });
    expect(result.file.name).toBe("inaturalist-42-7.jpg");
    expect(result.metadata).toStrictEqual(METADATA);
  });

  it("shows the API's reason", async () => {
    server.use(
      http.post(IMPORT_URL, () =>
        HttpResponse.json(
          {
            error: {
              code: "invalid_request",
              message: "The observation has no usable photo",
            },
          },
          { status: 422 },
        ),
      ),
    );
    await expect(
      importINaturalistPhoto("bufo-viridis", OBSERVATION),
    ).rejects.toThrow("The observation has no usable photo");
  });

  it("reports an expired session", async () => {
    server.use(
      http.post(IMPORT_URL, () => new HttpResponse(null, { status: 401 })),
    );
    await expect(
      importINaturalistPhoto("bufo-viridis", OBSERVATION),
    ).rejects.toBeInstanceOf(SessionExpiredError);
  });

  it("rejects an incomplete answer", async () => {
    server.use(http.post(IMPORT_URL, () => new HttpResponse(new FormData())));
    await expect(
      importINaturalistPhoto("bufo-viridis", OBSERVATION),
    ).rejects.toThrow("iNaturalist sent an incomplete answer");
  });
});

type FakeWorker = {
  onerror: (() => void) | null;
  onmessage: ((event: MessageEvent) => void) | null;
  posted: unknown;
  terminated: boolean;
};

describe("encodePhotoFile", () => {
  function stubWorker(reply: (worker: FakeWorker) => void) {
    const workers: FakeWorker[] = [];
    class StubWorker implements FakeWorker {
      onerror: (() => void) | null = null;
      onmessage: ((event: MessageEvent) => void) | null = null;
      posted: unknown;
      terminated = false;
      constructor() {
        workers.push(this);
      }
      postMessage(value: unknown) {
        this.posted = value;
        reply(this);
      }
      terminate() {
        this.terminated = true;
      }
    }
    vi.stubGlobal("Worker", StubWorker);
    return workers;
  }

  it("encodes the file in a worker and stops it", async () => {
    const workers = stubWorker((worker) =>
      worker.onmessage?.({ data: { photo: PHOTO } } as MessageEvent),
    );
    const file = new File(["x"], "photo.jpg");
    expect(await encodePhotoFile(file)).toBe(PHOTO);
    expect(workers[0]?.posted).toBe(file);
    expect(workers[0]?.terminated).toBe(true);
  });

  it("rejects with the worker's error", async () => {
    stubWorker((worker) =>
      worker.onmessage?.({
        data: { error: "photo.jpg has too many pixels." },
      } as MessageEvent),
    );
    await expect(encodePhotoFile(new File(["x"], "photo.jpg"))).rejects.toThrow(
      "photo.jpg has too many pixels.",
    );
  });

  it("rejects when the worker crashes", async () => {
    const workers = stubWorker((worker) => worker.onerror?.());
    await expect(encodePhotoFile(new File(["x"], "photo.jpg"))).rejects.toThrow(
      "Could not encode photo",
    );
    expect(workers[0]?.terminated).toBe(true);
  });
});
