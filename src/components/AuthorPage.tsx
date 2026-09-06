import { ArrowLeft } from "lucide-react";
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
import {
  getCreditAuthorHubIds,
  getCreditAuthorSpeciesIds,
} from "@/lib/creditAuthors";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { AUTHOR_PORTRAIT_SIZES } from "@/lib/imageSizes";
import { quizHref } from "@/lib/quizzes";
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
  const [t, tShared, tProfile] = await Promise.all([
    getTranslations("author"),
    getTranslations("groupHubShared"),
    getTranslations("profile"),
  ]);
  const name = creditAuthorName(author, locale);
  const bio = creditAuthorBio(author, locale);
  const speciesIds = getCreditAuthorSpeciesIds(photos);
  const hubs = getCreditAuthorHubIds(speciesIds);
  const socials = [
    author.links?.facebook
      ? {
          href: author.links.facebook,
          Icon: FacebookGlyph,
          key: "facebook" as const,
        }
      : null,
    author.links?.instagram
      ? {
          href: author.links.instagram,
          Icon: InstagramGlyph,
          key: "instagram" as const,
        }
      : null,
  ].filter(
    (
      item,
    ): item is {
      href: string;
      Icon: typeof FacebookGlyph;
      key: "facebook" | "instagram";
    } => Boolean(item),
  );

  return (
    <div className="min-h-screen bg-background">
      <header
        className="border-b border-border"
        style={{ paddingTop: "5.5rem" }}
      >
        <div className="mx-auto max-w-[1400px] px-6 pt-6 pb-10 lg:px-10 lg:pt-8 lg:pb-14">
          <nav aria-label={tProfile("breadcrumbAria")}>
            <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
              <li>
                <Link
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                  href="/"
                >
                  <ArrowLeft className="size-3.5" />
                  {tShared("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">
                /
              </li>
              <li aria-current="page" className="text-foreground/80">
                {name}
              </li>
            </ol>
          </nav>

          <div className="mt-8 flex items-center gap-5 sm:mt-10 sm:gap-8">
            <div className="relative size-28 shrink-0 overflow-hidden rounded-full ring-1 ring-border sm:size-36 lg:size-40">
              <CoverImage
                alt={t("portraitAlt", { name })}
                className={`object-cover ${author.portraitClass ?? "object-[50%_18%]"}`}
                priority
                sizes={AUTHOR_PORTRAIT_SIZES}
                src={author.portraitSrc}
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
                {t(`roles.${author.role}`)}
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
            <ul className="mt-5 flex items-center gap-2">
              {socials.map((item) => (
                <li key={item.key}>
                  <a
                    aria-label={t(item.key)}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
                    href={item.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <item.Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      <section className="bg-background py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <h2 className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
            {t("gallery")}
          </h2>
          <AuthorGallery locale={locale} photos={photos} />

          {speciesIds.length > 0 ? (
            <div className="mt-20 border-t border-border pt-12 sm:mt-24 sm:pt-16">
              <h2 className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                {t("speciesList")}
              </h2>
              <ul className="mt-6 flex max-w-3xl flex-wrap gap-x-6 gap-y-3">
                {speciesIds.map((id) => {
                  const species = getSpeciesById(id);
                  if (!species) return null;
                  const localized = localizeSpecies(species, locale);
                  return (
                    <li key={id}>
                      <Link
                        className="inline-flex min-h-11 items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground"
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

          <div className="mt-20 border-t border-border pt-12 sm:mt-24 sm:pt-16">
            <h2 className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
              {t("next")}
            </h2>
            <ul className="mt-6 flex max-w-3xl flex-wrap gap-x-6 gap-y-3">
              <li>
                <Link
                  className="inline-flex min-h-11 items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                  href="/species"
                >
                  {tProfile("allSpecies")}
                </Link>
              </li>
              {hubs.map((hub) => (
                <li key={hub}>
                  <Link
                    className="inline-flex min-h-11 items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                    href={GROUP_HUBS[hub].path}
                  >
                    {tShared(`hubs.${hub}`)}
                  </Link>
                </li>
              ))}
              {hubs.includes("snakes") ? (
                <li>
                  <Link
                    className="inline-flex min-h-11 items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                    href={quizHref("snake", locale)}
                  >
                    {t("nextQuizSnake")}
                  </Link>
                </li>
              ) : null}
              {hubs.includes("lizards") ? (
                <li>
                  <Link
                    className="inline-flex min-h-11 items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                    href={quizHref("lizard", locale)}
                  >
                    {t("nextQuizLizard")}
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
        width="20"
        x="2"
        y="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" fill="currentColor" r="1" />
    </svg>
  );
}
