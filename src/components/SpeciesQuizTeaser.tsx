"use client";

import { ArrowUpRight, Check, X } from "lucide-react";
import { useId, useState } from "react";

import type { PictureSource } from "@/data/optimizedImages";
import type { AppLocale } from "@/i18n/routing";
import type { QuizTeaserId, QuizTeaserOption } from "@/lib/quizTeaser";

import { TrackedSpeciesLink } from "@/components/home/TrackedSpeciesLink";
import { QuizCtaLink } from "@/components/QuizCtaLink";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { OPTION_MARKS } from "@/lib/quizOptionMarks";
import { quizHref } from "@/lib/quizzes";

export type SpeciesQuizTeaserCopy = {
  body: string;
  correct: string;
  cta: string;
  eyebrow: string;
  imageAltHidden: string;
  incorrect: string;
  learnMore: string;
  photoCredit: string;
  revealLead: string;
  title: string;
};

type SpeciesQuizTeaserImage = {
  alt: string;
  height?: number;
  photographer?: string;
  sizes: string;
  sources: PictureSource[];
  src: string;
  width?: number;
};

type SpeciesQuizTeaserProps = {
  copy: SpeciesQuizTeaserCopy;
  correctId: string;
  explanation: string;
  image: SpeciesQuizTeaserImage;
  locale: AppLocale;
  options: QuizTeaserOption[];
  quizId: QuizTeaserId;
  speciesId: string;
};

export function SpeciesQuizTeaser({
  copy,
  correctId,
  explanation,
  image,
  locale,
  options,
  quizId,
  speciesId,
}: SpeciesQuizTeaserProps) {
  const [selectedId, setSelectedId] = useState<null | string>(null);
  const headingId = useId();
  const revealed = selectedId !== null;
  const answeredCorrectly = selectedId === correctId;
  const correct = options.find((option) => option.id === correctId);

  function onSelect(optionId: string) {
    if (revealed) return;
    setSelectedId(optionId);
    trackEvent("quiz_teaser_answer", {
      correct: optionId === correctId,
      question_species_id: correctId,
      quiz_id: quizId,
      species_id: speciesId,
    });
  }

  return (
    <section className="border-t border-border bg-surface py-10 lg:py-14">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid overflow-hidden rounded-media bg-ink text-white lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="relative aspect-4/3 lg:aspect-auto lg:min-h-120">
            <picture className="absolute inset-0 block size-full">
              {image.sources.map((source) => (
                <source key={source.key} {...source.props} />
              ))}
              <img
                alt={revealed ? image.alt : copy.imageAltHidden}
                className="size-full object-cover text-transparent"
                decoding="async"
                height={image.height}
                loading="lazy"
                sizes={image.sizes}
                src={image.src}
                width={image.width}
              />
            </picture>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/75 via-black/5 to-black/25"
            />
            <span className="absolute top-5 left-5 inline-flex items-center rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] text-white/90 uppercase backdrop-blur-md sm:top-6 sm:left-6">
              {copy.eyebrow}
            </span>
            <div className="absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
              <div
                className={cn(
                  "transition-[opacity,translate] duration-500 ease-out",
                  revealed
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0",
                )}
              >
                <p className="font-display text-[1.5rem] leading-tight font-semibold text-white sm:text-[1.9rem]">
                  {revealed ? correct?.commonName : null}
                </p>
                <p className="mt-1 text-[13px] text-white/70 italic sm:text-[14px]">
                  {revealed ? correct?.scientificName : null}
                </p>
              </div>
              {image.photographer ? (
                <p className="mt-3 text-[11px] text-white/55">
                  {copy.photoCredit} {image.photographer}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
            <h2
              className="font-display text-display-card font-semibold text-white"
              id={headingId}
            >
              {copy.title}
            </h2>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/60">
              {copy.body}
            </p>

            <div
              aria-labelledby={headingId}
              className="mt-7 grid gap-2.5 sm:grid-cols-2"
              role="group"
            >
              {options.map((option, index) => {
                const isCorrect = option.id === correctId;
                const isSelected = option.id === selectedId;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={cn(
                      "flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors duration-200",
                      optionClass({ isCorrect, isSelected, revealed }),
                    )}
                    disabled={revealed}
                    key={option.id}
                    onClick={() => onSelect(option.id)}
                    type="button"
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-medium",
                        revealed && isCorrect
                          ? "border-emerald-200/70 bg-emerald-400/25"
                          : "border-white/20",
                      )}
                    >
                      <OptionMark
                        isCorrect={isCorrect}
                        isSelected={isSelected}
                        label={OPTION_MARKS[locale][index]}
                        revealed={revealed}
                      />
                    </span>
                    <span className="min-w-0 text-[14px] leading-snug font-medium sm:text-[15px]">
                      {option.commonName}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              aria-live="polite"
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                revealed
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                {revealed ? (
                  <div className="pt-6">
                    <p
                      className={cn(
                        "font-display text-[1.25rem] font-semibold",
                        answeredCorrectly
                          ? "text-emerald-300"
                          : "text-[#f0a399]",
                      )}
                    >
                      {answeredCorrectly ? copy.correct : copy.incorrect}
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                      {copy.revealLead} {explanation}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <QuizCtaLink
                className={cn(
                  "inline-flex items-center gap-2 text-[14px] font-medium transition-colors",
                  revealed
                    ? "min-h-12 rounded-full bg-white px-6 text-ink hover:bg-white/90"
                    : "text-white/65 underline decoration-white/25 underline-offset-4 hover:text-white",
                )}
                href={quizHref(quizId, locale)}
                quizId={quizId}
                source="species"
                speciesId={speciesId}
              >
                {copy.cta}
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </QuizCtaLink>
              {revealed ? (
                <TrackedSpeciesLink
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/75 transition-colors hover:text-white"
                  locale={locale}
                  source="quiz_question"
                  speciesId={correctId}
                >
                  {copy.learnMore}
                </TrackedSpeciesLink>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function optionClass({
  isCorrect,
  isSelected,
  revealed,
}: {
  isCorrect: boolean;
  isSelected: boolean;
  revealed: boolean;
}) {
  if (!revealed) {
    return "border-white/15 bg-white/5 text-white hover:border-white/45 hover:bg-white/10";
  }
  if (isCorrect) return "border-emerald-300/80 bg-emerald-500/25 text-white";
  if (isSelected) return "border-destructive/80 bg-destructive/30 text-white";
  return "border-white/10 bg-white/3 text-white/45";
}

function OptionMark({
  isCorrect,
  isSelected,
  label,
  revealed,
}: {
  isCorrect: boolean;
  isSelected: boolean;
  label: string;
  revealed: boolean;
}) {
  if (revealed && isCorrect) {
    return <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />;
  }
  if (revealed && isSelected) {
    return <X aria-hidden="true" className="size-3.5" strokeWidth={2.5} />;
  }
  return label;
}
