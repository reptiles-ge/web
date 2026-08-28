"use client";

import { usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { pushPageContext } from "@/lib/analytics";
import { resolvePageContext } from "@/lib/pageContext";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export function AnalyticsPageContext() {
  const pathname = usePathname();
  const locale = useLocale() as AppLocale;
  const params = useParams();

  const slug = typeof params.slug === "string" ? params.slug : undefined;
  const id = typeof params.id === "string" ? params.id : undefined;

  useEffect(() => {
    const context = resolvePageContext(pathname, locale, { slug, id });
    pushPageContext({
      language: locale,
      page_type: context.page_type,
      group: context.group,
      entity_id: context.entity_id,
    });
  }, [pathname, locale, slug, id]);

  return null;
}
