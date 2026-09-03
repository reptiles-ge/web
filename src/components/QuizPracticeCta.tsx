"use client";

import type { ReactNode } from "react";

import { ArrowUpRight } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";

import { Link } from "@/i18n/navigation";
import { type QuizCtaSource, trackEvent } from "@/lib/analytics";
import { quizHref } from "@/lib/quizzes";

export function QuizCtaLink({
  children,
  className,
  href,
  quizId,
  source,
  speciesId,
}: {
  children: ReactNode;
  className?: string;
  href: ReturnType<typeof quizHref>;
  quizId: string;
  source: QuizCtaSource;
  speciesId?: string;
}) {
  return (
    <Link
      className={className}
      href={href}
      onClick={() =>
        trackEvent("quiz_cta_click", {
          quiz_id: quizId,
          source,
          species_id: speciesId,
        })
      }
    >
      {children}
    </Link>
  );
}

export function QuizPracticeCta({
  body,
  className = "border-t border-border bg-surface pt-8 pb-8 lg:pt-10 lg:pb-10",
  cta,
  eyebrow,
  locale,
  source = "other",
  speciesId,
  title,
}: {
  body: string;
  className?: string;
  cta: string;
  eyebrow: string;
  locale: AppLocale;
  source?: QuizCtaSource;
  speciesId?: string;
  title: string;
}) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-5 rounded-[28px] border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
              {eyebrow}
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.08] font-semibold">
              {title}
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
              {body}
            </p>
          </div>
          <QuizCtaLink
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[14px] font-medium text-ink-foreground"
            href={quizHref("snake", locale)}
            quizId="snake"
            source={source}
            speciesId={speciesId}
          >
            {cta}
            <ArrowUpRight className="size-3.5" />
          </QuizCtaLink>
        </div>
      </div>
    </section>
  );
}
