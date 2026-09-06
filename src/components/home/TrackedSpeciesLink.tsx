"use client";

import type { ReactNode } from "react";

import type { AppLocale } from "@/i18n/routing";
import type { LocaleSpeciesHref } from "@/lib/localeSwitch";

import { useSpeciesHref } from "@/components/LocaleSwitchProvider";
import { Link } from "@/i18n/navigation";
import { type SpeciesClickSource, trackSpeciesClick } from "@/lib/analytics";

type TrackedSpeciesLinkProps = {
  "aria-label"?: string;
  children: ReactNode;
  className?: string;
  locale: AppLocale;
  position?: number;
  source: SpeciesClickSource;
  speciesId: string;
};

export function TrackedSpeciesLink({
  "aria-label": ariaLabel,
  children,
  className,
  locale,
  position,
  source,
  speciesId,
}: TrackedSpeciesLinkProps) {
  const href: LocaleSpeciesHref = useSpeciesHref(speciesId, locale);

  return (
    <Link
      aria-label={ariaLabel}
      className={className}
      href={href}
      onClick={() =>
        trackSpeciesClick({
          position,
          source,
          species_id: speciesId,
        })
      }
    >
      {children}
    </Link>
  );
}
