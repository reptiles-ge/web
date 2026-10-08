import type { AppLocale } from "@/i18n/routing";

import { LookalikePair } from "@/components/LookalikePair";
import { toSpeciesCard } from "@/data/speciesCard";

type LookalikePairGridProps = {
  locale: AppLocale;
  pairs: readonly { a: LookalikeSpecies; b: LookalikeSpecies }[];
  vs: string;
};

type LookalikeSpecies = Parameters<typeof toSpeciesCard>[0];

export function LookalikePairGrid({
  locale,
  pairs,
  vs,
}: LookalikePairGridProps) {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-2">
      {pairs.map((pair) => (
        <div key={`${pair.a.id}-${pair.b.id}`}>
          <LookalikePair
            a={toSpeciesCard(pair.a)}
            b={toSpeciesCard(pair.b)}
            locale={locale}
            vs={vs}
          />
        </div>
      ))}
    </div>
  );
}
