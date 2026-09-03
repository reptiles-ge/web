"use client";

import { type ReactNode } from "react";

import { type SearchGroupTitles } from "@/components/SpeciesSearchResults";
import { type SearchKind } from "@/lib/siteSearch";

export function groupHeading(
  kind: SearchKind,
  isRecent: boolean,
  query: string,
  titles: SearchGroupTitles,
) {
  if (isRecent) return titles.recent;
  if (!query && kind === "page") return titles.suggested;
  if (!query && kind === "species") return titles.featured;
  return kind === "page"
    ? titles.pages
    : kind === "species"
      ? titles.species
      : titles.regions;
}

export function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <div className="sticky top-0 z-10 border-b border-border/60 bg-card/90 px-4 py-2.5 backdrop-blur-md">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {children}
      </p>
    </div>
  );
}
