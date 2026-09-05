import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  BEAR_ENCOUNTER_CONFIG,
  SafetyGuideSections,
} from "@/components/SafetyGuideSections";

export async function MammalBearPage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  return (
    <ClusterPageFrame
      attributionSourcesHref="#sources"
      guideId={guideId}
      heroObjectClass="object-[50%_45%]"
      heroSrc={heroSrc}
    >
      <SafetyGuideSections config={BEAR_ENCOUNTER_CONFIG} species={species} />
    </ClusterPageFrame>
  );
}
