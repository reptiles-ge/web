"use client";

import type { ReactNode } from "react";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

import { SpeciesProfileSkeleton } from "@/components/SpeciesProfileSkeleton";
import {
  getPendingNavigation,
  getServerPendingNavigation,
  subscribePendingNavigation,
} from "@/lib/pendingNavigation";
import { isSpeciesPagePath } from "@/lib/speciesPagePath";

export function NavigationSkeleton({ children }: { children: ReactNode }) {
  const t = useTranslations("nav");
  const pending = useSyncExternalStore(
    subscribePendingNavigation,
    getPendingNavigation,
    getServerPendingNavigation,
  );
  const showing = pending !== null && isSpeciesPagePath(pending.pathname);

  return (
    <>
      <div className="contents" inert={showing}>
        {children}
      </div>
      {showing ? (
        <div className="fixed inset-0 z-40 overflow-hidden bg-background">
          <SpeciesProfileSkeleton label={t("loadingPage")} />
        </div>
      ) : null}
    </>
  );
}
