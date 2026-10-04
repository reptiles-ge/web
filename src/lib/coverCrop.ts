export type CoverCropRect = {
  height: number;
  width: number;
  x: number;
  y: number;
};

const SCALE = 1000;
const MIN_SIDE = 100;
const EXTENSION = /\.[a-z0-9]+$/i;
const CROP_SUFFIX = /-crop-(\d{1,4})-(\d{1,4})-(\d{1,4})-(\d{1,4})$/;

export function coverCropSuffix(rect: CoverCropRect) {
  const units = toUnits(rect);
  if (!units) throw new Error("Invalid crop");
  return `-crop-${units.x}-${units.y}-${units.width}-${units.height}`;
}

export function isCoverCrop(src: null | string | undefined) {
  return Boolean(src && parseCoverCrop(src));
}

export function isFullCoverCrop(rect: CoverCropRect) {
  const units = toUnits(rect);
  return Boolean(units && units.width === SCALE && units.height === SCALE);
}

export function matchesCoverSource(coverSrc: string, originalSrc: string) {
  if (!coverSrc || !originalSrc) return false;
  if (coverSrc === originalSrc) return true;
  const crop = parseCoverCrop(coverSrc);
  return Boolean(crop && crop.stem === stemOf(originalSrc));
}

export function normalizeCoverCropRect(
  rect: CoverCropRect,
): CoverCropRect | null {
  const units = toUnits(rect);
  if (!units) return null;
  return {
    height: units.height / SCALE,
    width: units.width / SCALE,
    x: units.x / SCALE,
    y: units.y / SCALE,
  };
}

export function parseCoverCrop(
  src: string,
): null | { rect: CoverCropRect; stem: string } {
  const stem = stemOf(src);
  const match = CROP_SUFFIX.exec(stem);
  if (!match) return null;
  const [x, y, width, height] = match.slice(1).map(Number);
  const rect = normalizeCoverCropRect({
    height: (height ?? 0) / SCALE,
    width: (width ?? 0) / SCALE,
    x: (x ?? 0) / SCALE,
    y: (y ?? 0) / SCALE,
  });
  if (!rect) return null;
  return { rect, stem: stem.slice(0, match.index) };
}

function stemOf(src: string) {
  return src.replace(EXTENSION, "");
}

function toUnits(rect: CoverCropRect) {
  const values = [rect.x, rect.y, rect.width, rect.height];
  if (!values.every((value) => Number.isFinite(value))) return null;
  const width = Math.min(SCALE, Math.round(rect.width * SCALE));
  const height = Math.min(SCALE, Math.round(rect.height * SCALE));
  if (width < MIN_SIDE || height < MIN_SIDE) return null;
  const x = Math.min(SCALE - width, Math.max(0, Math.round(rect.x * SCALE)));
  const y = Math.min(SCALE - height, Math.max(0, Math.round(rect.y * SCALE)));
  return { height, width, x, y };
}
