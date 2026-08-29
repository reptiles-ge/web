import { getPathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  legacySpeciesStaticParams,
  resolveSpecies,
  speciesHref,
} from "@/lib/speciesRoutes";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound, permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return legacySpeciesStaticParams();
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: false },
  };
}

export default async function LegacySpeciesRedirect({ params }: PageProps) {
  const { locale: localeParam, id } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const species = resolveSpecies(id);
  if (!species) {
    notFound();
  }

  permanentRedirect(
    getPathname({ locale, href: speciesHref(species.id, locale) }),
  );
}
