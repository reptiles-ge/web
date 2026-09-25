import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import { normalizePhotoCoordinates } from "@/lib/photoCoordinates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PHOTO_BYTES = 12 * 1024 * 1024;
const PHOTO_HOSTS = new Set([
  "inaturalist-open-data.s3.amazonaws.com",
  "static.inaturalist.org",
]);

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

export async function POST(request: Request) {
  if (!isLocalAdminEnabled()) return localAdminForbiddenResponse();

  let url: string;
  try {
    const body = (await request.json()) as { url?: unknown };
    url = typeof body.url === "string" ? body.url.trim() : "";
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const observationId = observationIdFromUrl(url);
  if (!observationId) {
    return Response.json(
      { error: "iNaturalist-ის დაკვირვების სწორი URL მიუთითე" },
      { status: 400 },
    );
  }

  try {
    const observationResponse = await fetch(
      `https://api.inaturalist.org/v1/observations/${observationId}`,
      {
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(15_000),
      },
    );
    if (!observationResponse.ok) {
      return Response.json(
        { error: "iNaturalist-ის დაკვირვება ვერ მოიძებნა" },
        { status: 502 },
      );
    }
    const payload = (await observationResponse.json()) as {
      results?: INaturalistObservation[];
    };
    const observation = payload.results?.find(
      (item) => item.id === observationId,
    );
    if (!observation) {
      return Response.json(
        { error: "iNaturalist-ის დაკვირვება ვერ მოიძებნა" },
        { status: 404 },
      );
    }

    const photo = observation.photos?.[0];
    const photoUrl = photo && originalPhotoUrl(photo);
    if (!photoUrl || !photo) {
      return Response.json(
        { error: "დაკვირვებას გამოსაყენებელი ფოტო არ აქვს" },
        { status: 422 },
      );
    }
    const photographer = observation.user?.login?.trim();
    if (!photographer) {
      return Response.json(
        { error: "დაკვირვებას ფოტოგრაფის username არ აქვს" },
        { status: 422 },
      );
    }

    const photoResponse = await fetch(photoUrl, {
      redirect: "error",
      signal: AbortSignal.timeout(20_000),
    });
    if (!photoResponse.ok) {
      return Response.json(
        { error: "iNaturalist-ის ფოტო ვერ ჩამოიტვირთა" },
        { status: 502 },
      );
    }
    const contentType = photoResponse.headers
      .get("content-type")
      ?.split(";")[0];
    if (
      !contentType ||
      !["image/jpeg", "image/png", "image/webp"].includes(contentType)
    ) {
      return Response.json(
        { error: "ფოტოს ფორმატი არ არის მხარდაჭერილი" },
        { status: 422 },
      );
    }
    const bytes = await readPhotoBytes(photoResponse);
    if (!bytes) {
      return Response.json(
        { error: "ფოტო 12 MB-ზე დიდია ან ცარიელია" },
        { status: 422 },
      );
    }

    const coordinates = observation.obscured
      ? undefined
      : normalizePhotoCoordinates(
          observation.geojson?.coordinates?.[1],
          observation.geojson?.coordinates?.[0],
        );
    const location = observation.place_guess?.split(",")[0]?.trim() ?? "";
    const georgiaField = Boolean(
      observation.place_ids?.includes(8857) &&
      !observation.captive &&
      coordinates &&
      location &&
      !["ge", "georgia", "gürcistan", "грузия", "საქართველო"].includes(
        location.toLowerCase(),
      ),
    );
    const result = new FormData();
    result.set(
      "photo",
      new File(
        [bytes],
        `inaturalist-${observationId}-${photo.id}.${contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg"}`,
        { type: contentType },
      ),
    );
    result.set(
      "metadata",
      JSON.stringify({
        date: /^\d{4}-\d{2}-\d{2}$/.test(observation.observed_on ?? "")
          ? observation.observed_on
          : "",
        georgiaField,
        lat: coordinates?.lat ?? "",
        license: photo.license_code ?? "all rights reserved",
        lng: coordinates?.lng ?? "",
        location,
        photographer,
        url: `https://www.inaturalist.org/photos/${photo.id}`,
      }),
    );
    return new Response(result, {
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  } catch {
    return Response.json(
      { error: "iNaturalist-თან დაკავშირება ვერ მოხერხდა" },
      { status: 502 },
    );
  }
}

function observationIdFromUrl(value: string) {
  try {
    const url = new URL(value);
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
