import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import type { CreditAuthorPhoto } from "@/lib/creditAuthors";

import { CoverImage } from "@/components/CoverImage";
import { TrackedSpeciesLink } from "@/components/home/TrackedSpeciesLink";
import {
  creditAuthorBio,
  creditAuthorHref,
  creditAuthorIndexHref,
  creditAuthorName,
} from "@/data/creditAuthors";
import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import {
  getCreditAuthorCards,
  HOME_CONTRIBUTOR_LIMIT,
} from "@/lib/creditAuthors";
import {
  HOME_CONTRIBUTOR_MOSAIC_SIZES,
  HOME_CONTRIBUTOR_PORTRAIT_SIZES,
} from "@/lib/imageSizes";

export async function HomeContributors() {
  const locale = (await getLocale()) as AppLocale;
  const all = getCreditAuthorCards();
  if (all.length === 0) return null;
  const cards = all.slice(0, HOME_CONTRIBUTOR_LIMIT);
  const hasMore = all.length > HOME_CONTRIBUTOR_LIMIT;

  const [t, tAuthor] = await Promise.all([
    getTranslations("home.contributors"),
    getTranslations("author"),
  ]);

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-xl">
          <p className="text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="text-balance-tight mt-4 font-display text-display-title font-semibold">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <ul
          className={cn(
            "mt-12 grid gap-14 lg:mt-16",
            cards.length > 1 ? "lg:grid-cols-2 lg:gap-16" : "max-w-2xl",
          )}
        >
          {cards.map((card) => {
            const name = creditAuthorName(card.author, locale);
            const bio = creditAuthorBio(card.author, locale);

            return (
              <li key={card.author.id}>
                <article>
                  <ContributorMosaic locale={locale} photos={card.preview} />
                  <Link
                    className="group mt-6 flex items-start gap-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none sm:mt-8 sm:gap-5"
                    href={creditAuthorHref(card.author.slug)}
                  >
                    <span className="relative size-20 shrink-0 overflow-hidden rounded-full ring-1 ring-border sm:size-24">
                      <CoverImage
                        alt={tAuthor("portraitAlt", { name })}
                        className={`object-cover ${card.author.portraitClass ?? "object-[50%_18%]"}`}
                        sizes={HOME_CONTRIBUTOR_PORTRAIT_SIZES}
                        src={card.author.portraitSrc}
                      />
                    </span>
                    <span className="min-w-0 pt-1">
                      <span className="block text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
                        {tAuthor(`roles.${card.author.role}`)}
                      </span>
                      <h3 className="mt-2 flex items-center gap-2 font-display text-[1.35rem] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[1.5rem]">
                        {name}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                        />
                      </h3>
                      <span className="mt-3 block text-[13px] text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {card.photoCount}
                        </span>{" "}
                        {tAuthor("statPhotos")}
                        <span className="mx-2 text-border">·</span>
                        <span className="font-medium text-foreground">
                          {card.speciesCount}
                        </span>{" "}
                        {tAuthor("statSpecies")}
                      </span>
                      {bio ? (
                        <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-muted-foreground">
                          {bio}
                        </p>
                      ) : null}
                    </span>
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
        {hasMore ? (
          <p className="mt-12 lg:mt-16">
            <Link
              className="group inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
              href={creditAuthorIndexHref()}
            >
              <span className="border-b border-foreground/25 pb-0.5 transition-colors group-hover:border-foreground">
                {t("seeAll")}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 text-muted-foreground group-hover:text-foreground motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-0.5"
              />
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}

function ContributorMosaic({
  locale,
  photos,
}: {
  locale: AppLocale;
  photos: CreditAuthorPhoto[];
}) {
  const slides = photos.flatMap((photo) => {
    const species = getSpeciesById(photo.speciesId);
    if (!species) return [];
    const localized = localizeSpecies(species, locale);
    const place = photo.credit?.location?.trim();
    return [
      {
        alt: place
          ? `${localized.commonName} (${localized.scientificName}) — ${place}`
          : `${localized.commonName} (${localized.scientificName})`,
        photo,
      },
    ];
  });
  const count = slides.length;
  if (count === 0) return null;

  return (
    <ul
      className={cn(
        "grid gap-1 overflow-hidden bg-ink",
        count >= 3
          ? "aspect-4/3 grid-cols-2 grid-rows-2 sm:aspect-16/10 sm:grid-cols-4 sm:grid-rows-2"
          : count === 2
            ? "aspect-2/1 grid-cols-2"
            : "aspect-4/5 grid-cols-1",
      )}
    >
      {slides.map((slide, index) => (
        <li
          className={mosaicItemClass(count, index)}
          key={slide.photo.src}
        >
          <TrackedSpeciesLink
            className="group relative block size-full overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            locale={locale}
            position={index + 1}
            source="home_contributors"
            speciesId={slide.photo.speciesId}
          >
            <CoverImage
              alt={slide.alt}
              className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
              sizes={HOME_CONTRIBUTOR_MOSAIC_SIZES}
              src={slide.photo.src}
            />
          </TrackedSpeciesLink>
        </li>
      ))}
    </ul>
  );
}

function mosaicItemClass(count: number, index: number) {
  if (count >= 4) {
    if (index === 0) return "sm:col-span-2 sm:row-span-2";
    if (index === 1) return "sm:col-span-2";
    return undefined;
  }
  if (count === 3) {
    if (index === 0) return "sm:col-span-2 sm:row-span-2";
    return "sm:col-span-2";
  }
  return undefined;
}
