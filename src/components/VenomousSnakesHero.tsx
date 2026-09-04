"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { ClusterStat } from "@/components/ClusterSectionIntro";
import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";

type VenomousSnakesHeroProps = {
  heroSrc: string;
  highCount: number;
  moderateCount: number;
  speciesCount: number;
};

export function VenomousSnakesHero({
  heroSrc,
  highCount,
  moderateCount,
  speciesCount,
}: VenomousSnakesHeroProps) {
  const t = useTranslations("venomousSnakes");
  const tSnakes = useTranslations("snakes");

  return (
    <>
      <section
        className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:pb-16 lg:min-h-[92svh] lg:pb-20"
        style={{
          paddingTop: "7rem",
        }}
      >
        <CoverImage
          alt={t("heroImageAlt")}
          className="object-cover object-[50%_35%]"
          priority
          sizes="100vw"
          src={heroSrc}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/35 to-black/92" />
        <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_25%,transparent_25%,rgba(0,0,0,0.58)_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <div>
            <nav aria-label="Breadcrumb" className="mb-5 sm:mb-7">
              <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/55">
                <li>
                  <Link
                    className="inline-flex items-center gap-2 transition-colors hover:text-white"
                    href="/"
                  >
                    <ArrowLeft className="size-3.5" />
                    {t("breadcrumbHome")}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/30">
                  /
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-white"
                    href="/snakes"
                  >
                    {tSnakes("breadcrumbCurrent")}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-white/30">
                  /
                </li>
                <li className="text-white/80">{t("breadcrumbCurrent")}</li>
              </ol>
            </nav>

            <p className="font-display text-[clamp(1.15rem,2.4vw,1.65rem)] font-semibold tracking-tight text-white/90">
              Reptiles
            </p>
            <h1 className="text-balance-tight mt-3 max-w-4xl font-display text-[clamp(2.1rem,6vw,4.6rem)] leading-[1.05] font-semibold text-white sm:mt-4">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:text-[16px]">
              {t("subtitle")}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11">
              <a
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                href="#species"
              >
                {t("ctaSpecies")}
                <ArrowRight className="size-4" />
              </a>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                href={{ pathname: "/species", query: { danger: "venomous" } }}
              >
                {t("ctaAtlas")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-10 sm:py-12">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-6 sm:grid-cols-3 sm:gap-6 lg:px-10">
          <ClusterStat label={t("statSpecies")} value={speciesCount} />
          <ClusterStat label={t("statHigh")} value={highCount} />
          <ClusterStat label={t("statModerate")} value={moderateCount} />
        </div>
      </section>
    </>
  );
}
