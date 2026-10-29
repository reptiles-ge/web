import type { ColumnsType } from "antd/es/table";
import type { FilterValue, TableRowSelection } from "antd/es/table/interface";
import type { ReactNode } from "react";

import { Alert, Button, Flex, Input, Space, Table, Typography } from "antd";

import { PAGE_SIZE_OPTIONS } from "@/lib/pagination";

export type ServerPaging = {
  limit: number;
  onChange: (change: {
    filters: Record<string, FilterValue | null>;
    limit: number;
    page: number;
  }) => void;
  page: number;
};

export function AdminListView<T extends object>({
  actions,
  columns,
  noun,
  onQuery,
  onReload,
  paging,
  rowKey,
  rows,
  rowSelection,
  searchPlaceholder,
  status,
  summary,
  title,
  total,
}: {
  actions?: ReactNode;
  columns: ColumnsType<T>;
  noun: string;
  onQuery: (query: string) => void;
  onReload: () => void;
  paging?: ServerPaging;
  rowKey: keyof T & string;
  rows: T[];
  rowSelection?: TableRowSelection<T>;
  searchPlaceholder: string;
  status: "error" | "loading" | "ready";
  summary?: ReactNode;
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
          {actions}
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
        <>
          {summary}
          <Table<T>
            columns={columns}
            dataSource={rows}
            footer={() =>
              `${paging ? pageRange(paging, rows.length) : rows.length} of ${total} ${noun}`
            }
            loading={status === "loading"}
            onChange={
              paging
                ? (pagination, filters) =>
                    paging.onChange({
                      filters,
                      limit: pagination.pageSize ?? paging.limit,
                      page: pagination.current ?? 1,
                    })
                : undefined
            }
            pagination={
              paging
                ? {
                    current: paging.page,
                    pageSize: paging.limit,
                    pageSizeOptions: [...PAGE_SIZE_OPTIONS],
                    showSizeChanger: true,
                    total,
                  }
                : { defaultPageSize: 50, showSizeChanger: true }
            }
            rowKey={rowKey}
            rowSelection={rowSelection}
            scroll={{ x: 900 }}
            size="small"
          />
        </>
      )}
    </Space>
  );
}

function pageRange({ limit, page }: ServerPaging, shown: number) {
  const first = (page - 1) * limit + 1;
  return shown === 0 ? "0" : `${first}–${first + shown - 1}`;
}
