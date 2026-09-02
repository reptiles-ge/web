import { CoverImage } from "@/components/CoverImage";
import { TrackedSpeciesLink } from "@/components/home/TrackedSpeciesLink";
import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { VENOMOUS_VIPER_IDS } from "@/lib/clusterGuides";
import { quizHref } from "@/lib/quizzes";
import { isPlaceholderMedia } from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

const GUIDES = [
  {
    key: "identify" as const,
    href: "/snakes/shxamiani-gvelis-amocnoba" as const,
  },
  {
    key: "yard" as const,
    href: "/snakes-in-the-yard" as const,
  },
  {
    key: "quiz" as const,
    quizId: "snake" as const,
  },
];

export async function HomeField() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home.field");
  const tSafety = await getTranslations("home.safety");
  const tKnowledge = await getTranslations("home.knowledge");
  const vipers = VENOMOUS_VIPER_IDS.map((id) => getSpeciesById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => localizeSpecies(item, locale));

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 font-display text-balance-tight text-[clamp(1.65rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-2 lg:gap-20">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {tSafety("eyebrow")}
            </p>
            <h3 className="mt-3 font-display text-[clamp(1.35rem,2.2vw,1.7rem)] font-semibold leading-tight">
              {tKnowledge("venomous.title")}
            </h3>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {tKnowledge("venomous.body")}
            </p>
            {vipers.length > 0 ? (
              <>
                <ul className="mt-7 divide-y divide-border border-y border-border sm:hidden">
                  {vipers.map((species, index) => {
                    const src =
                      species.mobileImage &&
                      !isPlaceholderMedia(species.mobileImage)
                        ? species.mobileImage
                        : species.image;
                    if (isPlaceholderMedia(src)) return null;

                    return (
                      <li key={species.id}>
                        <TrackedSpeciesLink
                          speciesId={species.id}
                          locale={locale}
                          source="home_safety"
                          position={index + 1}
                          className="group flex min-h-16 items-center gap-3 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          <span className="relative size-14 shrink-0 overflow-hidden bg-ink">
                            <CoverImage
                              src={src}
                              alt={speciesImageAlt(
                                species.commonName,
                                species.scientificName,
                                species.location,
                              )}
                              sizes="56px"
                              className="object-cover"
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-display text-[15px] font-semibold leading-snug text-foreground">
                              {species.commonName}
                            </span>
                            <span className="mt-0.5 block text-[12px] italic leading-snug text-muted-foreground">
                              {species.scientificName}
                            </span>
                          </span>
                        </TrackedSpeciesLink>
                      </li>
                    );
                  })}
                </ul>
                <ul className="mt-7 hidden gap-2 sm:grid sm:grid-cols-6">
                  {vipers.map((species, index) => {
                    const src =
                      species.mobileImage &&
                      !isPlaceholderMedia(species.mobileImage)
                        ? species.mobileImage
                        : species.image;
                    if (isPlaceholderMedia(src)) return null;

                    return (
                      <li key={species.id}>
                        <TrackedSpeciesLink
                          speciesId={species.id}
                          locale={locale}
                          source="home_safety"
                          position={index + 1}
                          className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          <span className="relative block aspect-[3/4] overflow-hidden bg-ink">
                            <CoverImage
                              src={src}
                              alt={speciesImageAlt(
                                species.commonName,
                                species.scientificName,
                                species.location,
                              )}
                              sizes="80px"
                              className="object-cover"
                            />
                          </span>
                          <span className="mt-2 block text-[11px] italic leading-snug text-muted-foreground">
                            {species.scientificName}
                          </span>
                        </TrackedSpeciesLink>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              <Link
                href="/venomous-snakes"
                className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                {tKnowledge("venomous.cta")}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/snakes/gvelis-nakbeni"
                className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                {tSafety("bite")}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <ol className="min-w-0 divide-y divide-border border-y border-border">
            {GUIDES.map((guide, index) => (
              <li key={guide.key}>
                <Link
                  href={
                    guide.key === "quiz"
                      ? quizHref("snake", locale)
                      : guide.href
                  }
                  className="group flex min-h-[7.5rem] flex-col justify-center py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                >
                  <span className="text-[11px] tabular-nums tracking-[0.2em] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-[1.25rem] font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {t(`${guide.key}.title`)}
                  </h3>
                  <span className="mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">
                    {t(`${guide.key}.body`)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
