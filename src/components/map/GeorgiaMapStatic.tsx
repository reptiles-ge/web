import { RangeHatchPattern } from "@/components/map/RangeHatch";
import {
  GEORGIA_MAP_VIEWBOX,
  georgiaRegionLabelPoints,
} from "@/data/georgia-paths";
import { regions } from "@/data/mapRegions";
import { cn } from "@/lib/cn";

type GeorgiaMapStaticProps = {
  className?: string;
  hatchId: string;
  highlightedIds: string[];
  showKeys?: boolean;
};

const [, , VIEWBOX_WIDTH, VIEWBOX_HEIGHT] =
  GEORGIA_MAP_VIEWBOX.split(" ").map(Number);

export function GeorgiaMapStatic({
  className,
  hatchId,
  highlightedIds,
  showKeys = true,
}: GeorgiaMapStaticProps) {
  const keys = new Map(highlightedIds.map((id, index) => [id, index + 1]));
  const highlighted = regions.filter((region) => keys.has(region.id));
  const rest = regions.filter((region) => !keys.has(region.id));

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        aria-hidden="true"
        className="block h-auto w-full select-none"
        viewBox={GEORGIA_MAP_VIEWBOX}
      >
        <defs>
          <RangeHatchPattern id={hatchId} size={9} />
        </defs>
        {rest.map((region) => (
          <path
            className="fill-card stroke-foreground/35"
            d={region.path}
            key={region.id}
            strokeLinejoin="round"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {highlighted.map((region) => (
          <path
            className="stroke-primary"
            d={region.path}
            fill={`url(#${hatchId})`}
            key={region.id}
            strokeLinejoin="round"
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {(showKeys ? highlighted : []).map((region) => {
        const [x, y] = georgiaRegionLabelPoints[region.id];
        return (
          <span
            aria-hidden="true"
            className="absolute -translate-1/2"
            data-compact=""
            data-range-mark="key"
            key={region.id}
            style={{
              left: `${(x / VIEWBOX_WIDTH) * 100}%`,
              top: `${(y / VIEWBOX_HEIGHT) * 100}%`,
            }}
          >
            {keys.get(region.id)}
          </span>
        );
      })}
    </div>
  );
}
