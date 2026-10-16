"use client";

import { createContext, type ReactNode, use, useMemo } from "react";

import type {
  ResolvedImageEntries,
  ResolvedImageEntry,
} from "@/lib/optimizedImageSources";

const EMPTY_ENTRIES: ResolvedImageEntries = {};

const OptimizedImagesContext =
  createContext<ResolvedImageEntries>(EMPTY_ENTRIES);

export function OptimizedImagesProvider({
  children,
  entries,
}: {
  children: ReactNode;
  entries: ResolvedImageEntries;
}) {
  const parent = use(OptimizedImagesContext);
  const value = useMemo(
    () => (parent === EMPTY_ENTRIES ? entries : { ...parent, ...entries }),
    [entries, parent],
  );
  return (
    <OptimizedImagesContext value={value}>{children}</OptimizedImagesContext>
  );
}

export function useOptimizedImage(
  src: null | string | undefined,
): null | ResolvedImageEntry {
  const entries = use(OptimizedImagesContext);
  if (!src) return null;
  return entries[src] ?? null;
}
