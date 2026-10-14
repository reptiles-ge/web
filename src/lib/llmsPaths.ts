import type { AppLocale } from "../i18n/routing";

export function llmsFullPath(locale: AppLocale) {
  return locale === "ka" ? "/llms-full.txt" : `/${locale}/llms-full.txt`;
}

export function llmsIndexPath(locale: AppLocale) {
  return locale === "ka" ? "/llms.txt" : `/${locale}/llms.txt`;
}

export function llmsLinkHeader(locale: AppLocale) {
  return [
    `<${llmsIndexPath(locale)}>; rel="alternate"; type="text/plain"; hreflang="${locale}"; title="llms.txt"`,
    `<${llmsFullPath(locale)}>; rel="alternate"; type="text/plain"; hreflang="${locale}"; title="llms-full.txt"`,
  ].join(", ");
}
