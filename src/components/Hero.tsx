import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { TrackedSpeciesLink } from "@/components/home/TrackedSpeciesLink";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { getSpeciesById } from "@/data/species";
import { getAtlasStats } from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { GROUP_HUB_ILLUSTRATIONS, GROUP_HUBS } from "@/lib/groupHubs";

const HERO_IMAGE_SIZES =
  "(max-width: 639px) 1080px, (max-width: 1023px) 100vw, 61vw";

export async function Hero({ locale }: { locale: AppLocale }) {
  const [t, tNav, tKnowledge, tSafety, tGroups] = await Promise.all([
    getTranslations({ locale, namespace: "hero" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "home.knowledge" }),
    getTranslations({ locale, namespace: "home.safety" }),
    getTranslations({ locale, namespace: "home.groups" }),
  ]);
  const stats = getAtlasStats();
  const base = getSpeciesById(GROUP_HUBS.snakes.heroSpeciesId);
  const subject = base ? localizeSpecies(base, locale) : null;
  const popular = [
    { href: "/venomous-snakes" as const, label: tKnowledge("venomous.cta") },
    { href: "/snakes/gvelis-nakbeni" as const, label: tSafety("bite") },
    { href: "/snakes" as const, label: tNav("snakes") },
    { href: "/amphibians" as const, label: tNav("amphibians") },
  ];

  return (
    <section
      className="relative z-10 flex h-[720px] min-h-[720px] bg-ink text-white lg:h-[780px] lg:min-h-[780px]"
      id="top"
    >
      <CoverImagePreload
        sizes={HERO_IMAGE_SIZES}
        src={GROUP_HUB_ILLUSTRATIONS.snakes}
      />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[400px] overflow-hidden lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:w-[61%]">
          <div className="absolute top-0 left-[-480px] h-[720px] w-[1080px] sm:inset-0 sm:size-full">
            <CoverImage
              alt={
                subject
                  ? tGroups("illustrationAlt", { name: subject.commonName })
                  : ""
              }
              className="hero-drift object-cover lg:object-[88%_30%]"
              priority
              sizes={HERO_IMAGE_SIZES}
              src={GROUP_HUB_ILLUSTRATIONS.snakes}
            />
          </div>
        </div>
        <div className="absolute inset-x-0 top-0 h-[150px] bg-linear-to-b from-ink/80 to-transparent lg:h-[210px]" />
        <div className="absolute inset-x-0 top-[170px] h-[232px] bg-linear-to-b from-transparent via-ink/70 to-ink lg:hidden" />
        <div className="absolute inset-y-0 left-[39%] hidden w-[31%] bg-linear-to-r from-ink via-ink/85 to-transparent lg:block" />
        <div className="absolute inset-x-0 bottom-0 hidden h-[250px] bg-linear-to-t from-ink/90 to-transparent lg:block" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-end px-6 pb-7 lg:items-center lg:px-[60px] lg:pb-0">
        <div className="w-full max-w-[620px] lg:pt-6">
          <p className="flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] text-white/65 uppercase">
            <span className="size-1.5 rounded-full bg-[#6fad88]" />
            {t("kicker")}
          </p>
          <h1 className="mt-4 max-w-[600px] font-display text-[clamp(2rem,8.7vw,2.6rem)] leading-[1.08] font-semibold tracking-[-0.01em] text-white lg:mt-[22px] lg:text-[64px] lg:leading-[1.06]">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-[540px] text-[15px] leading-[1.6] text-white/75 lg:mt-[22px] lg:text-[17px]">
            <strong className="font-semibold text-white">
              {t("statSpecies", { count: stats.total })}
            </strong>
            ,{" "}
            <strong className="font-semibold text-white">
              {t("statRegions", { count: stats.regions })}
            </strong>{" "}
            {t("statAnd")}{" "}
            <strong className="font-semibold text-white">
              {t("statPhotos", { count: stats.photos })}
            </strong>
            {" — "}
            {t("subtitle")}
          </p>
          <div className="mt-[22px] lg:mt-[34px] lg:max-w-[600px]">
            <SpeciesSearch shortcut="top" variant="hero" />
          </div>
          <div className="mt-5 lg:flex lg:flex-wrap lg:items-center lg:gap-2">
            <p className="text-[12px] text-white/60 lg:mr-1.5 lg:text-[13px]">
              {t("popular")}
            </p>
            <ul className="no-scrollbar -mx-6 mt-2.5 flex gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:mt-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
              {popular.map((item) => (
                <li className="shrink-0" key={item.href}>
                  <Link
                    className="inline-flex min-h-11 items-center rounded-full border border-white/20 bg-white/8 px-4 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6fad88] lg:min-h-9 lg:px-[15px]"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[30px] z-20 hidden lg:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-[60px]">
          <a
            className="group flex items-center gap-3 text-[13px] font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6fad88]"
            href="#groups"
          >
            <span className="flex size-11 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:bg-white/10">
              <ArrowDown aria-hidden="true" className="size-4" />
            </span>
            {t("scrollToGroups")}
          </a>
          {subject ? (
            <TrackedSpeciesLink
              className="flex h-[38px] items-center gap-2 rounded-full border border-white/15 bg-ink/60 px-[15px] text-[12.5px] text-white/85 backdrop-blur-lg transition-colors hover:border-white/35 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6fad88]"
              locale={locale}
              source="home_hero"
              speciesId={subject.id}
            >
              {tGroups("illustrationAlt", { name: subject.commonName })}
              <span className="text-white/60 italic">
                {subject.scientificName}
              </span>
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </TrackedSpeciesLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
