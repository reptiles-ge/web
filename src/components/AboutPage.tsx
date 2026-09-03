"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { CoverImage } from "@/components/CoverImage";
import { Reveal } from "@/components/Reveal";
import { images } from "@/data/species";
import { Link } from "@/i18n/navigation";

const SOURCE_LINKS = [
  {
    href: "https://doi.org/10.3897/caucasiana.5.e189214",
    key: "tarkhnishvili" as const,
  },
  {
    href: "https://doi.org/10.1080/09397140.2021.1957208",
    key: "iankoshvili" as const,
  },
];

const PILLARS = ["discover", "understand", "protect"] as const;

export function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="min-h-screen bg-background">
      <div>
        <section
          className="relative flex min-h-[58svh] w-full flex-col justify-end overflow-hidden bg-ink pb-10 sm:pb-12 lg:min-h-[62svh] lg:pb-16"
          style={{
            paddingTop: "7rem",
          }}
        >
          <CoverImage
            alt={t("heroImageAlt")}
            className="object-cover"
            priority
            sizes="100vw"
            src={images.cta}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/35 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_20%,transparent_25%,rgba(0,0,0,0.55)_100%)]" />

          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <Link
                className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-white/55 transition-colors hover:text-white sm:mb-6"
                href="/"
              >
                <ArrowLeft className="size-3.5" />
                {t("back")}
              </Link>
              <p className="font-display text-[clamp(2.4rem,6vw,3.75rem)] leading-none font-semibold tracking-tight text-white">
                {t("brand")}
              </p>
              <p className="mt-5 text-[11px] font-medium tracking-[0.32em] text-white/45 uppercase">
                {t("eyebrow")}
              </p>
              <h1 className="text-balance-tight mt-3 max-w-3xl font-display text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.08] font-semibold text-white sm:mt-4">
                {t("title")}
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/65 sm:mt-5 sm:text-[16px]">
                {t("subtitle")}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <Reveal>
                <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
                  {t("companyEyebrow")}
                </p>
                <h2 className="mt-4 font-display text-[clamp(1.85rem,3.5vw,2.75rem)] leading-[1.05] font-semibold text-foreground">
                  {t("companyTitle")}
                </h2>
              </Reveal>
              <Reveal>
                <div className="space-y-5 text-[15px] leading-[1.75] text-muted-foreground">
                  <p>{t("companyBody1")}</p>
                  <p>{t("companyBody2")}</p>
                  <p>{t("companyBody3")}</p>
                </div>
                <Link
                  className="group mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-foreground transition-colors hover:text-primary"
                  href="/contact"
                >
                  <span className="border-b border-foreground/20 pb-1 transition-colors group-hover:border-primary">
                    {t("contributeCta")}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </Link>
              </Reveal>
            </div>

            <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-border/80 sm:grid-cols-3 lg:mt-20">
              {PILLARS.map((pillar, index) => (
                <div
                  className="bg-card px-6 py-8 sm:px-8 sm:py-10"
                  key={pillar}
                >
                  <span className="font-display text-[13px] font-medium tracking-[0.2em] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-display text-[1.35rem] leading-tight font-semibold text-foreground">
                    {t(`pillars.${pillar}.title`)}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                    {t(`pillars.${pillar}.body`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="scroll-mt-28 border-t border-border bg-surface/60 py-20 lg:py-28"
          id="methodology"
        >
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
                {t("methodEyebrow")}
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.05] font-semibold">
                {t("methodTitle")}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {t("methodLead")}
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <MethodCard
                body={t("methodCardBody")}
                title={t("methodCardTitle")}
              />
              <MethodCard
                body={t("sourcesCardBody")}
                title={t("sourcesCardTitle")}
              />
              <MethodCard
                body={t("photosCardBody")}
                title={t("photosCardTitle")}
              />
            </div>

            <ul className="mt-10 flex flex-wrap gap-3">
              {SOURCE_LINKS.map((source) => (
                <li key={source.key}>
                  <a
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    href={source.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t(`sources.${source.key}`)}
                    <ArrowUpRight className="size-3.5 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
                {t("exploreEyebrow")}
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.05] font-semibold">
                {t("exploreTitle")}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {t("exploreBody")}
              </p>
            </Reveal>
            <div className="mt-12 grid gap-px overflow-hidden rounded-[24px] bg-border/80 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  { href: "/species" as const, key: "species" as const },
                  { href: "/snakes" as const, key: "snakes" as const },
                  { href: "/lizards" as const, key: "lizards" as const },
                  { href: "/turtles" as const, key: "turtles" as const },
                  { href: "/amphibians" as const, key: "amphibians" as const },
                  { href: "/birds" as const, key: "birds" as const },
                  { href: "/mammals" as const, key: "mammals" as const },
                  { href: "/spiders" as const, key: "spiders" as const },
                  {
                    href: "/venomous-snakes" as const,
                    key: "venomous" as const,
                  },
                ] as const
              ).map((item, index) => (
                <Link
                  className="group flex min-h-[150px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background"
                  href={item.href}
                  key={item.href}
                >
                  <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-8 inline-flex items-center gap-1.5 font-display text-[18px] font-semibold text-foreground transition-colors group-hover:text-primary">
                    {t(`exploreLinks.${item.key}`)}
                    <ArrowUpRight className="size-4 opacity-50" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[860px] px-6 text-center lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
                {t("contributeEyebrow")}
              </p>
              <h2 className="mt-4 font-display text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.05] font-semibold">
                {t("contributeTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                {t("contributeBody")}
              </p>
              <Link
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[13px] font-medium text-white transition-colors hover:bg-primary/90 dark:text-ink"
                href="/contact"
              >
                {t("contributeCta")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}

function MethodCard({ body, title }: { body: string; title: string }) {
  return (
    <div className="rounded-[24px] border border-border/80 bg-card px-5 py-6 sm:px-6">
      <h3 className="font-display text-[1.15rem] font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}
