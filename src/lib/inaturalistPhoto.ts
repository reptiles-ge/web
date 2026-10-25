import { normalizePhotoCoordinates } from "@/lib/photoCoordinates";

const MAX_PHOTO_BYTES = 12 * 1024 * 1024;
const PHOTO_HOSTS = new Set([
  "inaturalist-open-data.s3.amazonaws.com",
  "static.inaturalist.org",
]);
const PHOTO_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const COUNTRY_ONLY_PLACES = new Set([
  "ge",
  "georgia",
  "gürcistan",
  "грузия",
  "საქართველო",
]);
const GEORGIA_PLACE_ID = 8857;

export type INaturalistDownloadResult =
  | { file: Blob; ok: true; type: string }
  | {
      ok: false;
      reason: Extract<
        INaturalistPhotoFailure,
        | "download_failed"
        | "invalid_url"
        | "too_large"
        | "unreachable"
        | "unsupported_format"
      >;
    };

export type INaturalistLookupResult =
  | {
      fileStem: string;
      metadata: INaturalistPhotoMetadata;
      ok: true;
      photoUrl: string;
    }
  | {
      ok: false;
      reason: Extract<
        INaturalistPhotoFailure,
        | "invalid_url"
        | "no_photo"
        | "no_photographer"
        | "not_found"
        | "rate_limited"
        | "unreachable"
      >;
    };

export type INaturalistPhotoFailure =
  | "download_failed"
  | "invalid_url"
  | "no_photo"
  | "no_photographer"
  | "not_found"
  | "rate_limited"
  | "too_large"
  | "unreachable"
  | "unsupported_format";

export type INaturalistPhotoMetadata = {
  date: string;
  georgiaField: boolean;
  lat: number | string;
  license: string;
  lng: number | string;
  location: string;
  photographer: string;
  url: string;
};

export type INaturalistPhotoResult =
  | { file: File; metadata: INaturalistPhotoMetadata; ok: true }
  | { ok: false; reason: INaturalistPhotoFailure };

type INaturalistObservation = {
  captive?: boolean;
  geojson?: { coordinates?: number[] };
  id: number;
  obscured?: boolean;
  observed_on?: null | string;
  photos?: INaturalistPhoto[];
  place_guess?: null | string;
  place_ids?: number[];
  user?: { login?: null | string };
};

type INaturalistPhoto = {
  id: number;
  license_code?: null | string;
  url?: null | string;
};

export async function downloadINaturalistPhoto(
  photoUrl: string,
): Promise<INaturalistDownloadResult> {
  if (!isINaturalistPhotoUrl(photoUrl)) {
    return { ok: false, reason: "invalid_url" };
  }
  try {
    const response = await fetch(photoUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) return { ok: false, reason: "download_failed" };
    const type = response.headers.get("content-type")?.split(";")[0];
    if (!type || !PHOTO_TYPES.has(type)) {
      return { ok: false, reason: "unsupported_format" };
    }
    const file = await readPhotoBytes(response);
    if (!file) return { ok: false, reason: "too_large" };
    return { file, ok: true, type };
  } catch {
    return { ok: false, reason: "unreachable" };
  }
}

export async function fetchINaturalistPhoto(
  observationUrl: string,
): Promise<INaturalistPhotoResult> {
  const lookup = await lookUpINaturalistObservation(observationUrl);
  if (!lookup.ok) return lookup;
  const download = await downloadINaturalistPhoto(lookup.photoUrl);
  if (!download.ok) return download;
  return {
    file: iNaturalistPhotoFile(lookup.fileStem, download.file, download.type),
    metadata: lookup.metadata,
    ok: true,
  };
}

export function iNaturalistPhotoFile(stem: string, file: Blob, type: string) {
  return new File([file], `${stem}.${PHOTO_TYPES.get(type) ?? "jpg"}`, {
    type,
  });
}

export function iNaturalistPhotoFormData(
  result: Extract<INaturalistPhotoResult, { ok: true }>,
) {
  const form = new FormData();
  form.set("photo", result.file);
  form.set("metadata", JSON.stringify(result.metadata));
  return form;
}

export function isINaturalistPhotoUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      PHOTO_HOSTS.has(url.hostname) &&
      !url.port &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      /^\/photos\/[1-9]\d*\/original\.(jpe?g|png|webp)$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}

export async function lookUpINaturalistObservation(
  observationUrl: string,
): Promise<INaturalistLookupResult> {
  const observationId = observationIdFromUrl(observationUrl);
  if (!observationId) return { ok: false, reason: "invalid_url" };
  let observation: INaturalistObservation | undefined;
  try {
    const response = await fetch(
      `https://api.inaturalist.org/v1/observations/${observationId}`,
      {
        cache: "no-store",
        redirect: "manual",
        signal: AbortSignal.timeout(15_000),
      },
    );
    if (response.status === 429) return { ok: false, reason: "rate_limited" };
    if (response.status === 404) return { ok: false, reason: "not_found" };
    if (!response.ok) return { ok: false, reason: "unreachable" };
    const payload = (await response.json()) as {
      results?: INaturalistObservation[];
    };
    observation = payload.results?.find((item) => item.id === observationId);
  } catch {
    return { ok: false, reason: "unreachable" };
  }
  if (!observation) return { ok: false, reason: "not_found" };

  const photo = observation.photos?.[0];
  const photoUrl = photo && originalPhotoUrl(photo);
  if (!photo || !photoUrl) return { ok: false, reason: "no_photo" };
  const photographer = observation.user?.login?.trim();
  if (!photographer) return { ok: false, reason: "no_photographer" };

  const coordinates = observation.obscured
    ? undefined
    : normalizePhotoCoordinates(
        observation.geojson?.coordinates?.[1],
        observation.geojson?.coordinates?.[0],
      );
  const location = observation.place_guess?.split(",")[0]?.trim() ?? "";
  return {
    fileStem: `inaturalist-${observationId}-${photo.id}`,
    metadata: {
      date: /^\d{4}-\d{2}-\d{2}$/.test(observation.observed_on ?? "")
        ? (observation.observed_on as string)
        : "",
      georgiaField: Boolean(
        observation.place_ids?.includes(GEORGIA_PLACE_ID) &&
        !observation.captive &&
        coordinates &&
        location &&
        !COUNTRY_ONLY_PLACES.has(location.toLowerCase()),
      ),
      lat: coordinates?.lat ?? "",
      license: photo.license_code ?? "all rights reserved",
      lng: coordinates?.lng ?? "",
      location,
      photographer,
      url: `https://www.inaturalist.org/photos/${photo.id}`,
    },
    ok: true,
    photoUrl,
  };
}

export function observationIdFromUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (
      url.protocol !== "https:" ||
      !["inaturalist.org", "www.inaturalist.org"].includes(url.hostname) ||
      url.port ||
      url.username ||
      url.password
    ) {
      return null;
    }
    const match = /^\/observations\/([1-9]\d*)\/?$/.exec(url.pathname);
    const id = match ? Number(match[1]) : null;
    return id && Number.isSafeInteger(id) ? id : null;
  } catch {
    return null;
  }
}

function originalPhotoUrl(photo: INaturalistPhoto) {
  if (!photo.url || !Number.isSafeInteger(photo.id)) return null;
  try {
    const url = new URL(photo.url);
    const match = new RegExp(
      `^/photos/${photo.id}/square\\.(jpe?g|png|webp)$`,
    ).exec(url.pathname);
    if (!match) return null;
    url.pathname = `/photos/${photo.id}/original.${match[1]}`;
    url.search = "";
    return isINaturalistPhotoUrl(url.toString()) ? url.toString() : null;
  } catch {
    return null;
  }
}

async function readPhotoBytes(response: Response) {
  const length = Number(response.headers.get("content-length"));
  if (Number.isFinite(length) && length > MAX_PHOTO_BYTES) return null;
  const reader = response.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_PHOTO_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  if (total === 0) return null;
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new Blob([bytes]);
}
