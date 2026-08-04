"use client";

import { images } from "@/data/species";
import { useLocale } from "@/i18n/LocaleProvider";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const { t } = useLocale();

  return (
    <section
      id="top"
      className="relative flex min-h-[68svh] w-full items-center overflow-hidden bg-ink pt-24 pb-16 lg:min-h-[72svh] lg:pt-28 lg:pb-20"
    >
      <div className="absolute inset-0">
        <Image
          src={images.hero}
          alt={t.hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/85" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,transparent_35%,rgba(0,0,0,0.6)_100%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center px-6 text-center lg:px-10">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.32em] text-white/55">
          {t.hero.eyebrow}
        </p>
        <h1 className="font-display max-w-4xl text-balance-tight text-[clamp(2.1rem,5.4vw,4.25rem)] font-semibold leading-[1.02] text-white">
          {t.hero.title}
        </h1>
        <p className="mt-4 max-w-lg text-balance-tight text-[15px] leading-relaxed text-white/70">
          {t.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#species"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-medium text-ink"
          >
            {t.hero.viewSpecies}
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#detail"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[14px] font-medium text-white/90 backdrop-blur-md hover:border-white/50 hover:bg-white/10"
          >
            {t.hero.moreAboutViper}
          </a>
        </div>
      </div>
    </section>
  );
}
