import type { ColumnsType, ColumnType } from "antd/es/table";

import {
  Alert,
  Button,
  Flex,
  Image,
  Input,
  Space,
  Table,
  Typography,
} from "antd";
import { useEffect, useEffectEvent, useMemo, useState } from "react";

import { optimizedImgSrc } from "@/data/optimizedImages";

import { SessionExpiredError } from "./species";

type LoadState<T> =
  { items: T[]; status: "ready" } | { status: "error" } | { status: "loading" };

export function AdminListView<T extends object>({
  columns,
  noun,
  onQuery,
  onReload,
  rowKey,
  rows,
  searchPlaceholder,
  status,
  title,
  total,
}: {
  columns: ColumnsType<T>;
  noun: string;
  onQuery: (query: string) => void;
  onReload: () => void;
  rowKey: keyof T & string;
  rows: T[];
  searchPlaceholder: string;
  status: "error" | "loading" | "ready";
  title: string;
  total: number;
}) {
  return (
    <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
      <Flex align="center" gap="middle" justify="space-between" wrap>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        <Space wrap>
          <Input.Search
            allowClear
            aria-label={`Search ${noun}`}
            onChange={(event) => onQuery(event.target.value)}
            placeholder={searchPlaceholder}
            style={{ width: 280 }}
          />
          <Button loading={status === "loading"} onClick={onReload}>
            Reload
          </Button>
        </Space>
      </Flex>
      {status === "error" ? (
        <Alert
          action={<Button onClick={onReload}>Retry</Button>}
          message={`Could not load ${noun}.`}
          showIcon
          type="error"
        />
      ) : (
        <Table<T>
          columns={columns}
          dataSource={rows}
          footer={() => `${rows.length} of ${total} ${noun}`}
          loading={status === "loading"}
          pagination={{ defaultPageSize: 50, showSizeChanger: true }}
          rowKey={rowKey}
          scroll={{ x: 900 }}
          size="small"
        />
      )}
    </Space>
  );
}

export function imageColumn<T extends { image: null | string }>(
  title: string,
): ColumnType<T> {
  return {
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
    title,
    width: 72,
  };
}

export function includesQuery(values: string[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return values.some((value) => value.toLowerCase().includes(needle));
}

export function photoCountColumn<
  T extends { photoCount: number },
>(): ColumnType<T> {
  return {
    align: "right",
    dataIndex: "photoCount",
    key: "photoCount",
    sorter: (a, b) => a.photoCount - b.photoCount,
    title: "Photos",
  };
}

export function revisionColumns<
  T extends { lastEditedAt: null | string; version: number },
>(): ColumnsType<T> {
  return [
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
}

export function unique<T>(values: T[]) {
  return [...new Set(values)].sort();
}

export function useAdminList<T>(
  load: () => Promise<T[]>,
  onSessionExpired: () => void,
) {
  const [state, setState] = useState<LoadState<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const expire = useEffectEvent(onSessionExpired);
  const fetchItems = useEffectEvent(load);

  useEffect(() => {
    let active = true;
    fetchItems().then(
      (items) => {
        if (active) setState({ items, status: "ready" });
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

  const items = useMemo(
    () => (state.status === "ready" ? state.items : []),
    [state],
  );

  function reload() {
    setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }

  return { items, reload, status: state.status };
}
