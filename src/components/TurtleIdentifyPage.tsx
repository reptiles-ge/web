"use client";

import { useLocale, useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuideViewProps } from "@/lib/clusterGuides";

import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import { TurtleIdentifyChooser } from "@/components/TurtleIdentifyChooser";
import { TurtleIdentifyFlow } from "@/components/TurtleIdentifyFlow";
import { TurtleIdentifyMatrix } from "@/components/TurtleIdentifyMatrix";
import { Link } from "@/i18n/navigation";
import { collectTurtleRegions, TURTLE_ORDER } from "@/lib/turtleIdentify";

export function TurtleIdentifyPage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = useTranslations("turtleIdentify");
  const locale = useLocale() as AppLocale;
  const byId = new Map(species.map((item) => [item.id, item]));
  const turtles = TURTLE_ORDER.map((id) => byId.get(id)).filter(
    (item): item is Species => Boolean(item),
  );
  const testudo = byId.get("testudo-graeca");
  const emys = byId.get("emys-orbicularis");
  const mauremys = byId.get("mauremys-caspica");
  const slider = byId.get("trachemys-scripta");
  const regions = collectTurtleRegions(turtles);

  return (
    <ClusterPageFrame ctaHash="#flow" guideId={guideId} heroSrc={heroSrc}>
      <ClusterGuideLead
        body={
          <>
            <p>{t("guideP1")}</p>
            <p>
              {t.rich("guideP2", {
                index: (chunks) => (
                  <Link
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                    href="/turtles/saxeoebebi"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </>
        }
        eyebrow={t("guideEyebrow")}
        title={t("guideTitle")}
      />

      <TurtleIdentifyFlow
        emys={emys}
        locale={locale}
        mauremys={mauremys}
        slider={slider}
        testudo={testudo}
      />

      <TurtleIdentifyMatrix
        emys={emys}
        locale={locale}
        mauremys={mauremys}
        turtles={turtles}
      />

      <TurtleIdentifyChooser
        locale={locale}
        regions={regions}
        turtles={turtles}
      />
    </ClusterPageFrame>
  );
}
