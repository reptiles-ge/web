import type { CSSProperties } from "react";

import { Alert, Button, Modal, Space, Tag, Typography } from "antd";
import { useState } from "react";

import { optimizedImgSrc } from "@/data/optimizedImages";
import {
  adminCoverRoles,
  type CoverTarget,
  resolveAdminCovers,
} from "@/lib/adminCover";

import { SessionExpiredError } from "./adminResponse";
import { setSpeciesCover } from "./species";

const INK = "#0e1411";
const FRAME_HEIGHT = 198;

const FRAMES = [
  { cover: "mobile", height: 440, label: "Phone · 390 px", width: 390 },
  { cover: "mobile", height: 440, label: "Tablet · 768 px", width: 768 },
  { cover: "desktop", height: 660, label: "Desktop · 1440 px", width: 1440 },
] as const;

const TARGETS: { label: string; notice: string; target: CoverTarget }[] = [
  {
    label: "Make desktop cover",
    notice: "Desktop cover saved.",
    target: "desktop",
  },
  {
    label: "Make mobile cover",
    notice: "Mobile cover saved.",
    target: "mobile",
  },
  { label: "Make both covers", notice: "Both covers saved.", target: "both" },
];

export function CoverPreviewButton({
  commonName,
  id,
  image,
  mobileImage,
  onChanged,
  onSessionExpired,
  scientificName,
  src,
  version,
}: {
  commonName: string;
  id: string;
  image: string;
  mobileImage?: string;
  onChanged: (version: number, notice: string) => void;
  onSessionExpired: () => void;
  scientificName: string;
  src: string;
  version: number;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState<CoverTarget | null>(null);
  const [error, setError] = useState<null | string>(null);
  const covers = resolveAdminCovers(image, mobileImage ?? "");
  const roles = adminCoverRoles(src, covers);
  const isDesktop = roles.includes("desktop") || roles.includes("cover");
  const isMobile = roles.includes("mobile") || roles.includes("cover");
  const current = { desktop: covers.desktopSrc, mobile: covers.mobileSrc };

  async function save(target: CoverTarget, notice: string) {
    setSaving(target);
    setError(null);
    try {
      const saved = await setSpeciesCover(id, src, target, version);
      setOpen(false);
      onChanged(saved, notice);
    } catch (caught) {
      if (caught instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      setError(caught instanceof Error ? caught.message : "Cover save failed");
    } finally {
      setSaving(null);
    }
  }

  function done(target: CoverTarget) {
    if (target === "desktop") return isDesktop;
    if (target === "mobile") return isMobile;
    return isDesktop && isMobile;
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="small">
        Cover
      </Button>
      <Modal
        footer={
          <Space wrap>
            {TARGETS.map(({ label, notice, target }) => (
              <Button
                disabled={
                  done(target) || (saving !== null && saving !== target)
                }
                key={target}
                loading={saving === target}
                onClick={() => void save(target, notice)}
                type={target === "both" ? "primary" : "default"}
              >
                {label}
              </Button>
            ))}
          </Space>
        }
        onCancel={() => setOpen(false)}
        open={open}
        title="Cover preview"
        width={1040}
      >
        <Typography.Paragraph type="secondary">
          The profile header crops the photo to fill the frame, as on
          reptiles.ge. Phones and tablets (under 1024 px) show the mobile cover;
          wider screens show the desktop cover on the right 62%.
        </Typography.Paragraph>
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
          <FrameRow
            commonName={commonName}
            scientificName={scientificName}
            src={() => src}
            title="This photo as cover"
          />
          <FrameRow
            commonName={commonName}
            roles={{ desktop: isDesktop, mobile: isMobile }}
            scientificName={scientificName}
            src={(cover) => current[cover]}
            title="Covers now"
          />
        </Space>
        {error ? (
          <Alert
            showIcon
            style={{ marginTop: 16 }}
            title={error}
            type="error"
          />
        ) : null}
      </Modal>
    </>
  );
}

function FrameRow({
  commonName,
  roles,
  scientificName,
  src,
  title,
}: {
  commonName: string;
  roles?: { desktop: boolean; mobile: boolean };
  scientificName: string;
  src: (cover: "desktop" | "mobile") => string;
  title: string;
}) {
  return (
    <section aria-label={title}>
      <Typography.Text strong>{title}</Typography.Text>
      <div
        style={{
          alignItems: "flex-end",
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginTop: 8,
        }}
      >
        {FRAMES.map((frame) => (
          <figure key={frame.label} style={{ margin: 0 }}>
            <HeroFrame
              commonName={commonName}
              desktop={frame.cover === "desktop"}
              height={frame.height}
              scientificName={scientificName}
              src={src(frame.cover)}
              width={frame.width}
            />
            <figcaption style={{ fontSize: 12, marginTop: 4 }}>
              {frame.label} · {frame.cover} cover
              {roles?.[frame.cover] ? (
                <Tag color="green" style={{ marginLeft: 6 }}>
                  this photo
                </Tag>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function HeroFrame({
  commonName,
  desktop,
  height,
  scientificName,
  src,
  width,
}: {
  commonName: string;
  desktop: boolean;
  height: number;
  scientificName: string;
  src: string;
  width: number;
}) {
  const scale = FRAME_HEIGHT / height;
  const fill: CSSProperties = { inset: 0, position: "absolute" };
  return (
    <div
      aria-label={`${desktop ? "Desktop" : "Mobile"} header preview`}
      role="img"
      style={{
        background: INK,
        borderRadius: 8,
        height: FRAME_HEIGHT,
        overflow: "hidden",
        position: "relative",
        width: Math.round(width * scale),
      }}
    >
      {src ? (
        <img
          alt=""
          src={optimizedImgSrc(src, 1600)}
          style={{
            ...fill,
            height: "100%",
            left: desktop ? "38%" : 0,
            objectFit: "cover",
            width: desktop ? "62%" : "100%",
          }}
        />
      ) : null}
      <div
        style={{
          ...fill,
          background: `linear-gradient(to bottom, ${INK}cc, transparent 30%, transparent 55%, ${INK})`,
        }}
      />
      {desktop ? (
        <div
          style={{
            background: `linear-gradient(to right, ${INK}, ${INK}d9, transparent)`,
            bottom: 0,
            left: "38%",
            position: "absolute",
            top: 0,
            width: "30%",
          }}
        />
      ) : null}
      <div
        style={{
          bottom: desktop ? "auto" : 10,
          color: "white",
          left: desktop ? "4%" : 10,
          position: "absolute",
          top: desktop ? "38%" : "auto",
        }}
      >
        <div style={{ fontSize: desktop ? 22 : 16, fontWeight: 700 }}>
          {commonName}
        </div>
        <div style={{ fontSize: 11, fontStyle: "italic", opacity: 0.8 }}>
          {scientificName}
        </div>
      </div>
    </div>
  );
}
