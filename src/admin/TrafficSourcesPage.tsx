import type { ColumnsType } from "antd/es/table";

import { Button, Flex, Tag, Typography } from "antd";

import { locales } from "@/i18n/locales";
import {
  TRAFFIC_SOURCE_IDS,
  type TrafficChannel,
  type TrafficSourceId,
} from "@/lib/trafficSource";

import { AdminListView } from "./AdminListView";
import { serverPaging, usePagedList } from "./usePagedList";
import { LangSelect, PeriodSwitch } from "./ViewFilters";
import { VIEW_PERIODS } from "./viewPeriods";
import { type AdminTrafficSource, fetchAdminTrafficSources } from "./views";

type SourceRow = AdminTrafficSource & { key: string };

const CHANNEL_COLORS: Record<TrafficChannel, string> = {
  ai: "purple",
  direct: "default",
  email: "cyan",
  paid: "gold",
  referral: "orange",
  search: "green",
  social: "blue",
};

function SourceTag({
  channel,
  source,
}: {
  channel: TrafficChannel;
  source: string;
}) {
  return <Tag color={CHANNEL_COLORS[channel]}>{source}</Tag>;
}

const COLUMNS: ColumnsType<SourceRow> = [
  {
    key: "source",
    render: (_, row) => <SourceTag channel={row.channel} source={row.source} />,
    title: "Source",
  },
  {
    dataIndex: "channel",
    key: "channel",
    render: (channel: TrafficChannel) => (
      <Typography.Text type="secondary">{channel}</Typography.Text>
    ),
    title: "Channel",
  },
  {
    dataIndex: "referrer",
    key: "referrer",
    render: (referrer: null | string) => referrer ?? "—",
    title: "Referrer",
  },
  {
    dataIndex: "path",
    key: "path",
    render: (path: string) => <Typography.Text code>{path}</Typography.Text>,
    title: "Landing page",
  },
  {
    align: "right",
    dataIndex: "visits",
    key: "visits",
    render: (visits: number) => visits.toLocaleString("en"),
    title: "Visits",
  },
  { dataIndex: "lastDay", key: "lastDay", title: "Last visit" },
];

export function TrafficSourcesPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const list = usePagedList(fetchAdminTrafficSources, onSessionExpired, {
    days: VIEW_PERIODS,
    lang: locales,
    source: TRAFFIC_SOURCE_IDS,
  });
  const { items, lastPage, query, setFilters } = list;
  const visits = lastPage?.visits ?? 0;

  function pick(source: TrafficSourceId | undefined) {
    setFilters({ source: source === query.source ? undefined : source });
  }

  return (
    <AdminListView<SourceRow>
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
            {visits.toLocaleString("en")} visits
          </Typography.Text>
        </>
      }
      columns={COLUMNS}
      noun="sources"
      onQuery={list.setSearch}
      onReload={list.reload}
      paging={serverPaging(list)}
      rowKey="key"
      rows={items.map((item) => ({
        ...item,
        key: `${item.source}:${item.referrer ?? ""}:${item.path}`,
      }))}
      search={list.search}
      searchPlaceholder="Referrer or page"
      status={list.status}
      summary={
        <Flex gap="small" wrap>
          {(lastPage?.sources ?? []).map((row) => (
            <Button
              aria-pressed={query.source === row.source}
              key={row.source}
              onClick={() => pick(row.source as TrafficSourceId)}
              type={query.source === row.source ? "primary" : "default"}
            >
              <SourceTag channel={row.channel} source={row.source} />
              {row.visits.toLocaleString("en")} ·{" "}
              {visits ? Math.round((row.visits / visits) * 100) : 0}%
            </Button>
          ))}
        </Flex>
      }
      title="Traffic sources"
      total={list.total}
    />
  );
}
