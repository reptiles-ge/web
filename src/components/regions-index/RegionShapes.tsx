import type { RegionPathId } from "@/data/georgia-paths";

import {
  georgiaRegionPaths,
  georgiaRegionViewBoxes,
} from "@/data/georgia-paths";
import { cn } from "@/lib/cn";

import { regionShapeId } from "./shared";

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
