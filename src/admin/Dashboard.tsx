import type { ReactNode } from "react";

import { Button, Layout, Menu, Result, Space, Typography } from "antd";
import { useEffect, useState } from "react";

import { AuthorDetailPage } from "./AuthorDetailPage";
import { AuthorsPage } from "./AuthorsPage";
import { CachePage } from "./CachePage";
import { DraftDetailPage } from "./DraftDetailPage";
import { DraftsPage } from "./DraftsPage";
import { NewsDetailPage } from "./NewsDetailPage";
import { NewsPage } from "./NewsPage";
import { RatingsPage } from "./RatingsPage";
import { followLink, navigate, usePathname } from "./router";
import { type AdminUser, signOut } from "./session";
import { SpeciesDetailPage } from "./SpeciesDetailPage";
import { SpeciesPage } from "./SpeciesPage";

type SectionProps = { onSessionExpired: () => void };

const SECTIONS: Array<{
  label: string;
  page: (props: SectionProps) => ReactNode;
  path: string;
}> = [
  { label: "Species", page: SpeciesPage, path: "/species" },
  { label: "Drafts", page: DraftsPage, path: "/drafts" },
  { label: "News", page: NewsPage, path: "/news" },
  { label: "Authors", page: AuthorsPage, path: "/authors" },
  { label: "Cache", page: CachePage, path: "/cache" },
  { label: "Ratings", page: RatingsPage, path: "/ratings" },
];

const HOME_PATH = SECTIONS[0].path;

type DetailProps = { id: string; onSessionExpired: () => void };

const DETAILS: Array<{
  page: (props: DetailProps) => ReactNode;
  path: string;
}> = [
  { page: SpeciesDetailPage, path: "/species" },
  { page: NewsDetailPage, path: "/news" },
  { page: DraftDetailPage, path: "/drafts" },
  { page: AuthorDetailPage, path: "/authors" },
];

const DETAIL_PATH = /^(\/[a-z]+)\/([a-z0-9-]+)$/;

const TITLE = "reptiles.ge admin";

export function Dashboard({
  onSignedOut,
  user,
}: {
  onSignedOut: () => void;
  user: AdminUser;
}) {
  const [pending, setPending] = useState(false);
  const pathname = usePathname();
  const [, detailPath, detailId] = DETAIL_PATH.exec(pathname) ?? [];
  const detail = DETAILS.find(({ path }) => path === detailPath);
  const section = SECTIONS.find(
    ({ path }) => path === pathname || (detail && path === detail.path),
  );

  useEffect(() => {
    if (pathname === "/") navigate(HOME_PATH, { replace: true });
  }, [pathname]);

  useEffect(() => {
    document.title = section ? `${section.label} — ${TITLE}` : TITLE;
  }, [section]);

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
          {TITLE}
        </Typography.Title>
        <Menu
          items={SECTIONS.map(({ label, path }) => ({
            key: path,
            label: (
              <a href={path} onClick={(event) => followLink(event, path)}>
                {label}
              </a>
            ),
          }))}
          mode="inline"
          selectedKeys={section ? [section.path] : []}
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
          {detail && detailId ? (
            <detail.page
              id={detailId}
              key={pathname}
              onSessionExpired={onSignedOut}
            />
          ) : section ? (
            <section.page onSessionExpired={onSignedOut} />
          ) : pathname === "/" ? null : (
            <Result
              extra={
                <Button
                  href={HOME_PATH}
                  onClick={(event) => followLink(event, HOME_PATH)}
                  type="primary"
                >
                  Open species
                </Button>
              }
              status="404"
              title="Page not found"
            />
          )}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
