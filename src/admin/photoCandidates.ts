import {
  GEORGIA_PLACE_ID,
  type INaturalistLookupResult,
  type INaturalistObservation,
  iNaturalistObservationPhoto,
  type INaturalistPhoto,
} from "@/lib/inaturalistPhoto";

export type CandidateLicence = "any" | "cc" | "open";
export type CandidateScope = "elsewhere" | "georgia";

export type PhotoCandidate = {
  faves: number;
  georgia: boolean;
  height?: number;
  key: string;
  licence: string;
  lookup: INaturalistLookup;
  observationUrl: string;
  observedOn: string;
  observer: string;
  observerName: string;
  place: string;
  previewUrl: string;
  small: boolean;
  width?: number;
};

export type PhotoCandidatePage = {
  candidates: PhotoCandidate[];
  total: number;
};

type CandidateObservation = Omit<INaturalistObservation, "photos" | "user"> & {
  faves_count?: number;
  photos?: CandidatePhoto[];
  user?: { login?: null | string; name?: null | string };
};

type CandidatePhoto = INaturalistPhoto & {
  original_dimensions?: null | { height?: number; width?: number };
};

type GalleryCredit = {
  credit?: { date?: string; photographer?: string };
};

type INaturalistLookup = Extract<INaturalistLookupResult, { ok: true }>;

type Taxon = {
  id: number;
  matched_term?: string;
  name?: string;
  rank?: string;
};

const API = "https://api.inaturalist.org/v1";
const LICENCES: Record<CandidateLicence, string | undefined> = {
  any: undefined,
  cc: "cc0,cc-by,cc-by-sa,cc-by-nc,cc-by-nc-sa,cc-by-nd,cc-by-nc-nd",
  open: "cc0,cc-by,cc-by-sa",
};
const MAX_PER_OBSERVER = 2;
const PER_PAGE = 30;
const SMALL_SIDE = 1600;

export const PHOTO_TARGET = 8;

export async function fetchPhotoCandidates({
  licence,
  page,
  scope,
  taxonId,
}: {
  licence: CandidateLicence;
  page: number;
  scope: CandidateScope;
  taxonId: number;
}): Promise<PhotoCandidatePage> {
  const params = new URLSearchParams({
    order: "desc",
    order_by: "votes",
    page: String(page),
    per_page: String(PER_PAGE),
    photos: "true",
    quality_grade: "research",
    taxon_id: String(taxonId),
  });
  params.set(
    scope === "georgia" ? "place_id" : "not_in_place",
    String(GEORGIA_PLACE_ID),
  );
  const licences = LICENCES[licence];
  if (licences) params.set("photo_license", licences);
  const payload = await getJson<{
    results?: CandidateObservation[];
    total_results?: number;
  }>(`${API}/observations?${params}`);
  return {
    candidates: rankCandidates(
      (payload.results ?? []).flatMap((observation) =>
        observationCandidates(observation, licence),
      ),
    ),
    total: payload.total_results ?? 0,
  };
}

export async function findINaturalistTaxon(scientificName: string) {
  const name = scientificName.trim().toLowerCase();
  const params = new URLSearchParams({ per_page: "10", q: scientificName });
  const payload = await getJson<{ results?: Taxon[] }>(`${API}/taxa?${params}`);
  const species = (payload.results ?? []).filter(
    (taxon) => taxon.rank === "species",
  );
  return (
    species.find((taxon) => taxon.name?.toLowerCase() === name) ??
    species.find((taxon) => taxon.matched_term?.toLowerCase() === name) ??
    null
  );
}

export function maybeInGallery(
  candidate: PhotoCandidate,
  gallery: GalleryCredit[],
) {
  const observer = candidate.observer.toLowerCase();
  return gallery.some(
    ({ credit }) =>
      Boolean(candidate.observedOn) &&
      credit?.date === candidate.observedOn &&
      credit.photographer?.trim().toLowerCase() === observer,
  );
}

export function rankCandidates(candidates: PhotoCandidate[]) {
  const sorted = candidates.toSorted(
    (a, b) =>
      Number(b.georgia) - Number(a.georgia) ||
      b.faves - a.faves ||
      Number(a.small) - Number(b.small) ||
      longSide(b) - longSide(a),
  );
  const seen = new Map<string, number>();
  const first: PhotoCandidate[] = [];
  const rest: PhotoCandidate[] = [];
  for (const candidate of sorted) {
    const count = seen.get(candidate.observer) ?? 0;
    seen.set(candidate.observer, count + 1);
    (count < MAX_PER_OBSERVER ? first : rest).push(candidate);
  }
  return [...first, ...rest];
}

async function getJson<T>(url: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new Error("Could not reach iNaturalist");
  }
  if (response.status === 429) {
    throw new Error("iNaturalist is limiting requests. Try again in a minute.");
  }
  if (!response.ok) throw new Error("Could not reach iNaturalist");
  return (await response.json()) as T;
}

function longSide(candidate: PhotoCandidate) {
  return Math.max(candidate.width ?? 0, candidate.height ?? 0);
}

function observationCandidates(
  observation: CandidateObservation,
  licence: CandidateLicence,
): PhotoCandidate[] {
  const allowed = LICENCES[licence]?.split(",");
  return (observation.photos ?? []).flatMap((photo) => {
    if (allowed && !allowed.includes(photo.license_code ?? "")) return [];
    const lookup = iNaturalistObservationPhoto(observation, photo);
    const previewUrl = photo.url?.replace(/\/square\.(\w+)$/, "/medium.$1");
    if (!lookup.ok || !previewUrl || previewUrl === photo.url) return [];
    const width = photo.original_dimensions?.width;
    const height = photo.original_dimensions?.height;
    return [
      {
        faves: observation.faves_count ?? 0,
        georgia: Boolean(observation.place_ids?.includes(GEORGIA_PLACE_ID)),
        height,
        key: `${observation.id}-${photo.id}`,
        licence: lookup.metadata.license,
        lookup,
        observationUrl: `https://www.inaturalist.org/observations/${observation.id}`,
        observedOn: lookup.metadata.date,
        observer: lookup.metadata.photographer,
        observerName: observation.user?.name?.trim() ?? "",
        place: observation.place_guess?.trim() ?? "",
        previewUrl,
        small: Boolean(width && height && Math.max(width, height) < SMALL_SIDE),
        width,
      },
    ];
  });
}
