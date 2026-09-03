"use client";

import { type ReactNode } from "react";

export function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <div className="sticky top-0 z-10 border-b border-border/60 bg-card/90 px-4 py-2.5 backdrop-blur-md">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {children}
      </p>
    </div>
  );
}
