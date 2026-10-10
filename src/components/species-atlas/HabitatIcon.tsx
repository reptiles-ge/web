import type { HabitatTag } from "@/data/speciesAtlasMeta";

import { cn } from "@/lib/cn";

const HABITAT_PATHS: Record<HabitatTag, string> = {
  forest: "M12 2 5 12h4l-3 5h12l-3-5h4zM12 17v5",
  grassland:
    "M4 20c1-4 2-7 4-9M9 20c0-5 1-9 3-12M14 20c0-4 1-7 3-9M19 20c0-3 0-5 1-7M2 20h20",
  mountain: "m8 3 4 8 5-5 5 15H2z",
  wetland:
    "M2 8c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M2 14c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M2 20c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0",
};

export function HabitatIcon({
  className,
  habitat,
  label,
}: {
  className?: string;
  habitat: HabitatTag;
  label?: string;
}) {
  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn("size-4 shrink-0", className)}
      fill="none"
      role={label ? "img" : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      <path d={HABITAT_PATHS[habitat]} />
    </svg>
  );
}
