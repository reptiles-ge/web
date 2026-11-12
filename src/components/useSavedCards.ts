"use client";

import { useEffect, useMemo, useState } from "react";

import type { DangerLevel } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";
import type { SavedSpeciesCard } from "@/lib/savedSpeciesCards";

import { type SavedEntry, useSavedEntries } from "@/lib/savedSpecies";

export type SavedItem = SavedSpeciesCard & { savedAt: number };

const requests = new Map<AppLocale, Promise<SavedSpeciesCard[]>>();

export function isVenomousLevel(level: DangerLevel | null) {
  return level === "High" || level === "Moderate";
}

export function joinSavedItems(
  entries: SavedEntry[],
  cards: null | SavedSpeciesCard[],
): SavedItem[] {
  if (!cards) return [];
  const byId = new Map(cards.map((card) => [card.id, card]));
  return entries.flatMap((entry) => {
    const card = byId.get(entry.id);
    return card ? [{ ...card, savedAt: entry.savedAt }] : [];
  });
}

export function loadSavedCards(locale: AppLocale) {
  let request = requests.get(locale);
  if (!request) {
    request = fetch(`/api/saved/${locale}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Saved cards answered ${response.status}`);
        }
        return response.json() as Promise<SavedSpeciesCard[]>;
      })
      .catch((error: unknown) => {
        requests.delete(locale);
        throw error;
      });
    requests.set(locale, request);
  }
  return request;
}

export function resetSavedCardsCache() {
  requests.clear();
}

export function useSavedItems(locale: AppLocale, enabled = true) {
  const entries = useSavedEntries();
  const [cards, setCards] = useState<null | {
    cards: SavedSpeciesCard[];
    locale: AppLocale;
  }>(null);
  const [failed, setFailed] = useState(false);
  const wanted = enabled && entries.length > 0;

  useEffect(() => {
    if (!wanted) return;
    let active = true;
    loadSavedCards(locale).then(
      (next) => {
        if (active) setCards({ cards: next, locale });
      },
      () => {
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, [locale, wanted]);

  const current = cards?.locale === locale ? cards.cards : null;
  const items = useMemo(
    () => joinSavedItems(entries, current),
    [entries, current],
  );

  return {
    count: entries.length,
    entries,
    failed,
    items,
    ready: entries.length === 0 || current !== null,
  };
}
