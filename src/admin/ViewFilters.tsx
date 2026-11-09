import { DatePicker, Select } from "antd";
import dayjs, { type Dayjs } from "dayjs";

import type { AppLocale } from "@/i18n/routing";

import { locales } from "@/i18n/locales";

import { lastDays, VIEW_PRESET_DAYS, type ViewRange } from "./viewRange";

const DAY_FORMAT = "YYYY-MM-DD";

export function DateRangeFilter({
  onChange,
  value,
}: {
  onChange: (range: ViewRange) => void;
  value: ViewRange;
}) {
  const today = dayjs(lastDays(1).to);
  return (
    <DatePicker.RangePicker
      allowEmpty={[true, true]}
      aria-label="Period"
      disabledDate={(day) => day.isAfter(today, "day")}
      format={DAY_FORMAT}
      onChange={(dates) =>
        onChange({
          from: dates?.[0]?.format(DAY_FORMAT),
          to: dates?.[1]?.format(DAY_FORMAT),
        })
      }
      placeholder={["All time", "Today"]}
      presets={VIEW_PRESET_DAYS.map(({ days, label }) => {
        const range = lastDays(days);
        return {
          label,
          value: [dayjs(range.from), dayjs(range.to)] as [Dayjs, Dayjs],
        };
      })}
      value={[toDay(value.from), toDay(value.to)]}
    />
  );
}

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

function toDay(value: string | undefined) {
  return value ? dayjs(value) : null;
}
