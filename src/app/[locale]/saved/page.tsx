import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { SavedPage } from "@/components/SavedPage";
import { routing } from "@/i18n/routing";
import { GROUP_HUB_ILLUSTRATIONS } from "@/lib/groupHubs";
import { buildPageMetadata, type LocalePageProps } from "@/lib/pageMetadata";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/robots";
import { absoluteUrl, localePath, SITE_OG_IMAGE_URL } from "@/lib/site";

const SAVED_CLIENT_MESSAGES = ["danger", "saved"] as const;

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam;
  const t = await getTranslations({ locale, namespace: "saved" });

  return {
    ...buildPageMetadata({
      description: t("metaDescription"),
      locale,
      ogImageUrl: SITE_OG_IMAGE_URL,
      pagePath: "/saved",
      title: t("metaTitle"),
    }),
    robots: NOINDEX_FOLLOW_ROBOTS,
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SavedSpeciesPage({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam;
  setRequestLocale(locale);

  return (
    <ClientMessagesProvider locale={locale} namespaces={SAVED_CLIENT_MESSAGES}>
      <SavedPage
        emptyImages={[
          GROUP_HUB_ILLUSTRATIONS.lizards,
          GROUP_HUB_ILLUSTRATIONS.snakes,
        ]}
        pageUrl={absoluteUrl(localePath(locale, "/saved"))}
      />
    </ClientMessagesProvider>
  );
}
