"use client";

import type { ReactNode } from "react";

import { useLocale } from "next-intl";

import type { SpeciesHubId } from "@/lib/speciesHubs";

import { useOptionalLocaleSwitchIndex } from "@/components/LocaleSwitchProvider";
import { Link } from "@/i18n/navigation";
import { type SpeciesClickSource, trackSpeciesClick } from "@/lib/analytics";
import { speciesHrefFromIndex } from "@/lib/localeSwitch";

const inlineLinkClassName =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

export function SpeciesInlineLink({
  children,
  className = inlineLinkClassName,
  hub,
  id,
  source = "guide",
}: {
  children: ReactNode;
  className?: string;
  hub?: SpeciesHubId;
  id: string;
  source?: SpeciesClickSource;
}) {
  const locale = useLocale();
  const switchIndex = useOptionalLocaleSwitchIndex();
  if (!switchIndex) return children;
  const speciesId = switchIndex.hubById[id] ? id : switchIndex.idBySlug[id];
  const speciesHub = speciesId ? switchIndex.hubById[speciesId] : undefined;
  if (!speciesId || !speciesHub || (hub && hub !== speciesHub)) {
    return children;
  }

  return (
    <Link
      className={className}
      href={speciesHrefFromIndex(switchIndex, speciesId, locale)}
      onClick={() =>
        trackSpeciesClick({
          source,
          species_id: speciesId,
        })
      }
    >
      {children}
    </Link>
  );
}
