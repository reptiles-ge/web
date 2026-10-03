import { getTranslations } from "next-intl/server";

import type { DangerLevel, SpeciesStat } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { BiologyExpandable } from "@/components/BiologyExpandable";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { dangerPageHref } from "@/lib/dangerLevels";
import { isPlaceholderBody } from "@/lib/speciesContent";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type SpeciesProfileFactsProps = {
  danger?: DangerLevel;
  dangerValue: null | string;
  displayStats: SpeciesStat[];
  editable: boolean;
  interaction?: string;
  linkDangerStats: boolean;
  locale: AppLocale;
  speciesId: string;
  stats: SpeciesStat[];
};

export async function SpeciesProfileFacts({
  danger,
  dangerValue,
  displayStats,
  editable,
  interaction,
  linkDangerStats,
  locale,
  speciesId,
  stats,
}: SpeciesProfileFactsProps) {
  const t = await getTranslations({ locale, namespace: "profile" });
  const interactionBody =
    interaction && !isPlaceholderBody(interaction) ? interaction : null;
  const cellSpans = statCellSpans(displayStats.length);

  if (displayStats.length === 0 && !interactionBody) return null;

  return (
    <>
      {displayStats.length > 0 ? (
        <section
          className={
            interactionBody
              ? "bg-background pt-20 pb-8 lg:pt-28 lg:pb-10"
              : "bg-background py-20 lg:py-28"
          }
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("atAGlance")}
            </p>
            <AnchoredHeading
              anchorLabel={t("anchorLink")}
              className="mt-5 max-w-2xl font-display text-display-title font-bold"
              id={SPECIES_SECTION_IDS.atAGlance}
            >
              {t("atAGlanceTitle")}
            </AnchoredHeading>
            <div className="mt-12 grid gap-px overflow-hidden rounded-media bg-border sm:grid-cols-2 md:grid-cols-3">
              {displayStats.map((stat, index) => (
                <div
                  className={cn(
                    "min-w-0 bg-background p-5 sm:p-6 lg:p-8",
                    cellSpans[index],
                  )}
                  key={stat.label}
                >
                  <p
                    className="text-[10px] leading-relaxed tracking-[0.16em] wrap-break-word text-muted-foreground"
                    data-content-field={
                      editable
                        ? `stats.${stats.indexOf(stat)}.label`
                        : undefined
                    }
                    data-content-id={editable ? speciesId : undefined}
                    data-content-kind={editable ? "species" : undefined}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="mt-3 font-display text-[20px] leading-tight font-medium wrap-anywhere lg:text-[24px]"
                    data-content-field={
                      editable
                        ? `stats.${stats.indexOf(stat)}.value`
                        : undefined
                    }
                    data-content-id={editable ? speciesId : undefined}
                    data-content-kind={editable ? "species" : undefined}
                  >
                    <SpeciesProfileStatValue
                      danger={danger}
                      dangerValue={dangerValue}
                      linkDangerStats={linkDangerStats}
                      value={stat.value}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {interactionBody ? (
        <section
          className={
            displayStats.length > 0
              ? "bg-background pb-20 lg:pb-28"
              : "bg-background py-20 lg:py-28"
          }
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <aside className="max-w-3xl border-l-4 border-gold bg-surface p-5 sm:px-6">
              <AnchoredHeading
                anchorLabel={t("anchorLink")}
                className="font-display text-[20px] font-medium text-foreground"
                id={SPECIES_SECTION_IDS.interaction}
              >
                {t("interaction")}
              </AnchoredHeading>
              <BiologyExpandable
                body={interactionBody}
                editorField={editable ? "interaction" : undefined}
                needsExpand={interactionBody.length > 260}
                readLess={t("readLess")}
                readMore={t("readMore")}
                speciesId={editable ? speciesId : undefined}
              />
            </aside>
          </div>
        </section>
      ) : null}
    </>
  );
}

const LAST_CELL_SPAN_MD = ["md:col-span-1", "md:col-span-3", "md:col-span-2"];

function SpeciesProfileStatValue({
  danger,
  dangerValue,
  linkDangerStats,
  value,
}: {
  danger?: DangerLevel;
  dangerValue: null | string;
  linkDangerStats: boolean;
  value: string;
}) {
  if (linkDangerStats && dangerValue && value === dangerValue) {
    return (
      <Link
        className="transition-colors hover:text-primary"
        href={dangerPageHref(danger)}
      >
        {value}
      </Link>
    );
  }

  return value;
}

function statCellSpans(count: number) {
  const spans = Array.from({ length: count }, () => "");
  if (count === 0) return spans;

  spans[count - 1] = cn(
    count % 2 === 1 && "sm:col-span-2",
    LAST_CELL_SPAN_MD[count % 3],
  );
  return spans;
}
