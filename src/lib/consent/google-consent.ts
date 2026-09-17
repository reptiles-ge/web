import type { CookieConsent } from "@/lib/consent/types";

import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_NAME,
  COOKIE_CONSENT_VERSION,
} from "@/lib/consent/config";

export const GOOGLE_CONSENT_DENIED = {
  ad_personalization: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  analytics_storage: "denied",
} as const;

export const GOOGLE_CONSENT_ANALYTICS_GRANTED = {
  ...GOOGLE_CONSENT_DENIED,
  analytics_storage: "granted",
} as const;

type ConsentWindow = Window &
  typeof globalThis & {
    __reptilesAnalyticsConsent?: boolean;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

export function consentModeInitScript() {
  return `(function(){var n=${JSON.stringify(COOKIE_CONSENT_NAME)};var v=${COOKIE_CONSENT_VERSION};var d=${JSON.stringify(GOOGLE_CONSENT_DENIED)};var g=${JSON.stringify(GOOGLE_CONSENT_ANALYTICS_GRANTED)};window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag('consent','default',d);var a=false;try{var c=document.cookie?document.cookie.split(';'):[];for(var i=0;i<c.length;i++){var p=c[i].trim();if(p.indexOf(n+'=')===0){var raw=p.slice(n.length+1);var parsed=JSON.parse(decodeURIComponent(raw));if(parsed&&parsed.version===v&&typeof parsed.analytics==='boolean'){a=parsed.analytics===true}break}}}catch(e){}window.__reptilesAnalyticsConsent=a;if(a){window.gtag('consent','update',g)}})();`;
}

export function deleteGoogleAnalyticsCookies() {
  if (typeof document === "undefined") return;
  const names = document.cookie
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  if (names.length === 0) return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const domains = deletionDomains(window.location.hostname);
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax${secure}`;
    }
  }
}

export function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  return window.__reptilesAnalyticsConsent === true;
}

export function updateGoogleConsent(consent: CookieConsent) {
  if (typeof window === "undefined") return;
  const w = window as ConsentWindow;
  w.dataLayer = w.dataLayer || [];
  w.gtag =
    w.gtag ||
    function gtagFallback(...args: unknown[]) {
      w.dataLayer?.push(args);
    };
  w.__reptilesAnalyticsConsent = consent.analytics;
  w.gtag(
    "consent",
    "update",
    consent.analytics
      ? GOOGLE_CONSENT_ANALYTICS_GRANTED
      : GOOGLE_CONSENT_DENIED,
  );
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, { detail: consent }),
  );
}

function deletionDomains(hostname: string) {
  if (!hostname || hostname === "localhost") return [];
  const parts = hostname.split(".").filter(Boolean);
  const domains = new Set<string>([`.${hostname}`, hostname]);
  if (parts.length > 2) {
    const parent = parts.slice(-2).join(".");
    domains.add(parent);
    domains.add(`.${parent}`);
  }
  return Array.from(domains);
}
