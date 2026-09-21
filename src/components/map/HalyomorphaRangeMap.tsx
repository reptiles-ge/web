"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import {
  HALYOMORPHA_REGION_QUERY_PARAM,
  type HalyomorphaRangeMapProps,
} from "@/components/map/HalyomorphaRangeMapTypes";

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || shouldLoadMap) return;
    if (
      new URLSearchParams(window.location.search).has(
        HALYOMORPHA_REGION_QUERY_PARAM,
      )
    ) {
      const frame = window.requestAnimationFrame(() => {
        setShouldLoadMap(true);
        wrapper.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return () => window.cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoadMap(true);
        observer.disconnect();
      },
      { rootMargin: "420px" },
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [shouldLoadMap]);

  return (
    <div
      aria-label={props.copy.mapAria}
      className="relative isolate z-0 h-[430px] overflow-hidden rounded-media border border-white/10 bg-ink shadow-[0_24px_80px_-48px_rgba(0,0,0,0.9)] md:h-[500px] lg:h-[540px]"
      data-halyomorpha-map=""
      ref={wrapperRef}
      role="region"
    >
      <span className="sr-only">{props.copy.loadingLabel}</span>
      {shouldLoadMap ? (
        <HalyomorphaRangeMapClient {...props} />
      ) : (
        <HalyomorphaMapFallback />
      )}
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
