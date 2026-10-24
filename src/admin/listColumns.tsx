import type { ColumnsType, ColumnType } from "antd/es/table";

import { Image, Space, Typography } from "antd";

import { optimizedImgSrc } from "@/data/optimizedImages";

import { AdminLink } from "./AdminLink";

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

export function nameColumn<
  T extends { id: string; name: { en: null | string; ka: null | string } },
>(title: string, path: (item: T) => string): ColumnType<T> {
  return {
    key: "name",
    render: (_, item) => (
      <Space orientation="vertical" size={0}>
        <AdminLink path={path(item)} strong>
          {item.name.ka ?? item.id}
        </AdminLink>
        <Typography.Text type="secondary">
          {item.name.en ?? "—"}
        </Typography.Text>
        <Typography.Text style={{ fontSize: 12 }} type="secondary">
          {item.id}
        </Typography.Text>
      </Space>
    ),
    title,
  };
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
