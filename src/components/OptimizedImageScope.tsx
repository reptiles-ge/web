import { isValidElement, type ReactNode } from "react";

import { OptimizedImagesProvider } from "@/components/OptimizedImagesProvider";
import {
  isOptimizedImageSrc,
  optimizedImageEntries,
} from "@/data/optimizedImages";

type OptimizedImageScopeProps = {
  children: ReactNode;
  srcs?: readonly (null | string | undefined)[];
};

export function OptimizedImageScope({
  children,
  srcs = [],
}: OptimizedImageScopeProps) {
  const found = new Set<string>();
  collectImageSrcs(children, found, new WeakSet());
  return (
    <OptimizedImagesProvider
      entries={optimizedImageEntries([...found, ...srcs])}
    >
      {children}
    </OptimizedImagesProvider>
  );
}

function collectImageSrcs(
  value: unknown,
  found: Set<string>,
  seen: WeakSet<object>,
) {
  if (typeof value === "string") {
    if (isOptimizedImageSrc(value)) found.add(value);
    return;
  }
  if (!value || typeof value !== "object" || seen.has(value)) return;
  seen.add(value);
  if (isValidElement(value)) {
    collectImageSrcs(value.props, found, seen);
    return;
  }
  for (const item of Array.isArray(value) ? value : Object.values(value)) {
    collectImageSrcs(item, found, seen);
  }
}
