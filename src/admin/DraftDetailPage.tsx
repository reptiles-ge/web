import type { MessageInstance } from "antd/es/message/interface";
import type { ColumnsType } from "antd/es/table";

import {
  Alert,
  Button,
  Descriptions,
  message,
  Popconfirm,
  Table,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";

import { diffSpeciesRecords, type DraftChange } from "@/lib/speciesDraftDiff";

import { AdminDetailGate, AdminDetailHeader } from "./AdminDetail";
import { AdminLink } from "./AdminLink";
import { SessionExpiredError } from "./adminResponse";
import {
  type AdminDraftDetail,
  DRAFT_STATUS_COLORS,
  DraftDecisionError,
  fetchDraft,
  isStale,
  mergeDraft,
  rejectDraft,
} from "./drafts";
import { diffWords } from "./textDiff";
import { useAdminData } from "./useAdminList";

const LIST_PATH = "/drafts";

const REMOVED = { background: "#fff1f0", textDecoration: "line-through" };

const ADDED = { background: "#f6ffed" };

export function DraftDetailPage({
  id,
  onSessionExpired,
}: {
  id: string;
  onSessionExpired: () => void;
}) {
  const { data, reload, status } = useAdminData(
    () => fetchDraft(id),
    onSessionExpired,
  );
  const [messages, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <AdminDetailGate
        back={<AdminLink path={LIST_PATH}>← Drafts</AdminLink>}
        data={data}
        failure="Could not load this draft."
        id={id}
        notFoundTitle="Draft not found"
        onReload={reload}
        status={status}
      >
        {(detail) => (
          <DraftReview
            detail={detail}
            messages={messages}
            onDecided={reload}
            onReload={reload}
            onSessionExpired={onSessionExpired}
          />
        )}
      </AdminDetailGate>
    </>
  );
}

function changeColumns(before: string): ColumnsType<DraftChange> {
  return [
    {
      dataIndex: "path",
      key: "path",
      render: (path: string) => <Typography.Text code>{path}</Typography.Text>,
      title: "Field",
      width: 240,
    },
    {
      key: "before",
      render: (_, change) => <ChangeText change={change} side="before" />,
      title: before,
    },
    {
      key: "after",
      render: (_, change) => <ChangeText change={change} side="after" />,
      title: "Proposed",
    },
  ];
}

function ChangeText({
  change,
  side,
}: {
  change: DraftChange;
  side: "after" | "before";
}) {
  const text = change[side];
  if (!text) return <Typography.Text type="secondary">—</Typography.Text>;
  if (!change.before || !change.after) {
    return <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>;
  }
  const hidden = side === "before" ? "added" : "removed";
  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {diffWords(change.before, change.after)
        .filter((part) => part.kind !== hidden)
        .map((part, index) =>
          part.kind === "same" ? (
            <span key={index}>{part.text}</span>
          ) : (
            <span key={index} style={part.kind === "added" ? ADDED : REMOVED}>
              {part.text}
            </span>
          ),
        )}
    </span>
  );
}

function DraftReview({
  detail: { current, draft },
  messages,
  onDecided,
  onReload,
  onSessionExpired,
}: {
  detail: AdminDraftDetail;
  messages: MessageInstance;
  onDecided: () => void;
  onReload: () => void;
  onSessionExpired: () => void;
}) {
  const [pending, setPending] = useState<"merge" | "reject" | null>(null);
  const base = draft.baseRecord;
  const changes = diffSpeciesRecords(base ?? current.record, draft.record);
  const open = draft.status === "pending";
  const stale = open && isStale(draft, current.version);

  async function decide(action: "merge" | "reject") {
    setPending(action);
    try {
      if (action === "merge") {
        const result = await mergeDraft(draft.id);
        if (result.revalidated) {
          void messages.success(
            `Merged as version ${result.version}. The species page is refreshed.`,
          );
        } else {
          void messages.warning(
            `Merged as version ${result.version}, but the site cache could not be cleared. Use Clear cache on the species.`,
          );
        }
      } else {
        await rejectDraft(draft.id);
        void messages.success("Draft rejected.");
      }
      onDecided();
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
      setPending(null);
    }
  }

  return (
    <>
      <AdminDetailHeader
        actions={
          <>
            <Button onClick={onReload}>Reload</Button>
            {open ? (
              <>
                <Popconfirm
                  description="The species keeps its live text and photos."
                  okButtonProps={{ danger: true }}
                  okText="Reject"
                  onConfirm={() => decide("reject")}
                  title="Reject this draft?"
                >
                  <Button
                    danger
                    disabled={pending !== null}
                    loading={pending === "reject"}
                  >
                    Reject
                  </Button>
                </Popconfirm>
                <Popconfirm
                  description="The change is saved as a new version and the species page on reptiles.ge is refreshed."
                  okText="Merge"
                  onConfirm={() => decide("merge")}
                  title="Merge this draft?"
                >
                  <Button
                    disabled={stale || changes.length === 0 || pending !== null}
                    loading={pending === "merge"}
                    type="primary"
                  >
                    Merge
                  </Button>
                </Popconfirm>
              </>
            ) : null}
          </>
        }
        subtitle={
          <>
            <i>{current.record.base.scientificName}</i> ·{" "}
            <AdminLink path={`/species/${draft.speciesId}`}>
              {draft.speciesId}
            </AdminLink>
          </>
        }
        tags={
          <>
            <Tag color={DRAFT_STATUS_COLORS[draft.status]}>{draft.status}</Tag>
            <Tag>{draft.source}</Tag>
            <Tag>draft #{draft.id}</Tag>
          </>
        }
        title={current.record.base.commonName}
      />
      {stale ? (
        <Alert
          message={`The species changed after this draft was made (draft is based on version ${draft.baseVersion}, live is version ${current.version}). It can no longer be merged. Reject it and make a new draft.`}
          showIcon
          type="warning"
        />
      ) : null}
      {base ? (
        open ? null : (
          <Alert
            message={`This draft is already decided. The table shows what it changed from version ${draft.baseVersion}.`}
            showIcon
            type="info"
          />
        )
      ) : (
        <Alert
          message={
            open
              ? "No copy of the record from when this draft was made was kept. The table compares it with the live record."
              : "This draft is already decided. No copy of the record from before it was kept, so the table compares it with the live record as it is now."
          }
          showIcon
          type="info"
        />
      )}
      <Descriptions
        column={{ md: 2, xs: 1 }}
        items={[
          { children: draft.summary, key: "summary", label: "Summary" },
          { children: draft.actor, key: "actor", label: "Proposed by" },
          {
            children: localTime(draft.createdAt),
            key: "created",
            label: "Created",
          },
          {
            children: `v${draft.baseVersion} (live v${current.version})`,
            key: "version",
            label: "Based on",
          },
          ...(draft.decidedAt
            ? [
                {
                  children: `${draft.decidedBy ?? "—"}, ${localTime(draft.decidedAt)}`,
                  key: "decided",
                  label: "Decided",
                },
              ]
            : []),
        ]}
        size="small"
      />
      <Table<DraftChange>
        columns={changeColumns(
          base ? `Before (v${draft.baseVersion})` : "Live",
        )}
        dataSource={changes}
        footer={() => `${changes.length} changed fields`}
        locale={{ emptyText: "No differences from the live record." }}
        pagination={false}
        rowKey="path"
        scroll={{ x: 900 }}
        size="small"
      />
    </>
  );
}

function localTime(value: string) {
  return new Date(value).toLocaleString();
}
