import { useTranslations } from "next-intl";

import { ClusterContentSection } from "@/components/ClusterContentSection";

const COMPARE_ROWS = ["risk", "fangs", "lookalike", "emergency"] as const;

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
              <th className="py-4 pr-4 font-medium">{t("compareColViper")}</th>
              <th className="py-4 pr-4 font-medium">
                {t("compareColMalpolon")}
              </th>
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
                <td className="py-4 pr-4 text-[14px] leading-relaxed text-muted-foreground">
                  {t(`compareViper.${row}`)}
                </td>
                <td className="py-4 pr-4 text-[14px] leading-relaxed text-muted-foreground">
                  {t(`compareMalpolon.${row}`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ClusterContentSection>
  );
}
