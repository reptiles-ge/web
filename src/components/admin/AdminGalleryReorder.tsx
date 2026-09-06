"use client";

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Monitor,
  Smartphone,
  Trash2,
} from "lucide-react";
import { type Dispatch, type SetStateAction, useRef, useState } from "react";

import type { GalleryImage } from "@/data/speciesTypes";

import { AdminCoverPreviewButton } from "@/components/admin/AdminCoverPreview";
import { CoverImage } from "@/components/CoverImage";
import {
  type AdminCoverRole,
  adminCoverRoles,
  type AdminCovers,
  type CoverTarget,
} from "@/lib/adminCover";
import { cn } from "@/lib/cn";

type Props = {
  covers: AdminCovers;
  disabled?: boolean;
  onPreview: (src: string) => void;
  onRemove: (src: string) => void;
  onReorder: Dispatch<SetStateAction<GalleryImage[]>>;
  onSetCover: (src: string, target: CoverTarget) => void;
  photos: GalleryImage[];
};

export function AdminGalleryReorder({
  covers,
  disabled,
  onPreview,
  onRemove,
  onReorder,
  onSetCover,
  photos,
}: Props) {
  const dragFrom = useRef<null | number>(null);
  const [draggingSrc, setDraggingSrc] = useState<null | string>(null);
  const sortable = photos.length > 1;
  const canDrag = sortable && !disabled;
  const canRemove = photos.length > 1 && !disabled;

  function move(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;
    onReorder((current) => {
      if (from === to || from < 0 || to < 0 || to >= current.length) {
        return current;
      }
      const next = [...current];
      const [item] = next.splice(from, 1);
      if (!item) return current;
      next.splice(to, 0, item);
      return next;
    });
  }

  return (
    <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((item, index) => {
        const roles = adminCoverRoles(item.src, covers);
        return (
          <li
            className={cn(
              "overflow-hidden rounded-lg border border-border bg-card",
              draggingSrc === item.src && "opacity-50",
              roles.length > 0 && "ring-2 ring-gold/70",
            )}
            key={item.src}
            onDragOver={(event) => {
              if (!canDrag || dragFrom.current === null) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              const from = dragFrom.current;
              if (from === index) return;
              move(from, index);
              dragFrom.current = index;
            }}
          >
            <div className="media-placeholder relative aspect-4/3 w-full">
              <CoverImage
                alt=""
                className="pointer-events-none object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
                src={item.src}
              />
              <span className="absolute top-2 left-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[11px] font-medium tabular-nums">
                {index + 1}
              </span>
              {sortable ? (
                <button
                  className="absolute top-2 right-2 flex size-8 cursor-grab items-center justify-center rounded-md bg-background/85 text-foreground active:cursor-grabbing disabled:cursor-default disabled:opacity-40"
                  disabled={!canDrag}
                  draggable={canDrag}
                  onDragEnd={() => {
                    dragFrom.current = null;
                    setDraggingSrc(null);
                  }}
                  onDragStart={(event) => {
                    dragFrom.current = index;
                    setDraggingSrc(item.src);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", item.src);
                  }}
                  type="button"
                >
                  <GripVertical aria-hidden className="size-4" />
                  <span className="sr-only">გადაადგილება</span>
                </button>
              ) : null}
              {roles.length > 0 ? (
                <span className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                  {roles.map((role) => (
                    <CoverBadge key={role} role={role} />
                  ))}
                </span>
              ) : null}
              <span className="absolute right-2 bottom-2">
                <AdminCoverPreviewButton onClick={() => onPreview(item.src)} />
              </span>
            </div>
            <div className="px-2 py-1.5">
              <div className="flex items-center gap-1">
                <p className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
                  {item.credit?.photographer ?? item.src.split("/").at(-1)}
                </p>
                {sortable ? (
                  <span className="flex shrink-0">
                    <button
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
                      disabled={disabled || index === 0}
                      onClick={() => move(index, index - 1)}
                      type="button"
                    >
                      <ChevronUp aria-hidden className="size-4" />
                      <span className="sr-only">ზემოთ</span>
                    </button>
                    <button
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
                      disabled={disabled || index === photos.length - 1}
                      onClick={() => move(index, index + 1)}
                      type="button"
                    >
                      <ChevronDown aria-hidden className="size-4" />
                      <span className="sr-only">ქვემოთ</span>
                    </button>
                  </span>
                ) : null}
              </div>
              <CoverSelect
                disabled={disabled}
                onChange={(target) => onSetCover(item.src, target)}
              />
              <button
                className="mt-1.5 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-border text-[11px] text-destructive hover:bg-secondary disabled:opacity-40"
                disabled={!canRemove}
                onClick={() => onRemove(item.src)}
                title={photos.length === 1 ? "ბოლო ფოტო არ იშლება" : undefined}
                type="button"
              >
                <Trash2 aria-hidden className="size-3.5" />
                წაშლა
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function CoverBadge({ role }: { role: AdminCoverRole }) {
  const Icon = role === "mobile" ? Smartphone : Monitor;
  const label =
    role === "cover" ? "ყდა" : role === "desktop" ? "დესკტოპი" : "მობილური";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide shadow-sm",
        role === "mobile" ? "bg-primary text-white" : "bg-gold text-white",
      )}
    >
      <Icon aria-hidden className="size-3" />
      {label}
    </span>
  );
}

function CoverSelect({
  disabled,
  onChange,
}: {
  disabled?: boolean;
  onChange: (target: CoverTarget) => void;
}) {
  return (
    <label className="mt-1.5 block">
      <span className="sr-only">ყდად დაყენება</span>
      <select
        className="h-8 w-full rounded-md border border-border bg-background px-2 text-[11px] text-foreground outline-none disabled:opacity-40"
        defaultValue=""
        disabled={disabled}
        onChange={(event) => {
          const value = event.target.value;
          event.target.value = "";
          if (value === "both" || value === "desktop" || value === "mobile") {
            onChange(value);
          }
        }}
      >
        <option disabled value="">
          ყდად დაყენება
        </option>
        <option value="desktop">დესკტოპის ყდა</option>
        <option value="mobile">მობილურის ყდა</option>
        <option value="both">ორივეს ყდა</option>
      </select>
    </label>
  );
}
