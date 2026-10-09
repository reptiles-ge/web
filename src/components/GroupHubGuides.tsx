import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";

import { CoverImage } from "@/components/CoverImage";
import {
  GroupHubSectionHeading,
  HUB_CONTAINER,
  HUB_EYEBROW,
  HUB_LEAD,
} from "@/components/GroupHubSectionHeading";
import { Link } from "@/i18n/navigation";
import { HUB_CLUSTER_CARDS, type HubClusterCard } from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";
import {
  EMERGENCY_GUIDE_KEYS,
  HUB_FEATURED_GUIDE,
  hubGuideCards,
} from "@/lib/groupHubLayout";
import { speciesHref } from "@/lib/speciesRoutes";

type GuideCard = Exclude<HubClusterCard, { kind: "quiz" }>;
type SharedT = Awaited<ReturnType<typeof getTranslations>>;

const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(14,20,17,0.04),0_14px_36px_rgba(14,20,17,0.06)]";

export async function GroupHubGuides({
  cards,
  hubId,
  locale,
  species,
}: {
  cards: GuideCard[];
  hubId: GroupHubId;
  locale: AppLocale;
  species: Species[];
}) {
  if (cards.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "groupHubShared" });
  const featured = HUB_FEATURED_GUIDE[hubId];
  const featuredCard = featured
    ? cards.find((card) => card.key === featured.card)
    : undefined;
  const rows =
    featured && featuredCard
      ? featured.rows.flatMap((key) => {
          const card = hubGuideCards(HUB_CLUSTER_CARDS[hubId]).find(
            (entry) => entry.key === key,
          );
          return card ? [card] : [];
        })
      : [];
  const used = new Set([featuredCard, ...rows]);
  const tiles = cards.filter((card) => !used.has(card));
  const image = featured
    ? species.find((item) => item.id === featured.imageSpeciesId)
    : undefined;

  return (
    <section className="scroll-mt-36 bg-surface py-11 lg:py-20" id="guides">
      <div className={HUB_CONTAINER}>
        <GroupHubSectionHeading
          eyebrow={t("relatedGuidesEyebrow")}
          lead={t("relatedGuidesBody")}
          title={t("relatedGuidesTitle")}
        />
        {featuredCard ? (
          <FeaturedGuide
            card={featuredCard}
            image={image}
            locale={locale}
            rows={rows}
            species={species}
            t={t}
          />
        ) : null}
        {tiles.length > 0 ? (
          <ul
            className={cn(
              "no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 pb-3.5 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0",
              featuredCard ? "mt-4 lg:mt-6" : "mt-6 lg:mt-11",
            )}
          >
            {tiles.map((card) => (
              <li
                className="w-[264px] shrink-0 snap-start lg:w-auto"
                key={card.key}
              >
                <GuideTile
                  card={card}
                  locale={locale}
                  species={species}
                  t={t}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function cardBody(card: GuideCard, t: SharedT) {
  const key = `cluster.${card.key}.body`;
  return t.has(key) ? t(key) : null;
}

function cardHref(card: GuideCard, locale: AppLocale) {
  return card.kind === "page" ? card.href : speciesHref(card.id, locale);
}

function cardTitle(card: GuideCard, species: Species[], t: SharedT) {
  if (card.kind === "species") {
    const item = species.find((entry) => entry.id === card.id);
    if (item) return item.commonName;
  }
  return t(`cluster.${card.key}.title`);
}

function FeaturedGuide({
  card,
  image,
  locale,
  rows,
  species,
  t,
}: {
  card: GuideCard;
  image?: Species;
  locale: AppLocale;
  rows: GuideCard[];
  species: Species[];
  t: SharedT;
}) {
  const body = cardBody(card, t);

  return (
    <div
      className={cn(
        "-mx-2 mt-6 rounded-[32px] bg-card p-2.5 lg:mx-0 lg:mt-11 lg:flex lg:items-stretch lg:rounded-[40px] lg:p-3.5",
        "shadow-[0_1px_2px_rgba(14,20,17,0.04),0_24px_60px_rgba(14,20,17,0.07)]",
      )}
    >
      {image ? (
        <div className="relative h-[196px] overflow-hidden rounded-[24px] bg-ink lg:h-auto lg:min-h-[440px] lg:max-w-[480px] lg:flex-[0_1_480px] lg:rounded-[28px]">
          <CoverImage
            alt={image.commonName}
            className="object-cover object-[35%_50%]"
            sizes="(max-width: 1023px) 100vw, 480px"
            src={image.image}
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1 px-2.5 pt-[18px] pb-2.5 lg:py-[26px] lg:pr-[30px] lg:pb-[22px] lg:pl-11">
        <span className="inline-flex h-7 items-center gap-2 rounded-full bg-destructive/10 px-3 lg:h-[30px] lg:px-[13px]">
          <span
            aria-hidden="true"
            className="size-[7px] rounded-full bg-destructive"
          />
          <span className={cn(HUB_EYEBROW, "text-destructive")}>
            {t(`cluster.${card.key}.eyebrow`)}
          </span>
        </span>
        <h3 className="mt-3 font-display text-[22px] leading-[1.2] font-semibold text-foreground lg:mt-3.5 lg:text-[30px] lg:leading-[1.15]">
          {t(`cluster.${card.key}.title`)}
        </h3>
        {body ? (
          <p
            className={cn(
              HUB_LEAD,
              "mt-2 text-[14px] lg:mt-2.5 lg:max-w-[600px]",
            )}
          >
            {body}
          </p>
        ) : null}
        {rows.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2 lg:mt-5">
            {rows.map((row, index) => (
              <li key={row.key}>
                <GuideRow
                  card={row}
                  locale={locale}
                  number={index + 1}
                  species={species}
                  t={t}
                />
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          className="mt-3.5 flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#2f6b4f] pr-[22px] pl-6 text-[14.5px] font-medium whitespace-nowrap text-white transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-110 lg:mt-[22px] lg:inline-flex lg:h-12"
          href={cardHref(card, locale)}
        >
          {t(`cluster.${card.key}.cta`)}
          <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

function GuideRow({
  card,
  locale,
  number,
  species,
  t,
}: {
  card: GuideCard;
  locale: AppLocale;
  number: number;
  species: Species[];
  t: SharedT;
}) {
  const emergency = EMERGENCY_GUIDE_KEYS.has(card.key);
  const body = cardBody(card, t);

  return (
    <Link
      className="group flex min-h-[68px] items-center gap-3 rounded-[20px] bg-background py-2.5 pr-3.5 pl-2.5 transition-colors hover:bg-primary/9 lg:min-h-[72px] lg:gap-4 lg:rounded-[22px] lg:pr-5 lg:pl-3"
      href={cardHref(card, locale)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full font-semibold tabular-nums",
          emergency
            ? "bg-destructive text-[12px] text-white"
            : "bg-card text-[13px] text-primary",
        )}
      >
        {emergency ? "112" : String(number).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] leading-[1.3] font-semibold text-foreground lg:text-[16.5px]">
          {cardTitle(card, species, t)}
        </span>
        {body ? (
          <span className="mt-0.5 block text-[12.5px] leading-[1.4] text-muted-foreground lg:mt-[3px] lg:text-[13.5px] lg:leading-[1.45]">
            {body}
          </span>
        ) : null}
      </span>
      <ArrowRight
        aria-hidden="true"
        className="size-4 shrink-0 text-foreground transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

function GuideTile({
  card,
  locale,
  species,
  t,
}: {
  card: GuideCard;
  locale: AppLocale;
  species: Species[];
  t: SharedT;
}) {
  const body = cardBody(card, t);
  const item =
    card.kind === "species"
      ? species.find((entry) => entry.id === card.id)
      : undefined;

  return (
    <Link
      className={cn(
        "group flex h-full min-h-[190px] flex-col rounded-[26px] bg-card px-5 pt-5 pb-[18px] transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-[1.02] lg:min-h-[176px] lg:rounded-[28px] lg:px-6 lg:pt-6 lg:pb-[22px]",
        CARD_SHADOW,
      )}
      href={cardHref(card, locale)}
    >
      <span className="inline-flex h-6 items-center self-start rounded-full bg-surface px-2.5 text-[10.5px] font-medium tracking-[0.14em] text-muted-foreground uppercase lg:h-[26px] lg:px-[11px] lg:text-[11px]">
        {t(`cluster.${card.key}.eyebrow`)}
      </span>
      <span className="mt-3 block text-[17px] leading-tight font-semibold text-foreground lg:mt-3.5 lg:text-[19px]">
        {item ? (
          <>
            {item.commonName}{" "}
            <span className="font-normal text-muted-foreground italic">
              {item.scientificName}
            </span>
          </>
        ) : (
          t(`cluster.${card.key}.title`)
        )}
      </span>
      {body ? (
        <span className="mt-1.5 block text-[13px] leading-normal text-muted-foreground lg:text-[13.5px]">
          {body}
        </span>
      ) : null}
      <span className="mt-auto inline-flex items-center gap-1.5 pt-3.5 text-[13px] font-medium text-primary lg:pt-4 lg:text-[13.5px]">
        {t(`cluster.${card.key}.cta`)}
        <ArrowUpRight aria-hidden="true" className="size-3.5" />
      </span>
    </Link>
  );
}
