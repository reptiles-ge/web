import { getTranslations } from "next-intl/server";

import type { DangerLevel, SpeciesStat } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { BiologyExpandable } from "@/components/BiologyExpandable";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { dangerPageHref } from "@/lib/dangerLevels";
import { isPlaceholderBody, isSizeStatLabel } from "@/lib/speciesContent";
import {
  getSpeciesFactVisual,
  IUCN_SCALE,
  type SpeciesFactVisual,
} from "@/lib/speciesFactVisuals";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type FactTile = {
  stat: SpeciesStat;
  visual: null | SpeciesFactVisual;
  wide: boolean;
};

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

const DESKTOP_COLUMNS = 4;
const DESKTOP_SPAN = [
  "",
  "lg:col-span-1",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-4",
];

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
  const tiles = factTiles(displayStats, locale);

  if (tiles.length === 0 && !interactionBody) return null;

  return (
    <div className="min-w-0">
      {tiles.length > 0 ? (
        <section>
          <h2
            className="px-6 pt-7 pb-3 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase lg:sr-only"
            id={SPECIES_SECTION_IDS.atAGlance}
          >
            {t("atAGlanceTitle")}
          </h2>
          <dl className="grid grid-cols-2 gap-2 px-4 lg:h-full lg:grid-cols-4 lg:gap-4 lg:px-0">
            {tiles.map((tile, index) => (
              <div
                className={cn(
                  "min-w-0 rounded-[22px] bg-card px-4 pt-[15px] pb-4 shadow-[0_1px_2px_rgba(14,20,17,0.04)] lg:rounded-[26px] lg:px-[22px] lg:py-5 lg:shadow-[0_16px_40px_rgba(14,20,17,0.06)]",
                  tileSpan(tiles, index),
                )}
                key={tile.stat.label}
              >
                <dt
                  className="text-[11px] leading-relaxed font-medium tracking-[0.14em] wrap-break-word text-muted-foreground"
                  data-content-field={
                    editable && tile.visual?.kind !== "iucn"
                      ? `stats.${stats.indexOf(tile.stat)}.label`
                      : undefined
                  }
                  data-content-id={
                    editable && tile.visual?.kind !== "iucn"
                      ? speciesId
                      : undefined
                  }
                  data-content-kind={
                    editable && tile.visual?.kind !== "iucn"
                      ? "species"
                      : undefined
                  }
                >
                  {tile.visual?.kind === "iucn"
                    ? t("conservationStatus")
                    : tile.stat.label}
                </dt>
                <dd className="mt-[7px] font-display text-[16px] leading-[1.3] font-semibold wrap-break-word text-foreground lg:mt-2 lg:text-[19px]">
                  {tile.visual?.kind === "iucn" ? (
                    <span className="inline-flex flex-wrap items-center gap-2">
                      {t(`iucnStatus.${tile.visual.code}`)}
                      <span
                        className={cn(
                          "inline-flex min-h-6 items-center rounded-md px-1.5 font-sans text-[11px] font-semibold",
                          iucnTone(tile.visual.code),
                        )}
                      >
                        {tile.visual.code}
                      </span>
                    </span>
                  ) : (
                    <>
                      <span
                        data-content-field={
                          editable
                            ? `stats.${stats.indexOf(tile.stat)}.value`
                            : undefined
                        }
                        data-content-id={editable ? speciesId : undefined}
                        data-content-kind={editable ? "species" : undefined}
                      >
                        <SpeciesProfileStatValue
                          danger={danger}
                          dangerValue={dangerValue}
                          linkDangerStats={linkDangerStats}
                          value={tile.stat.value}
                        />
                      </span>
                      {tile.visual ? <FactVisual visual={tile.visual} /> : null}
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      {interactionBody ? (
        <aside className="mx-4 mt-2 rounded-[22px] bg-gold/12 p-5 lg:mx-0 lg:mt-4 lg:rounded-[26px] lg:px-7 lg:py-6">
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className="font-display text-[19px] font-semibold text-foreground"
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
      ) : null}
    </div>
  );
}

function factTiles(stats: SpeciesStat[], locale: AppLocale): FactTile[] {
  const tiles = stats.map((stat) => {
    const visual = getSpeciesFactVisual(stat, locale);
    return {
      stat,
      visual,
      wide: visual?.kind === "range" && isSizeStatLabel(stat.label),
    };
  });
  return [
    ...tiles.filter((tile) => tile.wide),
    ...tiles.filter((tile) => !tile.wide),
  ];
}

function FactVisual({ visual }: { visual: SpeciesFactVisual }) {
  if (visual.kind === "iucn") return null;

  return (
    <span aria-hidden="true" className="mt-3 block lg:mt-3.5">
      <span className="relative block h-1.5 overflow-hidden rounded-full bg-surface lg:h-2">
        <span
          className="absolute inset-y-0 rounded-full bg-primary"
          style={{
            left: `${visual.start * 100}%`,
            width: `${Math.max((visual.end - visual.start) * 100, 3)}%`,
          }}
        />
      </span>
      <span className="mt-1.5 flex justify-between font-sans text-[10.5px] font-normal text-muted-foreground tabular-nums">
        <span>0</span>
        <span>{visual.scaleLabel}</span>
      </span>
    </span>
  );
}

function iucnTone(code: (typeof IUCN_SCALE)[number]) {
  if (code === "LC") return "bg-primary text-white dark:text-ink";
  if (code === "NT" || code === "VU") return "bg-gold text-white";
  return "bg-destructive text-white";
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

function tileSpan(tiles: FactTile[], index: number) {
  const tile = tiles[index];
  if (tile.wide) return "col-span-2";
  if (index < tiles.length - 1) return "";

  const singles = tiles.filter((item) => !item.wide).length;
  const used = tiles.reduce((sum, item) => sum + (item.wide ? 2 : 1), 0) - 1;
  const rest = DESKTOP_COLUMNS - (used % DESKTOP_COLUMNS);
  return cn(singles % 2 === 1 && "col-span-2", DESKTOP_SPAN[rest]);
}
