import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import type { CreditAuthorCard } from "@/lib/creditAuthors";

import { CoverImage } from "@/components/CoverImage";
import {
  creditAuthorBio,
  creditAuthorHref,
  creditAuthorName,
} from "@/data/creditAuthors";
import { Link } from "@/i18n/navigation";
import { HOME_CONTRIBUTOR_PORTRAIT_SIZES } from "@/lib/imageSizes";

export async function AuthorIndexPage({
  cards,
  locale,
}: {
  cards: CreditAuthorCard[];
  locale: AppLocale;
}) {
  const [t, tShared, tProfile] = await Promise.all([
    getTranslations("author"),
    getTranslations("groupHubShared"),
    getTranslations("profile"),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <header className="pt-30 pb-12 sm:pt-33 sm:pb-16 lg:pb-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <nav aria-label={tProfile("breadcrumbAria")} className="mb-8 sm:mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
              <li>
                <Link
                  className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
                  href="/"
                >
                  {tShared("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">
                /
              </li>
              <li className="text-foreground">{t("index.breadcrumb")}</li>
            </ol>
          </nav>
          <h1 className="text-balance-tight max-w-3xl font-display text-display-hero font-semibold text-foreground">
            {t("index.h1")}
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-snug text-foreground/90 sm:text-[18px]">
            {t("index.intro")}
          </p>
          {cards.length > 0 ? (
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {t("index.count", { count: cards.length })}
            </p>
          ) : null}
        </div>
      </header>

      <section className="pb-20 sm:pb-24 lg:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          {cards.length === 0 ? (
            <p className="text-[15px] text-muted-foreground">{t("index.empty")}</p>
          ) : (
            <ul className="grid gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-14 lg:gap-x-16">
              {cards.map((card) => {
                const name = creditAuthorName(card.author, locale);
                const bio = creditAuthorBio(card.author, locale);
                return (
                  <li key={card.author.id}>
                    <Link
                      className="group flex items-start gap-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none sm:gap-5"
                      href={creditAuthorHref(card.author.slug)}
                    >
                      <span className="relative size-20 shrink-0 overflow-hidden rounded-full ring-1 ring-border sm:size-24">
                        <CoverImage
                          alt={t("portraitAlt", { name })}
                          className={`object-cover ${card.author.portraitClass ?? "object-[50%_18%]"}`}
                          sizes={HOME_CONTRIBUTOR_PORTRAIT_SIZES}
                          src={card.author.portraitSrc}
                        />
                      </span>
                      <span className="min-w-0 pt-1">
                        <span className="block text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
                          {t(`roles.${card.author.role}`)}
                        </span>
                        <h2 className="mt-2 font-display text-[1.35rem] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[1.5rem]">
                          {name}
                        </h2>
                        <span className="mt-3 block text-[13px] text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {card.photoCount}
                          </span>{" "}
                          {t("statPhotos")}
                          <span className="mx-2 text-border">·</span>
                          <span className="font-medium text-foreground">
                            {card.speciesCount}
                          </span>{" "}
                          {t("statSpecies")}
                        </span>
                        {bio ? (
                          <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-muted-foreground">
                            {bio}
                          </p>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
