import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { LIZARD_HOUSE_CONFIG } from "@/components/conflictGuideConfig";
import { ConflictGuideSections } from "@/components/ConflictGuideSections";

export async function LizardHousePage({
  guideId,
  heroSrc,
  locale,
  species,
}: ClusterGuideViewProps) {
  return (
    <ClusterPageFrame
      guideId={guideId}
      heroObjectClass="object-[50%_55%]"
      heroSrc={heroSrc}
      locale={locale}
    >
      <ConflictGuideSections config={LIZARD_HOUSE_CONFIG} species={species} />
    </ClusterPageFrame>
  );
}
