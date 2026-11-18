import type { RegionPathId } from "@/data/georgia-paths";
import type { RegionAtlasEntry } from "@/data/regions";

import {
  georgiaRegionPaths,
  georgiaRegionViewBoxes,
} from "@/data/georgia-paths";
import { cn } from "@/lib/cn";

export type RegionsIndexRegion = RegionAtlasEntry & { number: string };

export const wrapClass = "mx-auto box-content max-w-[1320px] px-6 lg:px-[60px]";
export const eyebrowClass =
  "text-[11px] font-medium tracking-[0.18em] text-(--nw-muted)";
export const h2Class =
  "mt-2.5 text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] text-(--nw-ink) lg:mt-3.5 lg:text-[44px] lg:leading-[1.1]";
export const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-(--nw-accent)";

export const GROUP_BG_CLASSES = [
  "bg-(--rg-group-0)",
  "bg-(--rg-group-1)",
  "bg-(--rg-group-2)",
  "bg-(--rg-group-3)",
  "bg-(--rg-group-4)",
];

export function RegionShapeDefs({ ids }: { ids: readonly RegionPathId[] }) {
  return (
    <svg aria-hidden="true" className="absolute" height="0" width="0">
      <defs>
        {ids.map((id) => (
          <path d={georgiaRegionPaths[id]} id={regionShapeId(id)} key={id} />
        ))}
      </defs>
    </svg>
  );
}

export function regionShapeId(id: RegionPathId) {
  return `region-shape-${id}`;
}

export function RegionThumb({
  className,
  id,
}: {
  className?: string;
  id: RegionPathId;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("block fill-(--rg-thumb)", className)}
      viewBox={georgiaRegionViewBoxes[id]}
    >
      <use href={`#${regionShapeId(id)}`} />
    </svg>
  );
}
