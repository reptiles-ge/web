import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const observation = {
  captive: false,
  geojson: { coordinates: [46.629866, 41.263938] },
  id: 294797151,
  obscured: false,
  observed_on: "2025-07-02",
  photos: [
    {
      id: 530655415,
      license_code: "cc-by-nc",
      url: "https://inaturalist-open-data.s3.amazonaws.com/photos/530655415/square.jpg",
    },
    {
      id: 530655416,
      url: "https://inaturalist-open-data.s3.amazonaws.com/photos/530655416/square.jpg",
    },
  ],
  place_guess: "Vashlovani National Park, Georgia",
  place_ids: [8857],
  user: { login: "vanmeetin" },
};

afterEach(() => vi.unstubAllGlobals());

function request(url: string) {
  return new Request("http://localhost/api/admin/inaturalist-photo", {
    body: JSON.stringify({ url }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

describe("POST /api/admin/inaturalist-photo", () => {
  it("fetches the first photo and returns the observation credit fields", async () => {
    const fetchMock = vi.fn(async (url: string) =>
      url.includes("api.inaturalist.org")
        ? Response.json({ results: [observation] })
        : new Response(new Uint8Array([1, 2, 3]), {
            headers: { "Content-Type": "image/jpeg" },
          }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      request("https://www.inaturalist.org/observations/294797151"),
    );
    expect(response.status).toBe(200);
    const result = await response.formData();
    const photo = result.get("photo");
    expect(photo).toBeInstanceOf(File);
    expect((photo as File).name).toBe("inaturalist-294797151-530655415.jpg");
    expect(JSON.parse(String(result.get("metadata")))).toEqual({
      date: "2025-07-02",
      georgiaField: true,
      lat: 41.26394,
      license: "cc-by-nc",
      lng: 46.62987,
      location: "Vashlovani National Park",
      photographer: "vanmeetin",
      url: "https://www.inaturalist.org/photos/530655415",
    });
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      "https://inaturalist-open-data.s3.amazonaws.com/photos/530655415/original.jpg",
    );
  });

  it("does not mark captive or obscured observations as Georgia field photos", async () => {
    vi.stubGlobal("fetch", async (url: string) =>
      url.includes("api.inaturalist.org")
        ? Response.json({
            results: [{ ...observation, captive: true, obscured: true }],
          })
        : new Response(new Uint8Array([1]), {
            headers: { "Content-Type": "image/jpeg" },
          }),
    );

    const response = await POST(
      request("https://www.inaturalist.org/observations/294797151"),
    );
    const result = await response.formData();
    expect(JSON.parse(String(result.get("metadata")))).toMatchObject({
      georgiaField: false,
      lat: "",
      lng: "",
    });
  });

  it("requires a Georgian locality before checking the field photo flag", async () => {
    vi.stubGlobal("fetch", async (url: string) =>
      url.includes("api.inaturalist.org")
        ? Response.json({
            results: [{ ...observation, place_guess: "Georgia" }],
          })
        : new Response(new Uint8Array([1]), {
            headers: { "Content-Type": "image/jpeg" },
          }),
    );

    const response = await POST(
      request("https://www.inaturalist.org/observations/294797151"),
    );
    const result = await response.formData();
    expect(JSON.parse(String(result.get("metadata")))).toMatchObject({
      georgiaField: false,
      location: "Georgia",
    });
  });

  it("rejects unrelated URLs before making a network request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(
      request("https://example.com/observations/294797151"),
    );
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not fetch photo URLs outside the iNaturalist image hosts", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({
        results: [
          {
            ...observation,
            photos: [
              {
                id: 530655415,
                url: "https://example.com/photos/530655415/square.jpg",
              },
            ],
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      request("https://www.inaturalist.org/observations/294797151"),
    );
    expect(response.status).toBe(422);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
