import { App as AntApp, ConfigProvider, Layout, Typography } from "antd";

export function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#2f6b4f" } }}>
      <AntApp>
        <Layout style={{ minHeight: "100vh" }}>
          <Layout.Content style={{ padding: 48 }}>
            <Typography.Title>Hello Admin</Typography.Title>
            <Typography.Text type="secondary">reptiles.ge</Typography.Text>
          </Layout.Content>
        </Layout>
      </AntApp>
    </ConfigProvider>
  );
}
