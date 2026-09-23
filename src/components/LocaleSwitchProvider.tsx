"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { AppLocale } from "@/i18n/routing";

import { localeSwitchIndex } from "@/data/localeSwitchIndex.generated";
import {
  type LocaleSpeciesHref,
  type LocaleSwitchIndex,
  speciesHrefFromIndex,
} from "@/lib/localeSwitch";

const LocaleSwitchContext = createContext<LocaleSwitchIndex | null>(null);

export function LocaleSwitchProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleSwitchContext.Provider value={localeSwitchIndex}>
      {children}
    </LocaleSwitchContext.Provider>
  );
}

export function useLocaleSwitchIndex() {
  const index = useContext(LocaleSwitchContext);
  if (!index) {
    throw new Error("LocaleSwitchProvider is required");
  }
  return index;
}

export function useSpeciesHref(
  id: string,
  locale: AppLocale,
): LocaleSpeciesHref {
  return speciesHrefFromIndex(useLocaleSwitchIndex(), id, locale);
}
