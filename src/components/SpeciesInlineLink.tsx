"use client";

import { getSpeciesById } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { trackSpeciesClick, type SpeciesClickSource } from "@/lib/analytics";
import { speciesHref } from "@/lib/speciesRoutes";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

const inlineLinkClassName =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

export function SpeciesInlineLink({
  id,
  children,
  source = "guide",
}: {
  id: string;
  children: ReactNode;
  source?: SpeciesClickSource;
}) {
  const locale = useLocale() as AppLocale;
  const target = getSpeciesById(id);
  if (!target) return children;

  return (
    <Link
      href={speciesHref(id, locale)}
      onClick={() =>
        trackSpeciesClick({
          species_id: id,
          source,
        })
      }
      className={inlineLinkClassName}
    >
      {children}
    </Link>
  );
}
