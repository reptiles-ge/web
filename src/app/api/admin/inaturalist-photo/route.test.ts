import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { recordRequests, server } from "../../../../../tests/msw/server";
import { POST } from "./route.local";

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

const API = "https://api.inaturalist.org/v1/observations/294797151";
const ORIGINAL =
  "https://inaturalist-open-data.s3.amazonaws.com/photos/530655415/original.jpg";

function request(url: string) {
  return new Request("http://localhost/api/admin/inaturalist-photo", {
    body: JSON.stringify({ url }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

function useObservation(result: object) {
  server.use(
    http.get(API, () => HttpResponse.json({ results: [result] })),
    http.get(
      ORIGINAL,
      () =>
        new HttpResponse(new Uint8Array([1, 2, 3]), {
          headers: { "Content-Type": "image/jpeg" },
        }),
    ),
  );
}

const OBSERVATION_URL = "https://www.inaturalist.org/observations/294797151";

describe("POST /api/admin/inaturalist-photo", () => {
  it("fetches the first photo and returns the observation credit fields", async () => {
    useObservation(observation);
    const requests = recordRequests();

    const response = await POST(request(OBSERVATION_URL));
    requests.stop();
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
    expect(requests.urls[1]).toBe(ORIGINAL);
  });

  it("does not mark captive or obscured observations as Georgia field photos", async () => {
    useObservation({ ...observation, captive: true, obscured: true });

    const response = await POST(request(OBSERVATION_URL));
    const result = await response.formData();
    expect(JSON.parse(String(result.get("metadata")))).toMatchObject({
      georgiaField: false,
      lat: "",
      lng: "",
    });
  });

  it("requires a Georgian locality before checking the field photo flag", async () => {
    useObservation({ ...observation, place_guess: "Georgia" });

    const response = await POST(request(OBSERVATION_URL));
    const result = await response.formData();
    expect(JSON.parse(String(result.get("metadata")))).toMatchObject({
      georgiaField: false,
      location: "Georgia",
    });
  });

  it("rejects unrelated URLs before making a network request", async () => {
    const requests = recordRequests();
    const response = await POST(
      request("https://example.com/observations/294797151"),
    );
    requests.stop();
    expect(response.status).toBe(400);
    expect(requests.urls).toEqual([]);
  });

  it("does not fetch photo URLs outside the iNaturalist image hosts", async () => {
    server.use(
      http.get(API, () =>
        HttpResponse.json({
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
      ),
    );
    const requests = recordRequests();

    const response = await POST(request(OBSERVATION_URL));
    requests.stop();
    expect(response.status).toBe(422);
    expect(requests.urls).toHaveLength(1);
  });

  it("fails clearly when iNaturalist is unavailable", async () => {
    server.use(http.get(API, () => new HttpResponse(null, { status: 503 })));

    const response = await POST(request(OBSERVATION_URL));
    expect(response.ok).toBe(false);
  });
});
