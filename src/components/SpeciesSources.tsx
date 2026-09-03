"use client";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import type { SpeciesSource } from "@/data/species";
import { trackEvent } from "@/lib/analytics";
import { SPECIES_SECTION_IDS } from "@/lib/toc";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

type SpeciesSourcesProps = {
  sources: SpeciesSource[];
  speciesId: string;
};

export function SpeciesSources({ sources, speciesId }: SpeciesSourcesProps) {
  const t = useTranslations("profile");

  if (sources.length === 0) return null;

  return (
    <section className="border-t border-border bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <details className="group max-w-2xl">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-left marker:content-none [&::-webkit-details-marker]:hidden">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("sourcesEyebrow")}
              </p>
              <AnchoredHeading
                id={SPECIES_SECTION_IDS.sources}
                className="mt-3 font-display text-[clamp(1.35rem,2.4vw,1.75rem)] leading-[1.1] text-foreground"
                anchorLabel={t("anchorLink")}
                showAnchor={false}
              >
                {t("sourcesTitle")}
              </AnchoredHeading>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:border-foreground/20 group-open:text-foreground">
              <ChevronDown
                className="size-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </span>
          </summary>
          <ul className="mt-8 space-y-0 border-t border-border">
            {sources.map((source) => (
              <li
                key={source.name}
                className="border-b border-border py-4 text-[15px] leading-relaxed text-foreground/80"
              >
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary"
                    onClick={() =>
                      trackEvent("source_click", {
                        species_id: speciesId,
                        link_type: "source",
                      })
                    }
                  >
                    {source.name}
                  </a>
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
