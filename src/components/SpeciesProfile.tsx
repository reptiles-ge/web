"use client";

import { BiologyBlock } from "@/components/BiologyBlock";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { SpeciesRangeMap } from "@/components/map/SpeciesRangeMap";
import { PhotoCreditCaption } from "@/components/PhotoCreditCaption";
import { Reveal } from "@/components/Reveal";
import { SpeciesDanger } from "@/components/SpeciesDanger";
import { SpeciesFaqSection } from "@/components/SpeciesFaqSection";
import { SpeciesGallery } from "@/components/SpeciesGallery";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  resolvePhotoCredit,
  type GalleryImage,
  type Species,
} from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

type SpeciesProfileProps = {
  species: Species;
  related: Species[];
};

export function SpeciesProfile({
  species: rawSpecies,
  related: rawRelated,
}: SpeciesProfileProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("profile");
  const species = useMemo(
    () => localizeSpecies(rawSpecies, locale),
    [rawSpecies, locale],
  );
  const related = useMemo(
    () => rawRelated.map((item) => localizeSpecies(item, locale)),
    [rawRelated, locale],
  );
  const gallery: GalleryImage[] =
    species.gallery.length > 0
      ? species.gallery
      : [{ src: species.image, credit: species.imageCredit }];
  const primary = gallery[0];
  const heroCredit = resolvePhotoCredit(
    species.imageCredit,
    primary?.credit,
  );
  const mobileHeroCredit = resolvePhotoCredit(
    species.mobileImageCredit,
    species.imageCredit,
    primary?.credit,
  );

  return (
    <div className="min-h-screen bg-background">
      <header
        className="fixed inset-x-0 z-50"
        style={{ top: "var(--beta-banner-height, 0px)" }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full"
            style={{
              background:
                "color-mix(in oklab, var(--ink) 55%, transparent)",
              backdropFilter: "blur(20px) saturate(140%)",
            }}
          />
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            <Logo
              size={44}
              priority
              showWordmark
              wordmarkClassName="hidden text-[17px] text-white sm:inline"
            />
          </Link>
          <div className="flex items-center justify-end gap-2.5 sm:gap-3">
            <SpeciesSearch variant="dark" />
            <ThemeToggle variant="dark" />
            <LanguageSwitcher variant="dark" />
          </div>
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
                src={primary?.src ?? species.image}
                alt={species.commonName}
                fill
                priority
                sizes="100vw"
                className="hidden object-cover lg:block"
              />
            </>
          ) : (
            <Image
              src={primary?.src ?? species.image}
              alt={species.commonName}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_30%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
          <div
            className="pointer-events-none absolute right-6 z-[5] hidden lg:block lg:right-10"
            style={{ top: "calc(var(--beta-banner-height, 0px) + 5.75rem)" }}
          >
            <PhotoCreditCaption credit={heroCredit} variant="hero" />
          </div>
          <div
            className="pointer-events-none absolute right-6 z-[5] lg:hidden"
            style={{ top: "calc(var(--beta-banner-height, 0px) + 5.25rem)" }}
          >
            <PhotoCreditCaption credit={mobileHeroCredit} variant="hero" />
          </div>
          <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
            <Reveal>
              <Link
                href="/#species"
                className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-white/55 transition-colors hover:text-white"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                {t("back")}
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

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("atAGlance")}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]">
                {t("atAGlanceTitle")}
              </h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-border md:grid-cols-3">
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

        <SpeciesGallery
          images={gallery}
          name={species.commonName}
          tone="surface"
        />

        <SpeciesRangeMap
          speciesId={species.id}
          speciesName={species.commonName}
        />

        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("facts")}
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]">
                {t("factsTitle")}
              </h2>
            </Reveal>
            <ol className="mt-12 space-y-0">
              {species.facts.map((fact, index) => (
                <Reveal key={fact} delay={index * 80}>
                  <li className="grid grid-cols-[auto_1fr] gap-6 border-t border-border py-7 lg:gap-10 lg:py-9">
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

        <section className="bg-surface py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {t("biology")}
              </p>
              <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]">
                {t("biologyTitle")}
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
              {[
                { title: t("diet"), body: species.diet },
                { title: t("behavior"), body: species.behavior },
                { title: t("conservation"), body: species.conservation },
              ].map((block, index) => (
                <Reveal key={block.title} delay={index * 100}>
                  <BiologyBlock title={block.title} body={block.body} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {species.faq && species.faq.length > 0 ? (
          <SpeciesFaqSection items={species.faq} name={species.commonName} />
        ) : null}

        {related.length > 0 ? (
          <section className="border-t border-border bg-background py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <Reveal>
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                      {t("related")}
                    </p>
                    <h2 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05]">
                      {t("relatedTitle")}
                    </h2>
                  </div>
                  <Link
                    href="/#species"
                    className="hidden items-center gap-1.5 text-[13px] font-medium text-primary sm:inline-flex"
                  >
                    {t("allSpecies")}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </Reveal>
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item, index) => (
                  <Reveal key={item.id} delay={index * 80}>
                    <Link
                      href={`/species/${item.id}`}
                      className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] bg-ink"
                    >
                      <Image
                        src={item.mobileImage ?? item.image}
                        alt={item.commonName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <p className="text-[12px] italic text-white/50">
                          {item.scientificName}
                        </p>
                        <h3 className="mt-1 font-display text-[22px] font-semibold text-white">
                          {item.commonName}
                        </h3>
                        <p className="mt-2 text-[12px] text-white/50">
                          {item.location}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo
              size={36}
              showWordmark
              wordmarkClassName="text-[15px] text-foreground"
            />
          </Link>
          <span>© {new Date().getFullYear()} Reptiles</span>
        </div>
      </footer>
    </div>
  );
}
