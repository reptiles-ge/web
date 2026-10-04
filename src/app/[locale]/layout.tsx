import type { ReactNode } from "react";

import { hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";

import { RootDocument } from "@/app/RootDocument";
import { SelectionContentEditor } from "@/components/admin/SelectionContentEditor";
import { AnalyticsPageContext } from "@/components/AnalyticsPageContext";
import { Footer } from "@/components/Footer";
import { FooterGate } from "@/components/FooterGate";
import { IntlProvider } from "@/components/IntlProvider";
import { LocaleSwitchProvider } from "@/components/LocaleSwitchProvider";
import { LogoPreload } from "@/components/LogoPreload";
import { Navbar } from "@/components/Navbar";
import { NavigationProgress } from "@/components/NavigationProgress";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteRating } from "@/components/SiteRating";
import { SkipLink } from "@/components/SkipLink";
import { TopGeCounter } from "@/components/TopGeCounter";
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

export const revalidate = false;

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
    (await getMessages({ locale })) as ClientMessages,
    ROOT_CLIENT_MESSAGE_NAMESPACES,
  );
  const t = await getTranslations({ locale, namespace: "nav" });
  const footerData = getFooterData(locale);
  const editorT =
    locale === "ka" && isLocalAdminEnabled()
      ? await getTranslations({ locale, namespace: "contentEditor" })
      : null;
  return (
    <RootDocument locale={locale}>
      <IntlProvider locale={locale} messages={messages}>
        <LocaleSwitchProvider>
          <SkipLink label={t("skipToContent")} />
          <NavigationProgress />
          <ScrollToTop />
          <LogoPreload />
          <AnalyticsPageContext />
          <TopGeCounter />
          <Navbar />
          <main id="main" tabIndex={-1}>
            {editorT ? (
              <SelectionContentEditor
                copy={{
                  action: editorT("action"),
                  close: editorT("close"),
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
            <Footer locale={locale} {...footerData} />
          </FooterGate>
          <SiteRating />
        </LocaleSwitchProvider>
      </IntlProvider>
    </RootDocument>
  );
}
