import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound, permanentRedirect } from "next/navigation";

import { getPathname } from "@/i18n/navigation";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  legacySpeciesStaticParams,
  resolveSpecies,
  speciesHref,
} from "@/lib/speciesRoutes";

type PageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { follow: false, index: false },
  };
}

export function generateStaticParams() {
  return legacySpeciesStaticParams();
}

export default async function LegacySpeciesRedirect({ params }: PageProps) {
  const { id, locale: localeParam } = await params;
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
    getPathname({ href: speciesHref(species.id, locale), locale }),
  );
}
