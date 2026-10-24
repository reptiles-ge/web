import {
  PHOTO_FORMATS,
  photoDerivativeHeight,
  photoDerivativeWidths,
  type PhotoFormat,
} from "@/lib/photoDerivatives";

export type EncodedPhoto = {
  derivatives: File[];
  height: number;
  original: File;
  width: number;
};

export type PhotoCodecs = Record<
  "jpeg" | "png" | PhotoFormat,
  (image: ImageData) => Promise<ArrayBuffer>
> & {
  resize: (
    image: ImageData,
    width: number,
    height: number,
  ) => Promise<ImageData>;
};

const MIME_TYPES = {
  avif: "image/avif",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;

export async function encodePhoto(
  image: ImageData,
  codecs: PhotoCodecs,
): Promise<EncodedPhoto> {
  const transparent = hasTransparency(image);
  const original = transparent
    ? new File([await codecs.png(image)], "original.png", {
        type: MIME_TYPES.png,
      })
    : new File([await codecs.jpeg(image)], "original.jpg", {
        type: MIME_TYPES.jpeg,
      });
  const derivatives: File[] = [];
  for (const width of photoDerivativeWidths(image.width)) {
    const resized =
      width === image.width
        ? image
        : await codecs.resize(
            image,
            width,
            photoDerivativeHeight(image, width),
          );
    for (const format of PHOTO_FORMATS) {
      derivatives.push(
        new File([await codecs[format](resized)], `${width}.${format}`, {
          type: MIME_TYPES[format],
        }),
      );
    }
  }
  return { derivatives, height: image.height, original, width: image.width };
}

export function hasTransparency(image: ImageData) {
  for (let index = 3; index < image.data.length; index += 4) {
    if (image.data[index] !== 255) return true;
  }
  return false;
}
