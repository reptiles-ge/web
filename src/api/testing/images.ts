import { createRequire } from "node:module";
import path from "node:path";

export type TestImageFormat = "avif" | "jpeg" | "png" | "webp";

type Sharp = (input: {
  create: {
    background: { b: number; g: number; r: number };
    channels: 3;
    height: number;
    width: number;
  };
}) => {
  avif: (options?: object) => { toBuffer: () => Promise<Buffer> };
  jpeg: () => { toBuffer: () => Promise<Buffer> };
  png: () => { toBuffer: () => Promise<Buffer> };
  webp: (options?: object) => { toBuffer: () => Promise<Buffer> };
};

const sharp = createRequire(
  path.join(
    process.cwd(),
    "node_modules/@reptiles-ge/img-compression/package.json",
  ),
)("sharp") as Sharp;

export async function testImage(
  format: TestImageFormat,
  width: number,
  height: number,
  options?: object,
) {
  const image = sharp({
    create: {
      background: { b: 40, g: 120, r: 60 },
      channels: 3,
      height,
      width,
    },
  });
  const buffer = await (
    format === "avif"
      ? image.avif(options)
      : format === "webp"
        ? image.webp(options)
        : format === "png"
          ? image.png()
          : image.jpeg()
  ).toBuffer();
  return Uint8Array.from(buffer);
}
