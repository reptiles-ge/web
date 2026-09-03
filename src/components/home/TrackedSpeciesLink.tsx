"use client";

import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { trackSpeciesClick, type SpeciesClickSource } from "@/lib/analytics";
import { speciesHref, type SpeciesHref } from "@/lib/speciesRoutes";
import type { ReactNode } from "react";

type TrackedSpeciesLinkProps = {
  speciesId: string;
  locale: AppLocale;
  source: SpeciesClickSource;
  position?: number;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
};

export function TrackedSpeciesLink({
  speciesId,
  locale,
  source,
  position,
  className,
  "aria-label": ariaLabel,
  children,
}: TrackedSpeciesLinkProps) {
  const href: SpeciesHref = speciesHref(speciesId, locale);

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={() =>
        trackSpeciesClick({
          species_id: speciesId,
          source,
          position,
        })
      }
    >
      {children}
    </Link>
  );
}
