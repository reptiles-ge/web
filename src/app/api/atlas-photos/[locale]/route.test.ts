import { describe, expect, it } from "vitest";

import { ATLAS_PHOTO_PAGE_SIZE } from "@/lib/atlasList";

import { GET } from "./route";

type Page = {
  entries: Record<string, { path: string }>;
  nextCursor: null | string;
  photos: Record<string, { image: string; mobileImage?: string }>;
};

function get(locale: string, cursor?: string) {
  const url = new URL(`https://reptiles.ge/api/atlas-photos/${locale}`);
  if (cursor !== undefined) url.searchParams.set("cursor", cursor);
  return GET(new Request(url), { params: Promise.resolve({ locale }) });
}

describe("GET /api/atlas-photos/[locale]", () => {
  it("answers the first page with photos, their image entries and a cursor", async () => {
    const response = await get("ka");
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=300, s-maxage=3600",
    );
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    const page = (await response.json()) as Page;
    const photos = Object.values(page.photos);
    expect(photos.length).toBeGreaterThan(0);
    expect(photos.length).toBeLessThanOrEqual(ATLAS_PHOTO_PAGE_SIZE);
    expect(page.nextCursor).toEqual(expect.any(String));
    for (const src of Object.keys(page.entries)) {
      expect(
        photos.some(
          (photo) => photo.image === src || photo.mobileImage === src,
        ),
      ).toBe(true);
    }
  });

  it("continues from a cursor without repeating species", async () => {
    const first = (await (await get("en")).json()) as Page;
    const second = (await (
      await get("en", first.nextCursor ?? undefined)
    ).json()) as Page;
    for (const id of Object.keys(second.photos)) {
      expect(first.photos).not.toHaveProperty(id);
    }
  });

  it("rejects an unknown locale, a malformed cursor and an unknown cursor", async () => {
    expect((await get("fr")).status).toBe(404);
    expect((await get("en", "Not A Cursor")).status).toBe(400);
    expect((await get("en", "no-such-species")).status).toBe(400);
  });
});
