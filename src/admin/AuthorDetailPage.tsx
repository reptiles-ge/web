import type { ColumnsType } from "antd/es/table";

import {
  Button,
  Descriptions,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";

import { AdminDetailGate, AdminDetailHeader } from "./AdminDetail";
import { AdminLink } from "./AdminLink";
import {
  type AdminAuthorPhoto,
  type AdminAuthorRecord,
  clearAuthorCache,
  fetchAdminAuthorPhotos,
  fetchAdminAuthorRecord,
} from "./authors";
import { ClearCacheButton } from "./ClearCacheButton";
import { PhotoThumbnail } from "./PhotoThumbnail";
import { SPECIES_STATUS_COLORS } from "./species";
import { useAdminData } from "./useAdminList";

type TextRow = {
  bio?: string;
  locale: string;
  metaDescription?: string;
  name: string;
};

const LIST_PATH = "/authors";

const LINK_LABELS: Record<string, string> = {
  facebook: "Facebook",
  inaturalist: "iNaturalist",
  instagram: "Instagram",
  researchGate: "ResearchGate",
};

const textColumns: ColumnsType<TextRow> = [
  {
    dataIndex: "locale",
    key: "locale",
    render: (locale: string) => <Tag>{locale}</Tag>,
    title: "Locale",
    width: 80,
  },
  { dataIndex: "name", key: "name", title: "Name" },
  {
    dataIndex: "bio",
    key: "bio",
    render: (bio?: string) => bio ?? "—",
    title: "Bio",
  },
  {
    dataIndex: "metaDescription",
    key: "metaDescription",
    render: (value?: string) => value ?? "—",
    title: "Meta description",
  },
];

const photoColumns: ColumnsType<AdminAuthorPhoto> = [
  {
    dataIndex: "src",
    key: "src",
    render: (src: string) => <PhotoThumbnail src={src} />,
    title: "Photo",
    width: 100,
  },
  {
    key: "species",
    render: (_, photo) => (
      <Space orientation="vertical" size={0}>
        <AdminLink path={`/species/${photo.speciesId}`}>
          {photo.speciesName.ka ?? photo.speciesId}
        </AdminLink>
        <Typography.Text style={{ fontSize: 12 }} type="secondary">
          {photo.speciesName.en ?? photo.speciesId}
        </Typography.Text>
      </Space>
    ),
    title: "Species",
  },
  {
    dataIndex: "status",
    key: "status",
    render: (status: AdminAuthorPhoto["status"]) => (
      <Tag color={SPECIES_STATUS_COLORS[status]}>{status}</Tag>
    ),
    title: "Status",
  },
  {
    dataIndex: "role",
    key: "role",
    render: (role: string) => <Tag>{role}</Tag>,
    title: "Role",
  },
  {
    dataIndex: "location",
    key: "location",
    render: (location: null | string) => location ?? "—",
    title: "Location",
  },
  {
    dataIndex: "date",
    key: "date",
    render: (date: null | string) => date ?? "—",
    title: "Date",
  },
];

export function AuthorDetailPage({
  id,
  onSessionExpired,
}: {
  id: string;
  onSessionExpired: () => void;
}) {
  const { data, reload, status } = useAdminDetail(id, onSessionExpired);

  return (
    <AdminDetailGate
      back={<AdminLink path={LIST_PATH}>← Authors</AdminLink>}
      data={data}
      failure="Could not load this author."
      id={id}
      notFoundTitle="Author not found"
      onReload={reload}
      status={status}
    >
      {({ author, photos }) => (
        <>
          <AdminDetailHeader
            actions={
              <>
                <Button onClick={reload}>Reload</Button>
                {author.isContributor ? (
                  <ClearCacheButton
                    description="This contributor's page on reptiles.ge renders fresh on its next visit, in every language. Photo credits on other pages are not cleared."
                    failure="The contributor cache could not be cleared. Try again in a minute."
                    label="Clear cache"
                    onSessionExpired={onSessionExpired}
                    run={async () => {
                      await clearAuthorCache(id);
                      return `Cache cleared for ${id}.`;
                    }}
                    title="Clear this contributor's cache?"
                  />
                ) : null}
              </>
            }
            image={
              author.portraitSrc ? (
                <PhotoThumbnail
                  height={72}
                  src={author.portraitSrc}
                  width={72}
                />
              ) : undefined
            }
            subtitle={`${author.texts.en?.name ?? "—"} · ${id}`}
            tags={
              <>
                {author.isContributor ? (
                  <Tag color="green">contributor</Tag>
                ) : (
                  <Tag>photo credit only</Tag>
                )}
                <Tag>{author.kind}</Tag>
                {author.role ? <Tag>{author.role}</Tag> : null}
                {author.jobTitle ? <Tag>{author.jobTitle}</Tag> : null}
              </>
            }
            title={author.texts.ka.name}
          />
          <Tabs
            items={[
              {
                children: (
                  <Space
                    orientation="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    <Descriptions
                      column={1}
                      items={[
                        {
                          children: tagList(author.aliases),
                          key: "aliases",
                          label: "Aliases",
                        },
                        {
                          children: tagList(author.affiliations),
                          key: "affiliations",
                          label: "Affiliations",
                        },
                        {
                          children: links(author.links),
                          key: "links",
                          label: "Links",
                        },
                      ]}
                      size="small"
                    />
                    <Table<TextRow>
                      columns={textColumns}
                      dataSource={textRows(author)}
                      pagination={false}
                      rowKey="locale"
                      size="small"
                    />
                  </Space>
                ),
                key: "profile",
                label: "Profile",
              },
              {
                children: (
                  <Table<AdminAuthorPhoto>
                    columns={photoColumns}
                    dataSource={photos}
                    pagination={{ defaultPageSize: 50, showSizeChanger: true }}
                    rowKey={(photo) =>
                      `${photo.speciesId}:${photo.role}:${photo.src}`
                    }
                    scroll={{ x: 900 }}
                    size="small"
                  />
                ),
                key: "photos",
                label: `Photos (${photos.length})`,
              },
            ]}
          />
        </>
      )}
    </AdminDetailGate>
  );
}

function links(values: AdminAuthorRecord["links"]) {
  const entries = Object.entries(values).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );
  if (entries.length === 0) return "—";
  return (
    <Space size="middle" wrap>
      {entries.map(([key, url]) => (
        <Typography.Link href={url} key={key} rel="noreferrer" target="_blank">
          {LINK_LABELS[key] ?? key}
        </Typography.Link>
      ))}
    </Space>
  );
}

function tagList(values: string[]) {
  if (values.length === 0) return "—";
  return (
    <Space size={4} wrap>
      {values.map((value) => (
        <Tag key={value}>{value}</Tag>
      ))}
    </Space>
  );
}

function textRows(author: AdminAuthorRecord): TextRow[] {
  return Object.entries(author.texts).flatMap(([locale, text]) =>
    text ? [{ ...text, locale }] : [],
  );
}

function useAdminDetail(id: string, onSessionExpired: () => void) {
  const { data, reload, status } = useAdminData(
    () => Promise.all([fetchAdminAuthorRecord(id), fetchAdminAuthorPhotos(id)]),
    onSessionExpired,
  );
  const value =
    data === undefined
      ? undefined
      : data[0]
        ? { author: data[0], photos: data[1] ?? [] }
        : null;
  return { data: value, reload, status };
}
