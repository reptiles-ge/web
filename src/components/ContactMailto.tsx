"use client";

import { type ReactNode } from "react";

import { trackEvent } from "@/lib/analytics";

export function ContactMailto({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <a
      className={className}
      href={href}
      onClick={() => trackEvent("contact_click", { page_type: "contact" })}
    >
      {children}
    </a>
  );
}
