import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { GYURZA_BITE } from "@/content/guides/gyurzaBite";
import { Link } from "@/i18n/navigation";
import { quizHref } from "@/lib/quizzes";

const GUIDES = [
  {
    href: "/snakes/shxamiani-gvelis-amocnoba" as const,
    key: "identify" as const,
  },
  { href: "/snakes-in-the-yard" as const, key: "yard" as const },
  { href: null, key: "quiz" as const },
];

export async function HomeField({ locale }: { locale: AppLocale }) {
  const [t, tSafety, tKnowledge] = await Promise.all([
    getTranslations({ locale, namespace: "home.field" }),
    getTranslations({ locale, namespace: "home.safety" }),
    getTranslations({ locale, namespace: "home.knowledge" }),
  ]);

  return (
    <section className="bg-surface pt-11 lg:pt-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <HomeSectionHeading
          eyebrow={t("eyebrow")}
          subtitle={t("subtitle")}
          title={t("title")}
        />

        <article className="mt-6 overflow-hidden rounded-[30px] bg-card p-2.5 shadow-[0_24px_60px_rgba(14,20,17,0.07)] lg:mt-11 lg:grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:rounded-[40px] lg:p-3.5">
          <div className="relative h-[220px] overflow-hidden rounded-[22px] bg-ink lg:h-auto lg:min-h-[460px] lg:rounded-[28px]">
            <CoverImage
              alt={GYURZA_BITE.hero.alt[locale]}
              className="object-cover object-[35%_center]"
              sizes="(max-width: 1023px) 100vw, 520px"
              src={GYURZA_BITE.hero.src}
            />
          </div>
          <div className="min-w-0 px-3 pt-5 pb-4 lg:px-11 lg:py-7">
            <span className="inline-flex min-h-[30px] items-center gap-2 rounded-full bg-destructive/10 px-3 text-[11px] font-medium tracking-[0.16em] text-destructive uppercase">
              <span className="size-1.5 rounded-full bg-destructive" />
              {tSafety("eyebrow")}
            </span>
            <h3 className="mt-3 font-display text-[22px] leading-[1.2] font-semibold text-foreground lg:mt-3.5 lg:text-[30px] lg:leading-[1.15]">
              {tKnowledge("venomous.title")}
            </h3>
            <p className="mt-3 max-w-xl text-[14px] leading-[1.6] text-muted-foreground lg:text-[16px]">
              {tKnowledge("venomous.body")}
            </p>
            <ol className="mt-5 flex flex-col gap-2 lg:mt-[22px]">
              {GUIDES.map((guide, index) => (
                <li key={guide.key}>
                  <Link
                    className="group flex min-h-[68px] items-center gap-3 rounded-[20px] bg-background px-3 py-2.5 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:gap-4 lg:rounded-[22px]"
                    href={
                      guide.key === "quiz"
                        ? quizHref("snake", locale)
                        : guide.href!
                    }
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-[13px] font-semibold text-primary tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[15px] leading-snug font-semibold text-foreground lg:text-[16px]">
                        {t(`${guide.key}.title`)}
                      </span>
                      <span className="mt-0.5 hidden text-[13px] leading-snug text-muted-foreground sm:block">
                        {t(`${guide.key}.body`)}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-foreground"
                    />
                  </Link>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap gap-2.5 lg:mt-6">
              <Link
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#2f6b4f] px-5 text-[14px] font-medium text-white hover:bg-[#255940] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href="/venomous-snakes"
              >
                {tKnowledge("venomous.cta")}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center rounded-full border border-border bg-card px-5 text-[14px] font-medium text-foreground hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href="/snakes/gvelis-nakbeni"
              >
                {tSafety("bite")}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
