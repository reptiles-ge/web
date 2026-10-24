import type { ColumnsType } from "antd/es/table";

import { Space, Tag, Typography } from "antd";
import { useMemo, useState } from "react";

import { AdminLink } from "./AdminLink";
import { AdminListView } from "./AdminListView";
import {
  type AdminAuthor,
  clearAuthorCache,
  clearAuthorsCache,
  fetchAdminAuthors,
} from "./authors";
import { ClearCacheButton } from "./ClearCacheButton";
import { imageColumn, photoCountColumn } from "./listColumns";
import { includesQuery, unique, useAdminList } from "./useAdminList";

export function AuthorsPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const {
    items: authors,
    reload,
    status,
  } = useAdminList(fetchAdminAuthors, onSessionExpired);
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      authors.filter((item) =>
        includesQuery([item.id, item.name.ka ?? "", item.name.en ?? ""], query),
      ),
    [authors, query],
  );

  const columns: ColumnsType<AdminAuthor> = [
    imageColumn<AdminAuthor>("Portrait"),
    {
      key: "name",
      render: (_, item) => (
        <Space orientation="vertical" size={0}>
          <AdminLink path={`/authors/${item.id}`} strong>
            {item.name.ka ?? item.id}
          </AdminLink>
          <Typography.Text type="secondary">
            {item.name.en ?? "—"}
          </Typography.Text>
          <Typography.Text style={{ fontSize: 12 }} type="secondary">
            {item.id}
          </Typography.Text>
        </Space>
      ),
      title: "Author",
    },
    {
      dataIndex: "isContributor",
      filters: [
        { text: "Contributor", value: true },
        { text: "Photo credit only", value: false },
      ],
      key: "isContributor",
      onFilter: (value, item) => item.isContributor === value,
      render: (isContributor: boolean) =>
        isContributor ? <Tag color="green">contributor</Tag> : "—",
      title: "Page",
    },
    {
      dataIndex: "kind",
      filters: unique(authors.map((item) => item.kind)).map((value) => ({
        text: value,
        value,
      })),
      key: "kind",
      onFilter: (value, item) => item.kind === value,
      render: (kind: string) => <Tag>{kind}</Tag>,
      title: "Kind",
    },
    {
      dataIndex: "role",
      filters: unique(
        authors.flatMap((item) => (item.role ? [item.role] : [])),
      ).map((value) => ({ text: value, value })),
      key: "role",
      onFilter: (value, item) => item.role === value,
      render: (role: null | string) => role ?? "—",
      title: "Role",
    },
    {
      dataIndex: "jobTitle",
      key: "jobTitle",
      render: (jobTitle: null | string) => jobTitle ?? "—",
      title: "Job title",
    },
    photoCountColumn<AdminAuthor>(),
    {
      align: "right",
      dataIndex: "aliasCount",
      key: "aliasCount",
      sorter: (a, b) => a.aliasCount - b.aliasCount,
      title: "Aliases",
    },
    {
      fixed: "right",
      key: "actions",
      render: (_, item) =>
        item.isContributor ? (
          <ClearCacheButton
            description="This contributor's page on reptiles.ge renders fresh on its next visit, in every language. Photo credits on other pages are not cleared."
            failure="The contributor cache could not be cleared. Try again in a minute."
            label="Clear cache"
            onSessionExpired={onSessionExpired}
            run={async () => {
              await clearAuthorCache(item.id);
              return `Cache cleared for ${item.id}.`;
            }}
            size="small"
            title="Clear this contributor's cache?"
          />
        ) : null,
      title: "Actions",
    },
  ];

  return (
    <AdminListView<AdminAuthor>
      actions={
        <ClearCacheButton
          description="Every page that shows authors renders fresh on its next visit: the contributor pages, every species profile (photo credits), news articles, the home page, about, contact and photo-use. This is most of the site."
          failure="The authors cache could not be cleared. Try again in a minute."
          label="Clear authors cache"
          onSessionExpired={onSessionExpired}
          run={async () => {
            await clearAuthorsCache();
            return "Authors cache cleared.";
          }}
          title="Clear the whole authors cache?"
        />
      }
      columns={columns}
      noun="authors"
      onQuery={setQuery}
      onReload={reload}
      rowKey="id"
      rows={visible}
      searchPlaceholder="Name or id"
      status={status}
      title="Authors"
      total={authors.length}
    />
  );
}
