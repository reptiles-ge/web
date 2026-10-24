import type { PhotoCredit } from "@/data/speciesTypes";

import { parsePhotoCoordinatesInput } from "@/lib/photoCoordinates";

export type PhotoCreditInput = {
  date?: string;
  georgiaField?: boolean;
  lat?: string;
  lng?: string;
  location?: string;
  locationEn?: string;
  photographer?: string;
  photographerEn?: string;
  url?: string;
};

export function creditFromInput(
  input: PhotoCreditInput,
  locale: "en" | "ka",
): PhotoCredit | undefined {
  const photographer =
    locale === "en"
      ? input.photographerEn?.trim() || input.photographer?.trim()
      : input.photographer?.trim();
  const location =
    locale === "en"
      ? input.locationEn?.trim() || input.location?.trim()
      : input.location?.trim();
  const date = input.date?.trim();
  const url = photoCreditUrl(input.url);
  const georgiaField = Boolean(input.georgiaField);
  const coordinates = parsePhotoCoordinatesInput(
    input.lat ?? "",
    input.lng ?? "",
  );
  if (georgiaField && !location) {
    throw new Error("საქართველოს ველის ფოტოს ადგილი სავალდებულოა");
  }
  const credit: PhotoCredit = {
    ...(photographer ? { photographer } : {}),
    ...(url ? { url } : {}),
    ...(location ? { location } : {}),
    ...(date ? { date } : {}),
    ...(coordinates ? { lat: coordinates.lat, lng: coordinates.lng } : {}),
    ...(georgiaField ? { photoConfidence: "georgia-field" } : {}),
  };
  return Object.keys(credit).length > 0 ? credit : undefined;
}

function photoCreditUrl(value: string | undefined): string | undefined {
  const url = value?.trim();
  if (!url) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("ავტორის URL არასწორია");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("ავტორის URL უნდა იყოს http ან https");
  }
  return url;
}
