import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { getSpeciesById } from "@/data/species";
import { FALLBACK_OG_IMAGE_URL, speciesOgImageUrl } from "@/lib/site";
import { speciesOpengraphResponse } from "@/lib/speciesOpengraph";

import { recordRequests, server } from "../../tests/msw/server";

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
const ID = "macrovipera-lebetina";
const SPECIES_OG = speciesOgImageUrl(ID, getSpeciesById(ID)?.image);

const image = () =>
  new HttpResponse(JPEG, { headers: { "Content-Type": "image/jpeg" } });
const missing = () => new HttpResponse(null, { status: 404 });

describe("speciesOpengraphResponse", () => {
  it("serves the CDN image as an immutable JPEG", async () => {
    server.use(http.get(SPECIES_OG, image));
    const response = await speciesOpengraphResponse(ID);
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    expect(response.headers.get("Cache-Control")).toContain("immutable");
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(JPEG);
  });

  it("resolves a public Georgian slug to the species id", async () => {
    server.use(http.get(SPECIES_OG, image));
    const requests = recordRequests();
    await speciesOpengraphResponse("giurza");
    requests.stop();
    expect(requests.urls).toEqual([SPECIES_OG]);
  });

  it("falls back to the site image when the species image is missing", async () => {
    server.use(
      http.get(SPECIES_OG, missing),
      http.get(FALLBACK_OG_IMAGE_URL, image),
    );
    const requests = recordRequests();
    const response = await speciesOpengraphResponse(ID);
    requests.stop();
    expect(response.status).toBe(200);
    expect(requests.urls).toEqual([SPECIES_OG, FALLBACK_OG_IMAGE_URL]);
  });

  it("throws when nothing can be loaded", async () => {
    server.use(
      http.get(FALLBACK_OG_IMAGE_URL, missing),
      http.get(/cdn\.reptiles\.ge\/og\/.*/, missing),
    );
    await expect(
      speciesOpengraphResponse("definitely-not-a-species"),
    ).rejects.toThrow("Failed to load OG image for definitely-not-a-species");
  });
});
