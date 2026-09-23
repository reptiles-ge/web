"use client";

import { type ComponentType, useEffect, useState } from "react";

export function NotFoundBoundary() {
  const [RichNotFound, setRichNotFound] = useState<ComponentType | null>(null);

  useEffect(() => {
    import("@/components/NotFoundContent").then((mod) =>
      setRichNotFound(() => mod.NotFoundContent),
    );
  }, []);

  return RichNotFound ? <RichNotFound /> : null;
}
