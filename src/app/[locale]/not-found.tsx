import type { Metadata } from "next";

import { hasLocale, useLocale } from "next-intl";

import { NotFoundShell } from "@/components/NotFoundShell";
import { type AppLocale, routing } from "@/i18n/routing";
import { notFoundMetadata } from "@/lib/notFoundMetadata";

type Props = {
  params?: Promise<{ locale?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const requested = (await params)?.locale;
  return notFoundMetadata(
    hasLocale(routing.locales, requested) ? requested : routing.defaultLocale,
  );
}

export default function NotFound() {
  const locale = useLocale() as AppLocale;
  return <NotFoundShell locale={locale} />;
}
