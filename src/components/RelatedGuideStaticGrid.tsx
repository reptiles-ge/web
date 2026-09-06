import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import type { HubClusterCard } from "@/lib/clusterGuides";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { speciesHrefFromIndex } from "@/lib/localeSwitch";
import { getLocaleSwitchIndex } from "@/lib/localeSwitchData";
import { quizHref } from "@/lib/quizzes";

export async function RelatedGuideStaticGrid({
  cards,
  className = "mt-12",
  locale,
}: {
  cards: HubClusterCard[];
  className?: string;
  locale: AppLocale;
}) {
  if (cards.length === 0) return null;

  const t = await getTranslations("groupHubShared");
  const switchIndex = getLocaleSwitchIndex();
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
      {cards.map((card) => {
        const href =
          card.kind === "page"
            ? card.href
            : card.kind === "quiz"
              ? quizHref(card.id, locale)
              : speciesHrefFromIndex(switchIndex, card.id, locale);

        return (
          <Link
            className="group flex h-full min-h-[180px] flex-col bg-card p-7 transition-colors hover:bg-background"
            href={href}
            key={card.key}
          >
            <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
              {t(`cluster.${card.key}.eyebrow`)}
            </span>
            <p className="mt-6 font-display text-[20px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[22px]">
              {t(`cluster.${card.key}.title`)}
            </p>
            <p className="mt-2 max-w-xl flex-1 text-[14px] text-muted-foreground">
              {t(`cluster.${card.key}.body`)}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 group-hover:text-primary">
              {t(`cluster.${card.key}.cta`)}
              <ArrowUpRight className="size-3.5" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
