import { Col, Flex, Row, Space, Typography } from "antd";
import { useMemo, useState } from "react";

import type { AppLocale } from "@/i18n/routing";

import {
  type AdminAuthorRecord,
  type AuthorTextsInput,
  clearAuthorCache,
  saveAuthorTexts,
} from "./authors";
import { ClearCacheButton } from "./ClearCacheButton";
import { PhotoThumbnail } from "./PhotoThumbnail";
import {
  EDIT_LOCALES,
  LocaleSwitch,
  runSave,
  sameValue,
  SaveBar,
  type SaveFailure,
  TextField,
  useLeaveWarning,
} from "./TextEditKit";

type AuthorDraft = { bio: string; metaDescription: string; name: string };

type Drafts = Record<AppLocale, AuthorDraft>;

const LOCALES = EDIT_LOCALES.map(({ value }) => value);

export function authorTextIssues(drafts: Drafts) {
  return LOCALES.flatMap((locale) => {
    const draft = drafts[locale];
    if (draft.name.trim()) return [];
    if (locale === "ka") return ["ka: the Georgian name is required."];
    return draft.bio.trim() || draft.metaDescription.trim()
      ? [`${locale}: add a name, or clear the bio and meta description.`]
      : [];
  });
}

export function AuthorTextsEditor({
  author,
  onSessionExpired,
}: {
  author: AdminAuthorRecord;
  onSessionExpired: () => void;
}) {
  const initial = useMemo(() => draftsOf(author), [author]);
  const [saved, setSaved] = useState(initial);
  const [drafts, setDrafts] = useState(initial);
  const [locale, setLocale] = useState<AppLocale>("ka");
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState<null | SaveFailure>(null);
  const [done, setDone] = useState(false);

  const dirty = new Set(
    LOCALES.filter((code) => !sameValue(drafts[code], saved[code])),
  );
  useLeaveWarning(dirty.size > 0);
  const draft = drafts[locale];
  const reference = locale === "ka" ? undefined : drafts.ka;

  function update(key: keyof AuthorDraft, value: string) {
    setDrafts((current) => ({
      ...current,
      [locale]: { ...current[locale], [key]: value },
    }));
  }

  async function save() {
    setSaving(true);
    setFailure(null);
    const sent = drafts;
    const ok = await runSave(
      () => saveAuthorTexts(author.id, authorTextsInput(sent)),
      { onFailure: setFailure, onSessionExpired },
    );
    if (ok) {
      setSaved(sent);
      setDone(true);
    }
    setSaving(false);
  }

  return (
    <Row gutter={[24, 16]}>
      <Col lg={16} xs={24}>
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
          <LocaleSwitch dirty={dirty} onChange={setLocale} value={locale} />
          <TextField
            label="Name"
            multiline={false}
            onChange={(value) => update("name", value)}
            reference={reference?.name}
            required={locale === "ka"}
            value={draft.name}
          />
          <TextField
            label="Bio"
            maxLength={4000}
            onChange={(value) => update("bio", value)}
            reference={reference?.bio || undefined}
            value={draft.bio}
          />
          <TextField
            hint="Shown in search results. Aim for 120–160 characters."
            label="Meta description"
            maxLength={300}
            onChange={(value) => update("metaDescription", value)}
            reference={reference?.metaDescription || undefined}
            value={draft.metaDescription}
          />
          <SaveBar
            dirtyLabels={[...dirty].map((code) => code.toUpperCase())}
            failure={failure}
            issues={authorTextIssues(drafts)}
            onDiscard={() => {
              setDrafts(saved);
              setFailure(null);
            }}
            onSave={save}
            saved={
              done ? (
                <Flex align="center" gap="small" wrap>
                  <Typography.Text type="success">
                    Saved. reptiles.ge shows it after the cache is cleared.
                  </Typography.Text>
                  {author.isContributor ? (
                    <ClearCacheButton
                      description="This contributor's page renders fresh on its next visit, in every language."
                      failure="The contributor cache could not be cleared. Try again in a minute."
                      label="Clear cache now"
                      onSessionExpired={onSessionExpired}
                      run={async () => {
                        await clearAuthorCache(author.id);
                        return `Cache cleared for ${author.id}.`;
                      }}
                      size="small"
                      title="Clear this contributor's cache?"
                    />
                  ) : null}
                </Flex>
              ) : null
            }
            saving={saving}
          />
        </Space>
      </Col>
      <Col lg={8} xs={24}>
        {author.portraitSrc ? (
          <Space orientation="vertical" size="small">
            <PhotoThumbnail height={200} src={author.portraitSrc} width={200} />
            <Typography.Text style={{ fontSize: 12 }} type="secondary">
              Portrait, shown for reference.
            </Typography.Text>
          </Space>
        ) : null}
      </Col>
    </Row>
  );
}

export function authorTextsInput(drafts: Drafts): AuthorTextsInput {
  return Object.fromEntries(
    LOCALES.flatMap((locale) => {
      const { bio, metaDescription, name } = drafts[locale];
      if (locale !== "ka" && !name.trim()) return [];
      return [
        [
          locale,
          {
            ...(bio.trim() ? { bio } : {}),
            ...(metaDescription.trim() ? { metaDescription } : {}),
            name,
          },
        ],
      ];
    }),
  ) as AuthorTextsInput;
}

function draftsOf(author: AdminAuthorRecord): Drafts {
  return Object.fromEntries(
    LOCALES.map((locale) => {
      const text = author.texts[locale];
      return [
        locale,
        {
          bio: text?.bio ?? "",
          metaDescription: text?.metaDescription ?? "",
          name: text?.name ?? "",
        },
      ];
    }),
  ) as Drafts;
}
