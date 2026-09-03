import type { ReactNode } from "react";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AnalyticsPageContext } from "@/components/AnalyticsPageContext";
import { ClarityInit } from "@/components/ClarityInit";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SkipLink } from "@/components/SkipLink";
import { routing } from "@/i18n/routing";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("nav");
  const isProd = process.env.NODE_ENV === "production";

  return (
    <NextIntlClientProvider messages={messages}>
      <SkipLink label={t("skipToContent")} />
      <ScrollToTop />
      <AnalyticsPageContext />
      <Navbar />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <Analytics />
      <SpeedInsights />
      {isProd ? <ClarityInit /> : null}
    </NextIntlClientProvider>
  );
}
