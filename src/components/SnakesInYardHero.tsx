"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { CoverImage } from "@/components/CoverImage";
import { InkHeroBreadcrumb } from "@/components/InkHeroBreadcrumb";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";

export function SnakesInYardHero({ heroSrc }: { heroSrc: string }) {
  const t = useTranslations("snakesInYard");
  const tSnakes = useTranslations("snakes");

  return (
    <section
      className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:pb-16 lg:min-h-[92svh] lg:pb-20"
      style={{ paddingTop: "7rem" }}
    >
      <CoverImage
        alt={t("heroImageAlt")}
        className="object-cover object-[50%_45%]"
        priority
        sizes="100vw"
        src={heroSrc}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/92" />
      <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_25%,transparent_25%,rgba(0,0,0,0.58)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
        <div>
          <InkHeroBreadcrumb
            crumbs={[
              { href: "/", label: t("breadcrumbHome"), withBack: true },
              { href: "/snakes", label: tSnakes("breadcrumbCurrent") },
              { label: t("breadcrumbCurrent") },
            ]}
          />

          <p className="font-display text-display-kicker font-semibold tracking-tight text-white/90">
            Reptiles
          </p>
          <h1 className="text-balance-tight mt-3 max-w-4xl font-display text-display-hero font-semibold text-white sm:mt-4">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:text-[16px]">
            <PhoneLinkedText>{t("subtitle")}</PhoneLinkedText>
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
              href="#actions"
            >
              {t("ctaActions")}
              <ArrowRight className="size-4" />
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
              href="#myths"
            >
              {t("ctaMyths")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
