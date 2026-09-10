import type { PhotoCredit } from "@/data/speciesTypes";

export type PhotoCoordinates = {
  lat: number;
  lng: number;
};

const COORD_DECIMALS = 5;

export function hasPhotoCoordinates(
  credit?: PhotoCredit,
): credit is PhotoCoordinates & PhotoCredit {
  return (
    typeof credit?.lat === "number" &&
    typeof credit?.lng === "number" &&
    Number.isFinite(credit.lat) &&
    Number.isFinite(credit.lng)
  );
}

export function normalizePhotoCoordinates(
  latRaw: unknown,
  lngRaw: unknown,
): PhotoCoordinates | undefined {
  const lat = parseCoordinate(latRaw, -90, 90);
  const lng = parseCoordinate(lngRaw, -180, 180);
  if (lat === undefined && lng === undefined) return undefined;
  if (lat === undefined || lng === undefined) return undefined;
  return {
    lat: roundCoordinate(lat),
    lng: roundCoordinate(lng),
  };
}

export function parsePhotoCoordinatesInput(
  latRaw: string,
  lngRaw: string,
): PhotoCoordinates | undefined {
  const latText = latRaw.trim();
  const lngText = lngRaw.trim();
  if (!latText && !lngText) return undefined;
  if (!latText || !lngText) {
    throw new Error("კოორდინატები ორივე უნდა იყოს — განედი და გრძედი");
  }
  const coords = normalizePhotoCoordinates(latText, lngText);
  if (!coords) {
    throw new Error("კოორდინატები არასწორია (განედი −90…90, გრძედი −180…180)");
  }
  return coords;
}

export function photoMapUrl(coords: PhotoCoordinates): string {
  const { lat, lng } = coords;
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function parseCoordinate(
  value: unknown,
  min: number,
  max: number,
): number | undefined {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < min || value > max) return undefined;
    return value;
  }
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().replace(",", ".");
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return undefined;
  return parsed;
}

function roundCoordinate(value: number): number {
  const factor = 10 ** COORD_DECIMALS;
  return Math.round(value * factor) / factor;
}
