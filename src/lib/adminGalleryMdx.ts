import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

import {
  type GalleryImage,
  type PhotoCredit,
  unpublishedSpeciesIds,
} from "@/data/species";
import { type AnimalGroup, speciesAtlasMeta } from "@/data/speciesAtlas";
import { CDN_BASE } from "@/lib/site";

const CONTENT_ROOT = path.join(process.cwd(), "src/content/species");
const SPECIES_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TOP_LEVEL_KEY = /^[A-Za-z][A-Za-z0-9]*:/;

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

export function speciesContentDir(id: string) {
  if (!isSpeciesContentId(id)) {
    throw new Error("Invalid species id");
  }
  return path.join(CONTENT_ROOT, id);
}

const OVERLAY_LOCALES = ["en", "ru", "tr"] as const;

export type GalleryOverlayLocale = (typeof OVERLAY_LOCALES)[number];

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
  if (!fs.existsSync(kaPath)) {
    throw new Error(`Missing ${id}/ka.mdx`);
  }

  fs.writeFileSync(
    kaPath,
    appendGalleryItemToMdx(fs.readFileSync(kaPath, "utf8"), kaItem),
    "utf8",
  );

  for (const locale of OVERLAY_LOCALES) {
    const overlay = overlays[locale];
    if (!overlay) continue;
    const filePath = path.join(dir, `${locale}.mdx`);
    if (!fs.existsSync(filePath)) continue;
    if (creditsEqual(kaItem.credit, overlay.credit)) continue;
    fs.writeFileSync(
      filePath,
      appendGalleryItemToMdx(fs.readFileSync(filePath, "utf8"), overlay),
      "utf8",
    );
  }
}

export function creditsEqual(a?: PhotoCredit, b?: PhotoCredit): boolean {
  const left = Object.fromEntries(creditEntries(a ?? {}));
  const right = Object.fromEntries(creditEntries(b ?? {}));
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const key of keys) {
    if (left[key] !== right[key]) return false;
  }
  return true;
}

export function formatGalleryItemYaml(item: GalleryImage): string {
  const lines = [`  - src: "${item.src}"`];
  const credit = item.credit;
  const fields = credit ? creditEntries(credit) : [];
  if (fields.length > 0) {
    lines.push("    credit:");
    for (const [key, value] of fields) {
      lines.push(
        key === "url"
          ? `      url: ${JSON.stringify(value)}`
          : `      ${key}: ${yamlScalar(value)}`,
      );
    }
  }
  return `${lines.join("\n")}\n`;
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
  gallery: GalleryImage[];
  group: AnimalGroup | null;
  image: string;
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
    gallery,
    group: speciesAtlasMeta[id]?.group ?? null,
    image: typeof data.image === "string" ? data.image : "",
    scientificName:
      typeof data.scientificName === "string" ? data.scientificName : "",
    unpublished: unpublishedSpeciesIds.has(id),
  };
}

export function reorderGalleryInMdx(
  raw: string,
  orderedSrcs: string[],
): string {
  const gallery = normalizeGallery(matter(raw).data.gallery);
  if (gallery.length < 2) {
    throw new Error("Need at least two photos to reorder");
  }
  assertGalleryPermutation(
    gallery.map((item) => item.src),
    orderedSrcs,
  );

  const newline = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);
  const range = findGalleryRange(lines);
  if (!range) {
    throw new Error("Gallery block not found");
  }

  const body = lines.slice(range.start + 1, range.end);
  let trailing = 0;
  for (let i = body.length - 1; i >= 0; i -= 1) {
    if (body[i].trim() !== "") break;
    trailing += 1;
  }
  const trailingLines = trailing > 0 ? body.slice(body.length - trailing) : [];
  const items = splitGalleryItems(body);
  if (items.length !== gallery.length) {
    throw new Error("Could not parse gallery items");
  }

  const bySrc = new Map<string, string[]>();
  for (const item of items) {
    const src = galleryItemSrc(item);
    if (!src) {
      throw new Error("Gallery item is missing src");
    }
    if (bySrc.has(src)) {
      throw new Error(`Gallery has duplicate src: ${src}`);
    }
    bySrc.set(src, item);
  }

  const nextItems = orderedSrcs.map((src) => {
    const item = bySrc.get(src);
    if (!item) {
      throw new Error(`Unknown gallery src: ${src}`);
    }
    return item;
  });

  const nextLines = [
    ...lines.slice(0, range.start + 1),
    ...nextItems.flat(),
    ...trailingLines,
    ...lines.slice(range.end),
  ];
  const next = nextLines.join(newline);
  const check = normalizeGallery(matter(next).data.gallery).map(
    (item) => item.src,
  );
  if (check.join("\0") !== orderedSrcs.join("\0")) {
    throw new Error("Failed to reorder gallery");
  }
  return next;
}

export function reorderGalleryInSpecies(
  id: string,
  orderedSrcs: string[],
  repoRoot = process.cwd(),
) {
  if (!isSpeciesContentId(id)) {
    throw new Error("Invalid species id");
  }
  const kaPath = path.join(repoRoot, "src/content/species", id, "ka.mdx");
  if (!fs.existsSync(kaPath)) {
    throw new Error(`Missing ${id}/ka.mdx`);
  }
  fs.writeFileSync(
    kaPath,
    reorderGalleryInMdx(fs.readFileSync(kaPath, "utf8"), orderedSrcs),
    "utf8",
  );
}

function assertGalleryPermutation(current: string[], next: string[]) {
  if (next.length !== current.length) {
    throw new Error("Gallery order must include every photo once");
  }
  if (new Set(next).size !== next.length) {
    throw new Error("Gallery order has duplicate src");
  }
  const have = new Set(current);
  for (const src of next) {
    if (!src || !have.has(src)) {
      throw new Error(`Unknown gallery src: ${src}`);
    }
  }
}

function creditEntries(credit: PhotoCredit): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  if (credit.photographer) entries.push(["photographer", credit.photographer]);
  if (credit.url) entries.push(["url", credit.url]);
  if (credit.location) entries.push(["location", credit.location]);
  if (credit.date) entries.push(["date", credit.date]);
  return entries;
}

function findGalleryRange(
  lines: string[],
): null | { end: number; start: number } {
  const start = lines.findIndex((line) =>
    /^gallery:\s*(?:\[\])?\s*$/.test(line),
  );
  if (start === -1) return null;
  let end = start + 1;
  while (end < lines.length) {
    const line = lines[end];
    if (line.trim() === "") {
      end += 1;
      continue;
    }
    if (TOP_LEVEL_KEY.test(line) || /^---\s*$/.test(line)) break;
    end += 1;
  }
  return { end, start };
}

function galleryItemSrc(lines: string[]): null | string {
  for (const line of lines) {
    const match = line.match(/^\s+-?\s*src:\s*(.*)$/);
    if (!match) continue;
    const raw = match[1].trim();
    if (!raw) return null;
    if (
      (raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'"))
    ) {
      return raw.slice(1, -1);
    }
    return raw;
  }
  return null;
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
  return Object.keys(credit).length > 0 ? credit : undefined;
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

function splitGalleryItems(lines: string[]): string[][] {
  const items: string[][] = [];
  let current: null | string[] = null;
  for (const line of lines) {
    if (line.trim() === "") continue;
    if (/^  - /.test(line)) {
      if (current) items.push(current);
      current = [line];
      continue;
    }
    if (!current) {
      throw new Error("Could not parse gallery items");
    }
    current.push(line);
  }
  if (current) items.push(current);
  return items;
}

function yamlScalar(value: string): string {
  if (value === "") return '""';
  if (
    /^\d/.test(value) ||
    /[:#{}[\],&*!|>'"%@`]/.test(value) ||
    /^\s|\s$/.test(value)
  ) {
    return JSON.stringify(value);
  }
  return value;
}
