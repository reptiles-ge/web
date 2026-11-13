import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { notFound, permanentRedirect } from "next/navigation";

import { routing } from "@/i18n/routing";
import { liveSpeciesRedirectPath } from "@/lib/liveSpeciesRedirect";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const metadata: Metadata = {
  robots: null,
};

type PageProps = {
  params: Promise<{ locale: string; rest: string[] }>;
};

export default async function CatchAllPage({ params }: PageProps) {
  const { locale, rest } = await params;
  if (hasLocale(routing.locales, locale)) {
    const target = await liveSpeciesRedirectPath(locale, rest).catch(
      (error: unknown) => {
        console.error("Live species redirect failed", error);
        return null;
      },
    );
    if (target) permanentRedirect(target);
  }
  notFound();
}
