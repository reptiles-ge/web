import encodeAvif from "@jsquash/avif/encode";
import encodeJpeg from "@jsquash/jpeg/encode";
import resize from "@jsquash/resize";
import encodeWebp from "@jsquash/webp/encode";

import {
  PHOTO_ENCODING,
  PHOTO_MAX_INPUT_PIXELS,
  PHOTO_MAX_UPLOAD_BYTES,
} from "@/lib/photoDerivatives";

import type { PhotoCodecs } from "./photoEncoding";

const AVIF_MAX_EFFORT = 9;

const AVIF_YUV444 = 3;

export const photoCodecs: PhotoCodecs = {
  avif: (image) =>
    encodeAvif(image, {
      quality: PHOTO_ENCODING.avifQuality,
      speed: AVIF_MAX_EFFORT - PHOTO_ENCODING.avifEffort,
      subsample: AVIF_YUV444,
    }),
  jpeg: (image) =>
    encodeJpeg(image, { quality: PHOTO_ENCODING.originalJpegQuality }),
  png: async (image) => {
    const canvas = new OffscreenCanvas(image.width, image.height);
    canvas.getContext("2d")!.putImageData(image, 0, 0);
    return (await canvas.convertToBlob({ type: "image/png" })).arrayBuffer();
  },
  resize: (image, width, height) =>
    resize(image, {
      fitMethod: "stretch",
      height,
      linearRGB: false,
      method: "lanczos3",
      premultiply: true,
      width,
    }),
  webp: (image) =>
    encodeWebp(image, {
      method: PHOTO_ENCODING.webpEffort,
      quality: PHOTO_ENCODING.webpQuality,
      use_sharp_yuv: 1,
    }),
};

export async function decodePhoto(file: File): Promise<ImageData> {
  if (file.size > PHOTO_MAX_UPLOAD_BYTES) {
    throw new Error(`${file.name} is larger than 12 MB.`);
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(
      `This browser cannot read ${file.name}. Use a JPEG, PNG, WebP or AVIF photo.`,
    );
  }
  if (bitmap.width * bitmap.height > PHOTO_MAX_INPUT_PIXELS) {
    bitmap.close();
    throw new Error(`${file.name} has too many pixels.`);
  }
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  return context.getImageData(0, 0, canvas.width, canvas.height);
}
