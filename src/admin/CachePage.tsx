import type { ColumnsType } from "antd/es/table";

import { Space, Tag, Typography } from "antd";
import { useMemo, useState } from "react";

import { AdminListView } from "./AdminListView";
import { ClearCacheButton } from "./ClearCacheButton";
import { clearPageGroupCache, fetchPageGroups, type PageGroup } from "./site";
import { includesQuery, useAdminList } from "./useAdminList";

const WHOLE_SITE = "site";

export function CachePage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const {
    items: groups,
    reload,
    status,
  } = useAdminList(fetchPageGroups, onSessionExpired);
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      groups.filter((group) =>
        includesQuery([group.id, group.label, group.description], query),
      ),
    [groups, query],
  );

  const columns: ColumnsType<PageGroup> = [
    {
      key: "group",
      render: (_, group) => (
        <Space orientation="vertical" size={0}>
          <Typography.Text strong>{group.label}</Typography.Text>
          <Typography.Text type="secondary">
            {group.description}
          </Typography.Text>
        </Space>
      ),
      title: "Pages",
    },
    {
      dataIndex: "routes",
      key: "routes",
      render: (routes: PageGroup["routes"]) => (
        <Space size={4} wrap>
          {routes.map((route) => (
            <Tag key={route.path}>
              {route.path}
              {route.type === "layout" ? " (all pages under it)" : ""}
            </Tag>
          ))}
        </Space>
      ),
      title: "Routes",
    },
    {
      fixed: "right",
      key: "actions",
      render: (_, group) => (
        <ClearCacheButton
          danger={group.id === WHOLE_SITE}
          description={
            group.id === WHOLE_SITE
              ? "Every page on reptiles.ge renders fresh on its next visit, in every language. The first visits after this are slow until the cache fills again."
              : `${group.description} These pages render fresh on their next visit, in every language.`
          }
          failure="The cache could not be cleared. Try again in a minute."
          label="Clear cache"
          onSessionExpired={onSessionExpired}
          run={async () => {
            await clearPageGroupCache(group.id);
            return `Cache cleared: ${group.label}.`;
          }}
          size="small"
          title={`Clear the cache of ${group.label}?`}
        />
      ),
      title: "Actions",
      width: 140,
    },
  ];

  return (
    <AdminListView<PageGroup>
      columns={columns}
      noun="page groups"
      onQuery={setQuery}
      onReload={reload}
      rowKey="id"
      rows={visible}
      searchPlaceholder="Page or section"
      status={status}
      title="Cache"
      total={groups.length}
    />
  );
}
