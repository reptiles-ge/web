import { Segmented, Select } from "antd";

import type { AppLocale } from "@/i18n/routing";

import { locales } from "@/i18n/locales";

import type { AdminViewPeriod } from "./views";

type Period = "all" | `${AdminViewPeriod}`;

const PERIODS: Array<{ label: string; value: Period }> = [
  { label: "Today", value: "1" },
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
  { label: "All time", value: "all" },
];

export function LangSelect({
  onChange,
  value,
}: {
  onChange: (lang: AppLocale | undefined) => void;
  value: AppLocale | undefined;
}) {
  return (
    <Select<"all" | AppLocale>
      aria-label="Language"
      onChange={(next) => onChange(next === "all" ? undefined : next)}
      options={[
        { label: "All languages", value: "all" },
        ...locales.map((locale) => ({
          label: locale.toUpperCase(),
          value: locale,
        })),
      ]}
      style={{ width: 140 }}
      value={value ?? "all"}
    />
  );
}

export function PeriodSwitch({
  onChange,
  value,
}: {
  onChange: (days: AdminViewPeriod | undefined) => void;
  value: AdminViewPeriod | undefined;
}) {
  return (
    <Segmented<Period>
      onChange={(next) =>
        onChange(next === "all" ? undefined : (Number(next) as AdminViewPeriod))
      }
      options={PERIODS}
      value={value ? `${value}` : "all"}
    />
  );
}
