import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { CreditAuthor } from "@/data/creditAuthors";
import type { AppLocale } from "@/i18n/routing";
import type { CreditAuthorPhoto } from "@/lib/creditAuthors";

import { AuthorGallery } from "@/components/AuthorGallery";
import { CoverImage } from "@/components/CoverImage";
import { creditAuthorBio, creditAuthorName } from "@/data/creditAuthors";
import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { getCreditAuthorSpeciesIds } from "@/lib/creditAuthors";
import { AUTHOR_PORTRAIT_SIZES } from "@/lib/imageSizes";
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
  const bio = creditAuthorBio(author, locale);
  const speciesIds = getCreditAuthorSpeciesIds(photos);
  const socials = [
    author.links?.facebook
      ? { href: author.links.facebook, key: "facebook" as const }
      : null,
    author.links?.instagram
      ? { href: author.links.instagram, key: "instagram" as const }
      : null,
  ].filter((item): item is { href: string; key: "facebook" | "instagram" } =>
    Boolean(item),
  );

  return (
    <div className="min-h-screen bg-background">
      <header
        className="border-b border-border"
        style={{ paddingTop: "5.5rem" }}
      >
        <div className="mx-auto max-w-[1400px] px-6 pt-6 pb-10 lg:px-10 lg:pt-8 lg:pb-14">
          <Link
            className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            href="/"
          >
            <ArrowLeft className="size-3.5" />
            {tShared("breadcrumbHome")}
          </Link>

          <div className="mt-8 flex items-center gap-5 sm:mt-10 sm:gap-8">
            <div className="relative size-28 shrink-0 overflow-hidden rounded-full ring-1 ring-border sm:size-36 lg:size-40">
              <CoverImage
                alt={t("portraitAlt", { name })}
                className="object-cover object-[50%_18%]"
                priority
                sizes={AUTHOR_PORTRAIT_SIZES}
                src={author.portraitSrc}
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
                {t("kicker")}
              </p>
              <h1 className="mt-2 font-display text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.05] font-semibold tracking-tight text-foreground">
                {name}
              </h1>
              <p className="mt-4 text-[13px] text-muted-foreground">
                <span className="font-medium text-foreground">
                  {photos.length}
                </span>{" "}
                {t("statPhotos")}
                <span className="mx-2 text-border">·</span>
                <span className="font-medium text-foreground">
                  {speciesIds.length}
                </span>{" "}
                {t("statSpecies")}
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:mt-8">
            {bio ?? t("subtitle")}
          </p>
          {socials.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-3">
              {socials.map((item) => (
                <li key={item.key}>
                  <a
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    href={item.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t(item.key)}
                    <ArrowUpRight className="size-3.5 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

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
