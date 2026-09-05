"use client";

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Monitor,
  Smartphone,
} from "lucide-react";
import { type Dispatch, type SetStateAction, useRef, useState } from "react";

import type { GalleryImage } from "@/data/speciesTypes";

import { CoverImage } from "@/components/CoverImage";
import { AdminCoverPreviewButton } from "@/components/admin/AdminCoverPreview";
import {
  type AdminCoverRole,
  adminCoverRoles,
  type AdminCovers,
} from "@/lib/adminCover";
import { cn } from "@/lib/cn";

type Props = {
  covers: AdminCovers;
  disabled?: boolean;
  onPreview: (src: string) => void;
  onReorder: Dispatch<SetStateAction<GalleryImage[]>>;
  photos: GalleryImage[];
};

export function AdminGalleryReorder({
  covers,
  disabled,
  onPreview,
  onReorder,
  photos,
}: Props) {
  const dragFrom = useRef<null | number>(null);
  const [draggingSrc, setDraggingSrc] = useState<null | string>(null);
  const sortable = photos.length > 1;
  const canDrag = sortable && !disabled;

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
                <AdminCoverPreviewButton
                  disabled={disabled}
                  onClick={() => onPreview(item.src)}
                />
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1.5">
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
