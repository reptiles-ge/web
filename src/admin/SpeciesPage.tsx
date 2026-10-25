import type { ColumnsType } from "antd/es/table";

import { Badge, Space, Tag, Typography } from "antd";

import { ANIMAL_GROUPS } from "@/lib/animalGroups";

import { AdminLink } from "./AdminLink";
import { AdminListView } from "./AdminListView";
import { ClearCacheButton } from "./ClearCacheButton";
import {
  imageColumn,
  photoCountColumn,
  revisionColumns,
  serverFilter,
} from "./listColumns";
import { clearSiteCache } from "./site";
import {
  type AdminSpecies,
  type AdminSpeciesFilters,
  clearSpeciesCache,
  fetchAdminSpecies,
  SPECIES_STATUS_COLORS,
} from "./species";
import { serverPaging, usePagedList } from "./usePagedList";

const STATUSES = Object.keys(SPECIES_STATUS_COLORS);

export function SpeciesPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const list = usePagedList(fetchAdminSpecies, onSessionExpired);
  const { query } = list;
  const paging = serverPaging(list, (filters) => ({
    group: filters.group?.[0] as AdminSpeciesFilters["group"] | undefined,
    status: filters.status?.[0] as AdminSpeciesFilters["status"] | undefined,
  }));

  const columns: ColumnsType<AdminSpecies> = [
    imageColumn<AdminSpecies>("Photo"),
    {
      key: "name",
      render: (_, item) => (
        <Space orientation="vertical" size={0}>
          <AdminLink path={`/species/${item.id}`} strong>
            {item.commonName.ka}
          </AdminLink>
          <Typography.Text type="secondary">
            {item.commonName.en ?? "—"} · <i>{item.scientificName}</i>
          </Typography.Text>
          <Typography.Text style={{ fontSize: 12 }} type="secondary">
            {item.id}
          </Typography.Text>
        </Space>
      ),
      title: "Species",
    },
    {
      dataIndex: "group",
      ...serverFilter(query.group, ANIMAL_GROUPS),
      key: "group",
      render: (group: string) => <Tag>{group}</Tag>,
      title: "Group",
    },
    {
      dataIndex: "status",
      ...serverFilter(query.status, STATUSES),
      key: "status",
      render: (status: AdminSpecies["status"]) => (
        <Tag color={SPECIES_STATUS_COLORS[status]}>{status}</Tag>
      ),
      title: "Status",
    },
    {
      dataIndex: "danger",
      key: "danger",
      render: (danger: null | string) => danger ?? "—",
      title: "Danger",
    },
    photoCountColumn(),
    {
      align: "right",
      dataIndex: "pendingDrafts",
      key: "pendingDrafts",
      render: (count: number) =>
        count ? <Badge count={count} /> : <Typography.Text>0</Typography.Text>,
      title: "Drafts",
    },
    ...revisionColumns<AdminSpecies>(),
    {
      fixed: "right",
      key: "actions",
      render: (_, item) => (
        <ClearCacheButton
          description="This species' profile pages, and the hubs, lists and cards that show it, render fresh on reptiles.ge on their next visit, in every language."
          failure="The species cache could not be cleared. Try again in a minute."
          label="Clear cache"
          onSessionExpired={onSessionExpired}
          run={async () => {
            await clearSpeciesCache(item.id);
            return `Cache cleared for ${item.id}.`;
          }}
          size="small"
          title="Clear this species' cache?"
        />
      ),
      title: "Actions",
    },
  ];

  return (
    <AdminListView<AdminSpecies>
      actions={
        <ClearCacheButton
          description="Every species page on reptiles.ge renders fresh on its next visit: profiles, hubs, lists and cards. Species edited in the last 24 hours are refetched from the API. This is most of the site."
          failure="The species cache could not be cleared. Try again in a minute."
          label="Clear species cache"
          onSessionExpired={onSessionExpired}
          run={async () => {
            const species = await clearSiteCache();
            return species.length === 0
              ? "Species cache cleared."
              : `Species cache cleared. ${species.length} recently edited species refetched.`;
          }}
          title="Clear the whole species cache?"
        />
      }
      columns={columns}
      noun="species"
      onQuery={list.setSearch}
      onReload={list.reload}
      paging={paging}
      rowKey="id"
      rows={list.items}
      searchPlaceholder="Name, scientific name or id"
      status={list.status}
      title="Species"
      total={list.total}
    />
  );
}
