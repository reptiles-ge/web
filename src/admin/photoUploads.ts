import type { INaturalistPhotoMetadata } from "@/lib/inaturalistPhoto";

import { AdminSaveError, SessionExpiredError } from "./adminResponse";
import { sameOrder } from "./galleryOrder";
import {
  encodePhotoFile,
  type PhotoCreditFields,
  uploadSpeciesPhoto,
} from "./photos";
import { fetchAdminSpeciesRecord, reorderSpeciesPhotos } from "./species";

export type UploadedJob = { src: string; uid: string };

export type UploadJob = {
  credit: PhotoCreditFields;
  file: File;
  uid: string;
};

export type UploadStatus =
  "added" | "compressing" | "failed" | "uploading" | "waiting";

const MAX_COMPRESSIONS = 6;
const ORDER_ATTEMPTS = 3;
const RATE_LIMIT_ATTEMPTS = 6;
const RATE_LIMIT_RETRY_MS = 10_000;

export function creditFromINaturalist(
  metadata: INaturalistPhotoMetadata,
  withGeorgia: boolean,
): PhotoCreditFields {
  return {
    date: metadata.date,
    ...(withGeorgia ? { georgiaField: metadata.georgiaField } : {}),
    lat: String(metadata.lat),
    lng: String(metadata.lng),
    location: metadata.location,
    locationEn: metadata.location,
    photographer: metadata.photographer,
    photographerEn: metadata.photographer,
    url: "",
  };
}

export function isSettled(status: undefined | UploadStatus) {
  return status === "added" || status === "failed";
}

export async function keepUploadOrder(id: string, srcs: string[]) {
  for (let attempt = 1; ; attempt += 1) {
    const current = await fetchAdminSpeciesRecord(id);
    if (!current) return;
    const gallery = current.record.base.gallery.map((photo) => photo.src);
    const inGallery = new Set(gallery);
    const batch = srcs.filter((src) => inGallery.has(src));
    const moved = new Set(batch);
    const next = [...gallery.filter((src) => !moved.has(src)), ...batch];
    if (next.length < 2 || sameOrder(next, gallery)) return;
    try {
      await reorderSpeciesPhotos(id, next, current.version);
      return;
    } catch (error) {
      const stale =
        error instanceof AdminSaveError && error.code === "version_conflict";
      if (!stale || attempt >= ORDER_ATTEMPTS) throw error;
    }
  }
}

export function profileNameOf(metadata: INaturalistPhotoMetadata | undefined) {
  return metadata && metadata.photographerName !== metadata.photographer
    ? metadata.photographerName
    : "";
}

export async function retryWhenRateLimited<T>(
  task: () => Promise<T>,
  delayMs = RATE_LIMIT_RETRY_MS,
): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      const limited =
        error instanceof AdminSaveError && error.code === "rate_limited";
      if (!limited || attempt >= RATE_LIMIT_ATTEMPTS) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
}

export async function runPhotoUploads({
  id,
  jobs,
  onSessionExpired,
  onStatus,
  parallel = false,
  retryDelayMs = RATE_LIMIT_RETRY_MS,
}: {
  id: string;
  jobs: UploadJob[];
  onSessionExpired: () => void;
  onStatus: (uid: string, status: UploadStatus, message?: string) => void;
  parallel?: boolean;
  retryDelayMs?: number;
}): Promise<UploadedJob[]> {
  const uploaded: UploadedJob[] = [];
  const compress = limiter(parallel ? compressionSlots() : 1);
  let expired = false;

  async function run({ credit, file, uid }: UploadJob) {
    if (expired) return;
    try {
      const photo = await compress(() => {
        if (expired) return null;
        onStatus(uid, "compressing");
        return encodePhotoFile(file);
      });
      if (!photo || expired) return;
      onStatus(uid, "uploading");
      const result = await retryWhenRateLimited(
        () => uploadSpeciesPhoto(id, credit, photo),
        retryDelayMs,
      );
      onStatus(uid, "added");
      uploaded.push({ src: result.photo.src, uid });
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        if (!expired) onSessionExpired();
        expired = true;
        return;
      }
      onStatus(
        uid,
        "failed",
        error instanceof Error ? error.message : "Upload failed",
      );
    }
  }

  if (parallel) await Promise.all(jobs.map(run));
  else for (const job of jobs) await run(job);
  return uploaded;
}

function compressionSlots() {
  const cores =
    typeof navigator === "undefined" ? 0 : navigator.hardwareConcurrency || 0;
  return Math.min(MAX_COMPRESSIONS, Math.max(2, cores - 1));
}

function limiter(size: number) {
  let active = 0;
  const queue: Array<() => void> = [];
  return async <T>(task: () => Promise<T> | T): Promise<T> => {
    if (active < size) active += 1;
    else await new Promise<void>((resolve) => queue.push(resolve));
    try {
      return await task();
    } finally {
      const next = queue.shift();
      if (next) next();
      else active -= 1;
    }
  };
}
