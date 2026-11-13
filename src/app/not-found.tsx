import type { Metadata } from "next";

import { getMessages, getTranslations } from "next-intl/server";

import { RootDocument } from "@/app/RootDocument";
import { IntlProvider } from "@/components/IntlProvider";
import { LocaleSwitchProvider } from "@/components/LocaleSwitchProvider";
import { LogoPreload } from "@/components/LogoPreload";
import { Navbar } from "@/components/Navbar";
import { NotFoundShell } from "@/components/NotFoundShell";
import { SkipLink } from "@/components/SkipLink";
import { getAtlasStats } from "@/data/speciesAtlas";
import {
  NOT_FOUND_CLIENT_MESSAGE_NAMESPACES,
  pickClientMessages,
} from "@/i18n/clientMessages";
import { routing } from "@/i18n/routing";
import { getLiveLocaleSwitchIndex } from "@/lib/liveLocaleSwitchIndex";
import { getNavbarData } from "@/lib/navbarData";
import { notFoundMetadata } from "@/lib/notFoundMetadata";

export function generateMetadata(): Promise<Metadata> {
  return notFoundMetadata(routing.defaultLocale);
}

export default async function RootNotFound() {
  const locale = routing.defaultLocale;
  const messages = pickClientMessages(
    await getMessages({ locale }),
    NOT_FOUND_CLIENT_MESSAGE_NAMESPACES,
  );
  const [t, stats, switchIndex] = await Promise.all([
    getTranslations({ locale, namespace: "nav" }),
    getAtlasStats(locale),
    getLiveLocaleSwitchIndex(),
  ]);
  return (
    <RootDocument locale={locale}>
      <IntlProvider locale={locale} messages={messages}>
        <LocaleSwitchProvider index={switchIndex}>
          <SkipLink label={t("skipToContent")} />
          <LogoPreload />
          <Navbar {...getNavbarData(stats)} />
          <main id="main" tabIndex={-1}>
            <NotFoundShell />
          </main>
        </LocaleSwitchProvider>
      </IntlProvider>
    </RootDocument>
  );
}
