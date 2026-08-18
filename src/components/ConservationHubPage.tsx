"use client";

import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const HERO = "https://cdn.reptiles.ge/vipera-kaznakovi.jpg";

const CARDS = [
  {
    href: "/conservation/witeli-nusxa-qvewarmavlebi" as const,
    key: "reptiles" as const,
  },
  {
    href: "/conservation/witeli-nusxa-amfibiebi" as const,
    key: "amphibians" as const,
  },
  {
    href: "/conservation/ishviati-qvewarmavlebi" as const,
    key: "rare" as const,
  },
  {
    href: "/conservation/endemuri-qvewarmavlebi" as const,
    key: "endemic" as const,
  },
];

export function ConservationHubPage() {
  const t = useTranslations("conservationHub");
  const tShared = useTranslations("groupHubShared");

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section
          className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:pb-16 lg:min-h-[92svh] lg:pb-20"
          style={{ paddingTop: "7rem" }}
        >
          <Image
            src={HERO}
            alt={t("heroImageAlt")}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/92" />
          <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_25%,transparent_25%,rgba(0,0,0,0.58)_100%)]" />
          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-5 sm:mb-7">
                <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/55">
                  <li>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 transition-colors hover:text-white"
                    >
                      <ArrowLeft className="size-3.5" />
                      {tShared("breadcrumbHome")}
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
              <h1 className="mt-3 max-w-4xl font-display text-balance-tight text-[clamp(2.1rem,6vw,4.6rem)] font-semibold leading-[1.05] text-white sm:mt-4">
                {t("title")}
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:text-[16px]">
                {t("subtitle")}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11">
                <a
                  href="#guides"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                >
                  {t("ctaSpecies")}
                  <ArrowRight className="size-4" />
                </a>
                <Link
                  href="/species"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                >
                  {tShared("ctaAllSpecies")}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <Reveal>
                <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  {t("guideEyebrow")}
                </p>
                <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.05]">
                  {t("guideTitle")}
                </h2>
              </Reveal>
              <Reveal delay={60}>
                <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                  <p>{t("guideP1")}</p>
                  <p>{t("guideP2")}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section
          id="guides"
          className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("cardsEyebrow")}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold leading-[1.05]">
                {t("cardsTitle")}
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-border bg-border sm:grid-cols-2">
              {CARDS.map((card) => (
                <Link
                  key={card.key}
                  href={card.href}
                  className="group flex min-h-[180px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background"
                >
                  <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
                    {t(`cards.${card.key}.eyebrow`)}
                  </span>
                  <div className="mt-6">
                    <p className="font-display text-[20px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[22px]">
                      {t(`cards.${card.key}.title`)}
                    </p>
                    <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
                      {t(`cards.${card.key}.body`)}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-foreground">
                      {t(`cards.${card.key}.cta`)}
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
