import type { ReactNode } from "react";

import {
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_GUIDE,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { Reveal } from "@/components/Reveal";

type ClusterGuideLeadProps = {
  body: ReactNode;
  eyebrow: string;
  title: string;
};

export async function ClusterGuideLead({
  body,
  eyebrow,
  title,
}: ClusterGuideLeadProps) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <Reveal>
            <ClusterSectionIntro
              eyebrow={eyebrow}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={title}
              titleClassName={CLUSTER_TITLE_GUIDE}
            />
          </Reveal>
          <Reveal delay={60}>
            <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              {body}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
