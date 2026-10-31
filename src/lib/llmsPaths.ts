import type { AppLocale } from "../i18n/routing";

export function llmsFilesPattern(prefixes: readonly string[] = []) {
  const files = [llmsIndexPath("ka"), llmsFullPath("ka")].map((path) =>
    path.slice(1).replaceAll(".", "\\."),
  );
  const prefix = prefixes.length > 0 ? `(?:(?:${prefixes.join("|")})/)?` : "";
  return `${prefix}(?:${files.join("|")})$`;
}

export function llmsFullPath(locale: AppLocale) {
  return locale === "ka" ? "/llms-full.txt" : `/${locale}/llms-full.txt`;
}

export function llmsIndexPath(locale: AppLocale) {
  return locale === "ka" ? "/llms.txt" : `/${locale}/llms.txt`;
}

export function llmsLinkHeader(locale: AppLocale) {
  return [
    `<${llmsIndexPath(locale)}>; rel="alternate"; type="text/plain"; title="llms.txt"`,
    `<${llmsFullPath(locale)}>; rel="alternate"; type="text/plain"; title="llms-full.txt"`,
  ].join(", ");
}
