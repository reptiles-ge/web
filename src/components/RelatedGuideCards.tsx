"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { HubClusterCard } from "@/lib/clusterGuides";

import { CoverImage } from "@/components/CoverImage";
import { useLocaleSwitchIndex } from "@/components/LocaleSwitchProvider";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { GROUP_HUB_ILLUSTRATIONS, GROUP_HUB_LIST } from "@/lib/groupHubs";
import { speciesHrefFromIndex } from "@/lib/localeSwitch";
import { quizHref } from "@/lib/quizzes";
import { speciesSeoAnchor } from "@/lib/seoKeywords";
import { isPlaceholderMedia } from "@/lib/speciesContent";

const PAGE_CARD_IMAGES: Partial<
  Record<Extract<HubClusterCard, { kind: "page" }>["href"], string>
> = {
  "/snakes-in-the-yard": "/images/guides/snakes-in-the-yard-cover.jpg",
  "/venomous-snakes": "/images/guides/identify-venomous-cover.png",
};

const GUIDE_HERO_IMAGES: Partial<
  Record<Extract<HubClusterCard, { kind: "page" }>["href"], string>
> = {
  "/snakes/didi-gvelebi": "/images/guides/largest-snakes-cover.png",
  "/snakes/gavrtseleba": "/images/guides/snake-range-cover.png",
  "/snakes/gvelis-nakbeni": "/images/guides/snake-bite-cover.png",
  "/snakes/saxeoebebi": "/images/guides/snake-species-cover.png",
  "/snakes/shxamiani-gvelis-amocnoba":
    "/images/guides/identify-venomous-cover.png",
};

export function RelatedGuideCard({
  card,
  featured = false,
  locale,
  species = [],
}: {
  card: HubClusterCard;
  featured?: boolean;
  locale: AppLocale;
  species?: Species[];
}) {
  const t = useTranslations("groupHubShared");
  const switchIndex = useLocaleSwitchIndex();
  const item =
    card.kind === "species"
      ? species.find((entry) => entry.id === card.id)
      : undefined;
  const href =
    card.kind === "page"
      ? card.href
      : card.kind === "quiz"
        ? quizHref(card.id, locale)
        : speciesHrefFromIndex(switchIndex, card.id, locale);
  const title =
    card.kind === "species" && item
      ? speciesSeoAnchor(item.commonName, item.scientificName)
      : t(`cluster.${card.key}.title`);
  const cta =
    card.kind === "species" && item
      ? t("openProfile")
      : t(`cluster.${card.key}.cta`);
  const imageSrc = featured ? hubClusterCardImage(card, species) : undefined;

  const copy = (
    <>
      <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
        {t(`cluster.${card.key}.eyebrow`)}
      </span>
      <p className="mt-6 font-display text-[20px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[22px]">
        {title}
      </p>
      <p className="mt-2 max-w-xl flex-1 text-[14px] text-muted-foreground">
        {t(`cluster.${card.key}.body`)}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 group-hover:text-primary">
        {cta}
        <ArrowUpRight className="size-3.5" />
      </span>
    </>
  );

  if (featured && imageSrc) {
    return (
      <Link
        className="group grid h-full overflow-hidden bg-card sm:grid-cols-[minmax(17rem,0.38fr)_1fr]"
        href={href}
      >
        <div className="flex min-h-[180px] flex-col p-7 sm:p-8 lg:p-9">
          {copy}
        </div>
        <div className="relative min-h-[200px] bg-secondary sm:min-h-[260px]">
          <CoverImage
            alt=""
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 65vw"
            src={imageSrc}
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      className="group flex h-full min-h-[180px] flex-col bg-card p-7 transition-colors hover:bg-background"
      href={href}
    >
      {copy}
    </Link>
  );
}

export function RelatedGuideGrid({
  cards,
  className = "mt-12",
  locale,
  species = [],
}: {
  cards: HubClusterCard[];
  className?: string;
  locale: AppLocale;
  species?: Species[];
}) {
  if (cards.length === 0) return null;

  const featured = cards.length === 1;
  const columns = featured ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div
      className={cn(
        className,
        "grid gap-px overflow-hidden rounded-card bg-border/80",
        columns,
      )}
    >
      {cards.map((card) => (
        <div className="contents" key={card.key}>
          <RelatedGuideCard
            card={card}
            featured={featured}
            locale={locale}
            species={species}
          />
        </div>
      ))}
    </div>
  );
}

function hubClusterCardImage(card: HubClusterCard, species: Species[]) {
  if (card.kind === "species") {
    return speciesCardImage(card.id, species);
  }

  if (card.kind === "quiz") {
    return card.id === "lizard"
      ? GROUP_HUB_ILLUSTRATIONS.lizards
      : "/images/guides/snake-quiz-og.jpg";
  }

  const override = PAGE_CARD_IMAGES[card.href] ?? GUIDE_HERO_IMAGES[card.href];
  if (override) return override;

  const hub = GROUP_HUB_LIST.find((entry) => entry.path === card.href);
  if (hub) return speciesCardImage(hub.heroSpeciesId, species);

  return undefined;
}

function speciesCardImage(id: string, species: Species[]) {
  const item = species.find((entry) => entry.id === id);
  const src = item?.image;
  if (!src || isPlaceholderMedia(src)) return undefined;
  return src;
}
