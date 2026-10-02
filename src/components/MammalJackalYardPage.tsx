import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { JACKAL_YARD_CONFIG } from "@/components/conflictGuideConfig";
import { ConflictGuideSections } from "@/components/ConflictGuideSections";
import { toSpeciesCards } from "@/data/speciesCard";

export async function MammalJackalYardPage({
  guideId,
  heroSrc,
  locale,
  species,
}: ClusterGuideViewProps) {
  return (
    <ClusterPageFrame
      guideId={guideId}
      heroObjectClass="object-[50%_40%]"
      heroSrc={heroSrc}
      locale={locale}
    >
      <ConflictGuideSections
        config={JACKAL_YARD_CONFIG}
        species={toSpeciesCards(species)}
      />
    </ClusterPageFrame>
  );
}
