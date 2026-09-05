"use client";

import { Eye, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { useEffect, useRef } from "react";

import type { GalleryImage } from "@/data/speciesTypes";
import type { AdminCovers } from "@/lib/adminCover";

import { CoverImage } from "@/components/CoverImage";
import { adminCoverRoles } from "@/lib/adminCover";
import { cn } from "@/lib/cn";

export type AdminCoverPreviewState =
  | { src: string; type: "photo" }
  | { type: "live" };

type Props = {
  commonName: string;
  covers: AdminCovers;
  onClose: () => void;
  onSelect: (next: AdminCoverPreviewState) => void;
  photos: GalleryImage[];
  preview: AdminCoverPreviewState | null;
  scientificName: string;
};

export function AdminCoverPreview({
  commonName,
  covers,
  onClose,
  onSelect,
  photos,
  preview,
  scientificName,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = preview !== null;
  const strip = previewStrip(photos, covers);
  const frames = previewFrames(preview, covers);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
  }, [open]);

  return (
    <dialog
      aria-labelledby="admin-cover-preview-title"
      className="fixed inset-0 z-100 m-0 hidden size-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-0 backdrop:bg-black/92 open:flex"
      onClose={onClose}
      ref={dialogRef}
    >
      <button
        aria-label="დახურვა"
        className="absolute inset-0 bg-transparent"
        onClick={() => dialogRef.current?.close()}
        type="button"
      />
      <button
        aria-label="დახურვა"
        className="absolute top-5 right-5 z-10 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white"
        onClick={() => dialogRef.current?.close()}
        ref={closeRef}
        type="button"
      >
        <X className="size-5" />
      </button>
      <div
        className="relative z-10 max-h-[92svh] w-[min(96vw,72rem)] overflow-y-auto px-4 py-10"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          className="text-center font-display text-xl font-medium text-white"
          id="admin-cover-preview-title"
        >
          {preview?.type === "live" ? "ახლანდელი ყდა" : "ყდის პრევიუ"}
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-[13px] leading-relaxed text-white/65">
          {previewCopy(preview, covers)}
        </p>
        {frames ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-10 lg:flex-row lg:items-end">
            {frames.map((frame) => (
              <DevicePreview
                commonName={commonName}
                coverLabel={frame.coverLabel}
                icon={frame.icon}
                key={frame.kind}
                kind={frame.kind}
                label={frame.label}
                scientificName={scientificName}
                src={frame.src}
              />
            ))}
          </div>
        ) : null}
        {strip.length > 0 ? (
          <div className="mx-auto mt-10 max-w-3xl">
            <p className="mb-3 text-center text-[12px] text-white/55">
              აირჩიე სხვა ფოტო — როგორ გამოჩნდება ყდად
            </p>
            <ul className="flex flex-wrap justify-center gap-2">
              {covers.desktopSrc ? (
                <li>
                  <button
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[12px] font-medium",
                      preview?.type === "live"
                        ? "bg-white text-ink"
                        : "bg-white/10 text-white/80 hover:bg-white/15",
                    )}
                    onClick={() => onSelect({ type: "live" })}
                    type="button"
                  >
                    ახლანდელი ყდა
                  </button>
                </li>
              ) : null}
              {strip.map((src) => {
                const selected =
                  preview?.type === "photo" && preview.src === src;
                const roles = adminCoverRoles(src, covers);
                return (
                  <li key={src}>
                    <button
                      className={cn(
                        "relative size-14 overflow-hidden rounded-lg border",
                        selected
                          ? "border-white ring-2 ring-white"
                          : "border-white/15 hover:border-white/40",
                      )}
                      onClick={() => onSelect({ src, type: "photo" })}
                      type="button"
                    >
                      <CoverImage
                        alt=""
                        className="object-cover"
                        sizes="56px"
                        src={src}
                      />
                      {roles.length > 0 ? (
                        <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-center text-[8px] font-semibold tracking-wide text-white">
                          {roles[0] === "cover"
                            ? "ყდა"
                            : roles[0] === "desktop"
                              ? "დესკ."
                              : "მობ."}
                        </span>
                      ) : null}
                      <span className="sr-only">ყდის პრევიუ</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </dialog>
  );
}

export function AdminCoverPreviewButton({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex size-8 items-center justify-center rounded-md bg-background/85 text-foreground hover:bg-background disabled:opacity-40"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Eye aria-hidden className="size-4" />
      <span className="sr-only">ყდის პრევიუ</span>
    </button>
  );
}

function DevicePreview({
  commonName,
  coverLabel,
  icon: Icon,
  kind,
  label,
  scientificName,
  src,
}: {
  commonName: string;
  coverLabel: string;
  icon: typeof Monitor;
  kind: "desktop" | "phone" | "tablet";
  label: string;
  scientificName: string;
  src: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/80">
        <Icon aria-hidden className="size-3.5" />
        {label}
      </p>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide",
          coverLabel === "დესკტოპის ყდა"
            ? "bg-gold text-white"
            : coverLabel === "მობილური ყდა"
              ? "bg-primary text-white"
              : "bg-white/15 text-white",
        )}
      >
        {coverLabel}
      </span>
      {kind === "desktop" ? (
        <div className="w-[min(100%,22rem)] overflow-hidden rounded-xl border border-white/12 bg-zinc-900 shadow-2xl sm:w-104">
          <div className="flex h-7 items-center gap-1.5 bg-zinc-800 px-3">
            <span className="size-1.5 rounded-full bg-white/25" />
            <span className="size-1.5 rounded-full bg-white/25" />
            <span className="size-1.5 rounded-full bg-white/25" />
          </div>
          <HeroCrop
            commonName={commonName}
            kind="desktop"
            scientificName={scientificName}
            src={src}
          />
        </div>
      ) : (
        <div
          className={cn(
            "overflow-hidden border-[6px] border-zinc-700 bg-ink shadow-2xl",
            kind === "phone"
              ? "w-46 rounded-[1.85rem] sm:w-50"
              : "w-60 rounded-[1.35rem] sm:w-66",
          )}
        >
          <HeroCrop
            commonName={commonName}
            kind={kind}
            scientificName={scientificName}
            src={src}
          />
        </div>
      )}
    </div>
  );
}

function HeroCrop({
  commonName,
  kind,
  scientificName,
  src,
}: {
  commonName: string;
  kind: "desktop" | "phone" | "tablet";
  scientificName: string;
  src: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-ink",
        kind === "desktop" && "aspect-video",
        kind === "phone" && "aspect-9/19",
        kind === "tablet" && "aspect-3/4",
      )}
    >
      <CoverImage
        alt=""
        className="object-cover"
        sizes={
          kind === "desktop" ? "26rem" : kind === "tablet" ? "16rem" : "12rem"
        }
        src={src}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/25 to-black/90" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <p className="font-display text-[13px] font-semibold text-white sm:text-[15px]">
          {commonName}
        </p>
        <p className="mt-0.5 text-[10px] text-white/55 italic sm:text-[11px]">
          {scientificName}
        </p>
      </div>
    </div>
  );
}

function previewCopy(
  preview: AdminCoverPreviewState | null,
  covers: AdminCovers,
) {
  if (preview?.type === "photo") {
    const roles = adminCoverRoles(preview.src, covers);
    if (roles.includes("cover")) {
      return "ეს ფოტო ახლა ყდაა. ასე იჭრება დესკტოპზე, ტაბლეტსა და მობილურზე.";
    }
    if (roles.includes("desktop")) {
      return "ეს ახლა დესკტოპის ყდაა. აქ ჩანს, როგორ გამოიყურებოდა სამივე ზომაზე, თუ ერთ ყდად გამოიყენებ.";
    }
    if (roles.includes("mobile")) {
      return "ეს ახლა მობილური ყდაა. აქ ჩანს, როგორ გამოიყურებოდა სამივე ზომაზე, თუ ერთ ყდად გამოიყენებ.";
    }
    return "როგორ გამოჩნდება ეს ფოტო ყდად — იჭრება სხვადასხვანაირად დესკტოპზე, ტაბლეტსა და მობილურზე.";
  }
  if (covers.split) {
    return "დესკტოპზე და მობილურზე სხვადასხვა ყდაა. ტაბლეტი მობილურის ყდას იყენებს — პროფილზე 1024px-მდე. ქვემოთ სხვა ფოტოც შეგიძლია ყდად სცადო.";
  }
  return "ახლანდელი ყდა. ქვემოთ აირჩიე სხვა ფოტო და ნახე, როგორ გამოიყურებოდა ყდად.";
}

function previewFrames(
  preview: AdminCoverPreviewState | null,
  covers: AdminCovers,
) {
  if (!preview) return null;
  if (preview.type === "photo") {
    return [
      {
        coverLabel: "ყდა",
        icon: Smartphone,
        kind: "phone" as const,
        label: "მობილური",
        src: preview.src,
      },
      {
        coverLabel: "ყდა",
        icon: Tablet,
        kind: "tablet" as const,
        label: "ტაბლეტი",
        src: preview.src,
      },
      {
        coverLabel: "ყდა",
        icon: Monitor,
        kind: "desktop" as const,
        label: "დესკტოპი",
        src: preview.src,
      },
    ];
  }
  if (!covers.desktopSrc) return null;
  return [
    {
      coverLabel: covers.split ? "მობილური ყდა" : "ყდა",
      icon: Smartphone,
      kind: "phone" as const,
      label: "მობილური",
      src: covers.mobileSrc,
    },
    {
      coverLabel: covers.split ? "მობილური ყდა" : "ყდა",
      icon: Tablet,
      kind: "tablet" as const,
      label: "ტაბლეტი",
      src: covers.mobileSrc,
    },
    {
      coverLabel: covers.split ? "დესკტოპის ყდა" : "ყდა",
      icon: Monitor,
      kind: "desktop" as const,
      label: "დესკტოპი",
      src: covers.desktopSrc,
    },
  ];
}

function previewStrip(photos: GalleryImage[], covers: AdminCovers) {
  const srcs: string[] = [];
  for (const item of photos) {
    if (item.src && !srcs.includes(item.src)) srcs.push(item.src);
  }
  for (const src of [covers.desktopSrc, covers.mobileSrc]) {
    if (src && !srcs.includes(src)) srcs.push(src);
  }
  return srcs;
}
