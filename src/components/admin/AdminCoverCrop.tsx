"use client";

import { Monitor, Smartphone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { AdminCovers } from "@/lib/adminCover";

import { optimizedEntry, optimizedImgSrc } from "@/data/optimizedImages";
import { cn } from "@/lib/cn";
import {
  type CoverCropRect,
  matchesCoverSource,
  parseCoverCrop,
} from "@/lib/coverCrop";

export type CoverCropTarget = "desktop" | "mobile";

type Aspect = { label: string; value: number };

type CropState = {
  aspect: number;
  cx: number;
  cy: number;
  target: CoverCropTarget;
  zoom: number;
};

type Props = {
  commonName: string;
  covers: AdminCovers;
  error: null | string;
  onClose: () => void;
  onSave: (target: CoverCropTarget, crop: CoverCropRect) => void;
  saving: boolean;
  scientificName: string;
  src: string;
};

const MAX_ZOOM = 4;
const KEY_STEP = 0.02;
const ASPECTS: Record<CoverCropTarget, Aspect[]> = {
  desktop: [
    { label: "16:9", value: 16 / 9 },
    { label: "2:1", value: 2 },
    { label: "3:2", value: 3 / 2 },
  ],
  mobile: [
    { label: "4:5", value: 4 / 5 },
    { label: "3:4", value: 3 / 4 },
    { label: "9:16", value: 9 / 16 },
  ],
};

export function AdminCoverCrop({
  commonName,
  covers,
  error,
  onClose,
  onSave,
  saving,
  scientificName,
  src,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<null | { x: number; y: number }>(null);
  const entry = optimizedEntry(src);
  const [ratio, setRatio] = useState(
    entry?.width && entry.height ? entry.width / entry.height : 0,
  );
  const [state, setState] = useState<CropState>(() =>
    initialState(
      matchesCoverSource(covers.desktopSrc, src) &&
        !matchesCoverSource(covers.mobileSrc, src)
        ? "desktop"
        : "mobile",
      covers,
      src,
      entry?.width && entry.height ? entry.width / entry.height : 0,
    ),
  );
  const rect = cropRect(state, ratio);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function moveBy(dx: number, dy: number) {
    setState((current) => {
      const size = cropSize(current, ratio);
      return clampCenter(
        {
          ...current,
          cx: current.cx + dx * size.width,
          cy: current.cy + dy * size.height,
        },
        ratio,
      );
    });
  }

  function setZoom(zoom: number) {
    setState((current) =>
      clampCenter(
        { ...current, zoom: Math.min(MAX_ZOOM, Math.max(1, zoom)) },
        ratio,
      ),
    );
  }

  return (
    <dialog
      aria-labelledby="admin-cover-crop-title"
      className="fixed inset-0 z-100 m-0 hidden size-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-0 backdrop:bg-black/92 open:flex"
      onClose={onClose}
      ref={dialogRef}
    >
      <button
        aria-label="დახურვა"
        className="absolute top-5 right-5 z-20 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white"
        onClick={() => dialogRef.current?.close()}
        type="button"
      >
        <X className="size-5" />
      </button>
      <div className="relative z-10 flex max-h-svh w-[min(96vw,44rem)] flex-col items-center overflow-y-auto px-4 py-8">
        <h2
          className="text-center font-display text-xl font-medium text-white"
          id="admin-cover-crop-title"
        >
          ყდის ქროფი
        </h2>
        <p className="mt-2 max-w-md text-center text-[13px] leading-relaxed text-white/65">
          გადაათრიე ფოტო ჩარჩოში და მოარგე ზუმი. ქროფი ცალკე ფაილად აიტვირთება
          CDN-ზე და მხოლოდ ყდად გამოიყენება — გალერეის ორიგინალი არ იცვლება.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {(["mobile", "desktop"] as const).map((target) => {
            const Icon = target === "mobile" ? Smartphone : Monitor;
            return (
              <button
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-medium",
                  state.target === target
                    ? "bg-white text-ink"
                    : "bg-white/10 text-white/80 hover:bg-white/15",
                )}
                disabled={saving}
                key={target}
                onClick={() =>
                  setState(initialState(target, covers, src, ratio))
                }
                type="button"
              >
                <Icon aria-hidden className="size-3.5" />
                {target === "mobile" ? "მობილური" : "დესკტოპი"}
              </button>
            );
          })}
          <span aria-hidden className="mx-1 h-5 w-px bg-white/15" />
          {ASPECTS[state.target].map((aspect) => (
            <button
              className={cn(
                "h-9 rounded-full px-3 text-[12px] font-medium tabular-nums",
                state.aspect === aspect.value
                  ? "bg-white/25 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/15",
              )}
              disabled={saving}
              key={aspect.label}
              onClick={() =>
                setState((current) =>
                  clampCenter({ ...current, aspect: aspect.value }, ratio),
                )
              }
              type="button"
            >
              {aspect.label}
            </button>
          ))}
        </div>
        <div
          aria-label="ქროფის ჩარჩო — გადაათრიე ან გამოიყენე ისრები"
          className="relative mt-6 shrink-0 cursor-grab touch-none overflow-hidden rounded-xl bg-ink shadow-2xl ring-1 ring-white/20 outline-none select-none focus-visible:ring-2 focus-visible:ring-white active:cursor-grabbing"
          onKeyDown={(event) => {
            const step =
              event.key === "ArrowLeft"
                ? [-KEY_STEP, 0]
                : event.key === "ArrowRight"
                  ? [KEY_STEP, 0]
                  : event.key === "ArrowUp"
                    ? [0, -KEY_STEP]
                    : event.key === "ArrowDown"
                      ? [0, KEY_STEP]
                      : null;
            if (!step) return;
            event.preventDefault();
            moveBy(step[0] ?? 0, step[1] ?? 0);
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
          onPointerDown={(event) => {
            if (saving) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerMove={(event) => {
            const last = drag.current;
            const frame = frameRef.current;
            if (!last || !frame) return;
            drag.current = { x: event.clientX, y: event.clientY };
            moveBy(
              (last.x - event.clientX) / frame.clientWidth,
              (last.y - event.clientY) / frame.clientHeight,
            );
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onWheel={(event) => {
            if (saving) return;
            setZoom(state.zoom * (event.deltaY < 0 ? 1.08 : 1 / 1.08));
          }}
          ref={frameRef}
          role="application"
          style={{
            aspectRatio: state.aspect,
            width:
              state.target === "mobile"
                ? `min(100%, calc(min(58svh, 30rem) * ${state.aspect}))`
                : "min(100%, 40rem)",
          }}
          tabIndex={0}
        >
          <img
            alt=""
            className="pointer-events-none absolute max-w-none"
            draggable={false}
            onLoad={(event) => {
              const image = event.currentTarget;
              if (image.naturalWidth && image.naturalHeight) {
                setRatio(image.naturalWidth / image.naturalHeight);
              }
            }}
            src={optimizedImgSrc(src)}
            style={
              rect
                ? {
                    height: `${100 / rect.height}%`,
                    left: `${(-rect.x / rect.width) * 100}%`,
                    top: `${(-rect.y / rect.height) * 100}%`,
                    width: `${100 / rect.width}%`,
                  }
                : { height: "100%", objectFit: "cover", width: "100%" }
            }
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/45 via-transparent to-black/75" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
            <p className="font-display text-[15px] font-semibold text-white">
              {commonName}
            </p>
            <p className="mt-0.5 text-[11px] text-white/55 italic">
              {scientificName}
            </p>
          </div>
        </div>
        <label className="mt-5 flex w-full max-w-xs items-center gap-3 text-[12px] text-white/70">
          ზუმი
          <input
            className="w-full accent-white"
            disabled={saving}
            max={MAX_ZOOM}
            min={1}
            onChange={(event) => setZoom(Number(event.target.value))}
            step={0.01}
            type="range"
            value={state.zoom}
          />
          <span className="w-10 text-right tabular-nums">
            {state.zoom.toFixed(2)}×
          </span>
        </label>
        {error ? (
          <p className="mt-4 max-w-md text-center text-[13px] text-red-300">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            className="h-10 rounded-lg border border-white/20 px-4 text-[13px] font-medium text-white/85 hover:bg-white/10 disabled:opacity-50"
            disabled={saving}
            onClick={() => dialogRef.current?.close()}
            type="button"
          >
            გაუქმება
          </button>
          <button
            className="h-10 rounded-lg bg-white px-4 text-[13px] font-medium text-ink disabled:opacity-50"
            disabled={saving || !rect}
            onClick={() => {
              if (rect) onSave(state.target, rect);
            }}
            type="button"
          >
            {saving
              ? "იტვირთება CDN-ზე…"
              : state.target === "mobile"
                ? "შენახვა მობილურის ყდად"
                : "შენახვა დესკტოპის ყდად"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

function clampCenter(state: CropState, ratio: number): CropState {
  const size = cropSize(state, ratio);
  return {
    ...state,
    cx: Math.min(1 - size.width / 2, Math.max(size.width / 2, state.cx)),
    cy: Math.min(1 - size.height / 2, Math.max(size.height / 2, state.cy)),
  };
}

function cropRect(state: CropState, ratio: number): CoverCropRect | null {
  if (!ratio) return null;
  const size = cropSize(state, ratio);
  const clamped = clampCenter(state, ratio);
  return {
    height: size.height,
    width: size.width,
    x: clamped.cx - size.width / 2,
    y: clamped.cy - size.height / 2,
  };
}

function cropSize(state: CropState, ratio: number) {
  if (!ratio) return { height: 1, width: 1 };
  const width = Math.min(1, state.aspect / ratio) / state.zoom;
  return { height: (width * ratio) / state.aspect, width };
}

function initialState(
  target: CoverCropTarget,
  covers: AdminCovers,
  src: string,
  ratio: number,
): CropState {
  const aspects = ASPECTS[target];
  const fallback: CropState = {
    aspect: aspects[0]?.value ?? 1,
    cx: 0.5,
    cy: 0.5,
    target,
    zoom: 1,
  };
  const coverSrc = target === "mobile" ? covers.mobileSrc : covers.desktopSrc;
  const saved =
    coverSrc !== src && matchesCoverSource(coverSrc, src)
      ? parseCoverCrop(coverSrc)?.rect
      : null;
  if (!saved || !ratio) return fallback;
  const savedAspect = (saved.width * ratio) / saved.height;
  const aspect = aspects.reduce(
    (best, item) =>
      Math.abs(item.value - savedAspect) < Math.abs(best - savedAspect)
        ? item.value
        : best,
    fallback.aspect,
  );
  return clampCenter(
    {
      aspect,
      cx: saved.x + saved.width / 2,
      cy: saved.y + saved.height / 2,
      target,
      zoom: Math.min(
        MAX_ZOOM,
        Math.max(1, Math.min(1, aspect / ratio) / saved.width),
      ),
    },
    ratio,
  );
}
