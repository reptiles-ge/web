"use client";

import { Reveal } from "@/components/Reveal";
import { images } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function FinalCTA() {
  const t = useTranslations("cta");

  return (
    <section className="relative flex min-h-[78svh] items-center overflow-hidden bg-ink lg:min-h-[85svh]">
      <Image
        src={images.cta}
        alt={t("imageAlt")}
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/88" />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 text-center lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/45">
            {t("eyebrow")}
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl font-display text-balance-tight text-[clamp(2.2rem,6vw,4.75rem)] font-semibold leading-[1.02] text-white">
            {t("title")}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-white/60 sm:mt-7">
            {t("subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row">
            <Link
              href="/species"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[14px] font-medium text-ink transition-transform duration-300 hover:scale-[1.02]"
            >
              {t("button")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/venomous-snakes"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-[14px] font-medium text-white/90 backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white/10"
            >
              {t("secondary")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
