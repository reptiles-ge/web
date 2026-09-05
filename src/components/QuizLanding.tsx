import { getLocale, getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { QuizCopyNamespace } from "@/lib/quizzes";
import type { SnakeQuizSpecies } from "@/lib/snakeQuiz";

import { CoverImage } from "@/components/CoverImage";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { Link } from "@/i18n/navigation";
import {
  LIZARD_LOOKALIKE_PAIRS,
  SNAKE_LOOKALIKE_PAIRS,
} from "@/lib/clusterGuides";
import { speciesHref } from "@/lib/speciesRoutes";

const LOOKALIKE_BODIES = [
  "lookalike1Body",
  "lookalike2Body",
  "lookalike3Body",
  "lookalike4Body",
  "lookalike5Body",
  "lookalike6Body",
] as const;

type QuizLandingProps = {
  namespace: QuizCopyNamespace;
  pool: SnakeQuizSpecies[];
  quizId: string;
  species: Species[];
};

export async function QuizLanding({
  namespace,
  pool,
  quizId,
  species,
}: QuizLandingProps) {
  const t = await getTranslations(namespace);
  const locale = (await getLocale()) as AppLocale;
  const byId = new Map(species.map((item) => [item.id, item]));
  const lookalikePairs =
    quizId === "lizard" ? LIZARD_LOOKALIKE_PAIRS : SNAKE_LOOKALIKE_PAIRS;
  const pairs = lookalikePairs
    .map((pair, index) => ({
      a: byId.get(pair.a),
      b: byId.get(pair.b),
      bodyKey: LOOKALIKE_BODIES[index],
    }))
    .filter(
      (
        pair,
      ): pair is {
        a: Species;
        b: Species;
        bodyKey: (typeof LOOKALIKE_BODIES)[number];
      } => Boolean(pair.a && pair.b && pair.bodyKey),
    );

  return (
    <>
      <noscript>
        <section className="bg-background px-6 py-16 text-foreground">
          <h2 className="font-display text-xl font-semibold">
            {t("noscriptTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {t("noscriptBody")}
          </p>
          <ul className="mt-5 space-y-2 text-[15px]">
            {pool.map((item) => (
              <li key={item.id}>
                <Link
                  className="text-foreground underline-offset-4 hover:underline"
                  href={speciesHref(item.id, locale)}
                >
                  {item.commonName} ({item.scientificName})
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </noscript>

      <article className="border-t border-white/10 bg-background px-6 py-16 text-foreground lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
            {t("practiceEyebrow")}
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-display-title font-semibold">
            {t("practiceTitle")}
          </h2>
          <div className="mt-8 max-w-3xl space-y-5 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
            <p>
              <PhoneLinkedText>{t("practiceLead")}</PhoneLinkedText>
            </p>
            <p>
              <PhoneLinkedText>{t("practiceP1")}</PhoneLinkedText>
            </p>
            <p>
              <PhoneLinkedText>{t("practiceP2")}</PhoneLinkedText>
            </p>
            <p>
              <PhoneLinkedText>{t("practiceP3")}</PhoneLinkedText>
            </p>
            <p>
              <PhoneLinkedText>{t("practiceP4")}</PhoneLinkedText>
            </p>
          </div>

          <h3 className="mt-14 font-display text-display-card font-semibold">
            {t("lookalikesTitle")}
          </h3>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            {t("lookalikesLead")}
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {pairs.map((pair) => (
              <li
                className="rounded-card border border-border bg-card p-5 sm:p-6"
                key={`${pair.a.id}-${pair.b.id}`}
              >
                <div className="flex items-center gap-3">
                  <LookalikeThumb locale={locale} species={pair.a} />
                  <LookalikeThumb locale={locale} species={pair.b} />
                </div>
                <p className="mt-4 text-[14px] font-medium text-foreground">
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={speciesHref(pair.a.id, locale)}
                  >
                    {pair.a.commonName}
                  </Link>
                  {" · "}
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={speciesHref(pair.b.id, locale)}
                  >
                    {pair.b.commonName}
                  </Link>
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  <PhoneLinkedText>{t(pair.bodyKey)}</PhoneLinkedText>
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-14 max-w-3xl rounded-card border border-border bg-card p-6 sm:p-8">
            <h3 className="font-display text-[1.35rem] font-semibold">
              {t("practiceGuideTitle")}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              <PhoneLinkedText>{t("practiceGuideBody")}</PhoneLinkedText>
            </p>
            <Link
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-[14px] font-medium text-ink-foreground"
              href={
                quizId === "lizard"
                  ? "/lizards/identifikacia"
                  : "/snakes/shxamiani-gvelis-amocnoba"
              }
            >
              {t("practiceGuideCta")}
            </Link>
          </div>
        </div>
      </article>

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
    </>
  );
}

function LookalikeThumb({
  locale,
  species,
}: {
  locale: AppLocale;
  species: Species;
}) {
  return (
    <Link
      className="relative size-14 overflow-hidden rounded-2xl sm:size-16"
      href={speciesHref(species.id, locale)}
    >
      <CoverImage
        alt={species.commonName}
        className="object-cover"
        sizes="64px"
        src={species.image}
      />
    </Link>
  );
}
