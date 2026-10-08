import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { HomeGroupCarousel } from "@/components/home/HomeGroupCarousel";
import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";
import { type AnimalGroup, getAtlasStats } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { GROUP_HUB_ILLUSTRATIONS, GROUP_HUBS } from "@/lib/groupHubs";

const GROUPS = [
  "snakes",
  "lizards",
  "turtles",
  "amphibians",
  "birds",
  "mammals",
  "spiders",
  "scorpions",
  "insects",
] as const;

export async function HomeGroups({ locale }: { locale: AppLocale }) {
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "home.groups" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const stats = getAtlasStats();

  return (
    <section className="bg-background py-11 lg:py-20" id="groups">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <HomeSectionHeading
          eyebrow={t("eyebrow")}
          subtitle={t("subtitle")}
          title={t("title")}
        />
      </div>

      <HomeGroupCarousel
        action={
          <Link
            className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href="/species"
          >
            <span className="border-b border-foreground/30 pb-0.5">
              {t("catalog")} · {t("count", { count: stats.total })}
            </span>
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        }
        nextLabel={t("next")}
        previousLabel={t("previous")}
      >
        {GROUPS.map((hubId, index) => {
          const hub = GROUP_HUBS[hubId];
          const name = tNav(hubId);
          return (
            <Link
              className={`group w-[300px] shrink-0 snap-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${index < 4 || hubId === "scorpions" || hubId === "insects" ? "lg:w-[495px]" : "lg:w-[330px]"}`}
              href={hub.path}
              key={hubId}
            >
              <span className="relative block h-[200px] overflow-hidden rounded-[24px] bg-ink lg:h-[330px] lg:rounded-[28px]">
                <CoverImage
                  alt={t("illustrationAlt", { name })}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  sizes="(max-width: 1023px) 300px, 495px"
                  src={GROUP_HUB_ILLUSTRATIONS[hubId]}
                />
              </span>
              <span className="mt-3 flex items-baseline justify-between gap-3 px-1.5 lg:mt-3.5 lg:px-2">
                <span className="flex items-baseline gap-2.5 lg:gap-3">
                  <span className="text-[12px] text-muted-foreground tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[18px] font-semibold text-foreground lg:text-[20px]">
                    {name}
                  </span>
                </span>
                <span className="shrink-0 text-[12px] text-muted-foreground lg:text-[13px]">
                  {t("count", { count: groupCount(hub.group, stats) })}
                </span>
              </span>
            </Link>
          );
        })}
        <Link
          className="flex h-[200px] w-[300px] shrink-0 snap-start flex-col justify-between rounded-[24px] bg-[#2f6b4f] p-5 text-white transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:size-[330px] lg:rounded-[28px] lg:p-6"
          href="/species"
        >
          <span className="text-[11px] font-medium tracking-[0.18em] text-white/80 uppercase">
            {t("eyebrow")}
          </span>
          <span className="flex items-end justify-between gap-4">
            <span>
              <span className="block font-display text-[26px] leading-tight font-semibold lg:text-[28px]">
                {t("catalog")}
              </span>
              <span className="mt-2 block text-[14px] text-white/80">
                {t("count", { count: stats.total })}
              </span>
            </span>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#2f6b4f]">
              <ArrowRight aria-hidden="true" className="size-[18px]" />
            </span>
          </span>
        </Link>
      </HomeGroupCarousel>
      <div className="mx-auto mt-5 max-w-[1440px] px-6 lg:hidden">
        <Link
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#2f6b4f] px-5 text-[15px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          href="/species"
        >
          {t("catalog")} · {t("count", { count: stats.total })}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function groupCount(
  group: AnimalGroup,
  stats: ReturnType<typeof getAtlasStats>,
) {
  switch (group) {
    case "amphibian":
      return stats.amphibians;
    case "bird":
      return stats.birds;
    case "insect":
      return stats.insects;
    case "lizard":
      return stats.lizards;
    case "mammal":
      return stats.mammals;
    case "scorpion":
      return stats.scorpions;
    case "snake":
      return stats.snakes;
    case "spider":
      return stats.spiders;
    case "turtle":
      return stats.turtles;
  }
}
