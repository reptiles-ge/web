import type { ReactNode } from "react";

import { Alert, Button, Flex, Result, Skeleton, Space, Typography } from "antd";

export function AdminDetailGate<T>({
  back,
  children,
  data,
  failure,
  id,
  notFoundTitle,
  onReload,
  status,
}: {
  back: ReactNode;
  children: (data: T) => ReactNode;
  data: null | T | undefined;
  failure: string;
  id: string;
  notFoundTitle: string;
  onReload: () => void;
  status: "error" | "loading" | "ready";
}) {
  if (status === "error") {
    return (
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        {back}
        <Alert
          action={<Button onClick={onReload}>Retry</Button>}
          message={failure}
          showIcon
          type="error"
        />
      </Space>
    );
  }
  if (data === undefined) return <Skeleton active />;
  if (data === null) {
    return (
      <Result extra={back} status="404" subTitle={id} title={notFoundTitle} />
    );
  }
  return (
    <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
      {back}
      {children(data)}
    </Space>
  );
}

export function AdminDetailHeader({
  actions,
  image,
  subtitle,
  tags,
  title,
}: {
  actions: ReactNode;
  image?: ReactNode;
  subtitle: ReactNode;
  tags: ReactNode;
  title: ReactNode;
}) {
  return (
    <Flex align="start" gap="middle" justify="space-between" wrap>
      <Space align="start" size="middle">
        {image}
        <Space orientation="vertical" size={4}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          <Typography.Text type="secondary">{subtitle}</Typography.Text>
          <Space size={4} wrap>
            {tags}
          </Space>
        </Space>
      </Space>
      <Space wrap>{actions}</Space>
    </Flex>
  );
}
