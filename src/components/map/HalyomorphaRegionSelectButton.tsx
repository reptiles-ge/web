"use client";

import type { ReactNode } from "react";

import type { RegionPathId } from "@/data/georgia-paths";

import { HALYOMORPHA_REGION_SELECT_EVENT } from "@/components/map/HalyomorphaRangeMapTypes";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type HalyomorphaRegionSelectButtonProps = {
  children: ReactNode;
  regionId: RegionPathId;
};

export function HalyomorphaRegionSelectButton({
  children,
  regionId,
}: HalyomorphaRegionSelectButtonProps) {
  return (
    <button
      className="text-left transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent(HALYOMORPHA_REGION_SELECT_EVENT, {
            detail: { regionId },
          }),
        );
        document
          .getElementById(SPECIES_SECTION_IDS.range)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      type="button"
    >
      {children}
    </button>
  );
}
