import type { ColumnsType } from "antd/es/table";

import {
  Alert,
  Badge,
  Button,
  Flex,
  Image,
  Input,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useEffectEvent, useMemo, useState } from "react";

import { optimizedImgSrc } from "@/data/optimizedImages";

import {
  type AdminSpecies,
  fetchAdminSpecies,
  SessionExpiredError,
} from "./species";

type LoadState =
  | { species: AdminSpecies[]; status: "ready" }
  | { status: "error" }
  | { status: "loading" };

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
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const expire = useEffectEvent(onSessionExpired);

  useEffect(() => {
    let active = true;
    fetchAdminSpecies().then(
      (species) => {
        if (active) setState({ species, status: "ready" });
      },
      (error: unknown) => {
        if (!active) return;
        if (error instanceof SessionExpiredError) expire();
        else setState({ status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  const species = useMemo(
    () => (state.status === "ready" ? state.species : []),
    [state],
  );
  const visible = useMemo(
    () => species.filter((item) => matches(item, query)),
    [species, query],
  );

  const columns: ColumnsType<AdminSpecies> = [
    {
      dataIndex: "image",
      key: "image",
      render: (src: null | string) =>
        src ? (
          <Image
            alt=""
            height={40}
            preview={false}
            src={optimizedImgSrc(src, 320)}
            style={{ objectFit: "cover" }}
            width={56}
          />
        ) : null,
      title: "Photo",
      width: 72,
    },
    {
      key: "name",
      render: (_, item) => (
        <Space direction="vertical" size={0}>
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
    {
      align: "right",
      dataIndex: "photoCount",
      key: "photoCount",
      sorter: (a, b) => a.photoCount - b.photoCount,
      title: "Photos",
    },
    {
      align: "right",
      dataIndex: "pendingDrafts",
      key: "pendingDrafts",
      render: (count: number) =>
        count ? <Badge count={count} /> : <Typography.Text>0</Typography.Text>,
      sorter: (a, b) => a.pendingDrafts - b.pendingDrafts,
      title: "Drafts",
    },
    {
      align: "right",
      dataIndex: "version",
      key: "version",
      sorter: (a, b) => a.version - b.version,
      title: "Version",
    },
    {
      dataIndex: "lastEditedAt",
      key: "lastEditedAt",
      render: (value: null | string) =>
        value ? new Date(value).toLocaleString() : "—",
      sorter: (a, b) =>
        (a.lastEditedAt ?? "").localeCompare(b.lastEditedAt ?? ""),
      title: "Last edited",
    },
  ];

  function reload() {
    setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Flex align="center" gap="middle" justify="space-between" wrap>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Species
        </Typography.Title>
        <Space wrap>
          <Input.Search
            allowClear
            aria-label="Search species"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, scientific name or id"
            style={{ width: 280 }}
          />
          <Button loading={state.status === "loading"} onClick={reload}>
            Reload
          </Button>
        </Space>
      </Flex>
      {state.status === "error" ? (
        <Alert
          action={<Button onClick={reload}>Retry</Button>}
          message="Could not load species."
          showIcon
          type="error"
        />
      ) : (
        <Table<AdminSpecies>
          columns={columns}
          dataSource={visible}
          footer={() => `${visible.length} of ${species.length} species`}
          loading={state.status === "loading"}
          pagination={{ defaultPageSize: 50, showSizeChanger: true }}
          rowKey="id"
          scroll={{ x: 900 }}
          size="small"
        />
      )}
    </Space>
  );
}

function matches(species: AdminSpecies, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [
    species.id,
    species.scientificName,
    species.commonName.ka,
    species.commonName.en ?? "",
  ].some((value) => value.toLowerCase().includes(needle));
}

function unique<T>(values: T[]) {
  return [...new Set(values)].sort();
}
