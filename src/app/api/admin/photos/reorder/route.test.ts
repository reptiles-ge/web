import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/adminAccess", () => ({
  isLocalAdminEnabled: () => true,
  localAdminForbiddenResponse: () => new Response(null, { status: 403 }),
}));

import { POST as setCoordinates } from "@/app/api/admin/photos/coordinates/route.local";
import { POST as setCover } from "@/app/api/admin/photos/cover/route.local";
import { POST as removePhoto } from "@/app/api/admin/photos/remove/route.local";
import { POST as reorder } from "@/app/api/admin/photos/reorder/route.local";
import { readAdminSpecies } from "@/lib/adminSpeciesApi";

import {
  REPTILES_API_TEST_TOKEN,
  reptilesApi,
  resetReptilesApi,
} from "../../../../../../tests/msw/reptilesApi";
import { server } from "../../../../../../tests/msw/server";

const ID = "alectoris-chukar";

function adminRequest(path: string, body: unknown) {
  return new Request(`http://localhost/api/admin/photos/${path}`, {
    body: JSON.stringify({ id: ID, ...(body as object) }),
    headers: { origin: "http://localhost" },
    method: "POST",
  });
}

async function gallery() {
  return (await readAdminSpecies(ID)).record.base.gallery.map(
    (item) => item.src,
  );
}

beforeEach(() => {
  resetReptilesApi();
  server.use(reptilesApi);
  vi.stubEnv("API_WRITE_TOKEN", REPTILES_API_TEST_TOKEN);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("local admin photo routes write through the API", () => {
  it("reorders the gallery", async () => {
    const srcs = (await gallery()).reverse();
    const response = await reorder(adminRequest("reorder", { srcs }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ version: 2 });
    expect(await gallery()).toEqual(srcs);
  });

  it("sets the cover and reports the new images", async () => {
    const [, second] = await gallery();
    const response = await setCover(
      adminRequest("cover", { src: second, target: "both" }),
    );
    expect(await response.json()).toMatchObject({
      image: second,
      mobileImage: second,
      version: 2,
    });
  });

  it("removes a photo", async () => {
    const [first] = await gallery();
    const response = await removePhoto(adminRequest("remove", { src: first }));
    expect(response.status).toBe(200);
    expect(await gallery()).not.toContain(first);
  });

  it("sets coordinates and rejects half of a pair", async () => {
    const [first] = await gallery();
    const response = await setCoordinates(
      adminRequest("coordinates", { lat: "41.7", lng: "44.8", src: first }),
    );
    expect(await response.json()).toMatchObject({
      credit: { lat: 41.7, lng: 44.8 },
    });
    const half = await setCoordinates(
      adminRequest("coordinates", { lat: "41.7", src: first }),
    );
    expect(half.status).toBe(400);
  });

  it("passes API errors through as admin errors", async () => {
    const response = await setCover(
      adminRequest("cover", {
        src: "https://cdn.reptiles.ge/x.jpg",
        target: "both",
      }),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Unknown gallery src: https://cdn.reptiles.ge/x.jpg",
    });
  });

  it("explains a missing API token", async () => {
    vi.stubEnv("API_WRITE_TOKEN", "");
    const response = await reorder(
      adminRequest("reorder", { srcs: ["a", "b"] }),
    );
    expect(await response.json()).toEqual({
      error: "API_WRITE_TOKEN is not set for the local admin",
    });
  });
});
