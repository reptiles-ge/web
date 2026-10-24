import type { ReactNode } from "react";

import { Card, Col, Flex, Image, Row, Space, Typography } from "antd";
import { useMemo, useRef, useState } from "react";

import type { AppLocale } from "@/i18n/routing";

import { ClearCacheButton } from "./ClearCacheButton";
import { PhotoThumbnail } from "./PhotoThumbnail";
import {
  type AdminSpeciesRecord,
  clearSpeciesCache,
  saveSpeciesTexts,
} from "./species";
import {
  SPECIES_TEXT_FIELDS,
  speciesTextIssues,
  type SpeciesTextKey,
  type SpeciesTexts,
  speciesTextsOf,
} from "./speciesTexts";
import { LocaleSwitch, SaveBar, TextField } from "./TextEditKit";
import {
  EDIT_LOCALES,
  runSave,
  sameValue,
  type SaveFailure,
  useLeaveWarning,
} from "./textEdits";

type Drafts = Record<AppLocale, SpeciesTexts>;

const LOCALES = EDIT_LOCALES.map(({ value }) => value);

export function SpeciesTextsEditor({
  id,
  onSaved,
  onSessionExpired,
  record,
  version: loadedVersion,
}: {
  id: string;
  onSaved: (version: number) => void;
  onSessionExpired: () => void;
  record: AdminSpeciesRecord["record"];
  version: number;
}) {
  const initial = useMemo(() => draftsOf(record), [record]);
  const [saved, setSaved] = useState(initial);
  const [drafts, setDrafts] = useState(initial);
  const [locale, setLocale] = useState<AppLocale>("ka");
  const version = useRef(loadedVersion);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState<null | SaveFailure>(null);
  const [savedVersion, setSavedVersion] = useState<null | number>(null);

  const dirty = new Set(
    LOCALES.filter((code) => !sameValue(drafts[code], saved[code])),
  );
  useLeaveWarning(dirty.size > 0);

  const texts = drafts[locale];
  const reference = locale === "ka" ? undefined : drafts.ka;
  const issues = [...dirty].flatMap((code) =>
    speciesTextIssues(drafts[code]).map((issue) => `${code}: ${issue}`),
  );

  function update(change: (next: SpeciesTexts) => void) {
    setDrafts((current) => {
      const next = structuredClone(current[locale]);
      change(next);
      return { ...current, [locale]: next };
    });
  }

  function setField(key: SpeciesTextKey, value: string) {
    update((next) => {
      if (
        key === "interaction" &&
        !value &&
        saved[locale].interaction === undefined
      ) {
        delete next.interaction;
      } else next[key] = value;
    });
  }

  async function save(summary: string) {
    let current = version.current;
    await runSave(
      async () => {
        for (const code of LOCALES.filter((item) => dirty.has(item))) {
          const result = await saveSpeciesTexts(id, {
            expectedVersion: current,
            locale: code,
            summary,
            texts: drafts[code],
          });
          current = result.version;
          version.current = current;
          setSaved((before) => ({ ...before, [code]: drafts[code] }));
        }
        setSavedVersion(current);
        onSaved(current);
      },
      { onFailure: setFailure, onSessionExpired, setSaving },
    );
  }

  return (
    <Row gutter={[24, 16]}>
      <Col lg={16} xs={24}>
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
          <Flex align="center" gap="middle" justify="space-between" wrap>
            <LocaleSwitch dirty={dirty} onChange={setLocale} value={locale} />
            <Typography.Text type="secondary">
              Links use [label](species-id), [label](/path) or
              [label](https://…).
            </Typography.Text>
          </Flex>
          <TextField
            label="Common name"
            multiline={false}
            onChange={(value) =>
              update((next) => void (next.commonName = value))
            }
            reference={reference?.commonName}
            required
            value={texts.commonName}
          />
          {SPECIES_TEXT_FIELDS.map(({ key, label }) => (
            <TextField
              key={key}
              label={label}
              linked
              onChange={(value) => setField(key, value)}
              reference={reference?.[key]}
              value={texts[key] ?? ""}
            />
          ))}
          {texts.identification ? (
            <Group title="Identification">
              <TextField
                label="Summary"
                linked
                onChange={(value) =>
                  update((next) => void (next.identification!.summary = value))
                }
                reference={reference?.identification?.summary}
                value={texts.identification.summary}
              />
              <TextField
                label="Colouration"
                linked
                onChange={(value) =>
                  update((next) => {
                    if (
                      value ||
                      saved[locale].identification?.coloration !== undefined
                    ) {
                      next.identification!.coloration = value;
                    } else delete next.identification!.coloration;
                  })
                }
                reference={reference?.identification?.coloration}
                value={texts.identification.coloration ?? ""}
              />
              {texts.identification.traits.map((trait, position) => (
                <TextField
                  key={`trait-${position}`}
                  label={`Trait ${position + 1}`}
                  linked
                  onChange={(value) =>
                    update(
                      (next) =>
                        void (next.identification!.traits[position] = value),
                    )
                  }
                  reference={reference?.identification?.traits[position]}
                  value={trait}
                />
              ))}
            </Group>
          ) : null}
          {texts.facts.length > 0 ? (
            <Group title="Facts">
              {texts.facts.map((fact, position) => (
                <TextField
                  key={`fact-${position}`}
                  label={`Fact ${position + 1}`}
                  linked
                  onChange={(value) =>
                    update((next) => void (next.facts[position] = value))
                  }
                  reference={reference?.facts[position]}
                  required
                  value={fact}
                />
              ))}
            </Group>
          ) : null}
          {texts.stats.length > 0 ? (
            <Group title="Quick stats">
              {texts.stats.map((stat, position) => (
                <Row gutter={12} key={`stat-${position}`}>
                  <Col sm={10} xs={24}>
                    <TextField
                      label={`Label ${position + 1}`}
                      multiline={false}
                      onChange={(value) =>
                        update(
                          (next) => void (next.stats[position]!.label = value),
                        )
                      }
                      reference={reference?.stats[position]?.label}
                      required
                      value={stat.label}
                    />
                  </Col>
                  <Col sm={14} xs={24}>
                    <TextField
                      label={`Value ${position + 1}`}
                      multiline={false}
                      onChange={(value) =>
                        update(
                          (next) => void (next.stats[position]!.value = value),
                        )
                      }
                      reference={reference?.stats[position]?.value}
                      required
                      value={stat.value}
                    />
                  </Col>
                </Row>
              ))}
            </Group>
          ) : null}
          {texts.faq && texts.faq.length > 0 ? (
            <Group title="Questions and answers">
              {texts.faq.map((item, position) => (
                <Space
                  key={`faq-${position}`}
                  orientation="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <TextField
                    label={`Question ${position + 1}`}
                    multiline={false}
                    onChange={(value) =>
                      update(
                        (next) => void (next.faq![position]!.question = value),
                      )
                    }
                    reference={reference?.faq?.[position]?.question}
                    required
                    value={item.question}
                  />
                  <TextField
                    label={`Answer ${position + 1}`}
                    linked
                    onChange={(value) =>
                      update(
                        (next) => void (next.faq![position]!.answer = value),
                      )
                    }
                    reference={reference?.faq?.[position]?.answer}
                    required
                    value={item.answer}
                  />
                </Space>
              ))}
            </Group>
          ) : null}
          <SaveBar
            dirtyLabels={[...dirty].map((code) => code.toUpperCase())}
            failure={failure}
            issues={issues}
            onDiscard={() => {
              setDrafts(saved);
              setFailure(null);
            }}
            onSave={save}
            saved={
              savedVersion ? (
                <Flex align="center" gap="small" wrap>
                  <Typography.Text type="success">
                    Saved as version {savedVersion}. reptiles.ge shows it after
                    the cache is cleared.
                  </Typography.Text>
                  <ClearCacheButton
                    description="This species' profile pages render fresh on their next visit, in every language."
                    failure="The species cache could not be cleared. Try again in a minute."
                    label="Clear cache now"
                    onSessionExpired={onSessionExpired}
                    run={async () => {
                      await clearSpeciesCache(id);
                      return `Cache cleared for ${id}.`;
                    }}
                    size="small"
                    title="Clear this species' cache?"
                  />
                </Flex>
              ) : null
            }
            saving={saving}
          />
        </Space>
      </Col>
      <Col lg={8} xs={24}>
        <SpeciesPhotos base={record.base} />
      </Col>
    </Row>
  );
}

function draftsOf(record: AdminSpeciesRecord["record"]): Drafts {
  return Object.fromEntries(
    LOCALES.map((code) => [code, speciesTextsOf(record, code)]),
  ) as Drafts;
}

function Group({ children, title }: { children: ReactNode; title: string }) {
  return (
    <Card size="small" title={title}>
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        {children}
      </Space>
    </Card>
  );
}

function SpeciesPhotos({
  base,
}: {
  base: AdminSpeciesRecord["record"]["base"];
}) {
  const srcs = [
    base.image,
    ...(base.mobileImage ? [base.mobileImage] : []),
    ...base.gallery.map((photo) => photo.src),
  ].filter((src, index, all) => all.indexOf(src) === index);
  return (
    <Card
      size="small"
      style={{ position: "sticky", top: 16 }}
      title={`Photos (${srcs.length})`}
    >
      <Typography.Paragraph style={{ fontSize: 12 }} type="secondary">
        Photos are shown for reference. Manage them in the Photos tab.
      </Typography.Paragraph>
      <Image.PreviewGroup>
        <Flex gap={8} wrap>
          {srcs.map((src) => (
            <PhotoThumbnail height={72} key={src} src={src} width={104} />
          ))}
        </Flex>
      </Image.PreviewGroup>
    </Card>
  );
}
