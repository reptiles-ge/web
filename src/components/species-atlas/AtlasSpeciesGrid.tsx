"use client";

import { AtlasSpeciesCard } from "@/components/species-atlas/AtlasSpeciesCard";
import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

type AtlasSpeciesGridProps = {
  species: Species[];
  locale: AppLocale;
};

export function AtlasSpeciesGrid({ species, locale }: AtlasSpeciesGridProps) {
  return (
    <div className="mt-12">
      <ul className="grid gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3 xl:gap-8">
        {species.map((item, index) => (
          <li key={item.id}>
            <AtlasSpeciesCard
              species={item}
              locale={locale}
              index={index}
              eager={index < 3}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
