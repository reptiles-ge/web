import { ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { SpeciesSource } from "@/data/species";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { SourceLink } from "@/components/SourceLink";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type SpeciesSourcesProps = {
  sources: SpeciesSource[];
  speciesId: string;
};

export async function SpeciesSources({
  sources,
  speciesId,
}: SpeciesSourcesProps) {
  if (sources.length === 0) return null;

  const t = await getTranslations("profile");

  return (
    <section className="border-t border-border bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <details className="group max-w-2xl">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-left marker:content-none [&::-webkit-details-marker]:hidden">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                {t("sourcesEyebrow")}
              </p>
              <AnchoredHeading
                anchorLabel={t("anchorLink")}
                className="mt-3 font-display text-display-card text-foreground"
                id={SPECIES_SECTION_IDS.sources}
                showAnchor={false}
              >
                {t("sourcesTitle")}
              </AnchoredHeading>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:border-foreground/20 group-open:text-foreground">
              <ChevronDown
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.75}
              />
            </span>
          </summary>
          <ul className="mt-8 space-y-0 border-t border-border">
            {sources.map((source) => (
              <li
                className="border-b border-border py-4 text-[15px] leading-relaxed text-foreground/80"
                key={source.name}
              >
                {source.url ? (
                  <SourceLink href={source.url} speciesId={speciesId}>
                    {source.name}
                  </SourceLink>
                ) : (
                  <span>{source.name}</span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            {t("sourcesNote")}
          </p>
        </details>
      </div>
    </section>
  );
}
