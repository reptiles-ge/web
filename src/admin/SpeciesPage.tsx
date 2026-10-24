import type { ColumnsType } from "antd/es/table";

import { Badge, Space, Tag, Typography } from "antd";
import { useMemo, useState } from "react";

import { AdminLink } from "./AdminLink";
import { AdminListView } from "./AdminListView";
import { ClearCacheButton } from "./ClearCacheButton";
import { imageColumn, photoCountColumn, revisionColumns } from "./listColumns";
import { clearSiteCache } from "./site";
import {
  type AdminSpecies,
  clearSpeciesCache,
  fetchAdminSpecies,
  SPECIES_STATUS_COLORS,
} from "./species";
import { includesQuery, unique, useAdminList } from "./useAdminList";

export function SpeciesPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const {
    items: species,
    reload,
    status,
  } = useAdminList(fetchAdminSpecies, onSessionExpired);
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      species.filter((item) =>
        includesQuery(
          [
            item.id,
            item.scientificName,
            item.commonName.ka,
            item.commonName.en ?? "",
          ],
          query,
        ),
      ),
    [species, query],
  );

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
      sorter: (a, b) => a.scientificName.localeCompare(b.scientificName),
      title: "Species",
    },
    {
      dataIndex: "group",
      filters: unique(species.map((item) => item.group)).map((group) => ({
        text: group,
        value: group,
      })),
      key: "group",
      onFilter: (value, item) => item.group === value,
      render: (group: string) => <Tag>{group}</Tag>,
      title: "Group",
    },
    {
      dataIndex: "status",
      filters: unique(species.map((item) => item.status)).map((status) => ({
        text: status,
        value: status,
      })),
      key: "status",
      onFilter: (value, item) => item.status === value,
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
      sorter: (a, b) => a.pendingDrafts - b.pendingDrafts,
      title: "Drafts",
    },
    ...revisionColumns<AdminSpecies>(),
    {
      fixed: "right",
      key: "actions",
      render: (_, item) => (
        <ClearCacheButton
          description="This species' profile pages on reptiles.ge render fresh on their next visit, in every language. Hubs, lists and cards are not cleared."
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
      onQuery={setQuery}
      onReload={reload}
      rowKey="id"
      rows={visible}
      searchPlaceholder="Name, scientific name or id"
      status={status}
      title="Species"
      total={species.length}
    />
  );
}
