import {
  parseXenoCantoPage,
  sortXenoCantoRecordings,
  XENO_CANTO_API,
  XENO_CANTO_PER_PAGE,
  xenoCantoLocation,
  type XenoCantoPage,
  xenoCantoQueries,
  type XenoCantoRecording,
} from "@/lib/xenoCanto";

import { checkAdminSave } from "./adminResponse";
import { api } from "./apiClient";

export const MAX_SOUND_BYTES = 20 * 1024 * 1024;

const KEY_STORAGE = "reptiles-admin:xeno-canto-key";

const TIMEOUT_MS = 20_000;

export class XenoCantoKeyError extends Error {
  constructor() {
    super("xeno-canto refused this API key. Enter your key again.");
    this.name = "XenoCantoKeyError";
  }
}

export async function downloadRecording(
  recording: Pick<XenoCantoRecording, "fileUrl">,
): Promise<Blob> {
  const response = await fetch(recording.fileUrl, { credentials: "omit" });
  if (!response.ok) {
    throw new Error(
      `The recording could not be downloaded: ${response.status}`,
    );
  }
  return response.blob();
}

export function forgetXenoCantoKey() {
  try {
    localStorage.removeItem(KEY_STORAGE);
  } catch {
    return;
  }
}

export function readXenoCantoKey() {
  try {
    return localStorage.getItem(KEY_STORAGE)?.trim() || null;
  } catch {
    return null;
  }
}

export function saveXenoCantoKey(key: string) {
  try {
    localStorage.setItem(KEY_STORAGE, key.trim());
  } catch {
    return;
  }
}

export async function searchXenoCantoSounds(
  scientificName: string,
  page: number,
  key: string,
): Promise<XenoCantoPage> {
  let result: null | XenoCantoPage = null;
  for (const query of xenoCantoQueries(scientificName)) {
    result = await fetchXenoCantoPage(query, page, key);
    if (result.total > 0) break;
  }
  return {
    ...result!,
    recordings: sortXenoCantoRecordings(result!.recordings),
  };
}

export async function uploadSpeciesSound(
  id: string,
  recording: XenoCantoRecording,
  file: File,
  expectedVersion: number,
): Promise<number> {
  const optional = Object.fromEntries(
    Object.entries({
      date: recording.date,
      location: xenoCantoLocation(recording),
    }).flatMap(([key, value]) =>
      value && value.trim() ? [[key, value.trim().slice(0, 300)]] : [],
    ),
  );
  const response = await api.v1.admin.species[":id"].audio.$post({
    form: {
      ...optional,
      expectedVersion: String(expectedVersion),
      file,
      recordist: recording.recordist.slice(0, 200) || "xeno-canto",
      xenoCantoId: recording.id,
    },
    param: { id },
  });
  await checkAdminSave(response, "Sound upload failed");
  return ((await response.json()) as { data: { version: number } }).data
    .version;
}

async function fetchXenoCantoPage(query: string, page: number, key: string) {
  const url = new URL(XENO_CANTO_API);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(XENO_CANTO_PER_PAGE));
  url.searchParams.set("key", key);
  const response = await fetch(url, {
    credentials: "omit",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  }).catch(() => null);
  if (!response) {
    throw new Error("xeno-canto did not answer. Try again in a minute.");
  }
  const payload = (await response.json().catch(() => null)) as unknown;
  if (
    response.status === 401 ||
    response.status === 403 ||
    keyRefused(payload)
  ) {
    throw new XenoCantoKeyError();
  }
  const parsed = response.ok ? parseXenoCantoPage(payload) : null;
  if (!parsed) {
    throw new Error(`xeno-canto search failed: ${response.status}`);
  }
  return parsed;
}

function keyRefused(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("message" in payload)) {
    return false;
  }
  return /\bkey\b/i.test(String(payload.message));
}
