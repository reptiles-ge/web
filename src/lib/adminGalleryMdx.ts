import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  unpublishedSpeciesIds,
  type GalleryImage,
  type PhotoCredit,
} from "@/data/species";
import { speciesAtlasMeta, type AnimalGroup } from "@/data/speciesAtlas";
import { CDN_BASE } from "@/lib/site";

const CONTENT_ROOT = path.join(process.cwd(), "src/content/species");
const SPECIES_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TOP_LEVEL_KEY = /^[A-Za-z][A-Za-z0-9]*:/;

export type AdminSpeciesSummary = {
  id: string;
  commonName: string;
  scientificName: string;
  image: string;
  galleryCount: number;
  group: AnimalGroup | null;
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

function mdxPath(id: string, locale: string) {
  return path.join(speciesContentDir(id), `${locale}.mdx`);
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
          id,
          commonName: typeof data.commonName === "string" ? data.commonName : id,
          scientificName:
            typeof data.scientificName === "string" ? data.scientificName : "",
          image: typeof data.image === "string" ? data.image : "",
          galleryCount: gallery.filter(
            (item) =>
              item &&
              typeof item === "object" &&
              "src" in item &&
              typeof item.src === "string" &&
              item.src,
          ).length,
          group: speciesAtlasMeta[id]?.group ?? null,
          unpublished: unpublishedSpeciesIds.has(id),
        },
      ];
    });
}

export function readAdminSpeciesGallery(id: string): {
  commonName: string;
  scientificName: string;
  image: string;
  gallery: GalleryImage[];
  unpublished: boolean;
  group: AnimalGroup | null;
} {
  const filePath = mdxPath(id, "ka");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${id}/ka.mdx`);
  }
  const { data } = matter(fs.readFileSync(filePath, "utf8"));
  const gallery = normalizeGallery(data.gallery);
  return {
    commonName: typeof data.commonName === "string" ? data.commonName : id,
    scientificName:
      typeof data.scientificName === "string" ? data.scientificName : "",
    image: typeof data.image === "string" ? data.image : "",
    gallery,
    unpublished: unpublishedSpeciesIds.has(id),
    group: speciesAtlasMeta[id]?.group ?? null,
  };
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
    out.push(credit ? { src, credit } : { src });
  }
  return out;
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

function yamlScalar(value: string): string {
  if (value === "") return '""';
  if (/^\d/.test(value) || /[:#{}[\],&*!|>'"%@`]/.test(value) || /^\s|\s$/.test(value)) {
    return JSON.stringify(value);
  }
  return value;
}

function creditEntries(credit: PhotoCredit): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  if (credit.photographer) entries.push(["photographer", credit.photographer]);
  if (credit.url) entries.push(["url", credit.url]);
  if (credit.location) entries.push(["location", credit.location]);
  if (credit.date) entries.push(["date", credit.date]);
  return entries;
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

function findGalleryRange(lines: string[]): { start: number; end: number } | null {
  const start = lines.findIndex((line) => /^gallery:\s*(?:\[\])?\s*$/.test(line));
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
  return { start, end };
}

export function appendGalleryItemToMdx(raw: string, item: GalleryImage): string {
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
