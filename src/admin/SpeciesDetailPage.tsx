import type { ColumnsType } from "antd/es/table";

import { Button, message, Space, Table, Tabs, Tag, Typography } from "antd";
import { useRef, useState } from "react";

import { AdminDetailGate, AdminDetailHeader } from "./AdminDetail";
import { AdminLink } from "./AdminLink";
import { ClearCacheButton } from "./ClearCacheButton";
import { CoverPreviewButton } from "./CoverPreview";
import { movePhoto, sameOrder } from "./galleryOrder";
import { PhotoActions } from "./PhotoActions";
import { PhotoThumbnail } from "./PhotoThumbnail";
import { PhotoUploadButton } from "./PhotoUploadButton";
import {
  type AdminFieldRecord,
  type AdminSpeciesRecord,
  clearSpeciesCache,
  fetchAdminFieldRecords,
  fetchAdminSpeciesRecord,
  reorderSpeciesPhotos,
  SessionExpiredError,
  SPECIES_STATUS_COLORS,
} from "./species";
import { SpeciesTextsEditor } from "./SpeciesTextsEditor";
import { useAdminData } from "./useAdminList";

type Base = AdminSpeciesRecord["record"]["base"];

type Credit = Base["imageCredit"];

type PhotoRow = {
  confidence?: string;
  credit: Credit;
  enCredit?: Credit;
  gallery: boolean;
  key: string;
  role: string;
  src: string;
};

const LIST_PATH = "/species";

const photoColumns: ColumnsType<PhotoRow> = [
  {
    dataIndex: "src",
    key: "src",
    render: (src: string) => <PhotoThumbnail src={src} />,
    title: "Photo",
    width: 100,
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
    render: (_, row) => coordinates(row.credit?.lat, row.credit?.lng),
    title: "Coordinates",
  },
  {
    dataIndex: "confidence",
    key: "confidence",
    render: (confidence?: string) => confidence ?? "—",
    title: "Confidence",
  },
];

const locationColumns: ColumnsType<AdminFieldRecord> = [
  { dataIndex: "locality", key: "locality", title: "Locality" },
  {
    key: "coordinates",
    render: (_, row) => coordinates(row.lat, row.lng),
    title: "Coordinates",
  },
  {
    dataIndex: "date",
    key: "date",
    render: (date?: string) => date ?? "—",
    title: "Date",
  },
  {
    dataIndex: "evidence",
    key: "evidence",
    render: (evidence?: string) => (evidence ? <Tag>{evidence}</Tag> : "—"),
    title: "Evidence",
  },
  {
    key: "observer",
    render: (_, row) => row.observerName ?? row.observer ?? "—",
    title: "Observer",
  },
  {
    key: "source",
    render: (_, row) =>
      row.url ? (
        <Typography.Link href={row.url} rel="noreferrer" target="_blank">
          {row.source ?? row.url}
        </Typography.Link>
      ) : (
        (row.source ?? "—")
      ),
    title: "Source",
  },
  {
    dataIndex: "note",
    key: "note",
    render: (note?: string) => note ?? "—",
    title: "Note",
  },
];

export function SpeciesDetailPage({
  id,
  onSessionExpired,
}: {
  id: string;
  onSessionExpired: () => void;
}) {
  const { data, reload, status } = useAdminData(
    () =>
      Promise.all([fetchAdminSpeciesRecord(id), fetchAdminFieldRecords(id)]),
    onSessionExpired,
  );
  const [savedVersion, setSavedVersion] = useState<null | number>(null);
  const [pendingOrder, setPendingOrder] = useState<null | {
    srcs: string[];
    version?: number;
  }>(null);
  const dragging = useRef<null | string>(null);
  const [messages, contextHolder] = message.useMessage();

  function changed(next: number, notice: string) {
    void messages.success(notice);
    setSavedVersion(next);
    reload();
  }

  async function saveOrder(srcs: string[], current: string[], version: number) {
    const saving = pendingOrder !== null && pendingOrder.version === undefined;
    if (saving || sameOrder(srcs, current)) return;
    setPendingOrder({ srcs });
    try {
      const saved = await reorderSpeciesPhotos(id, srcs, version);
      setPendingOrder({ srcs, version: saved });
      changed(saved, "Gallery order saved.");
    } catch (caught) {
      setPendingOrder(null);
      if (caught instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      void messages.error(
        caught instanceof Error ? caught.message : "Gallery order save failed",
      );
    }
  }
  const value =
    data === undefined
      ? undefined
      : data[0]
        ? { fieldRecords: data[1] ?? [], found: data[0] }
        : null;

  return (
    <>
      {contextHolder}
      <AdminDetailGate
        back={<AdminLink path={LIST_PATH}>← Species</AdminLink>}
        data={value}
        failure="Could not load this species."
        id={id}
        notFoundTitle="Species not found"
        onReload={reload}
        status={status}
      >
        {({ fieldRecords, found: { record, version } }) => {
          const recordOrder = record.base.gallery.map((photo) => photo.src);
          const ordering =
            pendingOrder !== null && pendingOrder.version === undefined;
          const order =
            pendingOrder &&
            (pendingOrder.version === undefined ||
              version < pendingOrder.version)
              ? pendingOrder.srcs
              : recordOrder;
          const photos = photoRows(record, order);
          const galleryCount = record.base.gallery.length;
          const currentVersion = savedVersion ?? version;
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
                      onChanged={changed}
                      onSessionExpired={onSessionExpired}
                      scientificName={record.base.scientificName}
                      src={row.src}
                      version={currentVersion}
                    />
                    <PhotoActions
                      canDelete={galleryCount > 1}
                      credit={row.credit}
                      enCredit={row.enCredit}
                      georgiaField={row.confidence === "georgia-field"}
                      id={id}
                      onChanged={changed}
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
            <>
              <AdminDetailHeader
                actions={
                  <>
                    <Button onClick={reload}>Reload</Button>
                    <ClearCacheButton
                      description="This species' profile pages, and the hubs, lists and cards that show it, render fresh on reptiles.ge on their next visit, in every language."
                      failure="The species cache could not be cleared. Try again in a minute."
                      label="Clear cache"
                      onSessionExpired={onSessionExpired}
                      run={async () => {
                        await clearSpeciesCache(id);
                        return `Cache cleared for ${id}.`;
                      }}
                      title="Clear this species' cache?"
                    />
                  </>
                }
                subtitle={
                  <>
                    {record.translations.en.commonName} ·{" "}
                    <i>{record.base.scientificName}</i> · {id}
                  </>
                }
                tags={
                  <>
                    <Tag color={SPECIES_STATUS_COLORS[record.status]}>
                      {record.status}
                    </Tag>
                    <Tag>{record.group}</Tag>
                    <Tag>version {currentVersion}</Tag>
                  </>
                }
                title={record.base.commonName}
              />
              <Tabs
                items={[
                  {
                    children: (
                      <Space orientation="vertical" style={{ width: "100%" }}>
                        <PhotoUploadButton
                          id={id}
                          onSessionExpired={onSessionExpired}
                          onUploaded={reload}
                        />
                        <Typography.Text type="secondary">
                          Drag gallery rows, or use ↑ ↓, to change the order.
                          The species page shows the first 5 gallery photos; the
                          rest open from the gallery.
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
                                    if (dragging.current)
                                      event.preventDefault();
                                  },
                                  onDragStart: (event) => {
                                    event.dataTransfer.effectAllowed = "move";
                                    event.dataTransfer.setData(
                                      "text/plain",
                                      row.src,
                                    );
                                    dragging.current = row.src;
                                  },
                                  onDrop: (event) => {
                                    event.preventDefault();
                                    if (dragging.current) {
                                      move(
                                        dragging.current,
                                        order.indexOf(row.src),
                                      );
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
                    ),
                    key: "photos",
                    label: `Photos (${photos.length})`,
                  },
                  {
                    children: (
                      <SpeciesTextsEditor
                        id={id}
                        onSaved={setSavedVersion}
                        onSessionExpired={onSessionExpired}
                        record={record}
                        version={version}
                      />
                    ),
                    key: "texts",
                    label: "Texts",
                  },
                  {
                    children: (
                      <Table<AdminFieldRecord>
                        columns={locationColumns}
                        dataSource={fieldRecords}
                        pagination={{
                          defaultPageSize: 50,
                          showSizeChanger: true,
                        }}
                        rowKey={(row) =>
                          `${row.locality}:${row.lat}:${row.lng}`
                        }
                        scroll={{ x: 900 }}
                        size="small"
                      />
                    ),
                    key: "locations",
                    label: `Locations (${fieldRecords.length})`,
                  },
                ]}
              />
            </>
          );
        }}
      </AdminDetailGate>
    </>
  );
}

function coordinates(lat?: number, lng?: number) {
  if (lat === undefined || lng === undefined) return "—";
  return (
    <Typography.Link
      href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=12/${lat}/${lng}`}
      rel="noreferrer"
      target="_blank"
    >
      {lat.toFixed(4)}, {lng.toFixed(4)}
    </Typography.Link>
  );
}

function photoRows(
  { base, translations }: AdminSpeciesRecord["record"],
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
    {
      confidence: base.imageCredit?.photoConfidence,
      credit: base.imageCredit,
      gallery: false,
      key: `desktop:${base.image}`,
      role: "Desktop cover",
      src: base.image,
    },
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
