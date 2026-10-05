"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  createHalyomorphaRangeMap,
  type HalyomorphaRangeMapEngine,
} from "@/components/map/HalyomorphaRangeMapEngine";
import {
  type HalyomorphaFieldRecord,
  type HalyomorphaRangeMapClientProps,
  type HalyomorphaRangeMapCopy,
} from "@/components/map/HalyomorphaRangeMapTypes";

export function HalyomorphaRangeMapClient({
  copy,
  hatchId,
  hoveredRegionId,
  onHoverRegion,
  onOverviewChange,
  onSelectRecord,
  onSelectRegion,
  range,
  records,
  regions,
  resetSignal,
  selectedRecord,
  selectedRegionId,
}: HalyomorphaRangeMapClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HalyomorphaRangeMapEngine | null>(null);
  const regionSyncedRef = useRef(false);
  const resetSignalRef = useRef(resetSignal);
  const [popupNode] = useState(() =>
    typeof document === "undefined" ? null : document.createElement("div"),
  );
  const activeRecord = useMemo(
    () =>
      selectedRecord
        ? (records.find((record) => record.id === selectedRecord.id) ?? null)
        : null,
    [records, selectedRecord],
  );

  const {
    noRegionRecordsLabel,
    regionRecordsLabel,
    zoomInLabel,
    zoomOutLabel,
  } = copy;
  const emitHoverRegion = useEffectEvent(onHoverRegion);
  const emitOverviewChange = useEffectEvent(onOverviewChange);
  const emitSelectRecord = useEffectEvent(onSelectRecord);
  const emitSelectRegion = useEffectEvent(onSelectRegion);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !popupNode) return;

    const engine = createHalyomorphaRangeMap({
      container,
      hatchId,
      labels: {
        noRegionRecordsLabel,
        regionRecordsLabel,
        zoomInLabel,
        zoomOutLabel,
      },
      onHoverRegion: (regionId) => emitHoverRegion(regionId),
      onOverviewChange: (atOverview) => emitOverviewChange(atOverview),
      onSelectRecord: (recordId) => emitSelectRecord(recordId),
      onSelectRegion: (regionId) => emitSelectRegion(regionId),
      popupNode,
      range,
      records,
      regions,
    });
    engineRef.current = engine;
    regionSyncedRef.current = false;

    return () => {
      engineRef.current = null;
      engine.destroy();
    };
  }, [
    hatchId,
    noRegionRecordsLabel,
    popupNode,
    range,
    records,
    regionRecordsLabel,
    regions,
    zoomInLabel,
    zoomOutLabel,
  ]);

  useEffect(() => {
    engineRef.current?.selectRegion(selectedRegionId, regionSyncedRef.current);
    regionSyncedRef.current = true;
  }, [selectedRegionId]);

  useEffect(() => {
    engineRef.current?.hoverRegion(hoveredRegionId);
  }, [hoveredRegionId]);

  useEffect(() => {
    engineRef.current?.focusRecord(
      activeRecord,
      selectedRecord?.reveal ?? false,
    );
  }, [activeRecord, selectedRecord]);

  useEffect(() => {
    if (resetSignalRef.current === resetSignal) return;
    resetSignalRef.current = resetSignal;
    engineRef.current?.reset();
  }, [resetSignal]);

  return (
    <>
      <div
        aria-label={copy.mapAria}
        className="absolute inset-0"
        ref={containerRef}
        role="group"
      />
      {popupNode && activeRecord
        ? createPortal(
            <RecordPopup
              copy={copy}
              onClose={() => onSelectRecord(null)}
              record={activeRecord}
            />,
            popupNode,
          )
        : null}
    </>
  );
}

function RecordPopup({
  copy,
  onClose,
  record,
}: {
  copy: HalyomorphaRangeMapCopy;
  onClose: () => void;
  record: HalyomorphaFieldRecord;
}) {
  const meta = [record.formattedDate, record.author]
    .filter(Boolean)
    .join(" · ");
  // const sourceUrl =
  //   record.url && /^https?:\/\//.test(record.url) ? record.url : null;

  return (
    <dialog
      aria-label={record.accessibleLabel}
      className="relative m-0 flex h-auto w-64 max-w-[calc(100vw-5rem)] gap-3 border-0 bg-transparent p-3 text-foreground"
      open
    >
      {record.thumbSrc ? (
        <Image
          alt={record.imageAlt}
          className="size-16 shrink-0 rounded-xl object-cover"
          height={128}
          loading="lazy"
          src={record.thumbSrc}
          width={128}
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="pr-6 text-[11px] leading-tight font-medium tracking-[0.06em] text-muted-foreground uppercase">
          {record.kind === "photo"
            ? copy.photoRecordLabel
            : copy.locationRecordLabel}
        </div>
        <div className="mt-1 text-[15px] leading-snug font-semibold wrap-break-word">
          {record.locality}
        </div>
        {meta ? (
          <div className="mt-0.5 text-[13px] leading-snug wrap-break-word text-muted-foreground">
            {meta}
          </div>
        ) : null}
        {record.galleryHref && record.gallerySrc ? (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] leading-snug font-medium">
            {record.galleryHref && record.gallerySrc ? (
              <a
                className="underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                data-species-gallery-src={record.gallerySrc}
                href={record.galleryHref}
              >
                {copy.galleryAction}
              </a>
            ) : null}
            {/* {sourceUrl ? (
              <a
                className="underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                href={sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                {copy.sourceAction}
                <span aria-hidden="true"> ↗</span>
              </a>
            ) : null} */}
          </div>
        ) : null}
      </div>
      <button
        aria-label={copy.closeLabel}
        className="absolute top-1.5 right-1.5 inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
        onClick={onClose}
        type="button"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </dialog>
  );
}
