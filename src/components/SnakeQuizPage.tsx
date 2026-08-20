"use client";

import { SnakeQuiz } from "@/components/SnakeQuiz";
import { Link } from "@/i18n/navigation";
import type { SnakeQuizSpecies } from "@/lib/snakeQuiz";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

type SnakeQuizPageProps = {
  snakes: SnakeQuizSpecies[];
};

export function SnakeQuizPage({ snakes }: SnakeQuizPageProps) {
  const t = useTranslations("snakeQuiz");

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-[760px] px-5 pb-20 pt-28 sm:px-6 lg:pt-32">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
            <li>
              <Link
                href="/"
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                {t("breadcrumbHome")}
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li>
              <Link
                href="/snakes"
                className="transition-colors hover:text-foreground"
              >
                {t("breadcrumbSnakes")}
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li className="text-foreground/80">{t("breadcrumbCurrent")}</li>
          </ol>
        </nav>

        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 font-display text-[clamp(2rem,6vw,3.4rem)] font-semibold leading-[1.05]">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {t("subtitle")}
        </p>

        <div className="mt-10">
          <SnakeQuiz snakes={snakes} />
        </div>

        <noscript>
          <section className="mt-10 rounded-[28px] border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">
              {t("noscriptTitle")}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              {t("noscriptBody")}
            </p>
            <ul className="mt-5 space-y-2 text-[15px]">
              {snakes.map((item) => (
                <li key={item.id}>
                  {item.commonName} ({item.scientificName})
                </li>
              ))}
            </ul>
          </section>
        </noscript>

        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-[1.4rem] font-semibold">
            {t("faqTitle")}
          </h2>
          <dl className="mt-6 space-y-6">
            {([1, 2, 3, 4] as const).map((n) => (
              <div key={n}>
                <dt className="text-[15px] font-medium">{t(`faq${n}Q`)}</dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  {t(`faq${n}A`)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  );
}
