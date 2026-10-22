import type { Metadata } from "next";

import { getMessages, getTranslations } from "next-intl/server";

import { RootDocument } from "@/app/RootDocument";
import { IntlProvider } from "@/components/IntlProvider";
import { LocaleSwitchProvider } from "@/components/LocaleSwitchProvider";
import { LogoPreload } from "@/components/LogoPreload";
import { Navbar } from "@/components/Navbar";
import { NotFoundShell } from "@/components/NotFoundShell";
import { SkipLink } from "@/components/SkipLink";
import {
  type ClientMessages,
  NOT_FOUND_CLIENT_MESSAGE_NAMESPACES,
  pickClientMessages,
} from "@/i18n/clientMessages";
import { routing } from "@/i18n/routing";
import { getLocaleSwitchIndex } from "@/lib/localeSwitchData";
import { getNavbarData } from "@/lib/navbarData";
import { notFoundMetadata } from "@/lib/notFoundMetadata";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";

export function generateMetadata(): Promise<Metadata> {
  return notFoundMetadata(routing.defaultLocale);
}

export default async function RootNotFound() {
  const locale = routing.defaultLocale;
  const messages = pickClientMessages(
    (await getMessages({ locale })) as ClientMessages,
    NOT_FOUND_CLIENT_MESSAGE_NAMESPACES,
  );
  const [t, catalog] = await Promise.all([
    getTranslations({ locale, namespace: "nav" }),
    getSpeciesCatalog(locale),
  ]);
  return (
    <RootDocument locale={locale}>
      <IntlProvider locale={locale} messages={messages}>
        <LocaleSwitchProvider index={getLocaleSwitchIndex(catalog)}>
          <SkipLink label={t("skipToContent")} />
          <LogoPreload />
          <Navbar {...getNavbarData(catalog)} />
          <main id="main" tabIndex={-1}>
            <NotFoundShell locale={locale} />
          </main>
        </LocaleSwitchProvider>
      </IntlProvider>
    </RootDocument>
  );
}
