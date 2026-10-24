import type { ColumnsType } from "antd/es/table";

import { Segmented, Space, Tag, Typography } from "antd";
import { useMemo, useState } from "react";

import { AdminLink } from "./AdminLink";
import { AdminListView } from "./AdminListView";
import {
  type AdminDraft,
  DRAFT_STATUS_COLORS,
  type DraftStatus,
  fetchDrafts,
  isStale,
} from "./drafts";
import { includesQuery, useAdminList } from "./useAdminList";

const STATUSES: DraftStatus[] = ["pending", "approved", "rejected"];

export function DraftsPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const [status, setStatus] = useState<DraftStatus>("pending");
  return (
    <DraftsList
      key={status}
      onSessionExpired={onSessionExpired}
      onStatus={setStatus}
      status={status}
    />
  );
}

function DraftsList({
  onSessionExpired,
  onStatus,
  status,
}: {
  onSessionExpired: () => void;
  onStatus: (status: DraftStatus) => void;
  status: DraftStatus;
}) {
  const {
    items: drafts,
    reload,
    status: loadStatus,
  } = useAdminList(() => fetchDrafts(status), onSessionExpired);
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      drafts.filter((draft) =>
        includesQuery(
          [
            draft.speciesId,
            draft.commonName,
            draft.scientificName,
            draft.summary,
            draft.actor,
          ],
          query,
        ),
      ),
    [drafts, query],
  );

  const columns: ColumnsType<AdminDraft> = [
    {
      dataIndex: "id",
      key: "id",
      render: (id: number) => (
        <AdminLink path={`/drafts/${id}`}>#{id}</AdminLink>
      ),
      title: "Draft",
      width: 80,
    },
    {
      key: "species",
      render: (_, draft) => (
        <Space orientation="vertical" size={0}>
          <AdminLink path={`/drafts/${draft.id}`} strong>
            {draft.commonName}
          </AdminLink>
          <Typography.Text type="secondary">
            <i>{draft.scientificName}</i> · {draft.speciesId}
          </Typography.Text>
        </Space>
      ),
      title: "Species",
    },
    { dataIndex: "summary", key: "summary", title: "Summary" },
    {
      key: "by",
      render: (_, draft) => (
        <Space size={4}>
          <Tag>{draft.source}</Tag>
          {draft.actor}
        </Space>
      ),
      title: "Proposed by",
    },
    {
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => new Date(value).toLocaleString(),
      title: "Created",
    },
    status === "pending"
      ? {
          key: "state",
          render: (_, draft) =>
            isStale(draft, draft.speciesVersion) ? (
              <Tag color="red">
                stale · v{draft.baseVersion} → v{draft.speciesVersion}
              </Tag>
            ) : (
              <Tag color="blue">ready · v{draft.baseVersion}</Tag>
            ),
          title: "State",
        }
      : {
          key: "decided",
          render: (_, draft) => (
            <Space size={4}>
              <Tag color={DRAFT_STATUS_COLORS[draft.status]}>
                {draft.status}
              </Tag>
              {draft.decidedBy}
              {draft.decidedAt ? (
                <Typography.Text type="secondary">
                  {new Date(draft.decidedAt).toLocaleString()}
                </Typography.Text>
              ) : null}
            </Space>
          ),
          title: "Decision",
        },
  ];

  return (
    <AdminListView<AdminDraft>
      actions={
        <Segmented<DraftStatus>
          onChange={onStatus}
          options={STATUSES}
          value={status}
        />
      }
      columns={columns}
      noun="drafts"
      onQuery={setQuery}
      onReload={reload}
      rowKey="id"
      rows={visible}
      searchPlaceholder="Species, summary or author"
      status={loadStatus}
      title="Drafts"
      total={drafts.length}
    />
  );
}
