"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import type { AppLocale } from "@/i18n/routing";

import { useCookieConsent } from "@/components/cookie-consent/CookieConsentProvider";
import { usePathname } from "@/i18n/navigation";
import { pushPageContext } from "@/lib/analytics";
import {
  type LocaleSwitchIndex,
  resolvePageContextFromIndex,
} from "@/lib/localeSwitch";

export function AnalyticsPageContext({
  switchIndex,
}: {
  switchIndex: LocaleSwitchIndex;
}) {
  const pathname = usePathname();
  const locale = useLocale() as AppLocale;
  const params = useParams();
  const { consent } = useCookieConsent();

  const slug = typeof params.slug === "string" ? params.slug : undefined;
  const id = typeof params.id === "string" ? params.id : undefined;

  useEffect(() => {
    if (!consent?.analytics) return;
    const context = resolvePageContextFromIndex(switchIndex, pathname, locale, {
      id,
      slug,
    });
    pushPageContext({
      entity_id: context.entity_id,
      group: context.group,
      language: locale,
      page_type: context.page_type,
    });
  }, [pathname, locale, slug, id, switchIndex, consent?.analytics]);

  return null;
}
