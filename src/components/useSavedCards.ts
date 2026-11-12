"use client";

import { use, useMemo } from "react";

import type { AppLocale } from "@/i18n/routing";
import type { SavedEntry } from "@/lib/savedSpecies";
import type { SavedSpeciesCard } from "@/lib/savedSpeciesCards";

export type SavedItem = SavedSpeciesCard & { savedAt: number };

const requests = new Map<AppLocale, Promise<SavedSpeciesCard[]>>();

export function resetSavedCardsCache() {
  requests.clear();
}

export function useSavedItems(
  locale: AppLocale,
  entries: SavedEntry[],
): SavedItem[] {
  const cards = use(savedCardsRequest(locale));
  return useMemo(() => {
    const byId = new Map(cards.map((card) => [card.id, card]));
    return entries.flatMap((entry) => {
      const card = byId.get(entry.id);
      return card ? [{ ...card, savedAt: entry.savedAt }] : [];
    });
  }, [cards, entries]);
}

function savedCardsRequest(locale: AppLocale) {
  let request = requests.get(locale);
  if (!request) {
    request = fetch(`/api/saved/${locale}`)
      .then((response) =>
        response.ok ? (response.json() as Promise<SavedSpeciesCard[]>) : [],
      )
      .catch(() => []);
    requests.set(locale, request);
  }
  return request;
}
