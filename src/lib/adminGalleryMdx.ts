import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

import {
  type GalleryImage,
  type PhotoCredit,
  type SpeciesFieldRecord,
  unpublishedSpeciesIds,
} from "@/data/species";
import { type AnimalGroup, speciesAtlasMeta } from "@/data/speciesAtlas";
import { type CoverTarget } from "@/lib/adminCover";
import { formatFieldRecordYaml } from "@/lib/fieldRecordYaml";
import {
  type FrontmatterRange,
  topLevelRangeFrom,
} from "@/lib/frontmatterRange";
import { normalizePhotoCoordinates } from "@/lib/photoCoordinates";
import { CDN_BASE } from "@/lib/site";
import { yamlScalar } from "@/lib/yamlScalar";

export type { CoverTarget };

const CONTENT_ROOT = path.join(process.cwd(), "src/content/species");
const SPECIES_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type AdminSpeciesSummary = {
  commonName: string;
  galleryCount: number;
  group: AnimalGroup | null;
  id: string;
  image: string;
  scientificName: string;
  unpublished: boolean;
};

export function isSpeciesContentId(id: string) {
  return SPECIES_ID_RE.test(id);
}

function rewriteMdxIfExists(
  filePath: string,
  transform: (raw: string) => string,
): undefined | { next: string; raw: string } {
  let fd: number;
  try {
    fd = fs.openSync(filePath, fs.constants.O_RDWR | fs.constants.O_NOFOLLOW);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }
  try {
    if (!fs.fstatSync(fd).isFile()) {
      throw new Error(`Not a regular file: ${filePath}`);
    }
    const raw = fs.readFileSync(fd, "utf8");
    const next = transform(raw);
    if (next !== raw) {
      const bytes = Buffer.from(next, "utf8");
      let offset = 0;
      while (offset < bytes.length) {
        const written = fs.writeSync(
          fd,
          bytes,
          offset,
          bytes.length - offset,
          offset,
        );
        if (written === 0) throw new Error(`Failed to write ${filePath}`);
        offset += written;
      }
      fs.ftruncateSync(fd, bytes.length);
    }
    return { next, raw };
  } finally {
    fs.closeSync(fd);
  }
}

function speciesContentDir(id: string) {
  if (!isSpeciesContentId(id)) {
    throw new Error("Invalid species id");
  }
  return path.join(CONTENT_ROOT, id);
}

const OVERLAY_LOCALES = ["en", "ru", "tr"] as const;

export type GalleryOverlayLocale = (typeof OVERLAY_LOCALES)[number];

export function appendFieldRecordToSpecies(
  id: string,
  record: SpeciesFieldRecord,
  repoRoot = process.cwd(),
) {
  const kaPath = path.join(repoRoot, "src/content/species", id, "ka.mdx");
  if (
    !rewriteMdxIfExists(kaPath, (raw) => appendFieldRecordToMdx(raw, record))
  ) {
    throw new Error(`Missing ${id}/ka.mdx`);
  }
}

export function appendGalleryItemToMdx(
  raw: string,
  item: GalleryImage,
): string {
  const parsed = matter(raw);
  const gallery = normalizeGallery(parsed.data.gallery);
  if (gallery.some((entry) => entry.src === item.src)) {
    throw new Error(`Gallery already has ${item.src}`);
  }

  const newline = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);
  const itemText = formatGalleryItemYaml(item).replace(/\n$/, "");
  const itemLines = itemText.split("\n");
  const range = findGalleryRange(lines);

  if (!range) {
    const commonName = lines.findIndex((line) => /^commonName:/.test(line));
    const insertAt = commonName === -1 ? lines.length : commonName;
    lines.splice(insertAt, 0, "gallery:", ...itemLines);
  } else {
    if (/^gallery:\s*\[\]\s*$/.test(lines[range.start])) {
      lines[range.start] = "gallery:";
    }
    lines.splice(range.end, 0, ...itemLines);
  }

  const next = lines.join(newline);
  const check = normalizeGallery(matter(next).data.gallery);
  const added = check.find((entry) => entry.src === item.src);
  if (!added) {
    throw new Error("Failed to append gallery item");
  }
  if (!creditsEqual(item.credit, added.credit)) {
    throw new Error("Failed to append gallery credit");
  }
  return next;
}

export function appendGalleryItemToSpecies(
  id: string,
  kaItem: GalleryImage,
  overlays: Partial<Record<GalleryOverlayLocale, GalleryImage>> = {},
  repoRoot = process.cwd(),
) {
  const dir = path.join(repoRoot, "src/content/species", id);
  const kaPath = path.join(dir, "ka.mdx");
  if (
    !rewriteMdxIfExists(kaPath, (raw) => appendGalleryItemToMdx(raw, kaItem))
  ) {
    throw new Error(`Missing ${id}/ka.mdx`);
  }

  for (const locale of OVERLAY_LOCALES) {
    const overlay = overlays[locale];
    if (!overlay) continue;
    const filePath = path.join(dir, `${locale}.mdx`);
    if (creditsEqual(kaItem.credit, overlay.credit)) continue;
    rewriteMdxIfExists(filePath, (raw) => appendGalleryItemToMdx(raw, overlay));
  }
}

export function creditsEqual(a?: PhotoCredit, b?: PhotoCredit): boolean {
  const left = Object.fromEntries(
    creditEntries(a ?? {}).map(([key, value]) => [key, String(value)]),
  );
  const right = Object.fromEntries(
    creditEntries(b ?? {}).map(([key, value]) => [key, String(value)]),
  );
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const key of keys) {
    if (left[key] !== right[key]) return false;
  }
  return true;
}

export function galleryStorageKeys(gallery: GalleryImage[]): Set<string> {
  const keys = new Set<string>();
  for (const item of gallery) {
    if (!item.src.startsWith(`${CDN_BASE}/`)) continue;
    const key = decodeURIComponent(item.src.slice(CDN_BASE.length + 1));
    if (key && !key.startsWith("optimized/") && !key.startsWith("og/")) {
      keys.add(key);
    }
  }
  return keys;
}

export function listAdminSpecies(): AdminSpeciesSummary[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];
  const ids: string[] = [];
  for (const entry of fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
    if (entry.isDirectory() && isSpeciesContentId(entry.name)) {
      ids.push(entry.name);
    }
  }
  ids.sort((a, b) => a.localeCompare(b));
  return ids.flatMap((id) => {
    const filePath = mdxPath(id, "ka");
    if (!fs.existsSync(filePath)) return [];
    const { data } = matter(fs.readFileSync(filePath, "utf8"));
    const gallery = Array.isArray(data.gallery) ? data.gallery : [];
    return [
      {
        commonName: typeof data.commonName === "string" ? data.commonName : id,
        galleryCount: gallery.filter(
          (item) =>
            item &&
            typeof item === "object" &&
            "src" in item &&
            typeof item.src === "string" &&
            item.src,
        ).length,
        group: speciesAtlasMeta[id]?.group ?? null,
        id,
        image: typeof data.image === "string" ? data.image : "",
        scientificName:
          typeof data.scientificName === "string" ? data.scientificName : "",
        unpublished: unpublishedSpeciesIds.has(id),
      },
    ];
  });
}

export function readAdminSpeciesGallery(id: string): {
  commonName: string;
  fieldRecords: SpeciesFieldRecord[];
  gallery: GalleryImage[];
  group: AnimalGroup | null;
  image: string;
  mobileImage: string;
  scientificName: string;
  unpublished: boolean;
} {
  const filePath = mdxPath(id, "ka");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${id}/ka.mdx`);
  }
  const { data } = matter(fs.readFileSync(filePath, "utf8"));
  const gallery = normalizeGallery(data.gallery);
  return {
    commonName: typeof data.commonName === "string" ? data.commonName : id,
    fieldRecords: normalizeFieldRecords(data.fieldRecords),
    gallery,
    group: speciesAtlasMeta[id]?.group ?? null,
    image: typeof data.image === "string" ? data.image : "",
    mobileImage: typeof data.mobileImage === "string" ? data.mobileImage : "",
    scientificName:
      typeof data.scientificName === "string" ? data.scientificName : "",
    unpublished: unpublishedSpeciesIds.has(id),
  };
}

function appendFieldRecordToMdx(
  raw: string,
  record: SpeciesFieldRecord,
): string {
  const parsed = matter(raw);
  const records = normalizeFieldRecords(parsed.data.fieldRecords);
  if (
    records.some(
      (entry) =>
        entry.locality === record.locality &&
        entry.lat === record.lat &&
        entry.lng === record.lng &&
        entry.date === record.date,
    )
  ) {
    throw new Error(`Field record already exists: ${record.locality}`);
  }

  const newline = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);
  const itemLines = formatFieldRecordYaml(record)
    .replace(/\n$/, "")
    .split("\n");
  const range = findTopLevelRange(lines, "fieldRecords");

  if (!range) {
    const galleryRange = findGalleryRange(lines);
    const commonName = lines.findIndex((line) => /^commonName:/.test(line));
    const insertAt =
      galleryRange?.end ?? (commonName === -1 ? lines.length : commonName);
    lines.splice(insertAt, 0, "fieldRecords:", ...itemLines);
  } else {
    if (/^fieldRecords:\s*\[\]\s*$/.test(lines[range.start])) {
      lines[range.start] = "fieldRecords:";
    }
    lines.splice(range.end, 0, ...itemLines);
  }

  const next = lines.join(newline);
  const check = normalizeFieldRecords(matter(next).data.fieldRecords);
  const added = check.find(
    (entry) =>
      entry.locality === record.locality &&
      entry.lat === record.lat &&
      entry.lng === record.lng &&
      entry.date === record.date,
  );
  if (!added) {
    throw new Error("Failed to append field record");
  }
  return next;
}

function creditEntries(credit: PhotoCredit): Array<[string, number | string]> {
  const entries: Array<[string, number | string]> = [];
  if (credit.photographer) entries.push(["photographer", credit.photographer]);
  if (credit.url) entries.push(["url", credit.url]);
  if (credit.location) entries.push(["location", credit.location]);
  if (typeof credit.lat === "number") entries.push(["lat", credit.lat]);
  if (typeof credit.lng === "number") entries.push(["lng", credit.lng]);
  if (credit.date) entries.push(["date", credit.date]);
  if (credit.photoConfidence) {
    entries.push(["photoConfidence", credit.photoConfidence]);
  }
  return entries;
}

function findGalleryRange(lines: string[]): FrontmatterRange | null {
  return topLevelRangeFrom(
    lines,
    lines.findIndex((line) => /^gallery:\s*(?:\[\])?\s*$/.test(line)),
  );
}

function findTopLevelRange(
  lines: string[],
  key: string,
): FrontmatterRange | null {
  return topLevelRangeFrom(
    lines,
    lines.findIndex((line) => isExactTopLevelKey(line, key)),
  );
}

function formatCreditField(key: string, value: number | string): string {
  if (typeof value === "number") return `${key}: ${value}`;
  if (key === "url") return `url: ${JSON.stringify(value)}`;
  return `${key}: ${yamlScalar(value)}`;
}

function formatGalleryItemYaml(item: GalleryImage): string {
  const lines = [`  - src: "${item.src}"`];
  const credit = item.credit;
  const fields = credit ? creditEntries(credit) : [];
  if (fields.length > 0) {
    lines.push("    credit:");
    for (const [key, value] of fields) {
      lines.push(`      ${formatCreditField(key, value)}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function isExactTopLevelKey(line: string, key: string) {
  return new RegExp(`^${key}:(?:\\s|$)`).test(line);
}

function mdxPath(id: string, locale: string) {
  return path.join(speciesContentDir(id), `${locale}.mdx`);
}

function normalizeCredit(value: unknown): PhotoCredit | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const credit: PhotoCredit = {};
  if (typeof record.photographer === "string" && record.photographer.trim()) {
    credit.photographer = record.photographer.trim();
  }
  if (typeof record.url === "string" && record.url.trim()) {
    credit.url = record.url.trim();
  }
  if (typeof record.location === "string" && record.location.trim()) {
    credit.location = record.location.trim();
  }
  if (typeof record.date === "string" && record.date.trim()) {
    credit.date = record.date.trim();
  }
  const coordinates = normalizePhotoCoordinates(record.lat, record.lng);
  if (coordinates) {
    credit.lat = coordinates.lat;
    credit.lng = coordinates.lng;
  }
  if (
    record.photoConfidence === "georgia-field" ||
    record.photoConfidence === "placeholder" ||
    record.photoConfidence === "range-typical"
  ) {
    credit.photoConfidence = record.photoConfidence;
  }
  return Object.keys(credit).length > 0 ? credit : undefined;
}

function normalizeFieldRecords(value: unknown): SpeciesFieldRecord[] {
  if (!Array.isArray(value)) return [];
  const out: SpeciesFieldRecord[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const locality =
      typeof record.locality === "string" ? record.locality.trim() : "";
    const coordinates = normalizePhotoCoordinates(record.lat, record.lng);
    if (!locality || !coordinates) continue;
    const next: SpeciesFieldRecord = {
      lat: coordinates.lat,
      lng: coordinates.lng,
      locality,
    };
    if (typeof record.date === "string" && record.date.trim()) {
      next.date = record.date.trim();
    }
    if (
      record.evidence === "literature" ||
      record.evidence === "observation" ||
      record.evidence === "specimen"
    ) {
      next.evidence = record.evidence;
    }
    if (typeof record.observer === "string" && record.observer.trim()) {
      next.observer = record.observer.trim();
    }
    if (typeof record.observerName === "string" && record.observerName.trim()) {
      next.observerName = record.observerName.trim();
    }
    if (typeof record.source === "string" && record.source.trim()) {
      next.source = record.source.trim();
    }
    if (typeof record.url === "string" && record.url.trim()) {
      next.url = record.url.trim();
    }
    if (typeof record.note === "string" && record.note.trim()) {
      next.note = record.note.trim();
    }
    out.push(next);
  }
  return out;
}

function normalizeGallery(value: unknown): GalleryImage[] {
  if (!Array.isArray(value)) return [];
  const out: GalleryImage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || !("src" in item)) continue;
    const src = (item as { src?: unknown }).src;
    if (typeof src !== "string" || !src) continue;
    const creditRaw = (item as { credit?: unknown }).credit;
    const credit = normalizeCredit(creditRaw);
    out.push(credit ? { credit, src } : { src });
  }
  return out;
}
