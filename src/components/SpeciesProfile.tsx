"use client";

import { Reveal } from "@/components/Reveal";
import {
  dangerClass,
  dangerLabels,
  type Species,
} from "@/data/species";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SpeciesProfileProps = {
  species: Species;
  related: Species[];
};

export function SpeciesProfile({ species, related }: SpeciesProfileProps) {
  const [primary, ...rest] = species.gallery;

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-10">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full"
            style={{
              background:
                "color-mix(in oklab, var(--ink) 55%, transparent)",
              backdropFilter: "blur(20px) saturate(140%)",
            }}
          />
          <Link
            href="/"
            className="font-display text-[17px] font-semibold tracking-tight text-white"
          >
            Repti<span className="text-white/60">Verse</span>
          </Link>
          <Link
            href="/#species"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            სახეობები
          </Link>
        </div>
      </header>

      <section className="relative h-[70svh] min-h-[420px] w-full overflow-hidden bg-ink lg:h-[75svh]">
        <Image
          src={primary ?? species.image}
          alt={species.commonName}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_30%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-12 lg:px-10 lg:pb-16">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/50">
              {species.family} · {species.genus}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-balance-tight text-[clamp(2.2rem,5.5vw,4.5rem)] font-semibold leading-[0.98] text-white">
              {species.commonName}
            </h1>
            <p className="mt-3 font-display text-[clamp(1.1rem,2vw,1.5rem)] font-light italic text-white/55">
              {species.scientificName}
            </p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-[16px]">
              {species.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-[13px] text-white/55">
                <MapPin className="size-3.5" />
                {species.location}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${dangerClass(species.danger)}`}
              >
                {dangerLabels[species.danger]}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                მიმოხილვა
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]">
                ვინ არის {species.commonName}?
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
                <div className="p-6 transition-colors duration-500 hover:bg-card lg:p-8">
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

      <section className="bg-ink py-24 text-ink-foreground lg:py-32">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
              <Image
                src={rest[0] ?? species.image}
                alt={`${species.commonName} — ჰაბიტატი`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-ink-muted">
                ჰაბიტატი
              </p>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05] text-white">
                სად ცხოვრობს
              </h2>
              <p className="mt-7 text-[16px] leading-relaxed text-white/75 sm:text-[17px]">
                {species.habitat}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              ბიოლოგია
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]">
              კვება, ქცევა და გამრავლება
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            {[
              { title: "კვება", body: species.diet },
              { title: "ქცევა", body: species.behavior },
              { title: "კონსერვაცია", body: species.conservation },
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

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              საინტერესო ფაქტები
            </p>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]">
              რა უნდა იცოდე
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

      {related.length > 0 && (
        <section className="border-t border-border bg-background pb-28 pt-8 lg:pb-36">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    სხვა სახეობები
                  </p>
                  <h2 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05]">
                    გააგრძელე აღმოჩენა
                  </h2>
                </div>
                <Link
                  href="/#species"
                  className="hidden items-center gap-1.5 text-[13px] font-medium text-primary sm:inline-flex"
                >
                  ყველა სახეობა
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
                      src={item.image}
                      alt={item.commonName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
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
      )}

      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <Link href="/" className="font-display text-[15px] font-semibold text-foreground">
            Repti<span className="text-primary">Verse</span>
          </Link>
          <span>© {new Date().getFullYear()} ReptiVerse</span>
        </div>
      </footer>
    </div>
  );
}
