"use client";

import type { ReactNode } from "react";

import { useLocale } from "next-intl";

import type { AppLocale } from "@/i18n/routing";

import { useLocaleSwitchIndex } from "@/components/LocaleSwitchProvider";
import { Link } from "@/i18n/navigation";
import { type SpeciesClickSource, trackSpeciesClick } from "@/lib/analytics";
import { speciesHrefFromIndex } from "@/lib/localeSwitch";

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
  const switchIndex = useLocaleSwitchIndex();
  if (!switchIndex.hubById[id]) return children;

  return (
    <Link
      className={inlineLinkClassName}
      href={speciesHrefFromIndex(switchIndex, id, locale)}
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
