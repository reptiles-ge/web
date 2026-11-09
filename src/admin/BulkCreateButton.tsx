import {
  Alert,
  Button,
  Card,
  ConfigProvider,
  Form,
  Modal,
  Space,
  Tag,
  Typography,
} from "antd";
import { useId, useRef, useState } from "react";

import type { INaturalistPhotoMetadata } from "@/lib/inaturalistPhoto";

import type { PhotoCandidate } from "./photoCandidates";

import { SessionExpiredError } from "./adminResponse";
import { PhotoCreditFormFields } from "./PhotoCreditFormFields";
import { importINaturalistLookup, type PhotoCreditFields } from "./photos";
import { UploadedAlert, UploadStatusTag } from "./photoUploadKit";
import {
  creditFromINaturalist,
  isSettled,
  keepUploadOrder,
  profileNameOf,
  retryWhenRateLimited,
  runPhotoUploads,
  type UploadStatus,
} from "./photoUploads";

type BulkItem = {
  candidate: PhotoCandidate;
  file?: File;
  loadError?: string;
  message?: string;
  metadata?: INaturalistPhotoMetadata;
  src?: string;
  status?: UploadStatus;
};

type BulkValues = { photos?: Record<string, PhotoCreditFields> };

const LOAD_CONCURRENCY = 3;

export function BulkCreateButton({
  candidates,
  id,
  onSessionExpired,
  onUploaded,
}: {
  candidates: PhotoCandidate[];
  id: string;
  onSessionExpired: () => void;
  onUploaded: () => void;
}) {
  const [form] = Form.useForm<BulkValues>();
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<BulkItem[]>([]);
  const [running, setRunning] = useState(false);
  const [orderError, setOrderError] = useState<null | string>(null);
  const session = useRef(0);
  const loading = items.filter((item) => !item.file && !item.loadError).length;
  const ready = items.filter((item) => item.file && item.status !== "added");
  const added = items.filter((item) => item.status === "added").length;
  const finished =
    !running &&
    items.some((item) => item.status !== undefined) &&
    items.every((item) => !item.file || isSettled(item.status));

  function patch(key: string, next: Partial<BulkItem>) {
    setItems((current) =>
      current.map((item) =>
        item.candidate.key === key ? { ...item, ...next } : item,
      ),
    );
  }

  async function load(candidate: PhotoCandidate, run: number) {
    try {
      const { file, metadata } = await retryWhenRateLimited(() =>
        importINaturalistLookup(id, candidate.lookup),
      );
      if (session.current !== run) return;
      form.setFieldValue(
        ["photos", candidate.key],
        creditFromINaturalist(metadata, true),
      );
      patch(candidate.key, { file, loadError: undefined, metadata });
    } catch (error) {
      if (session.current !== run) return;
      if (error instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      patch(candidate.key, {
        loadError:
          error instanceof Error ? error.message : "iNaturalist import failed",
      });
    }
  }

  async function loadAll(queue: PhotoCandidate[], run: number) {
    const pending = [...queue];
    async function drain(): Promise<void> {
      const next = pending.shift();
      if (!next || session.current !== run) return;
      await load(next, run);
      return drain();
    }
    await Promise.all(
      Array.from({ length: Math.min(LOAD_CONCURRENCY, pending.length) }, drain),
    );
  }

  function start() {
    session.current += 1;
    setItems(candidates.map((candidate) => ({ candidate })));
    setOpen(true);
    void loadAll(candidates, session.current);
  }

  function retry(candidate: PhotoCandidate) {
    patch(candidate.key, { loadError: undefined });
    void load(candidate, session.current);
  }

  function remove(key: string) {
    setItems((current) => current.filter((item) => item.candidate.key !== key));
  }

  function close() {
    if (running) return;
    session.current += 1;
    setOpen(false);
    setItems([]);
    setOrderError(null);
    form.resetFields();
  }

  async function upload(values: BulkValues) {
    const jobs = ready.flatMap(({ candidate, file }) =>
      file
        ? [
            {
              credit: values.photos?.[candidate.key] ?? {},
              file,
              uid: candidate.key,
            },
          ]
        : [],
    );
    const queued = new Set(jobs.map((job) => job.uid));
    setItems((current) =>
      current.map((item) =>
        queued.has(item.candidate.key)
          ? { ...item, message: undefined, status: "waiting" }
          : item,
      ),
    );
    setRunning(true);
    setOrderError(null);
    const srcs = new Map(
      items.flatMap((item) =>
        item.src ? [[item.candidate.key, item.src] as const] : [],
      ),
    );
    try {
      const results = await runPhotoUploads({
        id,
        jobs,
        onSessionExpired,
        onStatus: (uid, status, message) => patch(uid, { message, status }),
        parallel: true,
      });
      for (const { src, uid } of results) {
        srcs.set(uid, src);
        patch(uid, { src });
      }
      if (results.length > 0) {
        await keepUploadOrder(
          id,
          items.flatMap((item) => srcs.get(item.candidate.key) ?? []),
        ).catch((error: unknown) => {
          if (error instanceof SessionExpiredError) throw error;
          setOrderError(
            "The photos were added, but their order could not be kept. Drag them into place on the Photos tab.",
          );
        });
        onUploaded();
      }
    } catch (error) {
      if (error instanceof SessionExpiredError) onSessionExpired();
      else throw error;
    } finally {
      setRunning(false);
    }
  }

  return (
    <>
      <Button disabled={candidates.length === 0} onClick={start}>
        Bulk create
      </Button>
      <Modal
        cancelText={finished ? "Close" : "Cancel"}
        closable={!running}
        mask={{ closable: false }}
        okButtonProps={{
          disabled: ready.length === 0 || loading > 0 || running,
          form: formId,
          htmlType: "submit",
          loading: running,
        }}
        okText={
          ready.length > 0
            ? `Upload ${ready.length} ${ready.length === 1 ? "photo" : "photos"}`
            : "Upload"
        }
        onCancel={close}
        open={open}
        styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
        title="Add saved photos to the gallery"
        width={880}
      >
        <Typography.Paragraph type="secondary">
          One form per saved photo, filled in from its iNaturalist observation.
          Check the Georgian fields, then Upload compresses each photo in this
          browser to AVIF and WebP at 320–2400 px and stores it on the CDN with
          its own credit.
        </Typography.Paragraph>
        {loading > 0 ? (
          <Alert
            showIcon
            style={{ marginBottom: 16 }}
            title={`Loading ${loading} ${loading === 1 ? "photo" : "photos"} from iNaturalist…`}
            type="info"
          />
        ) : null}
        <Form<BulkValues>
          disabled={running}
          form={form}
          id={formId}
          layout="vertical"
          onFinish={upload}
        >
          <Space orientation="vertical" size={16} style={{ width: "100%" }}>
            {items.map((item, index) => (
              <BulkCard
                index={index}
                item={item}
                key={item.candidate.key}
                onRemove={() => remove(item.candidate.key)}
                onRetry={() => retry(item.candidate)}
                running={running}
              />
            ))}
          </Space>
        </Form>
        {finished && added > 0 ? <UploadedAlert count={added} /> : null}
        {orderError ? (
          <Alert
            showIcon
            style={{ marginTop: 16 }}
            title={orderError}
            type="warning"
          />
        ) : null}
      </Modal>
    </>
  );
}

function BulkCard({
  index,
  item,
  onRemove,
  onRetry,
  running,
}: {
  index: number;
  item: BulkItem;
  onRemove: () => void;
  onRetry: () => void;
  running: boolean;
}) {
  const { candidate } = item;
  const name = candidate.observerName || candidate.observer;
  return (
    <Card
      extra={
        <Space>
          {item.status ? <UploadStatusTag status={item.status} /> : null}
          {!item.file && !item.loadError ? (
            <Tag color="processing">Loading</Tag>
          ) : null}
          <Button
            aria-label={`Remove photo ${index + 1}`}
            danger
            disabled={running || item.status === "added"}
            onClick={onRemove}
            size="small"
          >
            Remove
          </Button>
        </Space>
      }
      size="small"
      title={`${index + 1}. ${name}`}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <div style={{ flex: "0 0 200px" }}>
          <img
            alt={`Observation ${index + 1} by ${candidate.observer}`}
            src={candidate.previewUrl}
            style={{
              aspectRatio: "4 / 3",
              borderRadius: 4,
              display: "block",
              objectFit: "cover",
              width: "100%",
            }}
          />
          <Space size={[4, 4]} style={{ marginTop: 8 }} wrap>
            {candidate.georgia ? <Tag color="green">Georgia</Tag> : null}
            <Tag>{candidate.licence}</Tag>
            <Typography.Link
              href={candidate.observationUrl}
              rel="noreferrer"
              target="_blank"
            >
              Observation
            </Typography.Link>
          </Space>
        </div>
        <div style={{ flex: "1 1 360px", minWidth: 0 }}>
          {item.loadError ? (
            <Alert
              action={
                <Button onClick={onRetry} size="small">
                  Retry
                </Button>
              }
              showIcon
              style={{ marginBottom: 12 }}
              title={item.loadError}
              type="error"
            />
          ) : null}
          {item.message ? (
            <Alert
              showIcon
              style={{ marginBottom: 12 }}
              title={item.message}
              type="error"
            />
          ) : null}
          <ConfigProvider
            componentDisabled={running || !item.file || item.status === "added"}
          >
            <PhotoCreditFormFields
              prefix={["photos", candidate.key]}
              profileName={profileNameOf(item.metadata)}
            />
          </ConfigProvider>
        </div>
      </div>
    </Card>
  );
}
