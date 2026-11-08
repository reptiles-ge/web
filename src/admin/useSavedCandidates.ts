import { useState } from "react";

import type { PhotoCandidate } from "./photoCandidates";

import { movePhoto } from "./galleryOrder";

export function readSavedCandidates(id: string): PhotoCandidate[] {
  try {
    const raw = window.localStorage.getItem(storageKey(id));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as PhotoCandidate[]) : [];
  } catch {
    return [];
  }
}

export function useSavedCandidates(id: string) {
  const [saved, setSaved] = useState(() => readSavedCandidates(id));

  function update(next: PhotoCandidate[]) {
    setSaved(next);
    try {
      if (next.length === 0) window.localStorage.removeItem(storageKey(id));
      else window.localStorage.setItem(storageKey(id), JSON.stringify(next));
    } catch {
      return;
    }
  }

  function toggle(candidate: PhotoCandidate) {
    update(
      saved.some((item) => item.key === candidate.key)
        ? saved.filter((item) => item.key !== candidate.key)
        : [...saved, candidate],
    );
  }

  function move(key: string, toIndex: number) {
    const keys = movePhoto(
      saved.map((item) => item.key),
      key,
      toIndex,
    );
    update(keys.map((item) => saved.find((photo) => photo.key === item)!));
  }

  return {
    isSaved: (key: string) => saved.some((item) => item.key === key),
    move,
    saved,
    toggle,
  };
}

function storageKey(id: string) {
  return `reptiles-admin:photo-shortlist:${id}`;
}
