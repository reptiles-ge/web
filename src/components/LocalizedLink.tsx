import type NextLink from "next/link";
import type { ComponentProps } from "react";

import type { AppLocale } from "@/i18n/routing";

import { IntentPrefetchNextLink } from "@/components/IntentPrefetchLink";
import { getPathname } from "@/i18n/navigation";

type Href = Parameters<typeof getPathname>[0]["href"];

type Props = Omit<ComponentProps<typeof NextLink>, "href" | "locale"> & {
  href: Href;
  locale: AppLocale;
};

export function LocalizedLink({ href, locale, ...props }: Props) {
  return (
    <IntentPrefetchNextLink href={getPathname({ href, locale })} {...props} />
  );
}
