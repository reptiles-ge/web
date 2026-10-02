import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { SPIDER_BITE_CONFIG } from "@/components/safetyGuideConfig";
import { SafetyGuideSections } from "@/components/SafetyGuideSections";
import { toSpeciesCards } from "@/data/speciesCard";

export async function SpiderBitePage({
  guideId,
  heroSrc,
  locale,
  species,
}: ClusterGuideViewProps) {
  return (
    <ClusterPageFrame
      attributionSourcesHref="#sources"
      guideId={guideId}
      heroObjectClass="object-[50%_70%]"
      heroSrc={heroSrc}
      locale={locale}
    >
      <SafetyGuideSections
        config={SPIDER_BITE_CONFIG}
        species={toSpeciesCards(species)}
      />
    </ClusterPageFrame>
  );
}
