import type { ColumnsType } from "antd/es/table";

import { Segmented, Tag, Typography } from "antd";

import type { ContentViewKind } from "@/lib/contentViewInput";

import { AdminListView, type ServerPaging } from "./AdminListView";
import { nameColumn } from "./listColumns";
import { usePagedList } from "./usePagedList";
import {
  type AdminView,
  type AdminViewFilters,
  type AdminViewPeriod,
  fetchAdminViews,
} from "./views";

type Period = "all" | `${AdminViewPeriod}`;

type ViewRow = AdminView & { key: string };

const KINDS: ContentViewKind[] = ["species", "news"];

const PERIODS: Array<{ label: string; value: Period }> = [
  { label: "Today", value: "1" },
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
  { label: "All time", value: "all" },
];

export function ViewsPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const {
    items,
    lastPage,
    query,
    reload,
    setFilters,
    setPage,
    setSearch,
    status,
    total,
  } = usePagedList(fetchAdminViews, onSessionExpired);

  const paging: ServerPaging = {
    limit: query.limit,
    onChange: ({ filters, limit, page }) => {
      const kind = filters.kind?.[0] as AdminViewFilters["kind"] | undefined;
      if (kind !== query.kind) setFilters({ kind });
      else setPage(page, limit);
    },
    page: query.page,
  };

  const columns: ColumnsType<ViewRow> = [
    nameColumn<ViewRow>("Page", (item) => `/${item.kind}/${item.id}`),
    {
      dataIndex: "kind",
      filteredValue: query.kind ? [query.kind] : null,
      filterMultiple: false,
      filters: KINDS.map((kind) => ({ text: kind, value: kind })),
      key: "kind",
      render: (kind: ContentViewKind) => (
        <Tag color={kind === "news" ? "blue" : "green"}>{kind}</Tag>
      ),
      title: "Kind",
    },
    {
      align: "right",
      dataIndex: "views",
      key: "views",
      render: (views: number) => views.toLocaleString("en"),
      title: "Views",
    },
    {
      dataIndex: "lastDay",
      key: "lastDay",
      title: "Last viewed",
    },
  ];

  return (
    <AdminListView<ViewRow>
      actions={
        <>
          <Segmented<Period>
            onChange={(value) =>
              setFilters({
                days:
                  value === "all"
                    ? undefined
                    : (Number(value) as AdminViewPeriod),
              })
            }
            options={PERIODS}
            value={query.days ? `${query.days}` : "all"}
          />
          <Typography.Text type="secondary">
            {(lastPage?.views ?? 0).toLocaleString("en")} views
          </Typography.Text>
        </>
      }
      columns={columns}
      noun="pages"
      onQuery={setSearch}
      onReload={reload}
      paging={paging}
      rowKey="key"
      rows={items.map((item) => ({ ...item, key: `${item.kind}:${item.id}` }))}
      searchPlaceholder="Name or id"
      status={status}
      title="Views"
      total={total}
    />
  );
}
