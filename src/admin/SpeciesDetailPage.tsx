import type { ColumnsType } from "antd/es/table";

import { Button, message, Space, Table, Tabs, Tag, Typography } from "antd";
import { useState } from "react";

import { AdminDetailGate, AdminDetailHeader } from "./AdminDetail";
import { AdminLink } from "./AdminLink";
import { ClearCacheButton } from "./ClearCacheButton";
import { PhotoActions } from "./PhotoActions";
import { PhotoThumbnail } from "./PhotoThumbnail";
import { PhotoUploadButton } from "./PhotoUploadButton";
import {
  type AdminFieldRecord,
  type AdminSpeciesRecord,
  clearSpeciesCache,
  fetchAdminFieldRecords,
  fetchAdminSpeciesRecord,
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
  const [messages, contextHolder] = message.useMessage();
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
          const photos = photoRows(record);
          const galleryCount = record.base.gallery.length;
          const columns: ColumnsType<PhotoRow> = [
            ...photoColumns,
            {
              fixed: "right",
              key: "actions",
              render: (_, row) =>
                row.gallery ? (
                  <PhotoActions
                    canDelete={galleryCount > 1}
                    credit={row.credit}
                    enCredit={row.enCredit}
                    georgiaField={row.confidence === "georgia-field"}
                    id={id}
                    onChanged={(next, notice) => {
                      void messages.success(notice);
                      setSavedVersion(next);
                      reload();
                    }}
                    onSessionExpired={onSessionExpired}
                    src={row.src}
                    version={savedVersion ?? version}
                  />
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
                      description="This species' profile pages on reptiles.ge render fresh on their next visit, in every language. Hubs, lists and cards are not cleared."
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
                    <Tag>version {savedVersion ?? version}</Tag>
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
                        <Table<PhotoRow>
                          columns={columns}
                          dataSource={photos}
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

function photoRows({
  base,
  translations,
}: AdminSpeciesRecord["record"]): PhotoRow[] {
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
    ...base.gallery.map((photo, index) => ({
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
