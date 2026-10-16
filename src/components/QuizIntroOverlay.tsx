"use client";

import { ArrowRight, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { useQuizCopy } from "@/components/QuizCopyContext";
import { Link } from "@/i18n/navigation";

type QuizIntroOverlayProps = {
  headingId: string;
  onStart: () => void;
  quizId: string;
};

export function QuizBreadcrumbs() {
  const t = useQuizCopy();
  const tQuizzes = useTranslations("quizzes");
  const tNav = useTranslations("nav");

  return (
    <nav aria-label={tNav("breadcrumbAria")} className="sr-only">
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
  quizId,
}: QuizIntroOverlayProps) {
  const t = useQuizCopy();
  const rules = [
    { body: t("rule1Body"), title: t("rule1Title") },
    { body: t("rule2Body"), title: t("rule2Title") },
    { body: t("rule3Body"), title: t("rule3Title") },
  ] as const;

  return (
    <div className="flex min-h-[calc(100dvh-7.5rem)] w-full flex-col">
      <div className="mt-auto w-full pb-8 sm:pb-20 lg:pb-24">
        <QuizBreadcrumbs />
        <p className="text-[11px] font-medium tracking-[0.18em] text-white/55 uppercase">
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

        <ul className="mt-5 grid gap-px overflow-hidden rounded-card border border-white/12 bg-white/10 sm:mt-10 sm:grid-cols-3">
          {rules.map((rule, index) => (
            <li
              className="bg-black/40 px-4 py-3.5 backdrop-blur-xl sm:p-6"
              key={rule.title}
            >
              <span className="font-display text-[12px] tracking-[0.16em] text-white/50">
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

        <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
          <button
            className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-white px-8 text-[15px] font-medium text-ink transition-opacity hover:opacity-90 sm:w-auto"
            onClick={onStart}
            type="button"
          >
            {t("start")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
          {quizId === "snake" ? <SnakeQuizSafetyLinks /> : null}
        </div>
      </div>
    </div>
  );
}

function SnakeQuizSafetyLinks() {
  const t = useTranslations("snakeQuiz");

  return (
    <>
      <Link
        className="inline-flex min-h-12 items-center justify-center text-[15px] font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
        href="/snakes/shxamiani-gvelis-amocnoba"
      >
        {t("practiceGuideCta")}
      </Link>
      <a
        className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border border-destructive/36 bg-[#b84336]/16 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#b84336]/28 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
        href="tel:112"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#b84336]">
          <Phone aria-hidden="true" className="size-3.5" />
        </span>
        {t("startEmergency")}
      </a>
    </>
  );
}
