import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

export async function SnakeBiteCallChip({ locale }: { locale: AppLocale }) {
  const [tShared, tSafety] = await Promise.all([
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "home.safetyStrip" }),
  ]);

  return (
    <a
      aria-label={tSafety("call")}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-destructive pr-4 pl-3 text-[14px] font-semibold text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      href="tel:112"
    >
      <Phone aria-hidden="true" className="size-[15px]" strokeWidth={2} />
      112 · {tShared("cluster.bite.title")}
    </a>
  );
}
