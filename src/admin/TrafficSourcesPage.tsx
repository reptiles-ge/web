import type { ColumnsType } from "antd/es/table";

import { Button, Flex, Select, Tag, Typography } from "antd";

import { locales } from "@/i18n/locales";
import {
  TRAFFIC_SOURCE_IDS,
  type TrafficChannel,
  trafficChannel,
  type TrafficSourceId,
} from "@/lib/trafficSource";

import { AdminListView } from "./AdminListView";
import { countryLabel } from "./countryLabel";
import { serverPaging, usePagedList } from "./usePagedList";
import { DateRangeFilter, LangSelect } from "./ViewFilters";
import { VIEW_RANGE_URL } from "./viewRange";
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
    dataIndex: "country",
    key: "country",
    render: (country: null | string) => countryLabel(country),
    title: "Country",
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
    ...VIEW_RANGE_URL,
    country: readCountry,
    lang: locales,
    source: TRAFFIC_SOURCE_IDS,
  });
  const { items, lastPage, query, setFilters } = list;
  const visits = lastPage?.visits ?? 0;

  const sourceButtons = lastPage?.sources ?? [];
  const selectedMissing =
    query.source !== undefined &&
    !sourceButtons.some((row) => row.source === query.source);

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
          <Select<string>
            aria-label="Country"
            onChange={(next) =>
              setFilters({ country: next === "all" ? undefined : next })
            }
            options={countryOptions(lastPage?.countries ?? [], query.country)}
            popupMatchSelectWidth={false}
            showSearch={{ optionFilterProp: "label" }}
            style={{ width: 200 }}
            value={query.country ?? "all"}
          />
          <DateRangeFilter onChange={setFilters} value={query} />
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
        key: `${item.source}:${item.referrer ?? ""}:${item.path}:${item.country ?? ""}`,
      }))}
      search={list.search}
      searchPlaceholder="Referrer or page"
      status={list.status}
      summary={
        <Flex gap="small" wrap>
          {selectedMissing && query.source ? (
            <Button
              aria-pressed
              onClick={() => pick(query.source)}
              type="primary"
            >
              <SourceTag
                channel={trafficChannel(query.source)}
                source={query.source}
              />
              0 · 0%
            </Button>
          ) : null}
          {sourceButtons.map((row) => (
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

function countryOptions(
  countries: ReadonlyArray<{ country: null | string; visits: number }>,
  selected: string | undefined,
) {
  const known = countries.filter(
    (row): row is { country: string; visits: number } => row.country !== null,
  );
  const missing =
    selected && !known.some((row) => row.country === selected)
      ? [{ country: selected, visits: 0 }]
      : [];
  return [
    { label: "All countries", value: "all" },
    ...[...missing, ...known].map((row) => ({
      label: `${countryLabel(row.country)} · ${row.visits.toLocaleString("en")}`,
      value: row.country,
    })),
  ];
}

function readCountry(value: string) {
  return /^[A-Z]{2}$/.test(value) ? value : undefined;
}
