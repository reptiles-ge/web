import type { ReactNode } from "react";

import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";

import { SelectionContentEditor } from "@/components/admin/SelectionContentEditor";
import { AnalyticsPageContext } from "@/components/AnalyticsPageContext";
import { Footer } from "@/components/Footer";
import { FooterGate } from "@/components/FooterGate";
import { LocaleSwitchProvider } from "@/components/LocaleSwitchProvider";
import { LogoPreload } from "@/components/LogoPreload";
import { Navbar } from "@/components/Navbar";
import { NavigationProgress } from "@/components/NavigationProgress";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SkipLink } from "@/components/SkipLink";
import {
  type ClientMessages,
  pickClientMessages,
  ROOT_CLIENT_MESSAGE_NAMESPACES,
} from "@/i18n/clientMessages";
import { routing } from "@/i18n/routing";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
import { getFooterData } from "@/lib/footerData";

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
  const messages = pickClientMessages(
    (await getMessages()) as ClientMessages,
    ROOT_CLIENT_MESSAGE_NAMESPACES,
  );
  const t = await getTranslations("nav");
  const footerData = getFooterData(locale);
  const editorT =
    locale === "ka" && isLocalAdminEnabled()
      ? await getTranslations("contentEditor")
      : null;
  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleSwitchProvider>
        <SkipLink label={t("skipToContent")} />
        <NavigationProgress />
        <ScrollToTop />
        <LogoPreload />
        <AnalyticsPageContext />
        <Navbar />
        <main id="main" tabIndex={-1}>
          {editorT ? (
            <SelectionContentEditor
              copy={{
                action: editorT("action"),
                codexError: editorT("codexError"),
                error: editorT("error"),
                gitError: editorT("gitError"),
                jobs: editorT("jobs"),
                networkError: editorT("networkError"),
                openPr: editorT("openPr"),
                processing: editorT("processing"),
                requestError: editorT("requestError"),
                retry: editorT("retry"),
                success: editorT("success"),
              }}
            />
          ) : null}
          {children}
        </main>
        <FooterGate>
          <Footer {...footerData} />
        </FooterGate>
      </LocaleSwitchProvider>
    </NextIntlClientProvider>
  );
}
