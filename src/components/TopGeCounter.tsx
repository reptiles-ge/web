"use client";

import Script from "next/script";

import { useCookieConsent } from "@/components/cookie-consent/CookieConsentProvider";

export function TopGeCounter() {
  const { consent } = useCookieConsent();

  if (process.env.NODE_ENV !== "production") return null;
  if (!consent?.analytics) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none opacity-0"
        data-site-id="118888"
        id="top-ge-counter-container"
      />
      <Script
        src="https://counter.top.ge/counter.js"
        strategy="afterInteractive"
      />
    </>
  );
}
