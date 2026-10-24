import type { ColumnsType } from "antd/es/table";

import { Space, Tag, Typography } from "antd";

import { newsSeriesIds } from "@/data/newsSeries";

import { AdminLink } from "./AdminLink";
import { AdminListView } from "./AdminListView";
import { ClearCacheButton } from "./ClearCacheButton";
import {
  imageColumn,
  photoCountColumn,
  revisionColumns,
  serverFilter,
} from "./listColumns";
import {
  type AdminNews,
  type AdminNewsFilters,
  clearNewsCache,
  clearNewsSectionCache,
  fetchAdminNews,
} from "./news";
import { serverPaging, usePagedList } from "./usePagedList";

const STATUS_COLORS: Record<AdminNews["status"], string> = {
  draft: "gold",
  published: "green",
};

export function NewsPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const list = usePagedList(fetchAdminNews, onSessionExpired);
  const { query } = list;
  const paging = serverPaging(list, (filters) => ({
    series: filters.series?.[0] as AdminNewsFilters["series"] | undefined,
    status: filters.status?.[0] as AdminNewsFilters["status"] | undefined,
  }));

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
      ...serverFilter(query.status, Object.keys(STATUS_COLORS)),
      key: "status",
      render: (value: AdminNews["status"]) => (
        <Tag color={STATUS_COLORS[value]}>{value}</Tag>
      ),
      title: "Status",
    },
    {
      dataIndex: "publishedAt",
      key: "publishedAt",
      title: "Published",
    },
    {
      dataIndex: "series",
      ...serverFilter(query.series, newsSeriesIds),
      key: "series",
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
      onQuery={list.setSearch}
      onReload={list.reload}
      paging={paging}
      rowKey="id"
      rows={list.items}
      searchPlaceholder="Title or slug"
      status={list.status}
      title="News"
      total={list.total}
    />
  );
}
