import type { ComponentProps } from "react";

import NextLink from "next/link";

import type { AppLocale } from "@/i18n/routing";

import { getPathname } from "@/i18n/navigation";

type Href = Parameters<typeof getPathname>[0]["href"];

type Props = Omit<ComponentProps<typeof NextLink>, "href" | "locale"> & {
  href: Href;
  locale: AppLocale;
};

export function LocalizedLink({ href, locale, ...props }: Props) {
  return <NextLink href={getPathname({ href, locale })} {...props} />;
}
