"use client";

import type { ComponentProps } from "react";

import { NextIntlClientProvider } from "next-intl";

import { SITE_TIME_ZONE } from "@/lib/siteTime";

export function IntlProvider(
  props: ComponentProps<typeof NextIntlClientProvider>,
) {
  return <NextIntlClientProvider timeZone={SITE_TIME_ZONE} {...props} />;
}
