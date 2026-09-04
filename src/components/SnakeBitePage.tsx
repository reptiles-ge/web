import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { SnakeBiteSections } from "@/components/SnakeBiteSections";

export async function SnakeBitePage({
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
      <SnakeBiteSections species={species} />
    </ClusterPageFrame>
  );
}
