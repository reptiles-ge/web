"use client";

import { type ComponentType, useEffect, useState } from "react";

export function NotFoundBoundary() {
  const [RichNotFound, setRichNotFound] = useState<ComponentType | null>(null);

  useEffect(() => {
    async function loadNotFoundContent() {
      try {
        const mod = await import("@/components/NotFoundContent");
        setRichNotFound(() => mod.NotFoundContent);
      } catch {
        return;
      }
    }

    void loadNotFoundContent();
  }, []);

  return RichNotFound ? <RichNotFound /> : null;
}
