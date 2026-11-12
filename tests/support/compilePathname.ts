import type { AppLocale } from "@/i18n/routing";

import { pathnames } from "@/i18n/pathnames";

export type TestHref =
  | string
  | {
      hash?: string;
      params?: Record<string, string>;
      pathname: string;
      query?: Record<string, string>;
    };

export function compilePathname(href: TestHref, locale: AppLocale | string) {
  const {
    hash,
    params = {},
    pathname,
    query,
  } = typeof href === "string" ? { pathname: href } : href;
  const mapped = pathnames[pathname as keyof typeof pathnames];
  const template =
    typeof mapped === "string" ? mapped : mapped[locale as keyof typeof mapped];
  const path = template.replace(/\[(\w+)\]/g, (_, name: string) =>
    name in params ? encodeURIComponent(params[name]) : name,
  );
  const prefixed =
    locale === "ka" ? path : `/${locale}${path === "/" ? "" : path}`;
  const search = query ? `?${new URLSearchParams(query)}` : "";
  return `${prefixed}${search}${hash ? `#${hash}` : ""}`;
}
