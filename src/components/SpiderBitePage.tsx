import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  SPIDER_BITE_CONFIG,
  SafetyGuideSections,
} from "@/components/SafetyGuideSections";

export async function SpiderBitePage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  return (
    <ClusterPageFrame
      attributionSourcesHref="#sources"
      guideId={guideId}
      heroObjectClass="object-[50%_70%]"
      heroSrc={heroSrc}
    >
      <SafetyGuideSections config={SPIDER_BITE_CONFIG} species={species} />
    </ClusterPageFrame>
  );
}
