import type { CSSProperties } from "react";

import { CoverImage } from "@/components/CoverImage";
import {
  GROUP_HUB_ILLUSTRATIONS,
  GROUP_HUBS,
  type GroupHubId,
} from "@/lib/groupHubs";

type WallHub = Extract<
  GroupHubId,
  "amphibians" | "birds" | "lizards" | "mammals" | "snakes" | "turtles"
>;

type WallRow = {
  direction: "l" | "r";
  durationLg: number;
  durationSm: number;
  hubs: WallHub[];
  mobile: boolean;
};

const SQUARE_HUBS: ReadonlySet<WallHub> = new Set(["birds", "mammals"]);

export const HERO_WALL_ROWS: WallRow[] = [
  {
    direction: "l",
    durationLg: 95,
    durationSm: 70,
    hubs: ["birds", "turtles", "mammals", "amphibians", "lizards", "snakes"],
    mobile: true,
  },
  {
    direction: "r",
    durationLg: 104,
    durationSm: 79,
    hubs: ["amphibians", "lizards", "mammals", "snakes", "turtles", "birds"],
    mobile: true,
  },
  {
    direction: "l",
    durationLg: 113,
    durationSm: 88,
    hubs: ["mammals", "birds", "snakes", "turtles", "amphibians", "lizards"],
    mobile: true,
  },
  {
    direction: "r",
    durationLg: 122,
    durationSm: 122,
    hubs: ["turtles", "amphibians", "birds", "lizards", "snakes", "mammals"],
    mobile: false,
  },
  {
    direction: "l",
    durationLg: 131,
    durationSm: 131,
    hubs: ["snakes", "mammals", "turtles", "birds", "lizards", "amphibians"],
    mobile: false,
  },
];

export function HeroWall({ labels }: { labels: Record<WallHub, string> }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-[316px] overflow-hidden lg:inset-y-0 lg:h-auto"
    >
      <div className="absolute top-[-52px] left-[-70px] flex w-[560px] -rotate-7 flex-col gap-(--wall-gap) lg:top-[-140px] lg:right-[-130px] lg:left-auto lg:w-[1060px]">
        {HERO_WALL_ROWS.map((row, rowIndex) => (
          <div
            className={
              row.mobile
                ? "hero-wall-row flex w-max gap-(--wall-gap)"
                : "hero-wall-row flex w-max gap-(--wall-gap) max-lg:hidden"
            }
            data-direction={row.direction}
            key={rowIndex}
            style={
              {
                "--wall-duration-lg": `${row.durationLg}s`,
                "--wall-duration-sm": `${row.durationSm}s`,
              } as CSSProperties
            }
          >
            {[...row.hubs, ...row.hubs].map((hub, index) => (
              <WallTile hub={hub} key={index} label={labels[hub]} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function heroWallSpeciesIds(): Record<WallHub, string> {
  const hubs = new Set(HERO_WALL_ROWS.flatMap((row) => row.hubs));
  return Object.fromEntries(
    [...hubs].map((hub) => [hub, GROUP_HUBS[hub].heroSpeciesId]),
  ) as Record<WallHub, string>;
}

function WallTile({ hub, label }: { hub: WallHub; label: string }) {
  const square = SQUARE_HUBS.has(hub);
  return (
    <span
      className={`relative block h-[124px] shrink-0 overflow-hidden rounded-[22px] bg-[#151c18] lg:h-[196px] lg:rounded-[28px] ${
        square ? "w-[124px] lg:w-[196px]" : "w-[186px] lg:w-[294px]"
      }`}
    >
      <CoverImage
        alt=""
        className="object-cover"
        sizes={
          square
            ? "(min-width: 1024px) 196px, 124px"
            : "(min-width: 1024px) 294px, 186px"
        }
        src={GROUP_HUB_ILLUSTRATIONS[hub]}
      />
      {label ? (
        <span className="absolute bottom-2 left-2 inline-flex h-6 items-center rounded-full bg-ink/65 px-2.5 text-[11px] whitespace-nowrap text-white/90 lg:bottom-3 lg:left-3 lg:h-[30px] lg:px-3 lg:text-[12px]">
          {label}
        </span>
      ) : null}
    </span>
  );
}
