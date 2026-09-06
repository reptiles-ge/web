export const AUTHOR_PORTRAIT_SIZES =
  "(max-width: 639px) 112px, (max-width: 1023px) 144px, 160px";

export const GALLERY_LIGHTBOX_SIZES = "(max-width: 1196px) 92vw, 1100px";

export const RELATED_CARD_SIZES =
  "(max-width: 639px) calc(100vw - 3rem), (max-width: 1023px) calc((100vw - 3rem - 1.25rem) / 2), calc((min(1400px, 100vw - 5rem) - 2.5rem) / 3)";

export const LOOKALIKE_SIZES =
  "(max-width: 639px) calc((100vw - 3rem - 2rem - 0.75rem) / 2), 280px";

export function galleryFeaturedSizes() {
  return "(max-width: 1023px) calc(100vw - 3rem), (max-width: 1479px) min(1400px, calc(100vw - 5rem)), 1400px";
}

export function galleryThumbSizes(count: number) {
  if (count <= 1) return galleryFeaturedSizes();
  if (count === 2) {
    return "(max-width: 639px) calc(100vw - 3rem), (max-width: 1023px) calc((100vw - 3rem - 1rem) / 2), (max-width: 1479px) calc((min(1400px, 100vw - 5rem) - 1rem) / 2), 692px";
  }
  return "(max-width: 639px) calc((100vw - 3rem - 0.75rem) / 2), (max-width: 767px) calc((100vw - 3rem - 1rem) / 2), (max-width: 1023px) calc((100vw - 3rem - 2rem) / 3), (max-width: 1479px) calc((min(1400px, 100vw - 5rem) - 2rem) / 3), 456px";
}
