import type { ColumnsType } from "antd/es/table";

import { Alert, Button, Flex, Input, Space, Table, Typography } from "antd";

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
