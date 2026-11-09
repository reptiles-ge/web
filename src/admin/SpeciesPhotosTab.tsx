import type { ColumnsType } from "antd/es/table";

import { Button, Space, Table, Tag, Typography } from "antd";
import { type Dispatch, type SetStateAction, useRef } from "react";

import { AdminLink } from "./AdminLink";
import { CoordinatesLink } from "./CoordinatesLink";
import { CoverPreviewButton } from "./CoverPreview";
import { movePhoto, sameOrder } from "./galleryOrder";
import { GalleryPhotoButtons } from "./GalleryPhotoButtons";
import { PhotoActions } from "./PhotoActions";
import { PhotoThumbnail } from "./PhotoThumbnail";
import {
  type AdminSpeciesRecord,
  reorderSpeciesPhotos,
  SessionExpiredError,
} from "./species";

export type PendingOrder = null | { srcs: string[]; version?: number };

type Credit = SpeciesRecord["base"]["imageCredit"];

type PhotoRow = {
  confidence?: string;
  credit: Credit;
  enCredit?: Credit;
  gallery: boolean;
  key: string;
  role: string;
  src: string;
};

type SpeciesRecord = AdminSpeciesRecord["record"];

const photoColumns: ColumnsType<PhotoRow> = [
  {
    dataIndex: "src",
    key: "src",
    render: (src: string) => (
      <PhotoThumbnail height={86} src={src} width={128} />
    ),
    title: "Photo",
    width: 152,
  },
  {
    dataIndex: "role",
    key: "role",
    render: (role: string) => <Tag>{role}</Tag>,
    title: "Role",
  },
  {
    key: "photographer",
    render: (_, row) =>
      row.credit?.authorId ? (
        <AdminLink path={`/authors/${row.credit.authorId}`}>
          {row.credit.photographer ?? row.credit.authorId}
        </AdminLink>
      ) : (
        (row.credit?.photographer ?? "—")
      ),
    title: "Photographer",
  },
  {
    key: "source",
    render: (_, row) =>
      row.credit?.url ? (
        <Typography.Link href={row.credit.url} rel="noreferrer" target="_blank">
          link
        </Typography.Link>
      ) : (
        "—"
      ),
    title: "Source",
  },
  {
    key: "location",
    render: (_, row) => row.credit?.location ?? "—",
    title: "Location",
  },
  {
    key: "date",
    render: (_, row) => row.credit?.date ?? "—",
    title: "Date",
  },
  {
    key: "coordinates",
    render: (_, row) => (
      <CoordinatesLink lat={row.credit?.lat} lng={row.credit?.lng} />
    ),
    title: "Coordinates",
  },
  {
    dataIndex: "confidence",
    key: "confidence",
    render: (confidence?: string) => confidence ?? "—",
    title: "Confidence",
  },
];

export function SpeciesPhotosTab({
  currentVersion,
  id,
  onChanged,
  onError,
  onSessionExpired,
  onUploaded,
  pending,
  record,
  version,
}: {
  currentVersion: number;
  id: string;
  onChanged: (next: number, notice: string) => void;
  onError: (text: string) => void;
  onSessionExpired: () => void;
  onUploaded: () => void;
  pending: [PendingOrder, Dispatch<SetStateAction<PendingOrder>>];
  record: SpeciesRecord;
  version: number;
}) {
  const [pendingOrder, setPendingOrder] = pending;
  const dragging = useRef<null | string>(null);

  async function saveOrder(srcs: string[], current: string[], at: number) {
    const saving = pendingOrder !== null && pendingOrder.version === undefined;
    if (saving || sameOrder(srcs, current)) return;
    const request: PendingOrder = { srcs };
    setPendingOrder(request);
    try {
      const saved = await reorderSpeciesPhotos(id, srcs, at);
      setPendingOrder((pending) =>
        pending === request ? { srcs, version: saved } : pending,
      );
      onChanged(saved, "Gallery order saved.");
    } catch (caught) {
      setPendingOrder((pending) => (pending === request ? null : pending));
      if (caught instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      onError(
        caught instanceof Error ? caught.message : "Gallery order save failed",
      );
    }
  }

  const recordOrder = record.base.gallery.map((photo) => photo.src);
  const ordering = pendingOrder !== null && pendingOrder.version === undefined;
  const order =
    pendingOrder &&
    (pendingOrder.version === undefined || version < pendingOrder.version)
      ? pendingOrder.srcs
      : recordOrder;
  const photos = photoRows(record, order);
  const move = (src: string, to: number) =>
    void saveOrder(movePhoto(order, src, to), order, currentVersion);
  const columns: ColumnsType<PhotoRow> = [
    {
      key: "order",
      render: (_, row) => {
        if (!row.gallery) return null;
        const index = order.indexOf(row.src);
        return (
          <Space size={2}>
            <span
              aria-hidden
              style={{ cursor: ordering ? "default" : "grab" }}
              title="Drag to reorder"
            >
              ⠿
            </span>
            <Button
              aria-label={`Move ${row.role} up`}
              disabled={ordering || index === 0}
              onClick={() => move(row.src, index - 1)}
              size="small"
              type="text"
            >
              ↑
            </Button>
            <Button
              aria-label={`Move ${row.role} down`}
              disabled={ordering || index === order.length - 1}
              onClick={() => move(row.src, index + 1)}
              size="small"
              type="text"
            >
              ↓
            </Button>
          </Space>
        );
      },
      title: "Order",
      width: 110,
    },
    ...photoColumns,
    {
      fixed: "right",
      key: "actions",
      render: (_, row) =>
        row.gallery ? (
          <Space>
            <CoverPreviewButton
              commonName={record.base.commonName}
              id={id}
              image={record.base.image}
              mobileImage={record.base.mobileImage}
              onChanged={onChanged}
              onSessionExpired={onSessionExpired}
              scientificName={record.base.scientificName}
              src={row.src}
              version={currentVersion}
            />
            <PhotoActions
              credit={row.credit}
              enCredit={row.enCredit}
              georgiaField={row.confidence === "georgia-field"}
              id={id}
              onChanged={onChanged}
              onSessionExpired={onSessionExpired}
              src={row.src}
              version={currentVersion}
            />
          </Space>
        ) : null,
      title: "Actions",
    },
  ];

  return (
    <Space orientation="vertical" style={{ width: "100%" }}>
      <GalleryPhotoButtons
        gallery={record.base.gallery}
        id={id}
        onSessionExpired={onSessionExpired}
        onUploaded={onUploaded}
        scientificName={record.base.scientificName}
      />
      <Typography.Text type="secondary">
        Drag gallery rows, or use ↑ ↓, to change the order. The species page
        shows the first 5 gallery photos; the rest open from the gallery.
      </Typography.Text>
      <Table<PhotoRow>
        columns={columns}
        dataSource={photos}
        onRow={(row) =>
          row.gallery && !ordering
            ? {
                draggable: true,
                onDragEnd: () => {
                  dragging.current = null;
                },
                onDragOver: (event) => {
                  if (dragging.current) event.preventDefault();
                },
                onDragStart: (event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", row.src);
                  dragging.current = row.src;
                },
                onDrop: (event) => {
                  event.preventDefault();
                  if (dragging.current) {
                    move(dragging.current, order.indexOf(row.src));
                  }
                  dragging.current = null;
                },
              }
            : {}
        }
        pagination={false}
        rowKey="key"
        scroll={{ x: 900 }}
        size="small"
      />
    </Space>
  );
}

function photoRows(
  { base, translations }: SpeciesRecord,
  order: string[],
): PhotoRow[] {
  const bySrc = new Map(base.gallery.map((photo) => [photo.src, photo]));
  const gallery = order.flatMap((src) => {
    const photo = bySrc.get(src);
    return photo ? [photo] : [];
  });
  const overlays = new Map(
    (translations.en.gallery ?? []).map((photo) => [photo.src, photo.credit]),
  );
  return [
    ...(base.image
      ? [
          {
            confidence: base.imageCredit?.photoConfidence,
            credit: base.imageCredit,
            gallery: false,
            key: `desktop:${base.image}`,
            role: "Desktop cover",
            src: base.image,
          },
        ]
      : []),
    ...(base.mobileImage
      ? [
          {
            confidence: base.mobileImageCredit?.photoConfidence,
            credit: base.mobileImageCredit,
            gallery: false,
            key: `mobile:${base.mobileImage}`,
            role: "Mobile cover",
            src: base.mobileImage,
          },
        ]
      : []),
    ...gallery.map((photo, index) => ({
      confidence: photo.photoConfidence ?? photo.credit?.photoConfidence,
      credit: photo.credit,
      enCredit: overlays.get(photo.src),
      gallery: true,
      key: `gallery:${photo.src}`,
      role: `Gallery ${index + 1}`,
      src: photo.src,
    })),
  ];
}
