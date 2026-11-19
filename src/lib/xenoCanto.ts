import { z } from "zod";

export const XENO_CANTO_API = "https://xeno-canto.org/api/3/recordings";

export const XENO_CANTO_PER_PAGE = 50;

const QUALITY_ORDER = ["A", "B", "C", "D", "E"];

const GEORGIA = "georgia";

const text = z
  .unknown()
  .optional()
  .transform((value) =>
    typeof value === "string" || typeof value === "number"
      ? String(value).trim()
      : "",
  );

const rawRecording = z.looseObject({
  cnt: text,
  date: text,
  en: text,
  file: text,
  "file-name": text.optional(),
  fileName: text.optional(),
  gen: text,
  id: text,
  lat: text,
  length: text,
  lic: text,
  lng: text.optional(),
  loc: text,
  lon: text.optional(),
  q: text,
  rec: text,
  sono: z
    .looseObject({ med: text.optional(), small: text.optional() })
    .optional()
    .catch(undefined),
  sp: text,
  ssp: text.optional(),
  type: text,
});

const rawResponse = z.looseObject({
  numPages: z.coerce.number().int().catch(1),
  numRecordings: z.coerce.number().int().catch(0),
  page: z.coerce.number().int().catch(1),
  recordings: z.array(z.unknown()),
});

export type XenoCantoPage = {
  page: number;
  pages: number;
  recordings: XenoCantoRecording[];
  total: number;
};

export type XenoCantoRecording = {
  country: string;
  date?: string;
  durationSeconds: null | number;
  fileName: string;
  fileUrl: string;
  format: string;
  id: string;
  lat?: string;
  length: string;
  licence: string;
  licenceUrl?: string;
  lng?: string;
  location: string;
  pageUrl: string;
  quality: string;
  recordist: string;
  scientificName: string;
  sonogram?: string;
  type: string;
};

export function isGeorgian(recording: Pick<XenoCantoRecording, "country">) {
  return recording.country.toLowerCase() === GEORGIA;
}

export function licenceName(url: string) {
  const match = /licenses\/([a-z-]+)\/(\d(?:\.\d)?)/i.exec(url);
  if (match) return `CC ${match[1]!.toUpperCase()} ${match[2]}`;
  return /publicdomain/i.test(url) ? "CC0" : "";
}

export function parseDuration(length: string) {
  const parts = length.split(":").map((part) => Number(part));
  if (!parts.length || parts.some((part) => !Number.isFinite(part))) {
    return null;
  }
  return parts.reduce((total, part) => total * 60 + part, 0);
}

export function parseXenoCantoPage(payload: unknown): null | XenoCantoPage {
  const parsed = rawResponse.safeParse(payload);
  if (!parsed.success) return null;
  const recordings = parsed.data.recordings.flatMap((item) => {
    const recording = rawRecording.safeParse(item);
    return recording.success ? normalize(recording.data) : [];
  });
  return {
    page: parsed.data.page,
    pages: Math.max(parsed.data.numPages, 1),
    recordings,
    total: parsed.data.numRecordings,
  };
}

export function sortXenoCantoRecordings(recordings: XenoCantoRecording[]) {
  return recordings
    .map((recording, index) => ({ index, recording }))
    .sort(
      (a, b) =>
        Number(isGeorgian(b.recording)) - Number(isGeorgian(a.recording)) ||
        qualityRank(a.recording.quality) - qualityRank(b.recording.quality) ||
        a.index - b.index,
    )
    .map(({ recording }) => recording);
}

export function xenoCantoAudioKey(speciesId: string, recordingId: string) {
  return `audio/${speciesId}-xc${recordingId}.mp3`;
}

export function xenoCantoLocation(
  recording: Pick<XenoCantoRecording, "country" | "location">,
) {
  const location = recording.location.trim();
  const country = recording.country.trim();
  if (!country || location.toLowerCase().includes(country.toLowerCase())) {
    return location;
  }
  return location ? `${location}, ${country}` : country;
}

export function xenoCantoQueries(scientificName: string) {
  const [genus = "", epithet = ""] = scientificName
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");
  const name = `${genus} ${epithet}`.trim().toLowerCase();
  return [
    `sp:"${name}"`,
    `gen:"${genus.toLowerCase()}" sp:"${epithet.toLowerCase()}"`,
  ];
}

function absolute(url: string) {
  if (!url) return "";
  if (url.startsWith("//")) return `https:${url}`;
  return url.replace(/^http:\/\//, "https://");
}

function normalize(raw: z.infer<typeof rawRecording>): XenoCantoRecording[] {
  if (!/^\d+$/.test(raw.id) || !raw.file) return [];
  const fileName = raw["file-name"] || raw.fileName || "";
  const extension = /\.([a-z0-9]+)$/i.exec(fileName)?.[1]?.toLowerCase();
  const licenceUrl = absolute(raw.lic);
  const date = raw.date.replace(/(-00)+$/, "");
  const lng = raw.lon || raw.lng;
  const sonogram = absolute(raw.sono?.small ?? raw.sono?.med ?? "");
  return [
    {
      country: raw.cnt,
      date: /^\d{4}(-\d{2}){0,2}$/.test(date) ? date : undefined,
      durationSeconds: parseDuration(raw.length),
      fileName,
      fileUrl: absolute(raw.file),
      format: extension ?? "",
      id: raw.id,
      lat: raw.lat || undefined,
      length: raw.length,
      licence: licenceName(licenceUrl),
      licenceUrl: licenceUrl || undefined,
      lng: lng || undefined,
      location: raw.loc,
      pageUrl: `https://xeno-canto.org/${raw.id}`,
      quality: raw.q,
      recordist: raw.rec,
      scientificName: [raw.gen, raw.sp, raw.ssp].filter(Boolean).join(" "),
      sonogram: sonogram || undefined,
      type: raw.type,
    },
  ];
}

function qualityRank(quality: string) {
  const rank = QUALITY_ORDER.indexOf(quality.toUpperCase());
  return rank === -1 ? QUALITY_ORDER.length : rank;
}
