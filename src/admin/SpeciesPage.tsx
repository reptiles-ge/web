import type { ColumnsType } from "antd/es/table";

import { Badge, Space, Tag, Typography } from "antd";
import { useMemo, useState } from "react";

import {
  AdminListView,
  imageColumn,
  includesQuery,
  photoCountColumn,
  revisionColumns,
  unique,
  useAdminList,
} from "./AdminList";
import { type AdminSpecies, fetchAdminSpecies } from "./species";

const STATUS_COLORS: Record<AdminSpecies["status"], string> = {
  draft: "gold",
  published: "green",
  unpublished: "default",
};

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
          <Typography.Text strong>{item.commonName.ka}</Typography.Text>
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
        <Tag color={STATUS_COLORS[status]}>{status}</Tag>
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
  ];

  return (
    <AdminListView<AdminSpecies>
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
