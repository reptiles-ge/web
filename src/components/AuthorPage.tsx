import { getTranslations } from "next-intl/server";

import type { CreditAuthor } from "@/data/creditAuthors";
import type { AppLocale } from "@/i18n/routing";
import type { CreditAuthorPhoto } from "@/lib/creditAuthors";

import { AuthorGallery } from "@/components/AuthorGallery";
import { CoverImage } from "@/components/CoverImage";
import { InkHeroBreadcrumb } from "@/components/InkHeroBreadcrumb";
import { creditAuthorName } from "@/data/creditAuthors";
import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { getCreditAuthorSpeciesIds } from "@/lib/creditAuthors";
import { speciesHref } from "@/lib/speciesRoutes";

export async function AuthorPage({
  author,
  locale,
  photos,
}: {
  author: CreditAuthor;
  locale: AppLocale;
  photos: CreditAuthorPhoto[];
}) {
  const t = await getTranslations("author");
  const tShared = await getTranslations("groupHubShared");
  const name = creditAuthorName(author, locale);
  const speciesIds = getCreditAuthorSpeciesIds(photos);
  const heroSrc = photos.some((photo) => photo.src === author.heroSrc)
    ? author.heroSrc
    : (photos[0]?.src ?? author.heroSrc);

  return (
    <div className="min-h-screen bg-background">
      <section
        className="relative flex min-h-[78svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:min-h-[82svh] sm:pb-16 lg:pb-20"
        style={{ paddingTop: "7rem" }}
      >
        <CoverImage
          alt={t("heroImageAlt", { name })}
          className="object-cover object-[50%_40%]"
          priority
          sizes="100vw"
          src={heroSrc}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/20 to-black/80" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <InkHeroBreadcrumb
            crumbs={[
              {
                href: "/",
                label: tShared("breadcrumbHome"),
                withBack: true,
              },
              { label: name },
            ]}
          />
          <p className="text-[11px] font-medium tracking-[0.32em] text-white/50 uppercase">
            {t("kicker")}
          </p>
          <h1 className="text-balance-tight mt-3 max-w-3xl font-display text-display-hero font-semibold text-white">
            {name}
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:text-[16px]">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-12">
          <div className="flex flex-wrap gap-10 sm:gap-16">
            <p>
              <span className="font-display text-display-stat font-semibold text-foreground">
                {photos.length}
              </span>
              <span className="mt-2 block text-[13px] text-muted-foreground">
                {t("statPhotos")}
              </span>
            </p>
            <p>
              <span className="font-display text-display-stat font-semibold text-foreground">
                {speciesIds.length}
              </span>
              <span className="mt-2 block text-[13px] text-muted-foreground">
                {t("statSpecies")}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
            {t("gallery")}
          </p>
          <AuthorGallery locale={locale} photos={photos} />

          {speciesIds.length > 0 ? (
            <div className="mt-20 border-t border-border pt-12 sm:mt-24 sm:pt-16">
              <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                {t("speciesList")}
              </p>
              <ul className="mt-6 flex max-w-3xl flex-wrap gap-x-6 gap-y-3">
                {speciesIds.map((id) => {
                  const species = getSpeciesById(id);
                  if (!species) return null;
                  const localized = localizeSpecies(species, locale);
                  return (
                    <li key={id}>
                      <Link
                        className="inline-flex min-h-6 items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                        href={speciesHref(id, locale)}
                      >
                        {localized.commonName}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
