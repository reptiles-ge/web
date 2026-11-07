import { Descriptions, Empty, Space, Typography } from "antd";

import { publicEnv } from "@/lib/env";

import type { AdminSpeciesRecord } from "./species";

type Audio = NonNullable<AdminSpeciesRecord["record"]["base"]["audio"]>;

const SITE = publicEnv().NEXT_PUBLIC_SITE_URL ?? "https://reptiles.ge";

export function SpeciesAudioPanel({ audio }: { audio?: Audio }) {
  if (!audio) {
    return (
      <Empty description="This species has no sound yet. The profile shows no player." />
    );
  }
  const src = audioUrl(audio.src);
  return (
    <Space orientation="vertical" style={{ width: "100%" }}>
      <audio
        aria-label="Species sound"
        controls
        preload="metadata"
        src={src}
        style={{ maxWidth: 480, width: "100%" }}
      >
        <track kind="captions" />
      </audio>
      <Descriptions
        column={1}
        items={[
          {
            children: (
              <Typography.Link href={src} rel="noreferrer" target="_blank">
                {audio.src}
              </Typography.Link>
            ),
            key: "file",
            label: "File",
          },
          {
            children: audio.recordist ?? "—",
            key: "recordist",
            label: "Recordist",
          },
          {
            children: audio.url ? (
              <Typography.Link
                href={audio.url}
                rel="noreferrer"
                target="_blank"
              >
                {audio.url}
              </Typography.Link>
            ) : (
              "—"
            ),
            key: "source",
            label: "Source",
          },
          {
            children: audio.location ?? "—",
            key: "location",
            label: "Location",
          },
          { children: audio.date ?? "—", key: "date", label: "Date" },
        ]}
        size="small"
      />
    </Space>
  );
}

function audioUrl(src: string) {
  return src.startsWith("/") ? `${SITE.replace(/\/+$/, "")}${src}` : src;
}
