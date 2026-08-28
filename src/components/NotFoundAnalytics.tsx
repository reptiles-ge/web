"use client";

import type { AppLocale } from "@/i18n/routing";
import { pushPageContext } from "@/lib/analytics";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export function NotFoundAnalytics() {
  const locale = useLocale() as AppLocale;

  useEffect(() => {
    pushPageContext({
      language: locale,
      page_type: "not_found",
    });
  }, [locale]);

  return null;
}
