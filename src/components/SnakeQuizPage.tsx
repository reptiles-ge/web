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
      <main>
        <div className="mx-auto w-full max-w-[1400px] px-6 pt-28 lg:px-10 lg:pt-32">
          <nav aria-label="Breadcrumb">
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

          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.1rem,6vw,4.2rem)] font-semibold leading-[1.05]">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-10 lg:mt-14">
          <SnakeQuiz snakes={snakes} />
        </div>

        <noscript>
          <section className="mx-auto mt-10 w-full max-w-[1400px] px-6 lg:px-10">
            <h2 className="font-display text-xl font-semibold">
              {t("noscriptTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t("noscriptBody")}
            </p>
            <ul className="mt-5 columns-1 gap-x-10 space-y-2 text-[15px] sm:columns-2 lg:columns-3">
              {snakes.map((item) => (
                <li key={item.id}>
                  {item.commonName} ({item.scientificName})
                </li>
              ))}
            </ul>
          </section>
        </noscript>

        <section className="mx-auto mt-20 w-full max-w-[1400px] border-t border-border px-6 py-16 lg:px-10 lg:py-20">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold">
            {t("faqTitle")}
          </h2>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2">
            {([1, 2, 3, 4] as const).map((n) => (
              <div key={n}>
                <dt className="text-[16px] font-medium">{t(`faq${n}Q`)}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
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
