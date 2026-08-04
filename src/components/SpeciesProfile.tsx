"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { SpeciesDanger } from "@/components/SpeciesDanger";
import { SpeciesFaqSection } from "@/components/SpeciesFaqSection";
import { SpeciesGallery } from "@/components/SpeciesGallery";
import { type Species } from "@/data/species";
import { useLocale } from "@/i18n/LocaleProvider";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { ArrowLeft, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type SpeciesProfileProps = {
  species: Species;
  related: Species[];
};

export function SpeciesProfile({ species: rawSpecies }: SpeciesProfileProps) {
  const { locale, t } = useLocale();
  const species = useMemo(
    () => localizeSpecies(rawSpecies, locale),
    [rawSpecies, locale],
  );
  const gallery =
    species.gallery.length > 0 ? species.gallery : [species.image];
  const primary = gallery[0];

  return (
    <div className="min-h-screen bg-background">
      <header
        className="fixed inset-x-0 z-50"
        style={{ top: "var(--beta-banner-height, 0px)" }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-10">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full"
            style={{
              background:
                "color-mix(in oklab, var(--ink) 55%, transparent)",
              backdropFilter: "blur(20px) saturate(140%)",
            }}
          />
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo
              size={44}
              priority
              showWordmark
              wordmarkClassName="text-[17px] text-white"
            />
          </Link>
          <LanguageSwitcher variant="dark" />
        </div>
      </header>

      <main>
      <section className="relative h-[70svh] min-h-[420px] w-full overflow-hidden bg-ink lg:h-[75svh]">
        {species.mobileImage ? (
          <>
            <Image
              src={species.mobileImage}
              alt={species.commonName}
              fill
              priority
              sizes="100vw"
              className="object-cover lg:hidden"
            />
            <Image
              src={primary ?? species.image}
              alt={species.commonName}
              fill
              priority
              sizes="100vw"
              className="hidden object-cover lg:block"
            />
          </>
        ) : (
          <Image
            src={primary ?? species.image}
            alt={species.commonName}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_30%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
          <Reveal>
            <Link
              href="/#species"
              className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-white/55 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              {t.profile.back}
            </Link>
            <h1 className="max-w-4xl font-display text-balance-tight text-[clamp(2.2rem,5.5vw,4.5rem)] font-semibold leading-[0.98] text-white">
              {species.commonName}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-[16px]">
              {species.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[13px] text-white/60 backdrop-blur-md">
                <MapPin className="size-3.5 text-white/45" aria-hidden="true" />
                {species.location}
              </span>
              <SpeciesDanger level={species.danger} variant="hero" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t.profile.overview}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]">
                {t.profile.whoIs} {species.commonName}?
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-[17px] leading-relaxed text-foreground/85 sm:text-[19px]">
                {species.overview}
              </p>
            </Reveal>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-border md:grid-cols-3">
            {species.stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 60}
                className="bg-background"
              >
                <div className="p-6 lg:p-8">
                  <p className="text-[10px] tracking-[0.22em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-3 font-display text-[20px] font-medium leading-tight lg:text-[24px]">
                    {stat.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t.profile.biology}
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]">
              {t.profile.biologyTitle}
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            {[
              { title: t.profile.diet, body: species.diet },
              { title: t.profile.behavior, body: species.behavior },
              { title: t.profile.conservation, body: species.conservation },
            ].map((block, index) => (
              <Reveal key={block.title} delay={index * 100}>
                <div className="h-px w-12 bg-gold" />
                <h3 className="mt-6 font-display text-[22px] font-medium">
                  {block.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {block.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SpeciesGallery images={gallery} name={species.commonName} />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t.profile.facts}
            </p>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]">
              {t.profile.factsTitle}
            </h2>
          </Reveal>
          <ol className="mt-14 space-y-0">
            {species.facts.map((fact, index) => (
              <Reveal key={fact} delay={index * 80}>
                <li className="grid grid-cols-[auto_1fr] gap-6 border-t border-border py-8 lg:gap-10 lg:py-10">
                  <span className="font-display text-[28px] font-light text-primary/40 lg:text-[36px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="max-w-2xl self-center text-[16px] leading-relaxed text-foreground/85 sm:text-[18px]">
                    {fact}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {species.faq && species.faq.length > 0 ? (
        <SpeciesFaqSection items={species.faq} name={species.commonName} />
      ) : null}
      </main>

      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo size={36} showWordmark wordmarkClassName="text-[15px] text-foreground" />
          </Link>
          <span>© {new Date().getFullYear()} Reptiles</span>
        </div>
      </footer>
    </div>
  );
}
