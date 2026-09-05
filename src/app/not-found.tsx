import type { Metadata } from "next";

import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { cookies } from "next/headers";

import { LocaleSwitchProvider } from "@/components/LocaleSwitchProvider";
import { Navbar } from "@/components/Navbar";
import { NotFoundContent } from "@/components/NotFoundContent";
import { SkipLink } from "@/components/SkipLink";
import { type AppLocale, routing } from "@/i18n/routing";
import { getLocaleSwitchIndex } from "@/lib/localeSwitchData";

export const metadata: Metadata = {
  robots: {
    follow: true,
    googleBot: { follow: true, index: false },
    index: false,
  },
};

export default async function RootNotFound() {
  const locale = await resolveNotFoundLocale();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("nav");
  const switchIndex = getLocaleSwitchIndex();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleSwitchProvider index={switchIndex}>
        <SkipLink label={t("skipToContent")} />
        <Navbar switchIndex={switchIndex} />
        <main id="main" tabIndex={-1}>
          <NotFoundContent />
        </main>
      </LocaleSwitchProvider>
    </NextIntlClientProvider>
  );
}

async function resolveNotFoundLocale(): Promise<AppLocale> {
  const jar = await cookies();
  const fromCookie = jar.get("NEXT_LOCALE")?.value;
  if (fromCookie && routing.locales.includes(fromCookie as AppLocale)) {
    return fromCookie as AppLocale;
  }
  return routing.defaultLocale;
}
