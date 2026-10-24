import { describe, expect, it, vi } from "vitest";

import {
  encodePhoto,
  hasTransparency,
  type PhotoCodecs,
} from "./photoEncoding";

function codecs(): PhotoCodecs {
  const bytes = (label: string) => async (image: ImageData) =>
    new TextEncoder().encode(`${label}:${image.width}x${image.height}`)
      .buffer as ArrayBuffer;
  return {
    avif: vi.fn(bytes("avif")),
    jpeg: vi.fn(bytes("jpeg")),
    png: vi.fn(bytes("png")),
    resize: vi.fn(async (_image, width, height) => imageData(width, height)),
    webp: vi.fn(bytes("webp")),
  };
}

function imageData(width: number, height: number, alpha = 255) {
  const data = new Uint8ClampedArray(width * height * 4).fill(120);
  for (let index = 3; index < data.length; index += 4) data[index] = alpha;
  return { colorSpace: "srgb", data, height, width } as ImageData;
}

describe("encodePhoto", () => {
  it("encodes a JPEG original and an AVIF and WebP copy at every width", async () => {
    const used = codecs();
    const photo = await encodePhoto(imageData(1000, 750), used);
    expect(photo.original.name).toBe("original.jpg");
    expect(photo.original.type).toBe("image/jpeg");
    expect(await photo.original.text()).toBe("jpeg:1000x750");
    expect(photo.derivatives.map((file) => file.name)).toStrictEqual([
      "320.avif",
      "320.webp",
      "400.avif",
      "400.webp",
      "640.avif",
      "640.webp",
      "800.avif",
      "800.webp",
      "1000.avif",
      "1000.webp",
    ]);
    expect(await photo.derivatives[0]!.text()).toBe("avif:320x240");
    expect(photo.derivatives[1]!.type).toBe("image/webp");
    expect(used.resize).toHaveBeenCalledTimes(4);
    expect(used.png).not.toHaveBeenCalled();
    expect({ height: photo.height, width: photo.width }).toStrictEqual({
      height: 750,
      width: 1000,
    });
  });

  it("keeps a transparent photo as PNG", async () => {
    const photo = await encodePhoto(imageData(300, 200, 0), codecs());
    expect(photo.original.name).toBe("original.png");
    expect(photo.original.type).toBe("image/png");
    expect(photo.derivatives.map((file) => file.name)).toStrictEqual([
      "300.avif",
      "300.webp",
    ]);
  });
});

describe("hasTransparency", () => {
  it("finds any pixel that is not fully opaque", () => {
    expect(hasTransparency(imageData(2, 2))).toBe(false);
    const image = imageData(2, 2);
    image.data[7] = 254;
    expect(hasTransparency(image)).toBe(true);
  });
});
