import {
  Alert,
  Button,
  Card,
  Empty,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";

import { isGeorgian, type XenoCantoRecording } from "@/lib/xenoCanto";

import { SessionExpiredError } from "./adminResponse";
import { encodeMp3, needsEncoding } from "./audioEncode";
import {
  downloadRecording,
  MAX_SOUND_BYTES,
  searchXenoCantoSounds,
  uploadSpeciesSound,
} from "./sounds";

type CardState =
  | { status: "adding" }
  | { status: "error"; text: string }
  | { status: "idle" }
  | { status: "loading" };

type Loaded = { blob: Blob; url: string };

type Search = {
  page: number;
  pages: number;
  recordings: XenoCantoRecording[];
  total: number;
};

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function XenoCantoSoundsButton({
  currentUrl,
  id,
  onAdded,
  onSessionExpired,
  version,
}: {
  currentUrl?: string;
  id: string;
  onAdded: (version: number, notice: string) => void;
  onSessionExpired: () => void;
  version: number;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<null | Search>(null);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState<null | string>(null);
  const [files, setFiles] = useState<Record<string, Loaded>>({});
  const filesRef = useRef(files);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(
    () => () => {
      for (const file of Object.values(filesRef.current)) {
        URL.revokeObjectURL(file.url);
      }
    },
    [],
  );

  async function load(page: number) {
    setLoading(true);
    setFailure(null);
    try {
      const result = await searchXenoCantoSounds(id, page);
      setSearch((previous) =>
        previous && page > 1
          ? {
              ...result,
              recordings: [
                ...previous.recordings,
                ...result.recordings.filter(
                  (item) =>
                    !previous.recordings.some((seen) => seen.id === item.id),
                ),
              ],
            }
          : result,
      );
    } catch (error) {
      if (error instanceof SessionExpiredError) return onSessionExpired();
      setFailure(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }

  function show() {
    setOpen(true);
    if (!search) void load(1);
  }

  function remember(recordingId: string, blob: Blob) {
    const file = { blob, url: URL.createObjectURL(blob) };
    setFiles((previous) => ({ ...previous, [recordingId]: file }));
    return file;
  }

  return (
    <>
      <Button onClick={show} type="primary">
        Find sounds
      </Button>
      <Modal
        destroyOnHidden={false}
        footer={null}
        onCancel={() => setOpen(false)}
        open={open}
        title="Sounds on xeno-canto"
        width={1100}
      >
        <Space orientation="vertical" style={{ width: "100%" }}>
          <Typography.Text type="secondary">
            Recordings of this species on xeno-canto, Georgia first, then by
            quality (A is best). Listen loads the file and shows its size. Add
            uploads it to the CDN as an MP3 and makes it the species sound.
          </Typography.Text>
          {failure ? <Alert showIcon title={failure} type="error" /> : null}
          {search ? (
            <Typography.Text>
              {search.recordings.length} of {search.total} recordings
            </Typography.Text>
          ) : null}
          {search && !search.recordings.length && !loading ? (
            <Empty description="xeno-canto has no recordings of this species." />
          ) : null}
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {search?.recordings.map((recording) => (
              <SoundCard
                current={currentUrl === recording.pageUrl}
                file={files[recording.id]}
                hasSound={Boolean(currentUrl)}
                key={recording.id}
                onAdd={async (file) => {
                  const source =
                    file ??
                    remember(recording.id, await downloadRecording(recording));
                  const mp3 = needsEncoding(
                    recording.format,
                    source.blob.size,
                    MAX_SOUND_BYTES,
                  )
                    ? await encodeMp3(source.blob)
                    : source.blob;
                  if (mp3.size > MAX_SOUND_BYTES) {
                    throw new Error(
                      "The MP3 is larger than 20 MB. Pick a shorter recording.",
                    );
                  }
                  const next = await uploadSpeciesSound(
                    id,
                    recording,
                    new File([mp3], `xc${recording.id}.mp3`, {
                      type: "audio/mpeg",
                    }),
                    version,
                  );
                  onAdded(
                    next,
                    `XC${recording.id} is now the species sound. Clear the cache to show it on the site.`,
                  );
                }}
                onListen={async () =>
                  remember(recording.id, await downloadRecording(recording))
                }
                onSessionExpired={onSessionExpired}
                recording={recording}
              />
            ))}
          </div>
          {loading ? (
            <div style={{ padding: 24, textAlign: "center" }}>
              <Spin />
            </div>
          ) : null}
          {search && search.page < search.pages && !loading ? (
            <Button block onClick={() => void load(search.page + 1)}>
              Load more
            </Button>
          ) : null}
        </Space>
      </Modal>
    </>
  );
}

function formatDuration(recording: XenoCantoRecording) {
  const seconds = recording.durationSeconds;
  if (seconds === null) return recording.length || "—";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;
}

function SoundCard({
  current,
  file,
  hasSound,
  onAdd,
  onListen,
  onSessionExpired,
  recording,
}: {
  current: boolean;
  file?: Loaded;
  hasSound: boolean;
  onAdd: (file?: Loaded) => Promise<void>;
  onListen: () => Promise<Loaded>;
  onSessionExpired: () => void;
  recording: XenoCantoRecording;
}) {
  const [state, setState] = useState<CardState>({ status: "idle" });
  const [autoPlay, setAutoPlay] = useState(false);

  async function run(
    action: () => Promise<unknown>,
    status: "adding" | "loading",
  ) {
    setState({ status });
    try {
      await action();
      setState({ status: "idle" });
    } catch (error) {
      if (error instanceof SessionExpiredError) return onSessionExpired();
      setState({
        status: "error",
        text: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const busy = state.status === "adding" || state.status === "loading";
  const add = () => void run(() => onAdd(file), "adding");
  const confirm = hasSound && !current;
  const addButton = (
    <Button
      disabled={busy || current}
      loading={state.status === "adding"}
      onClick={confirm ? undefined : add}
      type="primary"
    >
      {current ? "Current sound" : "Add"}
    </Button>
  );

  return (
    <Card
      cover={
        recording.sonogram ? (
          <img
            alt={`Sonogram of XC${recording.id}`}
            loading="lazy"
            src={recording.sonogram}
            style={{ background: "#fff", height: 90, objectFit: "cover" }}
          />
        ) : undefined
      }
      size="small"
      title={
        <Space size={4} wrap>
          <Typography.Link
            href={recording.pageUrl}
            rel="noreferrer"
            target="_blank"
          >
            XC{recording.id}
          </Typography.Link>
          {recording.quality ? (
            <Tag color={recording.quality === "A" ? "green" : undefined}>
              {recording.quality}
            </Tag>
          ) : null}
          {isGeorgian(recording) ? <Tag color="red">Georgia</Tag> : null}
          {current ? <Tag color="blue">Current</Tag> : null}
        </Space>
      }
    >
      <Space orientation="vertical" size={4} style={{ width: "100%" }}>
        {recording.type ? <Tag>{recording.type}</Tag> : null}
        <Typography.Text>{recording.recordist || "—"}</Typography.Text>
        <Typography.Text type="secondary">
          {[recording.location, recording.country].filter(Boolean).join(", ") ||
            "—"}
        </Typography.Text>
        <Space size={12} wrap>
          <span>⏱ {formatDuration(recording)}</span>
          <span>
            {file ? formatBytes(file.blob.size) : "size after Listen"}
          </span>
          <span>{recording.format.toUpperCase() || "?"}</span>
          {recording.date ? <span>{recording.date}</span> : null}
        </Space>
        {recording.licence || recording.licenceUrl ? (
          <Typography.Link
            href={recording.licenceUrl}
            rel="noreferrer"
            target="_blank"
          >
            {recording.licence || "Licence"}
          </Typography.Link>
        ) : null}
        {file ? (
          <audio
            aria-label={`XC${recording.id}`}
            autoPlay={autoPlay}
            controls
            preload="metadata"
            src={file.url}
            style={{ width: "100%" }}
          >
            <track kind="captions" />
          </audio>
        ) : (
          <Button
            block
            disabled={busy}
            loading={state.status === "loading"}
            onClick={() =>
              void run(async () => {
                await onListen();
                setAutoPlay(true);
              }, "loading")
            }
          >
            Listen
          </Button>
        )}
        {state.status === "error" ? (
          <Alert showIcon title={state.text} type="error" />
        ) : null}
        {confirm ? (
          <Popconfirm
            description="The species page will play this recording instead of the current one."
            onConfirm={add}
            title="Replace the current sound?"
          >
            {addButton}
          </Popconfirm>
        ) : (
          addButton
        )}
      </Space>
    </Card>
  );
}
