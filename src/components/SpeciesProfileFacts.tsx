import { getTranslations } from "next-intl/server";

import type { DangerLevel, SpeciesStat } from "@/data/species";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { BiologyExpandable } from "@/components/BiologyExpandable";
import { Link } from "@/i18n/navigation";
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
  speciesId,
  stats,
}: SpeciesProfileFactsProps) {
  if (displayStats.length === 0) {
    return null;
  }

  const t = await getTranslations("profile");

  return (
    <section className="bg-background py-20 lg:py-28">
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
        {displayStats.length > 0 ? (
          <div className="mt-12 grid gap-px overflow-hidden rounded-media bg-border sm:grid-cols-2 md:grid-cols-3">
            {displayStats.map((stat) => (
              <div
                className="min-w-0 bg-background p-5 sm:p-6 lg:p-8"
                key={stat.label}
              >
                <p
                  className="text-[10px] leading-relaxed tracking-[0.16em] wrap-break-word text-muted-foreground"
                  data-content-field={
                    editable ? `stats.${stats.indexOf(stat)}.label` : undefined
                  }
                  data-content-id={editable ? speciesId : undefined}
                  data-content-kind={editable ? "species" : undefined}
                >
                  {stat.label}
                </p>
                <p
                  className="mt-3 font-display text-[20px] leading-tight font-medium wrap-anywhere lg:text-[24px]"
                  data-content-field={
                    editable ? `stats.${stats.indexOf(stat)}.value` : undefined
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
        ) : null}
        {interaction && !isPlaceholderBody(interaction) ? (
          <aside className="mt-8 max-w-3xl border-l-4 border-gold bg-surface p-5 sm:px-6">
            <h3 className="font-display text-[20px] font-medium text-foreground">
              {t("interaction")}
            </h3>
            <BiologyExpandable
              body={interaction}
              editorField={editable ? "interaction" : undefined}
              needsExpand={interaction.length > 260}
              readLess={t("readLess")}
              readMore={t("readMore")}
              speciesId={editable ? speciesId : undefined}
            />
          </aside>
        ) : null}
      </div>
    </section>
  );
}

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
