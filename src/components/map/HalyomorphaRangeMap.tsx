"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type { HalyomorphaRangeRegionFeatureCollection } from "@/data/halyomorphaRangeRegions";

import {
  HALYOMORPHA_REGION_QUERY_PARAM,
  HALYOMORPHA_REGION_SELECT_EVENT,
  type HalyomorphaLazyMapProps,
  type HalyomorphaRangeMapProps,
} from "@/components/map/HalyomorphaRangeMapTypes";
import { loadHalyomorphaMapSummary } from "@/lib/halyomorphaOccurrenceApi";

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

export function HalyomorphaRangeMap(props: HalyomorphaLazyMapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [mapData, setMapData] = useState<null | Pick<
    HalyomorphaRangeMapProps,
    "occurrenceSummary" | "officialRange" | "regionNames"
  >>(null);
  const [loadError, setLoadError] = useState(false);

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

  useEffect(() => {
    const selectRegion = (event: Event) => {
      const regionId = (event as CustomEvent<{ regionId?: string }>).detail
        ?.regionId;
      if (!regionId) return;
      const url = new URL(window.location.href);
      url.searchParams.set(HALYOMORPHA_REGION_QUERY_PARAM, regionId);
      window.history.replaceState(
        window.history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
      setShouldLoadMap(true);
    };
    window.addEventListener(HALYOMORPHA_REGION_SELECT_EVENT, selectRegion);
    return () =>
      window.removeEventListener(HALYOMORPHA_REGION_SELECT_EVENT, selectRegion);
  }, []);

  useEffect(() => {
    if (!shouldLoadMap) return;
    const controller = new AbortController();
    Promise.all([
      loadHalyomorphaMapSummary(
        props.speciesId,
        props.locale,
        controller.signal,
      ),
      fetch("/geodata/georgia-regions-v1.json", {
        signal: controller.signal,
      }).then((response) => {
        if (!response.ok) throw new Error("Georgia regions request failed");
        return response.json() as Promise<HalyomorphaRangeRegionFeatureCollection>;
      }),
    ])
      .then(([{ regionNames, summary }, georgiaRegions]) => {
        const officialIds = new Set(props.officialRegionIds);
        setMapData({
          occurrenceSummary: summary,
          officialRange: {
            ...georgiaRegions,
            features: georgiaRegions.features.map((feature) => ({
              ...feature,
              properties: {
                ...feature.properties,
                isOfficialRange: officialIds.has(feature.properties.id),
              },
            })),
          },
          regionNames,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadError(true);
      });
    return () => controller.abort();
  }, [shouldLoadMap, props.locale, props.officialRegionIds, props.speciesId]);

  return (
    <div
      aria-label={props.copy.mapAria}
      className="relative isolate z-0 h-[430px] overflow-hidden rounded-media border border-white/10 bg-ink shadow-[0_24px_80px_-48px_rgba(0,0,0,0.9)] md:h-[500px] lg:h-[540px]"
      data-halyomorpha-map=""
      ref={wrapperRef}
      role="region"
    >
      {!mapData && !loadError ? (
        <span className="sr-only">{props.copy.loadingLabel}</span>
      ) : null}
      {mapData ? (
        <HalyomorphaRangeMapClient {...props} {...mapData} />
      ) : loadError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-ink p-6 text-center text-[13px] text-ink-foreground">
          {props.copy.mapError}
        </div>
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
