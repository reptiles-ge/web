"use client";

import { useTranslations } from "next-intl";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import type { CookieConsent } from "@/lib/consent/types";

import { CookieBanner } from "@/components/cookie-consent/CookieBanner";
import { CookieSettings } from "@/components/cookie-consent/CookieSettings";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { COOKIE_CONSENT_EVENT } from "@/lib/consent/config";
import {
  consentValue,
  readConsentCookie,
  serializeConsentCookie,
} from "@/lib/consent/cookies";
import {
  deleteGoogleAnalyticsCookies,
  updateGoogleConsent,
} from "@/lib/consent/google-consent";

type CookieConsentContextValue = {
  consent: CookieConsent | null;
  openSettings: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

export function CookieConsentProvider({
  analyticsEnabled,
  children,
  gtmId,
}: {
  analyticsEnabled: boolean;
  children: ReactNode;
  gtmId: string;
}) {
  const t = useTranslations("cookieConsent");
  const mounted = useSyncExternalStore(
    subscribeMounted,
    mountedSnapshot,
    serverMountedSnapshot,
  );
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!consent) return;
    updateGoogleConsent(consent);
    if (!consent.analytics) deleteGoogleAnalyticsCookies();
  }, [consent]);

  const saveConsent = (analytics: boolean) => {
    const next = consentValue(analytics);
    document.cookie = serializeConsentCookie(
      next,
      window.location.protocol === "https:",
    );
    updateGoogleConsent(next);
    if (!analytics) deleteGoogleAnalyticsCookies();
    setSettingsOpen(false);
  };

  const value = useMemo(
    () => ({
      consent,
      openSettings: () => setSettingsOpen(true),
    }),
    [consent],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {analyticsEnabled && consent?.analytics ? (
        <GoogleTagManager gtmId={gtmId} />
      ) : null}
      {children}
      {mounted && !consent ? (
        <CookieBanner
          onAccept={() => saveConsent(true)}
          onNecessary={() => saveConsent(false)}
          onSettings={() => setSettingsOpen(true)}
          policyLabel={t("policyLink")}
        />
      ) : null}
      {settingsOpen ? (
        <CookieSettings
          analytics={consent?.analytics ?? false}
          onAcceptAll={() => saveConsent(true)}
          onClose={() => setSettingsOpen(false)}
          onSave={(analytics) => saveConsent(analytics)}
        />
      ) : null}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider",
    );
  }
  return context;
}

let cachedCookie = "";
let cachedConsent: CookieConsent | null = null;

function getConsentSnapshot() {
  const cookie = document.cookie;
  if (cookie !== cachedCookie) {
    cachedCookie = cookie;
    cachedConsent = readConsentCookie(cookie);
  }
  return cachedConsent;
}

function getServerConsentSnapshot() {
  return null;
}

function mountedSnapshot() {
  return true;
}

function serverMountedSnapshot() {
  return false;
}

function subscribeConsent(onChange: () => void) {
  window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
  return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
}

function subscribeMounted() {
  return () => undefined;
}
