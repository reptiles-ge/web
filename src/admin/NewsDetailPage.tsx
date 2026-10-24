import type { JSONContent } from "@tiptap/core";

import { Button, Flex, Space, Tabs, Tag, Typography } from "antd";
import { useMemo, useState } from "react";

import type { NewsPhoto, NewsSection } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import { publicEnv } from "@/lib/env";
import { MAX_PAGE_SIZE } from "@/lib/pagination";

import { AdminDetailGate, AdminDetailHeader } from "./AdminDetail";
import { AdminLink } from "./AdminLink";
import { type AdminAuthor, fetchAdminAuthors } from "./authors";
import { ClearCacheButton } from "./ClearCacheButton";
import {
  type AdminNewsRecord,
  clearNewsCache,
  fetchAdminNewsRecord,
  saveNewsCopy,
} from "./news";
import { type LinkTargets, NewsBodyEditor } from "./NewsBodyEditor";
import {
  newsDocToSections,
  newsSectionIssues,
  newsSectionsToDoc,
} from "./newsDoc";
import { NewsPreview } from "./NewsPreview";
import { PhotoThumbnail } from "./PhotoThumbnail";
import { type AdminSpecies, fetchAllAdminSpecies } from "./species";
import { LocaleSwitch, SaveBar, TextField } from "./TextEditKit";
import {
  EDIT_LOCALES,
  runSave,
  sameValue,
  type SaveFailure,
  useLeaveWarning,
} from "./textEdits";
import { useAdminData } from "./useAdminList";

type Article = AdminNewsRecord["article"];

type Draft = { doc: JSONContent; fields: Fields; sections: NewsSection[] };

type Fields = Omit<LocaleCopy, "sections">;

type LocaleCopy = Article["copy"]["ka"];

const LIST_PATH = "/news";

const FIELDS: ReadonlyArray<{
  hint?: string;
  key: keyof Fields;
  label: string;
  multiline: boolean;
}> = [
  { key: "title", label: "Title", multiline: true },
  { key: "dek", label: "Dek (subtitle)", multiline: true },
  { key: "lead", label: "Lead", multiline: true },
  {
    hint: "Search result title. Aim for 50–60 characters.",
    key: "metaTitle",
    label: "Meta title",
    multiline: false,
  },
  {
    hint: "Search result snippet. Aim for 120–160 characters.",
    key: "metaDescription",
    label: "Meta description",
    multiline: true,
  },
];

const SITE = publicEnv().NEXT_PUBLIC_SITE_URL ?? "https://reptiles.ge";

export function NewsDetailPage({
  id,
  onSessionExpired,
}: {
  id: string;
  onSessionExpired: () => void;
}) {
  const { data, reload, status } = useAdminData(
    () =>
      Promise.all([
        fetchAdminNewsRecord(id),
        fetchAllAdminSpecies(),
        fetchAdminAuthors({
          contributor: true,
          limit: MAX_PAGE_SIZE,
          page: 1,
        }).then((page) => page.data),
      ]),
    onSessionExpired,
  );
  const value =
    data === undefined
      ? undefined
      : data[0]
        ? { authors: data[2], found: data[0], species: data[1] }
        : null;

  return (
    <AdminDetailGate
      back={<AdminLink path={LIST_PATH}>← News</AdminLink>}
      data={value}
      failure="Could not load this article."
      id={id}
      notFoundTitle="Article not found"
      onReload={reload}
      status={status}
    >
      {({ authors, found, species }) => (
        <NewsArticleEditor
          article={found.article}
          authors={authors}
          onReload={reload}
          onSessionExpired={onSessionExpired}
          species={species}
          version={found.version}
        />
      )}
    </AdminDetailGate>
  );
}

function copyOf(draft: Draft): LocaleCopy {
  return { ...draft.fields, sections: draft.sections };
}

function draftIssues(draft: Draft) {
  return [
    ...FIELDS.flatMap(({ key, label }) =>
      draft.fields[key].trim() ? [] : [`${label} is empty.`],
    ),
    ...newsSectionIssues(draft.sections),
  ];
}

function draftsOf(copy: Article["copy"]) {
  return Object.fromEntries(
    Object.entries(copy).flatMap(([locale, text]) => {
      if (!text) return [];
      const { sections, ...fields } = text;
      return [
        [
          locale,
          {
            doc: newsSectionsToDoc(sections),
            fields,
            sections,
          } satisfies Draft,
        ],
      ];
    }),
  ) as Partial<Record<AppLocale, Draft>>;
}

function isDirty(draft: Draft, saved: LocaleCopy) {
  return !sameValue(copyOf(draft), saved);
}

function linkTargets(
  article: Article,
  species: AdminSpecies[],
  authors: AdminAuthor[],
): LinkTargets {
  const speciesNames = new Map(
    species.map((item) => [item.id, item.commonName.ka ?? item.id]),
  );
  return {
    "credit-author": authors
      .filter((author) => author.isContributor)
      .map((author) => ({
        label: `${author.name.ka ?? author.id} (${author.id})`,
        value: author.id,
      })),
    hub: article.relatedHubIds.map((value) => ({ label: value, value })),
    region: article.relatedRegionIds.map((value) => ({ label: value, value })),
    species: article.relatedSpeciesIds.map((value) => ({
      label: `${speciesNames.get(value) ?? value} (${value})`,
      value,
    })),
  };
}

function NewsArticleEditor({
  article,
  authors,
  onReload,
  onSessionExpired,
  species,
  version: loadedVersion,
}: {
  article: Article;
  authors: AdminAuthor[];
  onReload: () => void;
  onSessionExpired: () => void;
  species: AdminSpecies[];
  version: number;
}) {
  const locales = EDIT_LOCALES.map(({ value }) => value).filter(
    (locale) => article.copy[locale],
  );
  const [saved, setSaved] = useState(article.copy);
  const [drafts, setDrafts] = useState(() => draftsOf(article.copy));
  const [locale, setLocale] = useState<AppLocale>("ka");
  const [version, setVersion] = useState(loadedVersion);
  const [resets, setResets] = useState(0);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState<null | SaveFailure>(null);
  const [savedVersion, setSavedVersion] = useState<null | number>(null);
  const photos = useMemo(() => photoMap(article), [article]);
  const targets = useMemo(
    () => linkTargets(article, species, authors),
    [article, species, authors],
  );

  const dirty = new Set(
    locales.filter((code) => isDirty(drafts[code]!, saved[code]!)),
  );
  useLeaveWarning(dirty.size > 0);
  const draft = drafts[locale]!;
  const reference = locale === "ka" ? undefined : drafts.ka!.fields;
  const issues = [...dirty].flatMap((code) =>
    draftIssues(drafts[code]!).map((issue) => `${code}: ${issue}`),
  );

  function setField(key: keyof Fields, value: string) {
    setDrafts((current) => ({
      ...current,
      [locale]: {
        ...current[locale]!,
        fields: { ...current[locale]!.fields, [key]: value },
      },
    }));
  }

  function setDoc(doc: JSONContent) {
    setDrafts((current) => ({
      ...current,
      [locale]: { ...current[locale]!, doc, sections: newsDocToSections(doc) },
    }));
  }

  async function save(summary: string) {
    const copy = Object.fromEntries(
      locales.map((code) => [
        code,
        dirty.has(code) ? copyOf(drafts[code]!) : saved[code],
      ]),
    ) as Article["copy"];
    await runSave(
      async () => {
        const next = await saveNewsCopy(article.id, {
          copy,
          expectedVersion: version,
          summary,
        });
        setVersion(next);
        setSavedVersion(next);
        setSaved(copy);
      },
      { onFailure: setFailure, onSessionExpired, setSaving },
    );
  }

  const title = saved.ka.title;
  return (
    <>
      <AdminDetailHeader
        actions={
          <>
            {article.status === "published" ? (
              <Button
                href={`${SITE}/news/${article.slug}`}
                rel="noreferrer"
                target="_blank"
              >
                Open on site
              </Button>
            ) : null}
            <Button disabled={dirty.size > 0} onClick={onReload}>
              Reload
            </Button>
            <ClearCacheButton
              description="This article's pages on reptiles.ge render fresh on their next visit, in every language. News lists are not cleared."
              failure="The article cache could not be cleared. Try again in a minute."
              label="Clear cache"
              onSessionExpired={onSessionExpired}
              run={async () => {
                await clearNewsCache(article.id);
                return `Cache cleared for ${article.id}.`;
              }}
              title="Clear this article's cache?"
            />
          </>
        }
        image={
          article.image ? (
            <PhotoThumbnail height={72} src={article.image.src} width={108} />
          ) : undefined
        }
        subtitle={
          <>
            {saved.en?.title ?? "—"} · {article.id}
          </>
        }
        tags={
          <>
            <Tag color={article.status === "published" ? "green" : "gold"}>
              {article.status}
            </Tag>
            <Tag>{article.publishedAt.slice(0, 10)}</Tag>
            <Tag>version {version}</Tag>
            <Tag>{photos.size} photos</Tag>
          </>
        }
        title={title}
      />
      <Flex align="center" gap="middle" justify="space-between" wrap>
        <LocaleSwitch
          available={locales}
          dirty={dirty}
          onChange={setLocale}
          value={locale}
        />
        <Typography.Text type="secondary">
          Text only. Photos, sources and related pages stay as they are.
        </Typography.Text>
      </Flex>
      <Tabs
        items={[
          {
            children: (
              <Space
                orientation="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                {FIELDS.map(({ hint, key, label, multiline }) => (
                  <TextField
                    hint={
                      hint
                        ? `${hint} Now ${draft.fields[key].length}.`
                        : undefined
                    }
                    key={`${locale}:${key}`}
                    label={label}
                    multiline={multiline}
                    onChange={(value) => setField(key, value)}
                    reference={reference?.[key]}
                    required
                    value={draft.fields[key]}
                  />
                ))}
                <Space
                  orientation="vertical"
                  size={4}
                  style={{ width: "100%" }}
                >
                  <Typography.Text strong>Body</Typography.Text>
                  <NewsBodyEditor
                    doc={draft.doc}
                    figure={{ locale, photos }}
                    key={`${locale}:${resets}`}
                    onChange={setDoc}
                    targets={targets}
                  />
                </Space>
              </Space>
            ),
            key: "edit",
            label: "Edit",
          },
          {
            children: (
              <NewsPreview
                article={article}
                copy={copyOf(draft)}
                locale={locale}
                photos={photos}
              />
            ),
            key: "preview",
            label: "Preview",
          },
        ]}
      />
      <SaveBar
        dirtyLabels={[...dirty].map((code) => code.toUpperCase())}
        failure={failure}
        issues={issues}
        onDiscard={() => {
          setDrafts(draftsOf(saved));
          setResets((count) => count + 1);
          setFailure(null);
        }}
        onSave={save}
        saved={
          savedVersion ? (
            <Typography.Text type="success">
              Saved as version {savedVersion}. Use Clear cache above so
              reptiles.ge shows it now.
            </Typography.Text>
          ) : null
        }
        saving={saving}
      />
    </>
  );
}

function photoMap(article: Article) {
  const photos = new Map<string, NewsPhoto>();
  for (const photo of [
    ...(article.image ? [article.image] : []),
    ...(article.gallery ?? []),
  ]) {
    photos.set(photo.src, photo as NewsPhoto);
  }
  return photos;
}
