import type { ColumnsType } from "antd/es/table";

import { Tag, Typography } from "antd";

import type { ContentViewKind } from "@/lib/contentViewInput";

import { AdminListView } from "./AdminListView";
import { nameColumn, serverFilter } from "./listColumns";
import { serverPaging, usePagedList } from "./usePagedList";
import { DateRangeFilter } from "./ViewFilters";
import { VIEW_RANGE_URL } from "./viewRange";
import {
  type AdminView,
  type AdminViewFilters,
  fetchAdminViews,
} from "./views";

type ViewRow = AdminView & { key: string };

const KINDS: ContentViewKind[] = ["species", "news"];

export function ViewsPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const list = usePagedList(fetchAdminViews, onSessionExpired, {
    ...VIEW_RANGE_URL,
    kind: KINDS,
  });
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
          <DateRangeFilter onChange={setFilters} value={query} />
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
      search={list.search}
      searchPlaceholder="Name or id"
      status={list.status}
      title="Views"
      total={list.total}
    />
  );
}
