"use client";

import { Fragment } from "react";
import { Reveal } from "@/components/Reveal";
import { images } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

type Status = "active" | "next" | "planned" | "future" | "longterm";
type PhaseId =
  | "p01"
  | "p02"
  | "p03"
  | "p04"
  | "p05"
  | "p06"
  | "p07"
  | "p08"
  | "p09"
  | "p10"
  | "p11"
  | "p12";
type PhaseHref = "/snakes" | "/amphibians" | "/birds" | "/mammals";

type Chapter = "life" | "atlas";

type Phase = {
  id: PhaseId;
  chapter: Chapter;
  status: Status;
  latin: string;
  glyph: GlyphKind;
  href?: PhaseHref;
  taxa: boolean;
  layers: boolean;
  examples?: boolean;
  questions?: boolean;
};

const STATUSES: Status[] = [
  "active",
  "next",
  "planned",
  "future",
  "longterm",
];

const ARC = ["reptiles", "vertebrates", "wildlife", "biodiversity", "atlas"] as const;

const PHASES: Phase[] = [
  {
    id: "p01",
    chapter: "life",
    status: "active",
    latin: "Reptilia",
    glyph: "snake",
    href: "/snakes",
    taxa: true,
    layers: true,
  },
  {
    id: "p02",
    chapter: "life",
    status: "next",
    latin: "Amphibia",
    glyph: "frog",
    href: "/amphibians",
    taxa: true,
    layers: true,
  },
  {
    id: "p03",
    chapter: "life",
    status: "planned",
    latin: "Aves",
    glyph: "bird",
    href: "/birds",
    taxa: true,
    layers: true,
  },
  {
    id: "p04",
    chapter: "life",
    status: "planned",
    latin: "Mammalia",
    glyph: "bear",
    href: "/mammals",
    taxa: true,
    layers: true,
    examples: true,
  },
  {
    id: "p05",
    chapter: "life",
    status: "planned",
    latin: "Pisces",
    glyph: "fish",
    taxa: true,
    layers: true,
  },
  {
    id: "p06",
    chapter: "life",
    status: "future",
    latin: "Invertebrata",
    glyph: "moth",
    taxa: true,
    layers: false,
  },
  {
    id: "p07",
    chapter: "life",
    status: "future",
    latin: "Plantae",
    glyph: "leaf",
    taxa: true,
    layers: false,
  },
  {
    id: "p08",
    chapter: "life",
    status: "future",
    latin: "Fungi",
    glyph: "fungus",
    taxa: true,
    layers: false,
  },
  {
    id: "p09",
    chapter: "atlas",
    status: "longterm",
    latin: "Oecosystema",
    glyph: "mountain",
    taxa: true,
    layers: true,
  },
  {
    id: "p10",
    chapter: "atlas",
    status: "longterm",
    latin: "Atlas",
    glyph: "map",
    taxa: true,
    layers: true,
  },
  {
    id: "p11",
    chapter: "atlas",
    status: "longterm",
    latin: "Areae protectae",
    glyph: "shield",
    taxa: true,
    layers: true,
  },
  {
    id: "p12",
    chapter: "atlas",
    status: "longterm",
    latin: "Graph",
    glyph: "graph",
    taxa: false,
    layers: false,
    questions: true,
  },
];

const PLATFORM = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

const GRAPH_NODES = [
  "species",
  "habitat",
  "location",
  "ecosystem",
  "protected",
  "observation",
  "science",
] as const;

const DEST_PILLARS = [
  "species",
  "geography",
  "habitats",
  "ecosystems",
  "conservation",
  "photography",
  "science",
] as const;

type GlyphKind =
  | "snake"
  | "frog"
  | "bird"
  | "bear"
  | "fish"
  | "moth"
  | "leaf"
  | "fungus"
  | "mountain"
  | "map"
  | "shield"
  | "graph";

const STATUS_CLASS: Record<Status, string> = {
  active:
    "border-primary/35 bg-primary/12 text-primary",
  next: "border-gold/40 bg-gold/12 text-gold",
  planned:
    "border-foreground/15 bg-foreground/[0.04] text-foreground/70",
  future: "border-border bg-surface/80 text-muted-foreground",
  longterm:
    "border-ink/20 bg-ink/[0.06] text-foreground/75 dark:border-white/15 dark:bg-white/[0.06]",
};

function asList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function Glyph({ kind }: { kind: GlyphKind }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.15,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "size-9",
  };

  if (kind === "snake") {
    return (
      <svg {...common}>
        <path d="M10 32c6-1 8-8 14-8 4 0 5 5 9 5 4 0 6-4 9-4" />
        <path d="M10 32c-2 4 1 8 6 7" />
        <circle cx="38" cy="24.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "frog") {
    return (
      <svg {...common}>
        <path d="M16 28c2-8 14-8 16 0" />
        <path d="M16 28c-4 2-6 8-2 10M32 28c4 2 6 8 2 10" />
        <path d="M20 22c0-3 2-5 4-5s4 2 4 5" />
        <circle cx="21.5" cy="20" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="26.5" cy="20" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "bird") {
    return (
      <svg {...common}>
        <path d="M10 28c8-2 12-10 22-12 2 6-1 12-8 14-6 2-12 0-14-2Z" />
        <path d="M32 16l6-4" />
      </svg>
    );
  }
  if (kind === "bear") {
    return (
      <svg {...common}>
        <circle cx="16" cy="16" r="4" />
        <circle cx="32" cy="16" r="4" />
        <path d="M14 20c2 12 18 12 20 0" />
        <circle cx="20" cy="24" r="1" fill="currentColor" stroke="none" />
        <circle cx="28" cy="24" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "fish") {
    return (
      <svg {...common}>
        <path d="M8 24c8-10 24-10 28 0-4 10-20 10-28 0Z" />
        <path d="M36 24l8-6v12l-8-6Z" />
        <circle cx="16" cy="22" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "moth") {
    return (
      <svg {...common}>
        <path d="M24 14v20" />
        <path d="M24 18c-8-8-16-2-14 6 6 2 10 2 14 0 4 2 8 2 14 0 2-8-6-14-14-6Z" />
      </svg>
    );
  }
  if (kind === "leaf") {
    return (
      <svg {...common}>
        <path d="M24 40c0-16 12-26 16-28-2 16-8 24-16 28Z" />
        <path d="M24 40c0-16-12-26-16-28 2 16 8 24 16 28Z" />
        <path d="M24 40V16" />
      </svg>
    );
  }
  if (kind === "fungus") {
    return (
      <svg {...common}>
        <path d="M12 22c0-10 24-10 24 0H12Z" />
        <path d="M22 22v14h4V22" />
      </svg>
    );
  }
  if (kind === "mountain") {
    return (
      <svg {...common}>
        <path d="M6 36l12-20 6 10 8-14 10 24H6Z" />
        <path d="M18 16l4 4 4-3" />
      </svg>
    );
  }
  if (kind === "map") {
    return (
      <svg {...common}>
        <path d="M10 12l10-4 8 4 10-4v28l-10 4-8-4-10 4V12Z" />
        <path d="M20 8v28M28 12v28" />
      </svg>
    );
  }
  if (kind === "shield") {
    return (
      <svg {...common}>
        <path d="M24 8l16 6v12c0 10-8 16-16 18C16 42 8 36 8 26V14l16-6Z" />
        <path d="M24 16v16" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="24" cy="14" r="3.5" />
      <circle cx="12" cy="30" r="3.5" />
      <circle cx="36" cy="30" r="3.5" />
      <circle cx="24" cy="38" r="3.5" />
      <path d="M24 17.5v16.5M15 28l6-12M33 28l-6-12M15.5 32.5h17" />
    </svg>
  );
}

export function RoadmapPage() {
  const t = useTranslations("roadmap");

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section
          className="relative flex min-h-[62svh] w-full flex-col justify-end overflow-hidden bg-ink pb-10 text-ink-foreground sm:pb-12 lg:min-h-[68svh] lg:pb-16"
          style={{ paddingTop: "7rem" }}
        >
          <Image
            src={images.cta}
            alt={t("heroImageAlt")}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_40%]"
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
                {t("lead")}
              </p>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-[16px]">
                {t("principle")}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-border bg-background py-8 lg:py-10">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
              {t("principleEyebrow")}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              {ARC.map((key, index) => (
                <div key={key} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span
                      aria-hidden
                      className="hidden h-px w-6 bg-border sm:block"
                    />
                  ) : null}
                  <span className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/75">
                    {t(`arc.${key}`)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <p className="mr-2 text-[11px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                {t("legendLabel")}
              </p>
              {STATUSES.map((status) => (
                <span
                  key={status}
                  className={`rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${STATUS_CLASS[status]}`}
                >
                  {t(`status.${status}`)}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-surface/50 py-16 lg:py-24">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-16 lg:px-10">
            <div>
              <Reveal>
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                  {t("bioEyebrow")}
                </p>
                <h2 className="mt-3 max-w-xl font-display text-[clamp(1.7rem,3.2vw,2.45rem)] font-semibold leading-[1.08]">
                  {t("bioTitle")}
                </h2>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  {t("bioLead")}
                </p>
              </Reveal>

              <ol className="relative mt-12 space-y-5 before:absolute before:bottom-8 before:left-[1.15rem] before:top-8 before:w-px before:bg-border lg:before:left-[1.35rem]">
                {PHASES.map((phase, index) => {
                  const taxa = phase.taxa ? asList(t.raw(`phases.${phase.id}.taxa`)) : [];
                  const layers = phase.layers
                    ? asList(t.raw(`phases.${phase.id}.layers`))
                    : [];
                  const examples = phase.examples
                    ? asList(t.raw(`phases.${phase.id}.examples`))
                    : [];
                  const questions = phase.questions
                    ? asList(t.raw(`phases.${phase.id}.questions`))
                    : [];
                  const wide = phase.id === "p06" || phase.id === "p12";
                  const prev = PHASES[index - 1];
                  const showChapter = !prev || prev.chapter !== phase.chapter;

                  return (
                    <Fragment key={phase.id}>
                      {showChapter ? (
                        <li className="relative list-none pl-12 lg:pl-14">
                          <div
                            className={index > 0 ? "mt-8 border-t border-border pt-10" : ""}
                          >
                            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                              {t(`chapters.${phase.chapter}.eyebrow`)}
                            </p>
                            <p className="mt-2 font-display text-[1.25rem] font-semibold leading-tight text-foreground">
                              {t(`chapters.${phase.chapter}.title`)}
                            </p>
                            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
                              {t(`chapters.${phase.chapter}.lead`)}
                            </p>
                          </div>
                        </li>
                      ) : null}
                      <li className="relative pl-12 lg:pl-14">
                      <span
                        aria-hidden
                        className={`absolute left-0 top-7 flex size-[2.3rem] items-center justify-center rounded-full border bg-background text-[11px] font-medium tracking-[0.12em] ${
                          phase.status === "active"
                            ? "border-primary text-primary"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <article
                        className={`rounded-[28px] border bg-card p-6 shadow-[0_18px_50px_rgba(14,20,17,0.04)] sm:p-8 ${
                          wide
                            ? "border-foreground/12"
                            : "border-border"
                        } ${phase.status === "active" ? "ring-1 ring-primary/20" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                              {phase.latin}
                            </p>
                            <h3 className="mt-2 font-display text-[1.45rem] font-semibold leading-tight text-foreground sm:text-[1.7rem]">
                              {t(`phases.${phase.id}.title`)}
                            </h3>
                          </div>
                          <span className="text-foreground/35">
                            <Glyph kind={phase.glyph} />
                          </span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${STATUS_CLASS[phase.status]}`}
                          >
                            {t(`status.${phase.status}`)}
                          </span>
                          {phase.href ? (
                            <Link
                              href={phase.href}
                              className="inline-flex items-center gap-1 text-[12px] font-medium text-primary transition-opacity hover:opacity-80"
                            >
                              {t("openLayer")}
                              <ArrowUpRight className="size-3.5" />
                            </Link>
                          ) : null}
                        </div>
                        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                          {t(`phases.${phase.id}.lead`)}
                        </p>
                        {taxa.length > 0 ? (
                          <ul className="mt-5 flex flex-wrap gap-2">
                            {taxa.map((item) => (
                              <li
                                key={item}
                                className="rounded-full border border-border bg-background px-3 py-1.5 text-[12px] text-foreground/80"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {layers.length > 0 ? (
                          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
                            {layers.map((item) => (
                              <li key={item} className="before:mr-2 before:text-foreground/25 before:content-['·'] first:before:content-none">
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {examples.length > 0 ? (
                          <p className="mt-5 font-display text-[14px] italic leading-relaxed text-foreground/70">
                            {examples.join("  ·  ")}
                          </p>
                        ) : null}
                        {questions.length > 0 ? (
                          <ul className="mt-6 space-y-3 border-t border-border pt-5">
                            {questions.map((item) => (
                              <li
                                key={item}
                                className="text-[14px] leading-relaxed text-foreground/80"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </article>
                    </li>
                    </Fragment>
                  );
                })}
              </ol>
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-[28px] border border-border bg-ink text-ink-foreground">
                <div className="border-b border-white/10 px-6 py-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
                    {t("platformEyebrow")}
                  </p>
                  <h2 className="mt-3 font-display text-[1.35rem] font-semibold leading-tight text-white">
                    {t("platformTitle")}
                  </h2>
                  <p className="mt-3 text-[13px] leading-relaxed text-white/50">
                    {t("platformLead")}
                  </p>
                </div>
                <ol className="px-6 py-5">
                  {PLATFORM.map((key, index) => (
                    <li key={key} className="relative flex gap-4 py-3.5">
                      {index < PLATFORM.length - 1 ? (
                        <span
                          aria-hidden
                          className="absolute bottom-0 left-[0.95rem] top-10 w-px bg-white/12"
                        />
                      ) : null}
                      <span className="mt-0.5 flex size-[1.9rem] shrink-0 items-center justify-center rounded-full border border-white/18 text-[11px] font-medium tracking-[0.12em] text-white/70">
                        {key.toUpperCase()}
                      </span>
                      <div>
                        <p className="text-[14px] font-medium leading-snug text-white">
                          {t(`platform.${key}`)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                {t("graphEyebrow")}
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.08]">
                {t("graphTitle")}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {t("graphLead")}
              </p>
            </Reveal>

            <div className="mt-12 overflow-hidden rounded-[32px] border border-border bg-card px-5 py-10 sm:px-10">
              <div className="flex flex-col items-center gap-0">
                {GRAPH_NODES.map((node, index) => (
                  <div key={node} className="flex flex-col items-center">
                    {index > 0 ? (
                      <div
                        aria-hidden
                        className="flex h-9 flex-col items-center justify-center"
                      >
                        <span className="h-9 w-px bg-border" />
                      </div>
                    ) : null}
                    <div className="rounded-full border border-border bg-background px-5 py-2.5 text-center text-[13px] font-medium text-foreground sm:px-7">
                      {t(`graph.nodes.${node}`)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-border bg-ink py-20 text-ink-foreground lg:py-28">
          <Image
            src={images.cta}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[50%_55%] opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/78 to-ink/92" />
          <div className="relative z-10 mx-auto max-w-[1400px] px-6 text-center lg:px-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-white/40">
              {t("destEyebrow")}
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,6vw,4.4rem)] font-semibold leading-[0.94] tracking-tight text-white">
              {t("destTitle")}
            </h2>
            <p className="mt-5 font-display text-[clamp(1.15rem,2.4vw,1.65rem)] text-white/70">
              {t("destSubtitle")}
            </p>
            <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2">
              {DEST_PILLARS.map((item) => (
                <li
                  key={item}
                  className="text-[12px] uppercase tracking-[0.22em] text-white/55"
                >
                  {t(`destPillars.${item}`)}
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-10 max-w-xl text-[15px] leading-relaxed text-white/50">
              {t("destNote")}
            </p>
          </div>
        </section>

        <section className="border-t border-border bg-background py-20 lg:py-24">
          <div className="mx-auto max-w-[760px] px-6 text-center lg:px-10">
            <p className="font-display text-[clamp(1.35rem,3vw,1.85rem)] font-semibold leading-[1.25] text-foreground">
              {t("closing")}
            </p>
            <Link
              href="/species"
              className="group mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-primary"
            >
              {t("cta")}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
