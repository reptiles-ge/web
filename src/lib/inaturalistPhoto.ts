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

export type INaturalistPhotoFailure =
  | "download_failed"
  | "invalid_url"
  | "no_photo"
  | "no_photographer"
  | "not_found"
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

export async function fetchINaturalistPhoto(
  observationUrl: string,
): Promise<INaturalistPhotoResult> {
  const observationId = observationIdFromUrl(observationUrl);
  if (!observationId) return { ok: false, reason: "invalid_url" };
  try {
    const observationResponse = await fetch(
      `https://api.inaturalist.org/v1/observations/${observationId}`,
      {
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(15_000),
      },
    );
    if (!observationResponse.ok) return { ok: false, reason: "not_found" };
    const payload = (await observationResponse.json()) as {
      results?: INaturalistObservation[];
    };
    const observation = payload.results?.find(
      (item) => item.id === observationId,
    );
    if (!observation) return { ok: false, reason: "not_found" };

    const photo = observation.photos?.[0];
    const photoUrl = photo && originalPhotoUrl(photo);
    if (!photo || !photoUrl) return { ok: false, reason: "no_photo" };
    const photographer = observation.user?.login?.trim();
    if (!photographer) return { ok: false, reason: "no_photographer" };

    const photoResponse = await fetch(photoUrl, {
      redirect: "error",
      signal: AbortSignal.timeout(20_000),
    });
    if (!photoResponse.ok) return { ok: false, reason: "download_failed" };
    const contentType = photoResponse.headers
      .get("content-type")
      ?.split(";")[0];
    const extension = contentType && PHOTO_TYPES.get(contentType);
    if (!contentType || !extension) {
      return { ok: false, reason: "unsupported_format" };
    }
    const bytes = await readPhotoBytes(photoResponse);
    if (!bytes) return { ok: false, reason: "too_large" };

    const coordinates = observation.obscured
      ? undefined
      : normalizePhotoCoordinates(
          observation.geojson?.coordinates?.[1],
          observation.geojson?.coordinates?.[0],
        );
    const location = observation.place_guess?.split(",")[0]?.trim() ?? "";
    return {
      file: new File(
        [bytes],
        `inaturalist-${observationId}-${photo.id}.${extension}`,
        { type: contentType },
      ),
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
    };
  } catch {
    return { ok: false, reason: "unreachable" };
  }
}

export function iNaturalistPhotoFormData(
  result: Extract<INaturalistPhotoResult, { ok: true }>,
) {
  const form = new FormData();
  form.set("photo", result.file);
  form.set("metadata", JSON.stringify(result.metadata));
  return form;
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
    if (
      url.protocol !== "https:" ||
      !PHOTO_HOSTS.has(url.hostname) ||
      url.port ||
      url.username ||
      url.password ||
      !match
    ) {
      return null;
    }
    url.pathname = `/photos/${photo.id}/original.${match[1]}`;
    return url.toString();
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
