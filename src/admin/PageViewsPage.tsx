import type { ColumnsType } from "antd/es/table";

import { Typography } from "antd";

import { locales } from "@/i18n/locales";

import { AdminListView } from "./AdminListView";
import { serverPaging, usePagedList } from "./usePagedList";
import { LangSelect, PeriodSwitch } from "./ViewFilters";
import { VIEW_PERIODS } from "./viewPeriods";
import { type AdminPageView, fetchAdminPageViews } from "./views";

const COLUMNS: ColumnsType<AdminPageView> = [
  {
    dataIndex: "path",
    key: "path",
    render: (path: string) => <Typography.Text code>{path}</Typography.Text>,
    title: "Page",
  },
  {
    align: "right",
    dataIndex: "views",
    key: "views",
    render: (views: number) => views.toLocaleString("en"),
    title: "Views",
  },
  { dataIndex: "lastDay", key: "lastDay", title: "Last viewed" },
];

export function PageViewsPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const list = usePagedList(fetchAdminPageViews, onSessionExpired, {
    days: VIEW_PERIODS,
    lang: locales,
  });
  const { items, lastPage, query, setFilters } = list;

  return (
    <AdminListView<AdminPageView>
      actions={
        <>
          <LangSelect
            onChange={(lang) => setFilters({ lang })}
            value={query.lang}
          />
          <PeriodSwitch
            onChange={(days) => setFilters({ days })}
            value={query.days}
          />
          <Typography.Text type="secondary">
            {(lastPage?.views ?? 0).toLocaleString("en")} views
          </Typography.Text>
        </>
      }
      columns={COLUMNS}
      noun="pages"
      onQuery={list.setSearch}
      onReload={list.reload}
      paging={serverPaging(list)}
      rowKey="path"
      rows={items}
      search={list.search}
      searchPlaceholder="Path"
      status={list.status}
      title="Page views"
      total={list.total}
    />
  );
}
