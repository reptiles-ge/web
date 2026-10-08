import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { speciesOpengraphResponse } from "@/lib/speciesOpengraph";

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);

function okResponse() {
  return { arrayBuffer: async () => JPEG.buffer, ok: true };
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("speciesOpengraphResponse", () => {
  it("serves the CDN image as an immutable JPEG", async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse() as never);
    const response = await speciesOpengraphResponse("macrovipera-lebetina");
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    expect(response.headers.get("Cache-Control")).toContain("immutable");
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(JPEG);
  });

  it("resolves a public Georgian slug to the species id", async () => {
    vi.mocked(fetch).mockResolvedValue(okResponse() as never);
    await speciesOpengraphResponse("giurza");
    const url = String(vi.mocked(fetch).mock.calls[0][0]);
    expect(url).toContain("cdn.reptiles.ge");
  });

  it("falls back to the site image when the species image is missing", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: false } as never)
      .mockResolvedValueOnce(okResponse() as never);
    const response = await speciesOpengraphResponse("macrovipera-lebetina");
    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(String(vi.mocked(fetch).mock.calls[1][0])).toContain("/og/");
  });

  it("throws when nothing can be loaded", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false } as never);
    await expect(
      speciesOpengraphResponse("definitely-not-a-species"),
    ).rejects.toThrow("Failed to load OG image for definitely-not-a-species");
  });
});
