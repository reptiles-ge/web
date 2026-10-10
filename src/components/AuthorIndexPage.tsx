import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { CreditAuthorRole } from "@/data/creditAuthors";
import type { AppLocale } from "@/i18n/routing";
import type { CreditAuthorCard } from "@/lib/creditAuthors";

import { AuthorIndexGrid } from "@/components/AuthorIndexGrid";
import { CoverImage } from "@/components/CoverImage";
import {
  creditAuthorBio,
  creditAuthorHref,
  creditAuthorName,
} from "@/data/creditAuthors";
import { Link } from "@/i18n/navigation";
import {
  getCreditAuthorPhotos,
  getCreditAuthorSpeciesIds,
} from "@/lib/creditAuthors";
import { HOME_CONTRIBUTOR_PORTRAIT_SIZES } from "@/lib/imageSizes";

const ROLE_ORDER: readonly CreditAuthorRole[] = [
  "herpetologist",
  "photographer",
  "researcher",
  "ranger",
];

const EYEBROW =
  "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase";
const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(14,20,17,0.04),0_16px_40px_rgba(14,20,17,0.06)]";

export async function AuthorIndexPage({
  cards,
  locale,
}: {
  cards: CreditAuthorCard[];
  locale: AppLocale;
}) {
  const [t, tShared, tProfile] = await Promise.all([
    getTranslations({ locale, namespace: "author" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "profile" }),
  ]);
  const photoTotal = cards.reduce((sum, card) => sum + card.photoCount, 0);
  const speciesTotal = new Set(
    cards.flatMap((card) =>
      getCreditAuthorSpeciesIds(getCreditAuthorPhotos(card.author)),
    ),
  ).size;
  const roles = ROLE_ORDER.filter((role) =>
    cards.some((card) => card.author.role === role),
  );
  const countLabels: Record<string, string> = {
    all: t("index.count", { count: cards.length }),
  };
  for (const role of roles) {
    countLabels[role] = t("index.count", {
      count: cards.filter((card) => card.author.role === role).length,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="pt-28 pb-10 sm:pt-32 lg:pt-36 lg:pb-14">
        <div className="mx-auto max-w-[1440px] px-6 lg:flex lg:items-end lg:justify-between lg:gap-16 lg:px-[60px]">
          <div className="min-w-0 lg:max-w-[700px]">
            <nav aria-label={tProfile("breadcrumbAria")} className="sr-only">
              <ol>
                <li>
                  <Link href="/">{tShared("breadcrumbHome")}</Link>
                </li>
                <li aria-current="page">{t("index.breadcrumb")}</li>
              </ol>
            </nav>
            <p className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-primary"
              />
              <span className={EYEBROW}>{t("index.eyebrow")}</span>
            </p>
            <h1 className="mt-4 font-display text-[44px] leading-[1.04] font-bold tracking-[-0.02em] text-foreground sm:text-[56px] lg:mt-5 lg:text-[72px] lg:leading-[1.02]">
              {t("index.h1")}
            </h1>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[1.6] text-foreground/80 lg:mt-[22px] lg:text-[19px]">
              {t("index.intro")}
            </p>
          </div>
          {cards.length > 0 ? (
            <dl
              className={`mt-7 grid grid-cols-3 rounded-[26px] bg-card px-1 py-5 lg:mt-0 lg:w-[560px] lg:shrink-0 lg:rounded-[32px] lg:px-2 lg:py-7 ${CARD_SHADOW}`}
            >
              {[
                { label: t("index.statContributors"), value: cards.length },
                { label: t("index.statPhotos"), value: photoTotal },
                { label: t("statSpecies"), value: speciesTotal },
              ].map((stat, index) => (
                <div
                  className={
                    index > 0
                      ? "flex flex-col-reverse justify-end border-l border-border/70 px-4 lg:px-7"
                      : "flex flex-col-reverse justify-end px-4 lg:px-7"
                  }
                  key={stat.label}
                >
                  <dt className={`${EYEBROW} mt-2 lg:mt-2.5`}>{stat.label}</dt>
                  <dd className="font-display text-[30px] leading-none font-semibold tracking-[-0.02em] text-foreground tabular-nums lg:text-[44px]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </header>

      <section className="pb-16 lg:pb-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
          {cards.length === 0 ? (
            <p className="text-[15px] text-muted-foreground">
              {t("index.empty")}
            </p>
          ) : (
            <AuthorIndexGrid
              countLabels={countLabels}
              filterLabel={t("index.filterLabel")}
              filters={[
                { count: cards.length, id: "all", label: t("index.all") },
                ...roles.map((role) => ({
                  count: cards.filter((card) => card.author.role === role)
                    .length,
                  id: role,
                  label: t(`rolesPlural.${role}`),
                })),
              ]}
              items={cards.map((card) => ({
                id: card.author.id,
                node: (
                  <AuthorIndexCard
                    bio={creditAuthorBio(card.author, locale)}
                    card={card}
                    name={creditAuthorName(card.author, locale)}
                    photosLabel={t("statPhotos")}
                    portraitAlt={t("portraitAlt", {
                      name: creditAuthorName(card.author, locale),
                    })}
                    role={t(`roles.${card.author.role}`)}
                    speciesLabel={t("statSpecies")}
                  />
                ),
                role: card.author.role,
              }))}
              sortedLabel={t("index.sorted")}
            />
          )}
        </div>
      </section>

      <section className="pb-16 lg:pb-24">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-[60px]">
          <div className="rounded-[30px] bg-ink px-6 py-8 text-white lg:flex lg:items-center lg:gap-14 lg:rounded-[36px] lg:px-14 lg:py-12">
            <div className="min-w-0 flex-1">
              <p className={`${EYEBROW} text-white/60`}>
                {t("index.ctaEyebrow")}
              </p>
              <h2 className="mt-3 font-display text-[26px] leading-[1.18] font-semibold tracking-[-0.012em] lg:mt-3.5 lg:text-[36px] lg:leading-[1.15]">
                {t("index.ctaTitle")}
              </h2>
              <p className="mt-3 max-w-[640px] text-[15px] leading-[1.6] text-white/70 lg:mt-3.5 lg:text-[16px] lg:leading-[1.65]">
                {t("index.ctaBody")}
              </p>
            </div>
            <Link
              className="mt-6 flex h-[54px] shrink-0 items-center justify-center gap-2.5 rounded-full bg-white px-[26px] text-[15px] font-semibold text-ink transition-[transform,filter] hover:-translate-y-0.5 lg:mt-0 lg:inline-flex"
              href="/contact"
            >
              {t("index.ctaButton")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function AuthorIndexCard({
  bio,
  card,
  name,
  photosLabel,
  portraitAlt,
  role,
  speciesLabel,
}: {
  bio?: string;
  card: CreditAuthorCard;
  name: string;
  photosLabel: string;
  portraitAlt: string;
  role: string;
  speciesLabel: string;
}) {
  return (
    <Link
      className={`group flex flex-1 flex-col rounded-[26px] bg-card p-5 transition-[transform,box-shadow] duration-300 hover:translate-y-[-3px] hover:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_22px_48px_rgba(14,20,17,0.1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:rounded-[32px] lg:p-7 ${CARD_SHADOW}`}
      href={creditAuthorHref(card.author.slug)}
    >
      <div className="flex items-center gap-4 lg:gap-[18px]">
        <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-ink lg:size-[72px]">
          <CoverImage
            alt={portraitAlt}
            className={`object-cover ${card.author.portraitClass ?? "object-[50%_18%]"}`}
            sizes={HOME_CONTRIBUTOR_PORTRAIT_SIZES}
            src={card.author.portraitSrc}
          />
        </span>
        <div className="min-w-0">
          <span className={`block ${EYEBROW}`}>{role}</span>
          <h2 className="mt-1.5 font-display text-[19px] leading-[1.2] font-semibold text-foreground lg:mt-2 lg:text-[22px]">
            {name}
          </h2>
        </div>
      </div>
      {bio ? (
        <span className="mt-3.5 line-clamp-3 flex-1 text-[14px] leading-[1.6] text-muted-foreground lg:mt-[18px] lg:text-[14.5px]">
          {bio}
        </span>
      ) : (
        <span className="flex-1" />
      )}
      <span className="mt-4 flex items-center gap-[18px] border-t border-border/70 pt-3.5 lg:mt-[22px] lg:pt-[18px]">
        <span className="flex items-baseline gap-1.5">
          <strong className="text-[18px] font-semibold text-primary tabular-nums lg:text-[20px]">
            {card.photoCount}
          </strong>
          <span className="text-[13px] text-muted-foreground">
            {photosLabel}
          </span>
        </span>
        <span className="flex items-baseline gap-1.5">
          <strong className="text-[18px] font-semibold text-primary tabular-nums lg:text-[20px]">
            {card.speciesCount}
          </strong>
          <span className="text-[13px] text-muted-foreground">
            {speciesLabel}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="ml-auto flex size-10 items-center justify-center rounded-full bg-background text-foreground transition-colors group-hover:bg-[#2f6b4f] group-hover:text-white"
        >
          <ArrowRight className="size-4" />
        </span>
      </span>
    </Link>
  );
}
