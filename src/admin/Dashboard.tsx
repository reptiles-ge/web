import { Button, Layout, Menu, Space, Typography } from "antd";
import { useState } from "react";

import { RatingsPage } from "./RatingsPage";
import { type AdminUser, signOut } from "./session";
import { SpeciesPage } from "./SpeciesPage";

type Section = "ratings" | "species";

const SECTIONS: Array<{ key: Section; label: string }> = [
  { key: "species", label: "Species" },
  { key: "ratings", label: "Ratings" },
];

export function Dashboard({
  onSignedOut,
  user,
}: {
  onSignedOut: () => void;
  user: AdminUser;
}) {
  const [pending, setPending] = useState(false);
  const [section, setSection] = useState<Section>("species");

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
          items={SECTIONS}
          mode="inline"
          onClick={({ key }) => setSection(key as Section)}
          selectedKeys={[section]}
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
          {section === "ratings" ? (
            <RatingsPage onSessionExpired={onSignedOut} />
          ) : (
            <SpeciesPage onSessionExpired={onSignedOut} />
          )}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
