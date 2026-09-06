import type { AppLocale } from "@/i18n/routing";

import {
  type LocaleSwitchIndex,
  type ResolvedPageContext,
  resolvePageContextFromIndex,
} from "@/lib/localeSwitch";

export type { ResolvedPageContext };

export function resolvePageContext(
  index: LocaleSwitchIndex,
  pathname: string,
  locale: AppLocale,
  params: { id?: string; slug?: string },
): ResolvedPageContext {
  return resolvePageContextFromIndex(index, pathname, locale, params);
}
