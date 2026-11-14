"use client";

import type { ReactNode } from "react";

import { useTranslations } from "next-intl";
import { useEffect, useState, useSyncExternalStore } from "react";

import { SpeciesProfileSkeleton } from "@/components/SpeciesProfileSkeleton";
import {
  getPendingNavigation,
  getServerPendingNavigation,
  subscribePendingNavigation,
} from "@/lib/pendingNavigation";
import { isSpeciesPagePath } from "@/lib/speciesPagePath";

const SKELETON_DELAY_MS = 150;

export function NavigationSkeleton({ children }: { children: ReactNode }) {
  const t = useTranslations("nav");
  const pending = useSyncExternalStore(
    subscribePendingNavigation,
    getPendingNavigation,
    getServerPendingNavigation,
  );
  const targetId =
    pending && isSpeciesPagePath(pending.pathname) ? pending.id : null;
  const [shownId, setShownId] = useState<null | number>(null);

  useEffect(() => {
    if (targetId === null) return;
    const timer = window.setTimeout(() => {
      setShownId(targetId);
      window.scrollTo(0, 0);
    }, SKELETON_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [targetId]);

  const showing = targetId !== null && shownId === targetId;

  return (
    <>
      <div className={showing ? "hidden" : "contents"}>{children}</div>
      {showing ? <SpeciesProfileSkeleton label={t("loadingPage")} /> : null}
    </>
  );
}
