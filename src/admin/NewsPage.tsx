import type { ColumnsType } from "antd/es/table";

import { Space, Tag, Typography } from "antd";
import { useMemo, useState } from "react";

import { AdminLink } from "./AdminLink";
import { AdminListView } from "./AdminListView";
import { ClearCacheButton } from "./ClearCacheButton";
import { imageColumn, photoCountColumn, revisionColumns } from "./listColumns";
import {
  type AdminNews,
  clearNewsCache,
  clearNewsSectionCache,
  fetchAdminNews,
} from "./news";
import { includesQuery, unique, useAdminList } from "./useAdminList";

const STATUS_COLORS: Record<AdminNews["status"], string> = {
  draft: "gold",
  published: "green",
};

export function NewsPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const {
    items: news,
    reload,
    status,
  } = useAdminList(fetchAdminNews, onSessionExpired);
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      news.filter((item) =>
        includesQuery(
          [item.id, item.title.ka ?? "", item.title.en ?? ""],
          query,
        ),
      ),
    [news, query],
  );

  const columns: ColumnsType<AdminNews> = [
    imageColumn<AdminNews>("Cover"),
    {
      key: "title",
      render: (_, item) => (
        <Space orientation="vertical" size={0}>
          <AdminLink path={`/news/${item.id}`} strong>
            {item.title.ka ?? item.id}
          </AdminLink>
          <Typography.Text type="secondary">
            {item.title.en ?? "—"}
          </Typography.Text>
          <Typography.Text style={{ fontSize: 12 }} type="secondary">
            {item.id}
          </Typography.Text>
        </Space>
      ),
      title: "Article",
    },
    {
      dataIndex: "status",
      filters: unique(news.map((item) => item.status)).map((value) => ({
        text: value,
        value,
      })),
      key: "status",
      onFilter: (value, item) => item.status === value,
      render: (value: AdminNews["status"]) => (
        <Tag color={STATUS_COLORS[value]}>{value}</Tag>
      ),
      title: "Status",
    },
    {
      dataIndex: "publishedAt",
      key: "publishedAt",
      sorter: (a, b) => a.publishedAt.localeCompare(b.publishedAt),
      title: "Published",
    },
    {
      dataIndex: "series",
      filters: unique(
        news.flatMap((item) => (item.series ? [item.series] : [])),
      ).map((value) => ({ text: value, value })),
      key: "series",
      onFilter: (value, item) => item.series === value,
      render: (value: null | string) => (value ? <Tag>{value}</Tag> : "—"),
      title: "Series",
    },
    {
      dataIndex: "locales",
      key: "locales",
      render: (locales: string[]) => (
        <Space size={4} wrap>
          {locales.map((locale) => (
            <Tag key={locale}>{locale}</Tag>
          ))}
        </Space>
      ),
      title: "Locales",
    },
    photoCountColumn(),
    ...revisionColumns<AdminNews>(),
    {
      fixed: "right",
      key: "actions",
      render: (_, item) => (
        <ClearCacheButton
          description="This article's pages on reptiles.ge render fresh on their next visit, in every language. News lists are not cleared."
          failure="The article cache could not be cleared. Try again in a minute."
          label="Clear cache"
          onSessionExpired={onSessionExpired}
          run={async () => {
            await clearNewsCache(item.id);
            return `Cache cleared for ${item.id}.`;
          }}
          size="small"
          title="Clear this article's cache?"
        />
      ),
      title: "Actions",
    },
  ];

  return (
    <AdminListView<AdminNews>
      actions={
        <ClearCacheButton
          description="Every news page on reptiles.ge renders fresh on its next visit: the news index, the archive pages and all articles, in every language. The home page and other pages that list news change only on deploy."
          failure="The news cache could not be cleared. Try again in a minute."
          label="Clear news cache"
          onSessionExpired={onSessionExpired}
          run={async () => {
            await clearNewsSectionCache();
            return "News cache cleared.";
          }}
          title="Clear the whole news cache?"
        />
      }
      columns={columns}
      noun="articles"
      onQuery={setQuery}
      onReload={reload}
      rowKey="id"
      rows={visible}
      searchPlaceholder="Title or slug"
      status={status}
      title="News"
      total={news.length}
    />
  );
}
