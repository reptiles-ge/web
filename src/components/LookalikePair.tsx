"use client";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { useSpeciesHref } from "@/components/LocaleSwitchProvider";
import { Link } from "@/i18n/navigation";
import { LOOKALIKE_SIZES } from "@/lib/imageSizes";
import { speciesImageAlt } from "@/lib/speciesMeta";

type LookalikePairProps = {
  a: Species;
  b: Species;
  locale: AppLocale;
  vs: string;
};

export function LookalikePair({ a, b, locale, vs }: LookalikePairProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-card border border-border bg-card p-4 sm:gap-5 sm:p-5">
      <LookalikeSide locale={locale} species={a} />
      <span className="text-[11px] tracking-[0.18em] text-muted-foreground">
        {vs}
      </span>
      <LookalikeSide locale={locale} species={b} />
    </div>
  );
}

function LookalikeSide({
  locale,
  species,
}: {
  locale: AppLocale;
  species: Species;
}) {
  return (
    <Link className="group min-w-0" href={useSpeciesHref(species.id, locale)}>
      <span className="relative block aspect-5/4 overflow-hidden rounded-2xl bg-ink">
        <CoverImage
          alt={speciesImageAlt(
            species.commonName,
            species.scientificName,
            species.location,
          )}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes={LOOKALIKE_SIZES}
          src={species.mobileImage ?? species.image}
        />
      </span>
      <span className="mt-3 block font-display text-[15px] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[16px]">
        {species.commonName}
      </span>
      <span className="mt-1 block text-[12px] text-muted-foreground italic">
        {species.scientificName}
      </span>
    </Link>
  );
}
