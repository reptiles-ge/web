"use client";

import { useTranslations } from "next-intl";

import { ClusterContentSection } from "@/components/ClusterContentSection";

const COMPARE_ROWS = ["risk", "fangs", "lookalike", "emergency"] as const;
const COMPARE_COLS = [
  { header: "compareColViper", value: "compareViper" },
  { header: "compareColMalpolon", value: "compareMalpolon" },
] as const;

export function VenomousSnakesCompare() {
  const t = useTranslations("venomousSnakes");

  return (
    <ClusterContentSection
      body={t("compareBody")}
      eyebrow={t("compareEyebrow")}
      id="compare"
      title={t("compareTitle")}
    >
      <div className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[640px] border-y border-border text-left">
          <thead>
            <tr className="border-b border-border text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              <th className="py-4 pr-4 font-medium">{t("compareColTrait")}</th>
              {COMPARE_COLS.map((col) => (
                <th className="py-4 pr-4 font-medium" key={col.header}>
                  {t(col.header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row) => (
              <tr
                className="border-b border-border/80 align-top last:border-b-0"
                key={row}
              >
                <th className="py-4 pr-4 text-[14px] font-medium text-foreground">
                  {t(`compareRow.${row}`)}
                </th>
                {COMPARE_COLS.map((col) => (
                  <td
                    className="py-4 pr-4 text-[14px] leading-relaxed text-muted-foreground"
                    key={col.value}
                  >
                    {t(`${col.value}.${row}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ClusterContentSection>
  );
}
