import type { ColumnsType } from "antd/es/table";

import {
  Button,
  message,
  Popconfirm,
  Segmented,
  Space,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";

import { AdminLink } from "./AdminLink";
import { AdminListView } from "./AdminListView";
import { SessionExpiredError } from "./adminResponse";
import {
  type AdminDraft,
  DRAFT_STATUS_COLORS,
  DraftDecisionError,
  type DraftMergeResult,
  type DraftStatus,
  fetchDrafts,
  isStale,
  mergeDrafts,
} from "./drafts";
import { type PagedQuery } from "./pagination";
import { serverPaging, usePagedList } from "./usePagedList";

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
  const list = usePagedList(
    (query: PagedQuery<object>) => fetchDrafts({ ...query, status }),
    onSessionExpired,
  );
  const [messages, contextHolder] = message.useMessage();
  const [selected, setSelected] = useState<number[]>([]);
  const [merging, setMerging] = useState(false);

  async function mergeSelected() {
    setMerging(true);
    try {
      const { results, revalidated } = await mergeDrafts(
        selected.toSorted((a, b) => a - b),
      );
      const failed = results.filter(
        (result): result is Extract<DraftMergeResult, { status: "failed" }> =>
          result.status === "failed",
      );
      const merged = results.length - failed.length;
      void messages.success(`Merged ${merged} of ${results.length} drafts.`);
      if (failed.length > 0) {
        void messages.warning(
          `Not merged: ${failed.map((result) => `#${result.draftId} (${result.message})`).join(", ")}`,
        );
      }
      if (!revalidated) {
        void messages.warning(
          "The site cache could not be cleared. Use Clear species cache.",
        );
      }
      setSelected([]);
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      void messages.error(
        error instanceof DraftDecisionError
          ? error.message
          : "The request failed. Try again in a minute.",
      );
    } finally {
      setMerging(false);
      list.reload();
    }
  }

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
    <>
      {contextHolder}
      <AdminListView<AdminDraft>
        actions={
          <>
            <Segmented<DraftStatus>
              onChange={onStatus}
              options={STATUSES}
              value={status}
            />
            {status === "pending" ? (
              <Popconfirm
                description="Each draft is saved as a new version, then the species pages on reptiles.ge are refreshed."
                okText="Merge"
                onConfirm={mergeSelected}
                title={`Merge ${selected.length} drafts?`}
              >
                <Button
                  disabled={selected.length === 0 || merging}
                  loading={merging}
                  type="primary"
                >
                  Merge selected ({selected.length})
                </Button>
              </Popconfirm>
            ) : null}
          </>
        }
        columns={columns}
        noun="drafts"
        onQuery={list.setSearch}
        onReload={list.reload}
        paging={serverPaging(list)}
        rowKey="id"
        rows={list.items}
        rowSelection={
          status === "pending"
            ? {
                getCheckboxProps: (draft) => ({
                  disabled: isStale(draft, draft.speciesVersion),
                }),
                onChange: (keys) => setSelected(keys.map(Number)),
                preserveSelectedRowKeys: true,
                selectedRowKeys: selected,
              }
            : undefined
        }
        searchPlaceholder="Species, summary or author"
        status={list.status}
        title="Drafts"
        total={list.total}
      />
    </>
  );
}
