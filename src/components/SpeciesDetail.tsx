"use client";

import { Reveal } from "@/components/Reveal";
import { getSpeciesById, images } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";

export function SpeciesDetail() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("detail");
  const featured = useMemo(() => {
    const base = getSpeciesById("vipera-dinniki")!;
    return localizeSpecies(base, locale);
  }, [locale]);

  return (
    <section
      id="detail"
      className="relative overflow-hidden bg-ink py-28 text-ink-foreground lg:py-40"
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24 lg:px-10">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
          <Image
            src={images.detail}
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="scale-110 object-cover"
            style={{ transform: "translateY(-6%) scale(1.1)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div>
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-ink-muted">
              {t("eyebrow")}
            </p>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5.4vw,4.5rem)] font-semibold leading-[1] text-white">
              Vipera <span className="font-light italic">dinniki</span>
            </h2>
            <p className="mt-7 max-w-lg text-balance-tight text-[19px] leading-snug text-white/80 sm:text-[22px]">
              {t("lead")}
            </p>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-muted">
              {t("body")}
            </p>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10">
            {featured.stats.slice(0, 4).map((stat, index) => (
              <Reveal key={stat.label} delay={index * 80} className="bg-ink">
                <div className="p-6 lg:p-8">
                  <p className="text-[10px] tracking-[0.22em] text-ink-muted">
                    {stat.label}
                  </p>
                  <p className="mt-3 font-display text-[20px] font-medium leading-tight text-white lg:text-[24px]">
                    {stat.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <Link
              href="/species/vipera-dinniki"
              className="group mt-12 inline-flex items-center gap-2 text-[14px] font-medium text-white"
            >
              <span className="border-b border-white/30 pb-1 group-hover:border-white">
                {t("viewProfile")}
              </span>
              <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
