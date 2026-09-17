"use client";

import { useCookieConsent } from "@/components/cookie-consent/CookieConsentProvider";

export function CookieSettingsButton({
  className,
  label,
}: {
  className?: string;
  label: string;
}) {
  const { openSettings } = useCookieConsent();

  return (
    <button className={className} onClick={openSettings} type="button">
      {label}
    </button>
  );
}
