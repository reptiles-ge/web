import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import { CoverImage } from "@/components/CoverImage";
import { InkHeroBreadcrumb } from "@/components/InkHeroBreadcrumb";
import { QuizCtaLink } from "@/components/QuizPracticeCta";
import { Reveal } from "@/components/Reveal";
import { isVenomousDanger } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { quizHref } from "@/lib/quizzes";

type GroupHubHeroProps = {
  heroSrc: string;
  hubId: GroupHubId;
  species: Species[];
};

export async function GroupHubHero({ heroSrc, hubId, species }: GroupHubHeroProps) {
  const [t, tShared, tSnakes, locale] = await Promise.all([
    getTranslations(hubId),
    getTranslations("groupHubShared"),
    getTranslations("snakes"),
    getLocale() as Promise<AppLocale>,
  ]);
  const venomousCount = species.filter((item) =>
    isVenomousDanger(item.danger),
  ).length;
  const familyCount = new Set(species.map((item) => item.family)).size;
  const extraItems = readStatExtraItems(t);

  return (
    <>
      <section
        className="relative flex min-h-[88svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:pb-16 lg:min-h-[92svh] lg:pb-20"
        style={{ paddingTop: "7rem" }}
      >
        <CoverImage
          alt={t("heroImageAlt")}
          className="object-cover object-[50%_35%]"
          priority
          sizes="100vw"
          src={heroSrc}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/35 to-black/92" />
        <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_25%,transparent_25%,rgba(0,0,0,0.58)_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <InkHeroBreadcrumb
              crumbs={[
                {
                  href: "/",
                  label: tShared("breadcrumbHome"),
                  withBack: true,
                },
                { label: t("breadcrumbCurrent") },
              ]}
            />

            <p className="font-display text-[clamp(1.15rem,2.4vw,1.65rem)] font-semibold tracking-tight text-white/90">
              Reptiles
            </p>
            <h1 className="text-balance-tight mt-3 max-w-4xl font-display text-[clamp(2.1rem,6vw,4.6rem)] leading-[1.05] font-semibold text-white sm:mt-4">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:text-[16px]">
              {t("subtitle")}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11">
              <a
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
                href="#species"
              >
                {t("ctaSpecies")}
                <ArrowRight className="size-4" />
              </a>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                href="/species"
              >
                {tShared("ctaAllSpecies")}
              </Link>
              {hubId === "snakes" ? (
                <QuizCtaLink
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                  href={quizHref("snake", locale)}
                  quizId="snake"
                  source="hub"
                >
                  {tSnakes("ctaQuiz")}
                  <ArrowUpRight className="size-4" />
                </QuizCtaLink>
              ) : null}
              {hubId === "turtles" ? (
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white"
                  href="/turtles/identifikacia"
                >
                  {t("ctaIdentify")}
                  <ArrowUpRight className="size-4" />
                </Link>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-10 sm:py-12">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div
            className={cn(
              "grid gap-8 sm:gap-6",
              extraItems ? "sm:grid-cols-2" : "sm:grid-cols-3",
            )}
          >
            <div>
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold text-foreground">
                {species.length}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statSpecies")}
              </p>
            </div>
            <div>
              <p className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold text-foreground">
                {familyCount}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {t("statFamilies")}
              </p>
            </div>
            {extraItems ? null : (
              <div>
                <p className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold text-foreground">
                  {hubId === "snakes" ? venomousCount : t("statExtraValue")}
                </p>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  {t("statExtra")}
                </p>
              </div>
            )}
          </div>
          {extraItems ? (
            <div className="mt-8 border-t border-border pt-8">
              <ul className="flex flex-wrap gap-2">
                {extraItems.map((item) => (
                  <li
                    className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-[13px] leading-tight font-medium text-foreground"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[13px] text-muted-foreground">
                {t("statExtra")}
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

function readStatExtraItems(
  t: Awaited<ReturnType<typeof getTranslations>>,
): null | string[] {
  if (!t.has("statExtraItems")) return null;
  const items = t.raw("statExtraItems");
  if (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every((item) => typeof item === "string")
  ) {
    return items;
  }
  return null;
}
