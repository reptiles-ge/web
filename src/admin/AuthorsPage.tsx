import type { ColumnsType } from "antd/es/table";

import { Space, Tag, Typography } from "antd";

import { AUTHOR_KINDS, AUTHOR_ROLES } from "@/lib/authorTaxonomy";

import { AdminLink } from "./AdminLink";
import { AdminListView, type ServerPaging } from "./AdminListView";
import {
  type AdminAuthor,
  type AdminAuthorFilters,
  clearAuthorCache,
  clearAuthorsCache,
  fetchAdminAuthors,
} from "./authors";
import { ClearCacheButton } from "./ClearCacheButton";
import { imageColumn } from "./listColumns";
import { usePagedList } from "./usePagedList";

export function AuthorsPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const {
    items: authors,
    query,
    reload,
    setFilters,
    setPage,
    setSearch,
    status,
    total,
  } = usePagedList(fetchAdminAuthors, onSessionExpired);

  const paging: ServerPaging = {
    limit: query.limit,
    onChange: ({ filters, limit, page }) => {
      const next: Partial<AdminAuthorFilters> = {
        contributor: filters.isContributor?.[0] as boolean | undefined,
        kind: filters.kind?.[0] as AdminAuthorFilters["kind"] | undefined,
        role: filters.role?.[0] as AdminAuthorFilters["role"] | undefined,
      };
      if (
        next.contributor !== query.contributor ||
        next.kind !== query.kind ||
        next.role !== query.role
      ) {
        setFilters(next);
      } else {
        setPage(page, limit);
      }
    },
    page: query.page,
  };

  const columns: ColumnsType<AdminAuthor> = [
    imageColumn<AdminAuthor>("Portrait"),
    {
      key: "name",
      render: (_, item) => (
        <Space orientation="vertical" size={0}>
          <AdminLink path={`/authors/${item.id}`} strong>
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
      title: "Author",
    },
    {
      dataIndex: "isContributor",
      filteredValue: selected(query.contributor),
      filterMultiple: false,
      filters: [
        { text: "Contributor", value: true },
        { text: "Photo credit only", value: false },
      ],
      key: "isContributor",
      render: (isContributor: boolean) =>
        isContributor ? <Tag color="green">contributor</Tag> : "—",
      title: "Page",
    },
    {
      dataIndex: "kind",
      filteredValue: selected(query.kind),
      filterMultiple: false,
      filters: options(AUTHOR_KINDS),
      key: "kind",
      render: (kind: string) => <Tag>{kind}</Tag>,
      title: "Kind",
    },
    {
      dataIndex: "role",
      filteredValue: selected(query.role),
      filterMultiple: false,
      filters: options(AUTHOR_ROLES),
      key: "role",
      render: (role: null | string) => role ?? "—",
      title: "Role",
    },
    {
      dataIndex: "jobTitle",
      key: "jobTitle",
      render: (jobTitle: null | string) => jobTitle ?? "—",
      title: "Job title",
    },
    {
      align: "right",
      dataIndex: "photoCount",
      key: "photoCount",
      title: "Photos",
    },
    {
      align: "right",
      dataIndex: "aliasCount",
      key: "aliasCount",
      title: "Aliases",
    },
    {
      fixed: "right",
      key: "actions",
      render: (_, item) =>
        item.isContributor ? (
          <ClearCacheButton
            description="This contributor's page on reptiles.ge renders fresh on its next visit, in every language. Photo credits on other pages are not cleared."
            failure="The contributor cache could not be cleared. Try again in a minute."
            label="Clear cache"
            onSessionExpired={onSessionExpired}
            run={async () => {
              await clearAuthorCache(item.id);
              return `Cache cleared for ${item.id}.`;
            }}
            size="small"
            title="Clear this contributor's cache?"
          />
        ) : null,
      title: "Actions",
    },
  ];

  return (
    <AdminListView<AdminAuthor>
      actions={
        <ClearCacheButton
          description="Every page that shows authors renders fresh on its next visit: the contributor pages, every species profile (photo credits), news articles, the home page, about, contact and photo-use. This is most of the site."
          failure="The authors cache could not be cleared. Try again in a minute."
          label="Clear authors cache"
          onSessionExpired={onSessionExpired}
          run={async () => {
            await clearAuthorsCache();
            return "Authors cache cleared.";
          }}
          title="Clear the whole authors cache?"
        />
      }
      columns={columns}
      noun="authors"
      onQuery={setSearch}
      onReload={reload}
      paging={paging}
      rowKey="id"
      rows={authors}
      searchPlaceholder="Name or id"
      status={status}
      title="Authors"
      total={total}
    />
  );
}

function options(values: readonly string[]) {
  return values.map((value) => ({ text: value, value }));
}

function selected(value: boolean | string | undefined) {
  return value === undefined ? null : [value];
}
