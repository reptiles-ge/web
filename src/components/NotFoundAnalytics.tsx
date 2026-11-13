"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

import { pushPageContext } from "@/lib/analytics";

export function NotFoundAnalytics() {
  const locale = useLocale();

  useEffect(() => {
    pushPageContext({
      language: locale,
      page_type: "not_found",
    });
  }, [locale]);

  return null;
}
