"use client";

import { Reveal } from "@/components/Reveal";
import { images } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const SOURCE_LINKS = [
  {
    key: "iucn" as const,
    href: "https://www.iucnredlist.org/",
  },
  {
    key: "gbif" as const,
    href: "https://www.gbif.org/",
  },
  {
    key: "reptileDb" as const,
    href: "https://reptile-database.reptarium.cz/",
  },
];

const PILLARS = ["discover", "understand", "protect"] as const;

export function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section
          className="relative flex min-h-[58svh] w-full flex-col justify-end overflow-hidden bg-ink pb-10 sm:pb-12 lg:min-h-[62svh] lg:pb-16"
          style={{
            paddingTop: "7rem",
          }}
        >
          <Image
            src={images.cta}
            alt={t("heroImageAlt")}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_20%,transparent_25%,rgba(0,0,0,0.55)_100%)]" />

          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <Link
                href="/"
                className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-white/55 transition-colors hover:text-white sm:mb-6"
              >
                <ArrowLeft className="size-3.5" />
                {t("back")}
              </Link>
              <p className="font-display text-[clamp(2.4rem,6vw,3.75rem)] font-semibold leading-none tracking-tight text-white">
                {t("brand")}
              </p>
              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.32em] text-white/45">
                {t("eyebrow")}
              </p>
              <h1 className="mt-3 max-w-3xl font-display text-balance-tight text-[clamp(1.75rem,4.5vw,3.25rem)] font-semibold leading-[1.08] text-white sm:mt-4">
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
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                  {t("companyEyebrow")}
                </p>
                <h2 className="mt-4 font-display text-[clamp(1.85rem,3.5vw,2.75rem)] font-semibold leading-[1.05] text-foreground">
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
                  href="/contact"
                  className="group mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  <span className="border-b border-foreground/20 pb-1 transition-colors group-hover:border-primary">
                    {t("contributeCta")}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </Reveal>
            </div>

            <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-border/80 sm:grid-cols-3 lg:mt-20">
              {PILLARS.map((pillar, index) => (
                <div
                  key={pillar}
                  className="bg-card px-6 py-8 sm:px-8 sm:py-10"
                >
                  <span className="font-display text-[13px] font-medium tracking-[0.2em] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-display text-[1.35rem] font-semibold leading-tight text-foreground">
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

        <section className="border-t border-border bg-surface/60 py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                {t("methodEyebrow")}
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.05]">
                {t("methodTitle")}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {t("methodLead")}
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <MethodCard title={t("methodCardTitle")} body={t("methodCardBody")} />
              <MethodCard title={t("sourcesCardTitle")} body={t("sourcesCardBody")} />
              <MethodCard title={t("photosCardTitle")} body={t("photosCardBody")} />
            </div>

            <ul className="mt-10 flex flex-wrap gap-3">
              {SOURCE_LINKS.map((source) => (
                <li key={source.key}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
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
          <div className="mx-auto max-w-[860px] px-6 text-center lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                {t("contributeEyebrow")}
              </p>
              <h2 className="mt-4 font-display text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-[1.05]">
                {t("contributeTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                {t("contributeBody")}
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[13px] font-medium text-white transition-colors hover:bg-primary/90 dark:text-ink"
              >
                {t("contributeCta")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}

function MethodCard({ title, body }: { title: string; body: string }) {
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
