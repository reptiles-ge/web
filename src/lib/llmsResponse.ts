import { hasLocale } from "next-intl";

import { type AppLocale, routing } from "@/i18n/routing";
import {
  buildLlmsFullText,
  buildLlmsIndexText,
  createLlmsSpecies,
} from "@/lib/llmsFiles";
import { llmsFullPath, llmsIndexPath } from "@/lib/llmsPaths";
import { llmsTextResponseHeaders } from "@/lib/robotsTxt";
import { absoluteUrl } from "@/lib/site";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";

export type LlmsFileKind = "full" | "index";

export type LlmsRouteContext = {
  params: Promise<{ locale: string }>;
};

export async function llmsFileResponse(kind: LlmsFileKind, locale: string) {
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { status: 404 });
  }
  const full = kind === "full";
  if (locale === routing.defaultLocale) {
    const path = full ? llmsFullPath(locale) : llmsIndexPath(locale);
    return Response.redirect(absoluteUrl(path), 301);
  }
  const catalog = await loadLlmsSpecies(locale);
  const body = full
    ? buildLlmsFullText(catalog, locale)
    : buildLlmsIndexText(catalog, locale);
  return new Response(body, {
    headers: llmsTextResponseHeaders({ noindex: full }),
  });
}

export function llmsStaticParams() {
  return routing.locales
    .filter((locale) => locale !== routing.defaultLocale)
    .map((locale) => ({ locale }));
}

export async function loadLlmsSpecies(locale: AppLocale) {
  const locales = [
    ...new Set<AppLocale>(["en", locale, routing.defaultLocale]),
  ];
  const lists = await Promise.all(
    locales.map((item) => getSpeciesCatalog(item, "full")),
  );
  return createLlmsSpecies(
    Object.fromEntries(locales.map((item, index) => [item, lists[index]])),
  );
}
