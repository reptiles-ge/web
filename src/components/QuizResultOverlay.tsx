"use client";

import { ArrowRight, Check, RotateCcw, Share2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { useQuizCopy } from "@/components/QuizCopyContext";
import { QuizBreadcrumbs } from "@/components/QuizIntroOverlay";
import { Link } from "@/i18n/navigation";
import { trackEvent, trackSpeciesClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  scoreMessageKey,
  scorePercent,
  type SnakeQuizQuestion,
  type SnakeQuizSpecies,
} from "@/lib/snakeQuiz";
import { speciesHref } from "@/lib/speciesRoutes";

type Answered = {
  correct: boolean;
  selectedId: string;
};

type QuizResultOverlayProps = {
  answers: Answered[];
  byId: Map<string, SnakeQuizSpecies>;
  correctCount: number;
  headingId: string;
  onRestart: () => void;
  questions: SnakeQuizQuestion[];
  quizId: string;
  shareUrl: string;
  total: number;
};

export function QuizResultOverlay({
  answers,
  byId,
  correctCount,
  headingId,
  onRestart,
  questions,
  quizId,
  shareUrl,
  total,
}: QuizResultOverlayProps) {
  const t = useQuizCopy();
  const locale = useLocale() as AppLocale;
  const percent = scorePercent(correctCount, total);
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const text = t("shareText", {
      score: `${correctCount}/${total}`,
      url: shareUrl.replace(/^https?:\/\//, ""),
    });
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          text,
          title: t("title"),
          url: shareUrl,
        });
        trackEvent("quiz_share", {
          method: "share",
          percent,
          quiz_id: quizId,
        });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${shareUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      trackEvent("quiz_share", {
        method: "copy",
        percent,
        quiz_id: quizId,
      });
    } catch {
      return;
    }
  }

  return (
    <div className="flex w-full flex-col pb-16 sm:pb-24">
      <QuizBreadcrumbs />
      <p className="text-[11px] font-medium tracking-[0.3em] text-white/55 uppercase">
        {t("resultEyebrow")}
      </p>
      <h2
        className="mt-3 font-display text-[clamp(2.6rem,16vw,8rem)] leading-none font-semibold text-white sm:mt-4"
        id={headingId}
      >
        {correctCount}
        <span className="text-white/50"> / {total}</span>
      </h2>
      <p className="mt-2 text-[15px] text-white/55">
        {t("percentLabel", { percent })}
      </p>
      <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white sm:mt-6 sm:text-[20px]">
        {t(scoreMessageKey(percent))}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
        <button
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-medium text-ink transition-opacity hover:opacity-90 sm:w-auto"
          onClick={onRestart}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          {t("restart")}
        </button>
        <button
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10 sm:w-auto"
          onClick={onShare}
          type="button"
        >
          {copied ? (
            <Check aria-hidden="true" className="size-4" />
          ) : (
            <Share2 aria-hidden="true" className="size-4" />
          )}
          {copied ? t("shareCopied") : t("share")}
        </button>
      </div>

      <h3 className="mt-12 font-display text-[1.25rem] font-semibold text-white sm:mt-16 sm:text-[1.5rem]">
        {t("roundRecap")}
      </h3>
      <ul className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2">
        {questions.map((item, questionIndex) => {
          const species = byId.get(item.correctId);
          const answer = answers[questionIndex];
          if (!species || !answer) return null;
          return (
            <li className="min-w-0" key={`${item.correctId}-${questionIndex}`}>
              <Link
                className="flex min-w-0 items-center gap-2.5 rounded-card border border-white/12 bg-black/45 p-2 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-black/60 sm:gap-3 sm:p-2.5"
                href={speciesHref(item.correctId, locale)}
                onClick={() =>
                  trackSpeciesClick({
                    position: questionIndex + 1,
                    source: "quiz_result",
                    species_id: item.correctId,
                  })
                }
              >
                <span className="relative size-12 shrink-0 overflow-hidden rounded-2xl sm:size-16">
                  <CoverImage
                    alt={species.imageAlt}
                    className="object-cover"
                    sizes="64px"
                    src={species.image}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-white">
                    {species.commonName}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-white/55 italic">
                    {species.scientificName}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-1 text-[11px] font-medium whitespace-nowrap sm:px-2.5",
                    answer.correct
                      ? "bg-emerald-500/20 text-emerald-100"
                      : "bg-destructive/25 text-red-100",
                  )}
                >
                  {answer.correct ? t("resultCorrect") : t("resultWrong")}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 max-w-xl text-[14px] leading-relaxed text-white/65 sm:mt-10">
        {t("practiceNote")}
      </p>
      <p className="mt-6 text-[11px] font-medium tracking-[0.28em] text-white/45 uppercase">
        {t("relatedTitle")}
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10"
          href={
            quizId === "lizard"
              ? "/lizards/identifikacia"
              : "/snakes/shxamiani-gvelis-amocnoba"
          }
        >
          {t("ctaIdentify")}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10"
          href={quizId === "lizard" ? "/lizards/darevskia" : "/venomous-snakes"}
        >
          {t("ctaVenomous")}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-[14px] font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10"
          href={quizId === "lizard" ? "/lizards" : "/snakes"}
        >
          {t("discoverSnakes")}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </div>
  );
}
