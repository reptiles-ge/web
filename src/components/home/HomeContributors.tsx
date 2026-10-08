import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import {
  creditAuthorBio,
  creditAuthorHref,
  creditAuthorIndexHref,
  creditAuthorName,
} from "@/data/creditAuthors";
import { Link } from "@/i18n/navigation";
import {
  getCreditAuthorCards,
  HOME_CONTRIBUTOR_LIMIT,
} from "@/lib/creditAuthors";
import { HOME_CONTRIBUTOR_PORTRAIT_SIZES } from "@/lib/imageSizes";

export async function HomeContributors({ locale }: { locale: AppLocale }) {
  const all = getCreditAuthorCards();
  if (all.length === 0) return null;
  const cards = all.slice(0, HOME_CONTRIBUTOR_LIMIT);
  const [t, tAuthor] = await Promise.all([
    getTranslations({ locale, namespace: "home.contributors" }),
    getTranslations({ locale, namespace: "author" }),
  ]);

  return (
    <section className="bg-surface py-11 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <HomeSectionHeading
          eyebrow={t("eyebrow")}
          subtitle={t("subtitle")}
          title={t("title")}
        />

        <ul className="mt-6 grid gap-3 lg:mt-11 lg:grid-cols-2 lg:gap-6">
          {cards.map((card) => {
            const name = creditAuthorName(card.author, locale);
            const bio = creditAuthorBio(card.author, locale);
            return (
              <li key={card.author.id}>
                <Link
                  className="group flex h-full gap-4 rounded-[26px] bg-card p-5 shadow-[0_16px_40px_rgba(14,20,17,0.06)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:gap-[22px] lg:rounded-[32px] lg:p-[30px]"
                  href={creditAuthorHref(card.author.slug)}
                >
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-ink ring-4 ring-surface lg:size-[84px]">
                    <CoverImage
                      alt={tAuthor("portraitAlt", { name })}
                      className={`object-cover ${card.author.portraitClass ?? "object-[50%_18%]"}`}
                      sizes={HOME_CONTRIBUTOR_PORTRAIT_SIZES}
                      src={card.author.portraitSrc}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                      {tAuthor(`roles.${card.author.role}`)}
                    </span>
                    <span className="mt-1.5 flex items-center gap-1.5 font-display text-[18px] leading-tight font-semibold text-foreground lg:text-[20px]">
                      {name}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 text-muted-foreground group-hover:text-primary"
                      />
                    </span>
                    <span className="mt-1.5 block text-[13px] font-medium text-primary">
                      {card.photoCount} {tAuthor("statPhotos")} ·{" "}
                      {card.speciesCount} {tAuthor("statSpecies")}
                    </span>
                    {bio ? (
                      <span className="mt-2.5 line-clamp-3 text-[13.5px] leading-[1.55] text-muted-foreground lg:text-[14px]">
                        {bio}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {all.length > cards.length ? (
          <Link
            className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:mt-7"
            href={creditAuthorIndexHref()}
          >
            <span className="border-b border-foreground/30 pb-0.5">
              {t("seeAll")}
            </span>
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
