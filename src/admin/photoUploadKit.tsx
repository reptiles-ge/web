import { Alert, Tag } from "antd";

import type { INaturalistPhotoMetadata } from "@/lib/inaturalistPhoto";

import { SessionExpiredError } from "./adminResponse";
import {
  encodePhotoFile,
  type PhotoCreditFields,
  uploadSpeciesPhoto,
} from "./photos";

export type UploadJob = {
  credit: PhotoCreditFields;
  file: File;
  uid: string;
};

export type UploadStatus =
  "added" | "compressing" | "failed" | "uploading" | "waiting";

const STATUS_TAGS: Record<UploadStatus, { color: string; label: string }> = {
  added: { color: "green", label: "Added" },
  compressing: { color: "processing", label: "Compressing" },
  failed: { color: "red", label: "Failed" },
  uploading: { color: "processing", label: "Uploading" },
  waiting: { color: "default", label: "Waiting" },
};

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

export function profileNameOf(metadata: INaturalistPhotoMetadata | undefined) {
  return metadata && metadata.photographerName !== metadata.photographer
    ? metadata.photographerName
    : "";
}

export async function runPhotoUploads({
  id,
  jobs,
  onSessionExpired,
  onStatus,
}: {
  id: string;
  jobs: UploadJob[];
  onSessionExpired: () => void;
  onStatus: (uid: string, status: UploadStatus, message?: string) => void;
}): Promise<number> {
  let uploaded = 0;
  for (const { credit, file, uid } of jobs) {
    try {
      onStatus(uid, "compressing");
      const photo = await encodePhotoFile(file);
      onStatus(uid, "uploading");
      await uploadSpeciesPhoto(id, credit, photo);
      onStatus(uid, "added");
      uploaded += 1;
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        onSessionExpired();
        return uploaded;
      }
      onStatus(
        uid,
        "failed",
        error instanceof Error ? error.message : "Upload failed",
      );
    }
  }
  return uploaded;
}

export function UploadedAlert({ count }: { count: number }) {
  return (
    <Alert
      showIcon
      style={{ marginTop: 16 }}
      title={`${count} ${count === 1 ? "photo" : "photos"} added to the gallery. The site shows them after you clear this species' cache, and serves their AVIF and WebP sizes from the next site deploy.`}
      type="success"
    />
  );
}

export function UploadStatusTag({ status }: { status: UploadStatus }) {
  return (
    <Tag color={STATUS_TAGS[status].color}>{STATUS_TAGS[status].label}</Tag>
  );
}
