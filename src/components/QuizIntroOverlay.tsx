"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

type QuizIntroOverlayProps = {
  headingId: string;
  onStart: () => void;
};

export function QuizBreadcrumbs() {
  const t = useTranslations("snakeQuiz");
  const tQuizzes = useTranslations("quizzes");

  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/55">
        <li>
          <Link className="transition-colors hover:text-white" href="/">
            {t("breadcrumbHome")}
          </Link>
        </li>
        <li aria-hidden="true" className="text-white/30">
          /
        </li>
        <li>
          <Link className="transition-colors hover:text-white" href="/quiz">
            {tQuizzes("breadcrumbCurrent")}
          </Link>
        </li>
        <li aria-hidden="true" className="text-white/30">
          /
        </li>
        <li className="text-white/80">{t("breadcrumbCurrent")}</li>
      </ol>
    </nav>
  );
}

export function QuizIntroOverlay({
  headingId,
  onStart,
}: QuizIntroOverlayProps) {
  const t = useTranslations("snakeQuiz");
  const rules = [
    { body: t("rule1Body"), title: t("rule1Title") },
    { body: t("rule2Body"), title: t("rule2Title") },
    { body: t("rule3Body"), title: t("rule3Title") },
  ] as const;

  return (
    <div className="flex min-h-[calc(100dvh-7.5rem)] w-full flex-col">
      <div className="mt-auto w-full pb-8 sm:pb-20 lg:pb-24">
        <QuizBreadcrumbs />
        <p className="text-[11px] font-medium tracking-[0.32em] text-white/55 uppercase">
          {t("eyebrow")}
        </p>
        <h1
          className="mt-3 max-w-3xl font-display text-[clamp(1.85rem,10vw,5.4rem)] leading-[0.98] font-semibold text-white sm:mt-4"
          id={headingId}
        >
          {t("title")}
        </h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/70 sm:mt-5 sm:text-[17px]">
          {t("startLead")}
        </p>

        <ul className="mt-5 grid gap-px overflow-hidden rounded-[24px] border border-white/12 bg-white/10 sm:mt-10 sm:grid-cols-3">
          {rules.map((rule, index) => (
            <li
              className="bg-black/40 px-4 py-3.5 backdrop-blur-xl sm:p-6"
              key={rule.title}
            >
              <span className="font-display text-[12px] tracking-[0.22em] text-white/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-display text-[16px] font-semibold text-white sm:mt-3 sm:text-[18px]">
                {rule.title}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/60 sm:mt-2">
                {rule.body}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-5 sm:mt-8">
          <button
            className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-[15px] font-medium text-ink transition-opacity hover:opacity-90 sm:w-auto"
            onClick={onStart}
            type="button"
          >
            {t("start")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
