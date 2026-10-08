import { ArrowUpRight, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { Link } from "@/i18n/navigation";

export async function HomeSafetyStrip({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "home.safetyStrip" });

  return (
    <aside className="bg-[#151c18] text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-6 pt-3.5 pb-2 lg:min-h-16 lg:flex-row lg:items-center lg:gap-6 lg:px-[60px] lg:py-3">
        <div className="flex items-center gap-3">
          <a
            aria-label={t("call")}
            className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#c84739] pr-[15px] pl-3 text-[14px] font-semibold tracking-[0.02em] text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:h-9 lg:text-[15px]"
            href="tel:112"
          >
            <Phone aria-hidden="true" className="size-[15px]" />
            112
          </a>
          <p className="text-[13px] leading-snug text-white/85 lg:text-[14px]">
            {t("body")}
          </p>
        </div>
        <nav
          aria-label={t("navLabel")}
          className="no-scrollbar -mx-6 flex gap-5 overflow-x-auto px-6 text-[13px] font-medium text-white/80 lg:mx-0 lg:ml-auto lg:gap-6 lg:overflow-visible lg:px-0"
        >
          <Link
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 hover:text-white"
            href="/snakes/gvelis-nakbeni"
          >
            {t("snakeBite")}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
          <Link
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 hover:text-white"
            href="/scorpions/morielis-nakbeni"
          >
            {t("scorpionSting")}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
          <Link
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 hover:text-white"
            href="/dangerous-animals"
          >
            {t("safetyGuides")}
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        </nav>
      </div>
    </aside>
  );
}
