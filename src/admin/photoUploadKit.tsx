import { Alert, Tag } from "antd";

import type { UploadStatus } from "./photoUploads";

const STATUS_TAGS: Record<UploadStatus, { color: string; label: string }> = {
  added: { color: "green", label: "Added" },
  compressing: { color: "processing", label: "Compressing" },
  failed: { color: "red", label: "Failed" },
  uploading: { color: "processing", label: "Uploading" },
  waiting: { color: "default", label: "Waiting" },
};

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
