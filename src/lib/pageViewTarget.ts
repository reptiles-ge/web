import type { AppLocale } from "@/i18n/routing";

import { pathnames } from "@/i18n/pathnames";
import {
  type LocaleSwitchIndex,
  resolvePageContextFromIndex,
} from "@/lib/localeSwitch";
import { PAGE_PATH_SEGMENT } from "@/lib/pageViewPath";
import { SPECIES_HUB_BY_PAGE } from "@/lib/speciesHubs";

const QUIZ_TEMPLATE = "/quiz/[slug]";

export function pageViewPath(
  index: LocaleSwitchIndex,
  pathname: string,
  locale: AppLocale,
  params: Record<string, string | undefined>,
): string | undefined {
  if (!Object.hasOwn(pathnames, pathname)) return undefined;
  if (SPECIES_HUB_BY_PAGE.has(pathname) || pathname === QUIZ_TEMPLATE) {
    const context = resolvePageContextFromIndex(index, pathname, locale, {
      slug: params.slug,
    });
    return context.entity_id
      ? pathname.replace("[slug]", context.entity_id)
      : undefined;
  }
  let complete = true;
  const path = pathname.replace(/\[([a-z]+)\]/g, (_, name: string) => {
    const value = params[name];
    if (value && PAGE_PATH_SEGMENT.test(value)) return value;
    complete = false;
    return "";
  });
  return complete ? path : undefined;
}
