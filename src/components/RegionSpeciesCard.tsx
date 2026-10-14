"use client";

import { useLocale } from "next-intl";

import type { RegionSpeciesCardItem } from "@/data/regions";
import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { useSpeciesHref } from "@/components/LocaleSwitchProvider";
import { SpeciesRiskChip } from "@/components/SpeciesDanger";
import { Link } from "@/i18n/navigation";
import { trackSpeciesClick } from "@/lib/analytics";
import { speciesImageAlt } from "@/lib/speciesMeta";

export function RegionSpeciesCard({
  showDanger = false,
  species,
}: {
  showDanger?: boolean;
  species: RegionSpeciesCardItem;
}) {
  const locale = useLocale() as AppLocale;
  return (
    <Link
      className="group relative block aspect-4/5 overflow-hidden rounded-media bg-ink"
      href={useSpeciesHref(species.id, locale)}
      onClick={() =>
        trackSpeciesClick({
          source: "region",
          species_id: species.id,
        })
      }
      prefetch={false}
    >
      <CoverImage
        alt={speciesImageAlt(
          species.commonName,
          species.scientificName,
          species.location,
        )}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        src={species.mobileImage ?? species.image}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[12px] text-white/50 italic">
          {species.scientificName}
        </p>
        <p className="mt-1 font-display text-[22px] font-semibold text-white">
          {species.commonName}
        </p>
        {showDanger ? (
          <div className="mt-3">
            <SpeciesRiskChip species={species} variant="hero" />
          </div>
        ) : (
          <p className="mt-2 text-[12px] text-white/50">{species.location}</p>
        )}
      </div>
    </Link>
  );
}
