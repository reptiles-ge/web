import { describe, expect, it } from "vitest";

import { testImage } from "../testing/images";
import { probeImage } from "./imageProbe";

describe("probeImage", () => {
  it.each(["avif", "jpeg", "png", "webp"] as const)(
    "reads the format and size of a %s file",
    async (format) => {
      expect(probeImage(await testImage(format, 321, 123))).toStrictEqual({
        format,
        height: 123,
        width: 321,
      });
    },
  );

  it("reads a lossless and an extended WebP", async () => {
    expect(
      probeImage(await testImage("webp", 64, 48, { lossless: true })),
    ).toStrictEqual({ format: "webp", height: 48, width: 64 });
    const extended = new Uint8Array(30);
    extended.set(new TextEncoder().encode("RIFF\0\0\0\0WEBPVP8X"));
    extended.set([0x3f, 0x02, 0x00, 0x1f, 0x01, 0x00], 24);
    expect(probeImage(extended)).toStrictEqual({
      format: "webp",
      height: 288,
      width: 576,
    });
  });

  it("rejects bytes that are not a known image", () => {
    expect(
      probeImage(new TextEncoder().encode("not an image at all")),
    ).toBeNull();
    expect(probeImage(new Uint8Array([0xff, 0xd8, 0x00, 0x00]))).toBeNull();
    expect(probeImage(new Uint8Array(0))).toBeNull();
  });

  it("rejects an ISO media file that is not AVIF", () => {
    const heic = new Uint8Array(40);
    heic.set([0, 0, 0, 16]);
    heic.set(new TextEncoder().encode("ftypheic\0\0\0\0"), 4);
    expect(probeImage(heic)).toBeNull();
  });
});
