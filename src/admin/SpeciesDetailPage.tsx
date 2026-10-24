import type { ColumnsType } from "antd/es/table";

import {
  Alert,
  Button,
  Flex,
  Image,
  Result,
  Skeleton,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";

import { optimizedImgSrc } from "@/data/optimizedImages";

import { ClearCacheButton } from "./ClearCacheButton";
import { followLink } from "./router";
import {
  type AdminFieldRecord,
  type AdminSpeciesRecord,
  clearSpeciesCache,
  fetchAdminFieldRecords,
  fetchAdminSpeciesRecord,
  SPECIES_STATUS_COLORS,
} from "./species";
import { useAdminData } from "./useAdminList";

type Base = AdminSpeciesRecord["record"]["base"];

type Credit = Base["imageCredit"];

type PhotoRow = {
  confidence?: string;
  credit: Credit;
  key: string;
  role: string;
  src: string;
};

const LIST_PATH = "/species";

const photoColumns: ColumnsType<PhotoRow> = [
  {
    dataIndex: "src",
    key: "src",
    render: (src: string) => (
      <Image
        alt=""
        height={56}
        preview={{ src }}
        src={optimizedImgSrc(src, 320)}
        style={{ objectFit: "cover" }}
        width={84}
      />
    ),
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
      row.credit?.url ? (
        <Typography.Link href={row.credit.url} rel="noreferrer" target="_blank">
          {row.credit.photographer ?? row.credit.url}
        </Typography.Link>
      ) : (
        (row.credit?.photographer ?? "—")
      ),
    title: "Photographer",
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
  const back = (
    <Typography.Link
      href={LIST_PATH}
      onClick={(event) => followLink(event, LIST_PATH)}
    >
      ← Species
    </Typography.Link>
  );

  if (status === "error") {
    return (
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        {back}
        <Alert
          action={<Button onClick={reload}>Retry</Button>}
          message="Could not load this species."
          showIcon
          type="error"
        />
      </Space>
    );
  }
  if (!data) return <Skeleton active />;
  const [found, fieldRecords] = data;
  if (!found) {
    return (
      <Result
        extra={back}
        status="404"
        subTitle={id}
        title="Species not found"
      />
    );
  }

  const { record, version } = found;
  const photos = photoRows(record.base);
  const locations = fieldRecords ?? [];

  return (
    <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
      {back}
      <Flex align="start" gap="middle" justify="space-between" wrap>
        <Space orientation="vertical" size={4}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {record.base.commonName}
          </Typography.Title>
          <Typography.Text type="secondary">
            {record.translations.en.commonName} ·{" "}
            <i>{record.base.scientificName}</i> · {id}
          </Typography.Text>
          <Space size={4} wrap>
            <Tag color={SPECIES_STATUS_COLORS[record.status]}>
              {record.status}
            </Tag>
            <Tag>{record.group}</Tag>
            <Tag>version {version}</Tag>
          </Space>
        </Space>
        <Space wrap>
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
        </Space>
      </Flex>
      <Tabs
        items={[
          {
            children: (
              <Table<PhotoRow>
                columns={photoColumns}
                dataSource={photos}
                pagination={false}
                rowKey="key"
                scroll={{ x: 900 }}
                size="small"
              />
            ),
            key: "photos",
            label: `Photos (${photos.length})`,
          },
          {
            children: (
              <Table<AdminFieldRecord>
                columns={locationColumns}
                dataSource={locations}
                pagination={{ defaultPageSize: 50, showSizeChanger: true }}
                rowKey={(row) => `${row.locality}:${row.lat}:${row.lng}`}
                scroll={{ x: 900 }}
                size="small"
              />
            ),
            key: "locations",
            label: `Locations (${locations.length})`,
          },
        ]}
      />
    </Space>
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

function photoRows(base: Base): PhotoRow[] {
  return [
    {
      confidence: base.imageCredit?.photoConfidence,
      credit: base.imageCredit,
      key: `desktop:${base.image}`,
      role: "Desktop cover",
      src: base.image,
    },
    ...(base.mobileImage
      ? [
          {
            confidence: base.mobileImageCredit?.photoConfidence,
            credit: base.mobileImageCredit,
            key: `mobile:${base.mobileImage}`,
            role: "Mobile cover",
            src: base.mobileImage,
          },
        ]
      : []),
    ...base.gallery.map((photo, index) => ({
      confidence: photo.photoConfidence ?? photo.credit?.photoConfidence,
      credit: photo.credit,
      key: `gallery:${photo.src}`,
      role: `Gallery ${index + 1}`,
      src: photo.src,
    })),
  ];
}
