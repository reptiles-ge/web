import type { CreditAuthor } from "@/data/creditAuthors";
import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { PhotoCredit } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import {
  creditAuthorHref,
  creditAuthorIndexHref,
  getPublishedCreditAuthorBySlug,
  getPublishedCreditAuthors,
} from "@/data/creditAuthors";
import { optimizedEntry, optimizedImgSrc } from "@/data/optimizedImages";
import { getCatalogSpecies } from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { isCoverCrop } from "@/lib/coverCrop";
import { ANIMAL_GROUP_TO_HUB, type GroupHubId } from "@/lib/groupHubs";
import { absoluteUrl, localeAlternates } from "@/lib/site";
import { isPlaceholderMedia } from "@/lib/speciesContent";

export type CreditAuthorPhoto = {
  credit?: PhotoCredit;
  speciesId: string;
  src: string;
  updatedAt: string;
};

const GROUP_RANK: Record<AnimalGroup, number> = {
  amphibian: 2,
  bird: 4,
  insect: 7,
  lizard: 1,
  mammal: 5,
  scorpion: 7,
  snake: 0,
  spider: 6,
  turtle: 3,
};

export const HOME_CONTRIBUTOR_LIMIT = 2;
const HOME_CONTRIBUTOR_PREVIEW_COUNT = 4;

export type CreditAuthorCard = {
  author: CreditAuthor;
  photoCount: number;
  preview: CreditAuthorPhoto[];
  speciesCount: number;
};

export type CreditAuthorGroupStat = {
  hub: GroupHubId;
  photos: number;
  species: Array<{ id: string; photos: number }>;
};

export function creditAuthorAlternates(locale: AppLocale, slug: string) {
  return localeAlternates(locale, {
    params: { slug },
    pathname: "/authors/[slug]",
  });
}

export function creditAuthorIndexAlternates(locale: AppLocale) {
  return localeAlternates(locale, creditAuthorIndexHref());
}

export function creditAuthorIndexUrl(locale: AppLocale) {
  return absoluteUrl(
    getPathname({
      href: creditAuthorIndexHref(),
      locale,
    }),
  );
}

export function creditAuthorPortraitImage(author: CreditAuthor) {
  const entry = optimizedEntry(author.portraitSrc);
  if (!entry?.formats.includes("webp")) {
    return {
      type: author.portraitSrc.endsWith(".webp") ? "image/webp" : "image/jpeg",
      url: author.portraitSrc,
    };
  }
  return { type: "image/webp", url: optimizedImgSrc(author.portraitSrc) };
}

export function creditAuthorStaticParams() {
  const params: Array<{ locale: AppLocale; slug: string }> = [];
  for (const author of getPublishedCreditAuthors()) {
    for (const locale of routing.locales) {
      params.push({ locale, slug: author.slug });
    }
  }
  return params;
}

export function creditAuthorUrl(locale: AppLocale, slug: string) {
  return absoluteUrl(
    getPathname({
      href: creditAuthorHref(slug),
      locale,
    }),
  );
}

export function getCreditAuthorCards(): CreditAuthorCard[] {
  const cards = [];
  for (const author of getPublishedCreditAuthors()) {
    const photos = getCreditAuthorPhotos(author);
    cards.push({
      author,
      photoCount: photos.length,
      preview: pickCreditAuthorPreviewPhotos(photos),
      speciesCount: getCreditAuthorSpeciesIds(photos).length,
    });
  }
  return cards.sort((a, b) => {
    if (b.photoCount !== a.photoCount) return b.photoCount - a.photoCount;
    return a.author.slug.localeCompare(b.author.slug);
  });
}

export function getCreditAuthorFieldSummary(photos: CreditAuthorPhoto[]) {
  const places = new Map<string, number>();
  const years: number[] = [];
  for (const photo of photos) {
    const place = photo.credit?.location?.trim();
    if (place) places.set(place, (places.get(place) ?? 0) + 1);
    const year = Number(photo.credit?.date?.match(/^\d{4}/)?.[0]);
    if (year) years.push(year);
  }
  const [topPlace] = [...places.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );
  return {
    place: topPlace ? { count: topPlace[1], name: topPlace[0] } : undefined,
    years:
      years.length > 0
        ? { from: Math.min(...years), to: Math.max(...years) }
        : undefined,
  };
}

export function getCreditAuthorGroupStats(
  photos: CreditAuthorPhoto[],
): CreditAuthorGroupStat[] {
  const byHub = new Map<GroupHubId, CreditAuthorGroupStat>();
  for (const photo of photos) {
    const hub = ANIMAL_GROUP_TO_HUB[getSpeciesAtlasMeta(photo.speciesId).group];
    const stat = byHub.get(hub) ?? { hub, photos: 0, species: [] };
    stat.photos += 1;
    const species = stat.species.find((item) => item.id === photo.speciesId);
    if (species) species.photos += 1;
    else stat.species.push({ id: photo.speciesId, photos: 1 });
    byHub.set(hub, stat);
  }
  return [...byHub.values()].sort(
    (a, b) =>
      b.photos - a.photos ||
      GROUP_RANK[HUB_GROUP[a.hub]] - GROUP_RANK[HUB_GROUP[b.hub]],
  );
}

export function getCreditAuthorHubIds(speciesIds: string[]): GroupHubId[] {
  const hubs: GroupHubId[] = [];
  const seen = new Set<GroupHubId>();
  const ranked = [...speciesIds].sort((a, b) => {
    return (
      GROUP_RANK[getSpeciesAtlasMeta(a).group] -
      GROUP_RANK[getSpeciesAtlasMeta(b).group]
    );
  });
  for (const id of ranked) {
    const hub = ANIMAL_GROUP_TO_HUB[getSpeciesAtlasMeta(id).group];
    if (seen.has(hub)) continue;
    seen.add(hub);
    hubs.push(hub);
  }
  return hubs;
}

export function getCreditAuthorPhotos(
  author: CreditAuthor,
): CreditAuthorPhoto[] {
  const aliases = new Set(author.aliases);
  const bySrc = new Map<string, CreditAuthorPhoto>();

  for (const species of getCatalogSpecies()) {
    addPhoto(
      bySrc,
      aliases,
      species.id,
      species.updatedAt,
      species.image,
      species.imageCredit,
    );
    addPhoto(
      bySrc,
      aliases,
      species.id,
      species.updatedAt,
      species.mobileImage,
      species.mobileImageCredit,
    );
    for (const item of species.gallery) {
      addPhoto(
        bySrc,
        aliases,
        species.id,
        species.updatedAt,
        item.src,
        item.credit,
      );
    }
  }

  return [...bySrc.values()].sort(compareAuthorPhotos);
}

export function getCreditAuthorSpeciesIds(photos: CreditAuthorPhoto[]) {
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const photo of photos) {
    if (seen.has(photo.speciesId)) continue;
    seen.add(photo.speciesId);
    ids.push(photo.speciesId);
  }
  return ids;
}

export function resolvePublishedCreditAuthor(slug: string) {
  return getPublishedCreditAuthorBySlug(slug);
}

function addPhoto(
  bySrc: Map<string, CreditAuthorPhoto>,
  aliases: Set<string>,
  speciesId: string,
  updatedAt: string,
  src: string | undefined,
  credit: PhotoCredit | undefined,
) {
  if (!src || bySrc.has(src) || isCoverCrop(src)) return;
  const name = credit?.photographer?.trim();
  if (!name || !aliases.has(name)) return;
  bySrc.set(src, { credit, speciesId, src, updatedAt });
}

function compareAuthorPhotos(a: CreditAuthorPhoto, b: CreditAuthorPhoto) {
  const groupA = GROUP_RANK[getSpeciesAtlasMeta(a.speciesId).group];
  const groupB = GROUP_RANK[getSpeciesAtlasMeta(b.speciesId).group];
  if (groupA !== groupB) return groupA - groupB;
  if (a.speciesId !== b.speciesId)
    return a.speciesId.localeCompare(b.speciesId);
  return a.src.localeCompare(b.src);
}

function pickCreditAuthorPreviewPhotos(
  photos: CreditAuthorPhoto[],
  limit = HOME_CONTRIBUTOR_PREVIEW_COUNT,
) {
  const unique: CreditAuthorPhoto[] = [];
  const rest: CreditAuthorPhoto[] = [];
  const seen = new Set<string>();
  for (const photo of photos) {
    if (!photo.src || isPlaceholderMedia(photo.src)) continue;
    if (seen.has(photo.speciesId)) {
      rest.push(photo);
      continue;
    }
    seen.add(photo.speciesId);
    unique.push(photo);
    if (unique.length >= limit) return unique;
  }
  return [...unique, ...rest].slice(0, limit);
}

const HUB_GROUP = Object.fromEntries(
  Object.entries(ANIMAL_GROUP_TO_HUB).map(([group, hub]) => [hub, group]),
) as Record<GroupHubId, AnimalGroup>;
