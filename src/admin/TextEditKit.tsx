import type { ReactNode } from "react";

import {
  Alert,
  Badge,
  Button,
  Flex,
  Input,
  Popconfirm,
  Segmented,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

import type { AppLocale } from "@/i18n/routing";

import { AdminSaveError, SessionExpiredError } from "./adminResponse";
import { LinkedTextPreview } from "./LinkedTextPreview";

export const EDIT_LOCALES: ReadonlyArray<{ label: string; value: AppLocale }> =
  [
    { label: "ქართული", value: "ka" },
    { label: "English", value: "en" },
    { label: "Русский", value: "ru" },
    { label: "Türkçe", value: "tr" },
  ];

export type SaveFailure = { details: string[]; message: string };

export function LocaleSwitch({
  available = EDIT_LOCALES.map(({ value }) => value),
  dirty,
  onChange,
  value,
}: {
  available?: readonly AppLocale[];
  dirty: ReadonlySet<AppLocale>;
  onChange: (locale: AppLocale) => void;
  value: AppLocale;
}) {
  return (
    <Segmented<AppLocale>
      onChange={onChange}
      options={EDIT_LOCALES.map(({ label, value: locale }) => ({
        disabled: !available.includes(locale),
        label: (
          <Badge dot={dirty.has(locale)} offset={[6, 0]}>
            {label}
          </Badge>
        ),
        value: locale,
      }))}
      value={value}
    />
  );
}

export async function runSave(
  save: () => Promise<void>,
  {
    onFailure,
    onSessionExpired,
  }: {
    onFailure: (failure: SaveFailure) => void;
    onSessionExpired: () => void;
  },
) {
  try {
    await save();
    return true;
  } catch (error) {
    if (error instanceof SessionExpiredError) onSessionExpired();
    else onFailure(saveFailure(error));
    return false;
  }
}

export function sameValue(left: unknown, right: unknown) {
  return stableJson(left) === stableJson(right);
}

export function SaveBar({
  dirtyLabels,
  failure,
  issues = [],
  onDiscard,
  onSave,
  saved,
  saving,
}: {
  dirtyLabels: string[];
  failure: null | SaveFailure;
  issues?: string[];
  onDiscard: () => void;
  onSave: (summary: string) => void;
  saved: ReactNode;
  saving: boolean;
}) {
  const [summary, setSummary] = useState("");
  const dirty = dirtyLabels.length > 0;
  const fallback = `Edit ${dirtyLabels.join(", ")} texts`;
  return (
    <div
      style={{
        background: "#fff",
        borderTop: "1px solid #f0f0f0",
        bottom: 0,
        boxShadow: dirty ? "0 -4px 12px rgba(0, 0, 0, 0.06)" : undefined,
        marginInline: -24,
        padding: "12px 24px",
        position: "sticky",
        zIndex: 5,
      }}
    >
      <Space orientation="vertical" size="small" style={{ width: "100%" }}>
        {failure ? (
          <Alert
            description={
              failure.details.length > 0 ? (
                <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                  {failure.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              ) : undefined
            }
            message={failure.message}
            showIcon
            type="error"
          />
        ) : null}
        {issues.length > 0 ? (
          <Alert
            message={
              <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                {issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            }
            showIcon
            type="warning"
          />
        ) : null}
        {!dirty && saved ? saved : null}
        <Flex align="center" gap="small" wrap>
          <Typography.Text type={dirty ? "warning" : "secondary"}>
            {dirty
              ? `Unsaved changes: ${dirtyLabels.join(", ")}`
              : "No unsaved changes"}
          </Typography.Text>
          <Input
            aria-label="Change summary"
            disabled={!dirty}
            maxLength={500}
            onChange={(event) => setSummary(event.target.value)}
            placeholder={dirty ? fallback : "What did you change?"}
            style={{ flex: "1 1 240px" }}
            value={summary}
          />
          <Popconfirm
            disabled={!dirty}
            okText="Discard"
            onConfirm={onDiscard}
            title="Discard every unsaved change?"
          >
            <Button disabled={!dirty || saving}>Discard</Button>
          </Popconfirm>
          <Button
            disabled={!dirty || issues.length > 0}
            loading={saving}
            onClick={() => {
              onSave(summary.trim() || fallback);
              setSummary("");
            }}
            type="primary"
          >
            Save
          </Button>
        </Flex>
      </Space>
    </div>
  );
}

export function TextField({
  hint,
  label,
  linked = false,
  maxLength,
  multiline = true,
  onChange,
  reference,
  required = false,
  value,
}: {
  hint?: string;
  label: string;
  linked?: boolean;
  maxLength?: number;
  multiline?: boolean;
  onChange: (value: string) => void;
  reference?: string;
  required?: boolean;
  value: string;
}) {
  const missing = required && !value.trim();
  const shared = {
    "aria-label": label,
    count: maxLength ? { max: maxLength, show: true } : undefined,
    onChange: (event: { target: { value: string } }) =>
      onChange(event.target.value),
    status: missing ? ("error" as const) : undefined,
    value,
  };
  return (
    <Space orientation="vertical" size={4} style={{ width: "100%" }}>
      <Typography.Text strong>
        {label}
        {required ? <Typography.Text type="danger"> *</Typography.Text> : null}
      </Typography.Text>
      <div style={{ paddingBottom: maxLength && multiline ? 20 : 0 }}>
        {multiline ? (
          <Input.TextArea autoSize={{ maxRows: 24, minRows: 2 }} {...shared} />
        ) : (
          <Input {...shared} />
        )}
      </div>
      {hint ? (
        <Typography.Text style={{ fontSize: 12 }} type="secondary">
          {hint}
        </Typography.Text>
      ) : null}
      {linked && value.includes("](") ? (
        <LinkedTextPreview text={value} />
      ) : null}
      {reference ? <Reference text={reference} /> : null}
    </Space>
  );
}

export function useLeaveWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
}

function Reference({ text }: { text: string }) {
  return (
    <Typography.Paragraph
      ellipsis={{ expandable: true, rows: 2, symbol: "more" }}
      style={{
        background: "#fafafa",
        borderInlineStart: "3px solid #d9d9d9",
        fontSize: 12,
        margin: 0,
        padding: "4px 8px",
      }}
      type="secondary"
    >
      <Typography.Text strong style={{ fontSize: 12 }} type="secondary">
        ქართული:{" "}
      </Typography.Text>
      {text}
    </Typography.Paragraph>
  );
}

function saveFailure(error: unknown): SaveFailure {
  if (error instanceof AdminSaveError) {
    return { details: error.details, message: error.message };
  }
  return { details: [], message: "Saving failed. Try again in a minute." };
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .filter(([, entry]) => entry !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableJson(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}
