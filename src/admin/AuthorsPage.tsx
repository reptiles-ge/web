import type { ColumnsType } from "antd/es/table";

import { Tag } from "antd";

import { AUTHOR_KINDS, AUTHOR_ROLES } from "@/lib/authorTaxonomy";

import { AdminListView } from "./AdminListView";
import {
  type AdminAuthor,
  type AdminAuthorFilters,
  clearAuthorCache,
  clearAuthorsCache,
  fetchAdminAuthors,
} from "./authors";
import { ClearCacheButton } from "./ClearCacheButton";
import { imageColumn, nameColumn, serverFilter } from "./listColumns";
import { serverPaging, usePagedList } from "./usePagedList";

export function AuthorsPage({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  const list = usePagedList(fetchAdminAuthors, onSessionExpired);
  const { query } = list;
  const paging = serverPaging(list, (filters) => ({
    contributor: filters.isContributor?.[0] as boolean | undefined,
    kind: filters.kind?.[0] as AdminAuthorFilters["kind"] | undefined,
    role: filters.role?.[0] as AdminAuthorFilters["role"] | undefined,
  }));

  const columns: ColumnsType<AdminAuthor> = [
    imageColumn<AdminAuthor>("Portrait"),
    nameColumn<AdminAuthor>("Author", (item) => `/authors/${item.id}`),
    {
      dataIndex: "isContributor",
      ...serverFilter(query.contributor, [
        { text: "Contributor", value: true },
        { text: "Photo credit only", value: false },
      ]),
      key: "isContributor",
      render: (isContributor: boolean) =>
        isContributor ? <Tag color="green">contributor</Tag> : "—",
      title: "Page",
    },
    {
      dataIndex: "kind",
      ...serverFilter(query.kind, AUTHOR_KINDS),
      key: "kind",
      render: (kind: string) => <Tag>{kind}</Tag>,
      title: "Kind",
    },
    {
      dataIndex: "role",
      ...serverFilter(query.role, AUTHOR_ROLES),
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
      onQuery={list.setSearch}
      onReload={list.reload}
      paging={paging}
      rowKey="id"
      rows={list.items}
      searchPlaceholder="Name or id"
      status={list.status}
      title="Authors"
      total={list.total}
    />
  );
}
