import type { Metadata } from "next";

import { getLocale } from "next-intl/server";

import { NotFoundShell } from "@/components/NotFoundShell";
import { type AppLocale, routing } from "@/i18n/routing";
import { notFoundMetadata } from "@/lib/notFoundMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale().catch(() => routing.defaultLocale);
  return notFoundMetadata(locale as AppLocale);
}

export default function NotFound() {
  return <NotFoundShell />;
}
