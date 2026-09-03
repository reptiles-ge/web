"use client";

import type { ReactNode } from "react";

import { useLocale } from "next-intl";

import type { AppLocale } from "@/i18n/routing";

import { getSpeciesById } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { type SpeciesClickSource, trackSpeciesClick } from "@/lib/analytics";
import { speciesHref } from "@/lib/speciesRoutes";

const inlineLinkClassName =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

export function SpeciesInlineLink({
  children,
  id,
  source = "guide",
}: {
  children: ReactNode;
  id: string;
  source?: SpeciesClickSource;
}) {
  const locale = useLocale() as AppLocale;
  const target = getSpeciesById(id);
  if (!target) return children;

  return (
    <Link
      className={inlineLinkClassName}
      href={speciesHref(id, locale)}
      onClick={() =>
        trackSpeciesClick({
          source,
          species_id: id,
        })
      }
    >
      {children}
    </Link>
  );
}
