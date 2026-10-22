import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { buildLlmsFullText, buildLlmsIndexText } from "@/lib/llmsFiles";
import { llmsFullPath, llmsIndexPath } from "@/lib/llmsPaths";
import { llmsTextResponseHeaders } from "@/lib/robotsTxt";
import { absoluteUrl } from "@/lib/site";

export type LlmsFileKind = "full" | "index";

export type LlmsRouteContext = {
  params: Promise<{ locale: string }>;
};

export function llmsFileResponse(kind: LlmsFileKind, locale: string) {
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { status: 404 });
  }
  const full = kind === "full";
  if (locale === routing.defaultLocale) {
    const path = full ? llmsFullPath(locale) : llmsIndexPath(locale);
    return Response.redirect(absoluteUrl(path), 301);
  }
  const body = full ? buildLlmsFullText(locale) : buildLlmsIndexText(locale);
  return new Response(body, {
    headers: llmsTextResponseHeaders({ noindex: full }),
  });
}

export function llmsStaticParams() {
  return routing.locales
    .filter((locale) => locale !== routing.defaultLocale)
    .map((locale) => ({ locale }));
}
