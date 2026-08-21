import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { quizHref } from "@/lib/quizzes";
import { ArrowUpRight } from "lucide-react";

export function QuizPracticeCta({
  locale,
  eyebrow,
  title,
  body,
  cta,
  className = "border-t border-border bg-surface pt-8 pb-8 lg:pt-10 lg:pb-10",
}: {
  locale: AppLocale;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-5 rounded-[28px] border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold leading-[1.08]">
              {title}
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
              {body}
            </p>
          </div>
          <Link
            href={quizHref("snake", locale)}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[14px] font-medium text-ink-foreground"
          >
            {cta}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
