import { ArrowRight, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { getPathname, Link } from "@/i18n/navigation";

export async function FinalCTA({ locale }: { locale: AppLocale }) {
  const [t, tSearch, tHero] = await Promise.all([
    getTranslations({ locale, namespace: "cta" }),
    getTranslations({ locale, namespace: "search" }),
    getTranslations({ locale, namespace: "hero" }),
  ]);

  return (
    <section className="bg-background px-4 pb-12 text-white lg:px-[60px] lg:pb-20">
      <div className="mx-auto grid max-w-[1320px] gap-7 rounded-[32px] bg-ink px-6 py-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-center lg:gap-12 lg:rounded-[44px] lg:px-16 lg:py-[60px]">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-white/60 uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 max-w-[580px] font-display text-[30px] leading-[1.15] font-semibold text-white lg:text-[48px] lg:leading-[1.1]">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-[1.6] text-white/70 lg:mt-[18px] lg:text-[16px] lg:leading-[1.65]">
            {t("subtitle")}
          </p>
        </div>
        <div>
          <form
            action={getPathname({ href: "/species", locale })}
            className="flex h-14 items-center gap-2.5 rounded-full bg-white py-1.5 pr-1.5 pl-[18px] text-[#1a211c] shadow-[0_18px_44px_rgba(0,0,0,0.45)] transition-shadow focus-within:ring-4 focus-within:ring-[#6fad88]/60 lg:h-16 lg:gap-3 lg:pr-2 lg:pl-[22px]"
            role="search"
          >
            <Search
              aria-hidden="true"
              className="size-[18px] shrink-0 text-[#5c665f] lg:size-5"
            />
            <label className="sr-only" htmlFor="cta-search">
              {tSearch("open")}
            </label>
            <input
              className="min-w-0 flex-1 bg-transparent text-[16px] font-medium text-[#1a211c] outline-none placeholder:text-[#5c665f] lg:text-[17px]"
              id="cta-search"
              name="q"
              placeholder={tSearch("placeholder")}
              type="search"
            />
            <button
              aria-label={tHero("searchSubmit")}
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#2f6b4f] text-white transition-colors hover:bg-[#255940] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b4f] lg:size-12"
              type="submit"
            >
              <ArrowRight aria-hidden="true" className="size-[18px]" />
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2.5 lg:mt-5 lg:gap-3">
            <Link
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white pr-[22px] pl-6 text-[14.5px] font-medium text-[#0e1411] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href="/species"
            >
              {t("button")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center rounded-full border border-white/30 px-6 text-[14.5px] font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href="/venomous-snakes"
            >
              {t("secondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
