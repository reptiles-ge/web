import type { ColumnsType } from "antd/es/table";

import { Segmented, Tag, Typography } from "antd";

import type { ContentViewKind } from "@/lib/contentViewInput";

import { AdminListView } from "./AdminListView";
import { nameColumn, serverFilter } from "./listColumns";
import { serverPaging, usePagedList } from "./usePagedList";
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
  const list = usePagedList(fetchAdminViews, onSessionExpired);
  const { items, lastPage, query, setFilters } = list;
  const paging = serverPaging(list, (filters) => ({
    kind: filters.kind?.[0] as AdminViewFilters["kind"] | undefined,
  }));

  const columns: ColumnsType<ViewRow> = [
    nameColumn<ViewRow>("Page", (item) => `/${item.kind}/${item.id}`),
    {
      dataIndex: "kind",
      ...serverFilter(query.kind, KINDS),
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
      onQuery={list.setSearch}
      onReload={list.reload}
      paging={paging}
      rowKey="key"
      rows={items.map((item) => ({ ...item, key: `${item.kind}:${item.id}` }))}
      searchPlaceholder="Name or id"
      status={list.status}
      title="Views"
      total={list.total}
    />
  );
}
