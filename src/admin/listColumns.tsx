import type { ColumnsType, ColumnType } from "antd/es/table";

import { Image } from "antd";

import { optimizedImgSrc } from "@/data/optimizedImages";

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
