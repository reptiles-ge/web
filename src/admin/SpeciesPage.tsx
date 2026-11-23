import type { ColumnsType } from "antd/es/table";

import {
  Badge,
  Button,
  message,
  Popconfirm,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";

import { ANIMAL_GROUPS } from "@/lib/animalGroups";

import { AdminLink } from "./AdminLink";
import { AdminListView } from "./AdminListView";
import { SessionExpiredError } from "./adminResponse";
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
  setSpeciesStatuses,
  SPECIES_STATUS_COLORS,
  type SpeciesStatusResult,
} from "./species";
import { serverPaging, usePagedList } from "./usePagedList";

const STATUSES = Object.keys(
  SPECIES_STATUS_COLORS,
) as AdminSpeciesFilters["status"][];

export function SpeciesPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const list = usePagedList(fetchAdminSpecies, onSessionExpired, {
    group: ANIMAL_GROUPS,
    status: STATUSES,
  });
  const { query } = list;
  const paging = serverPaging(list, (filters) => ({
    group: filters.group?.[0] as AdminSpeciesFilters["group"] | undefined,
    status: filters.status?.[0] as AdminSpeciesFilters["status"] | undefined,
  }));

  const [messages, contextHolder] = message.useMessage();
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [target, setTarget] = useState<AdminSpecies["status"]>("published");
  const [saving, setSaving] = useState(false);
  const selectedIds = Object.keys(selected);

  async function applyStatus() {
    setSaving(true);
    try {
      const results = await setSpeciesStatuses(
        Object.entries(selected).map(([id, expectedVersion]) => ({
          expectedVersion,
          id,
        })),
        target,
      );
      const failed = results.filter(
        (
          result,
        ): result is Extract<SpeciesStatusResult, { status: "failed" }> =>
          result.status === "failed",
      );
      void messages.success(
        `Set ${results.length - failed.length} of ${results.length} species to ${target}. Clear the species cache when you are done.`,
      );
      if (failed.length > 0) {
        void messages.warning(
          `Not changed: ${failed.map((result) => `${result.id} (${result.message})`).join(", ")}`,
        );
      }
      setSelected({});
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      void messages.error(
        error instanceof Error
          ? error.message
          : "The request failed. Try again in a minute.",
      );
    } finally {
      setSaving(false);
      list.reload();
    }
  }

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
    <>
      {contextHolder}
      <AdminListView<AdminSpecies>
        actions={
          <>
            <Select
              aria-label="New status"
              onChange={setTarget}
              options={STATUSES.map((status) => ({
                label: status,
                value: status,
              }))}
              style={{ width: 130 }}
              value={target}
            />
            <Popconfirm
              description="Each species is saved as a new version. The cache is not cleared: press Clear species cache when you are done."
              okText="Set status"
              onConfirm={() => void applyStatus()}
              title={`Set ${selectedIds.length} species to ${target}?`}
            >
              <Button
                disabled={selectedIds.length === 0 || saving}
                loading={saving}
                type="primary"
              >
                Set status ({selectedIds.length})
              </Button>
            </Popconfirm>
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
          </>
        }
        columns={columns}
        noun="species"
        onQuery={list.setSearch}
        onReload={list.reload}
        paging={paging}
        rowKey="id"
        rows={list.items}
        rowSelection={{
          onChange: (keys) => {
            const versions = new Map(
              list.items.map((item) => [item.id, item.version]),
            );
            setSelected((previous) =>
              Object.fromEntries(
                keys.map((key) => {
                  const id = String(key);
                  return [id, versions.get(id) ?? previous[id]!];
                }),
              ),
            );
          },
          preserveSelectedRowKeys: true,
          selectedRowKeys: selectedIds,
        }}
        search={list.search}
        searchPlaceholder="Name, scientific name or id"
        status={list.status}
        title="Species"
        total={list.total}
      />
    </>
  );
}
