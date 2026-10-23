import { Button, Layout, Menu, Space, Typography } from "antd";
import { useState } from "react";

import { type AdminUser, signOut } from "./session";

export function Dashboard({
  onSignedOut,
  user,
}: {
  onSignedOut: () => void;
  user: AdminUser;
}) {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await signOut();
    } finally {
      setPending(false);
      onSignedOut();
    }
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider breakpoint="lg" collapsedWidth={0} theme="light">
        <Typography.Title level={5} style={{ margin: 16 }}>
          reptiles.ge admin
        </Typography.Title>
        <Menu
          items={[{ key: "dashboard", label: "Dashboard" }]}
          mode="inline"
          selectedKeys={["dashboard"]}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Header
          style={{
            alignItems: "center",
            background: "#fff",
            display: "flex",
            height: "auto",
            justifyContent: "flex-end",
            lineHeight: 1.5,
            paddingBlock: 12,
            paddingInline: 24,
          }}
        >
          <Space wrap>
            <Typography.Text>{user.name}</Typography.Text>
            <Typography.Text
              ellipsis={{ tooltip: user.email }}
              style={{ maxWidth: 220 }}
              type="secondary"
            >
              {user.email}
            </Typography.Text>
            <Button loading={pending} onClick={logout}>
              Sign out
            </Button>
          </Space>
        </Layout.Header>
        <Layout.Content style={{ padding: 24 }}>
          <Typography.Title level={3}>Dashboard</Typography.Title>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
