"use client";

import { SnakeQuiz } from "@/components/SnakeQuiz";
import type { SnakeQuizSpecies } from "@/lib/snakeQuiz";
import { useTranslations } from "next-intl";

type SnakeQuizPageProps = {
  snakes: SnakeQuizSpecies[];
};

export function SnakeQuizPage({ snakes }: SnakeQuizPageProps) {
  const t = useTranslations("snakeQuiz");

  return (
    <div className="bg-ink">
      <h1 className="sr-only">{t("title")}</h1>
      <SnakeQuiz snakes={snakes} />
      <noscript>
        <section className="bg-background px-6 py-16 text-foreground">
          <h2 className="font-display text-xl font-semibold">
            {t("noscriptTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
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
      <section className="border-t border-white/10 bg-ink px-6 py-16 text-white lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-display text-[1.5rem] font-semibold">
            {t("faqTitle")}
          </h2>
          <dl className="mt-8 grid gap-8 sm:grid-cols-2">
            {([1, 2, 3, 4] as const).map((n) => (
              <div key={n}>
                <dt className="text-[15px] font-medium text-white/90">
                  {t(`faq${n}Q`)}
                </dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-white/55">
                  {t(`faq${n}A`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
