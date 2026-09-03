import type { Metadata } from "next";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { cookies } from "next/headers";

import { Navbar } from "@/components/Navbar";
import { NotFoundContent } from "@/components/NotFoundContent";
import { type AppLocale, routing } from "@/i18n/routing";

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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
      <NotFoundContent />
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
