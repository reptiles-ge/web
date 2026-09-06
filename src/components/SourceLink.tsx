"use client";

import type { ReactNode } from "react";

import { trackEvent } from "@/lib/analytics";

export function SourceLink({
  children,
  href,
  speciesId,
}: {
  children: ReactNode;
  href: string;
  speciesId: string;
}) {
  return (
    <a
      className="transition-colors hover:text-primary"
      href={href}
      onClick={() =>
        trackEvent("source_click", {
          link_type: "source",
          species_id: speciesId,
        })
      }
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
