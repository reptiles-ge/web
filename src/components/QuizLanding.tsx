import type { Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { SNAKE_LOOKALIKE_PAIRS } from "@/lib/clusterGuides";
import type { SnakeQuizSpecies } from "@/lib/snakeQuiz";
import { speciesHref } from "@/lib/speciesRoutes";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

const LOOKALIKE_BODIES = [
  "lookalike1Body",
  "lookalike2Body",
  "lookalike3Body",
  "lookalike4Body",
  "lookalike5Body",
  "lookalike6Body",
] as const;

type QuizLandingProps = {
  snakes: SnakeQuizSpecies[];
  species: Species[];
};

export async function QuizLanding({ snakes, species }: QuizLandingProps) {
  const t = await getTranslations("snakeQuiz");
  const locale = (await getLocale()) as AppLocale;
  const byId = new Map(species.map((item) => [item.id, item]));
  const pairs = SNAKE_LOOKALIKE_PAIRS.map((pair, index) => ({
    a: byId.get(pair.a),
    b: byId.get(pair.b),
    bodyKey: LOOKALIKE_BODIES[index],
  })).filter(
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
            {snakes.map((item) => (
              <li key={item.id}>
                <Link
                  href={speciesHref(item.id, locale)}
                  className="text-foreground underline-offset-4 hover:underline"
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
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {t("practiceEyebrow")}
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.7rem,3.4vw,2.7rem)] font-semibold leading-[1.08]">
            {t("practiceTitle")}
          </h2>
          <div className="mt-8 max-w-3xl space-y-5 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
            <p>{t("practiceLead")}</p>
            <p>{t("practiceP1")}</p>
            <p>{t("practiceP2")}</p>
            <p>{t("practiceP3")}</p>
            <p>{t("practiceP4")}</p>
          </div>

          <h3 className="mt-14 font-display text-[clamp(1.35rem,2.4vw,1.9rem)] font-semibold">
            {t("lookalikesTitle")}
          </h3>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            {t("lookalikesLead")}
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {pairs.map((pair) => (
              <li
                key={`${pair.a.id}-${pair.b.id}`}
                className="rounded-[24px] border border-border bg-card p-5 sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <LookalikeThumb species={pair.a} locale={locale} />
                  <LookalikeThumb species={pair.b} locale={locale} />
                </div>
                <p className="mt-4 text-[14px] font-medium text-foreground">
                  <Link
                    href={speciesHref(pair.a.id, locale)}
                    className="underline-offset-4 hover:underline"
                  >
                    {pair.a.commonName}
                  </Link>
                  {" · "}
                  <Link
                    href={speciesHref(pair.b.id, locale)}
                    className="underline-offset-4 hover:underline"
                  >
                    {pair.b.commonName}
                  </Link>
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  {t(pair.bodyKey)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-14 max-w-3xl rounded-[24px] border border-border bg-card p-6 sm:p-8">
            <h3 className="font-display text-[1.35rem] font-semibold">
              {t("practiceGuideTitle")}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              {t("practiceGuideBody")}
            </p>
            <Link
              href="/snakes/shxamiani-gvelis-amocnoba"
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-[14px] font-medium text-ink-foreground"
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
  species,
  locale,
}: {
  species: Species;
  locale: AppLocale;
}) {
  return (
    <Link
      href={speciesHref(species.id, locale)}
      className="relative size-14 overflow-hidden rounded-2xl sm:size-16"
    >
      <Image
        src={species.image}
        alt={species.commonName}
        fill
        sizes="64px"
        className="object-cover"
      />
    </Link>
  );
}
