"use client";

import dynamic from "next/dynamic";

import type { HalyomorphaRangeMapProps } from "@/components/map/HalyomorphaRangeMapTypes";

const HalyomorphaRangeMapClient = dynamic(
  () =>
    import("@/components/map/HalyomorphaRangeMapClient").then(
      (mod) => mod.HalyomorphaRangeMapClient,
    ),
  {
    loading: () => <HalyomorphaMapFallback />,
    ssr: false,
  },
);

export function HalyomorphaRangeMap(props: HalyomorphaRangeMapProps) {
  return (
    <div
      aria-label={props.copy.mapAria}
      className="relative h-[360px] overflow-hidden rounded-media border border-white/10 bg-ink shadow-[0_24px_80px_-48px_rgba(0,0,0,0.9)] md:h-[620px]"
      data-halyomorpha-map=""
      role="region"
    >
      <span className="sr-only">{props.copy.loadingLabel}</span>
      <HalyomorphaRangeMapClient {...props} />
    </div>
  );
}

function HalyomorphaMapFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(111,173,136,0.16),transparent_42%),linear-gradient(135deg,#111a15,#060908)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[42px_42px] opacity-25" />
    </div>
  );
}
