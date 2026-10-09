import { GEORGIA_MAP_VIEWBOX } from "@/data/georgia-paths";
import { regions } from "@/data/mapRegions";
import { cn } from "@/lib/cn";

export function GroupHubRegionsMap({
  className,
  speciesIds,
}: {
  className?: string;
  speciesIds: ReadonlySet<string>;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("block h-auto w-full", className)}
      viewBox={GEORGIA_MAP_VIEWBOX}
    >
      {regions.map((region) => (
        <path
          className={
            region.speciesIds.some((id) => speciesIds.has(id))
              ? "fill-[#6fad88]/45 stroke-white/55"
              : "fill-white/8 stroke-white/30"
          }
          d={region.path}
          key={region.id}
          strokeLinejoin="round"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
