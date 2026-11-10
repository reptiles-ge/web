import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { HeroWall } from "@/components/HeroWall";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { summarizeAtlas } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { heroWallSpeciesIds } from "@/lib/heroWall";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6fad88]";

export async function Hero({ locale }: { locale: AppLocale }) {
  const [t, format, catalog] = await Promise.all([
    getTranslations({ locale, namespace: "hero" }),
    getFormatter({ locale }),
    getSpeciesCatalog(locale),
  ]);
  const stats = summarizeAtlas(catalog);
  const names = new Map(catalog.map((item) => [item.id, item.commonName]));
  const labels = Object.fromEntries(
    Object.entries(heroWallSpeciesIds()).map(([hub, id]) => [
      hub,
      names.get(id) ?? "",
    ]),
  ) as Parameters<typeof HeroWall>[0]["labels"];
  const statRow = [
    {
      count: stats.total,
      label: t("statLabelSpecies", { count: stats.total }),
    },
    {
      count: stats.regions,
      label: t("statLabelRegions", { count: stats.regions }),
    },
    {
      count: stats.photos,
      label: t("statLabelPhotos", { count: stats.photos }),
    },
  ];

  return (
    <section
      className="hero-wall relative z-10 flex bg-ink text-white lg:h-[clamp(720px,calc(100svh-64px),836px)]"
      id="top"
    >
      <div className="absolute inset-0 overflow-hidden">
        <HeroWall labels={labels} />
        <div className="hero-wall-fade absolute inset-y-0 left-0 hidden w-full lg:block" />
        <div className="absolute inset-x-0 top-0 h-[150px] bg-linear-to-b from-ink/90 to-transparent lg:h-[190px] lg:from-ink/85" />
        <div className="absolute inset-x-0 top-[168px] h-[152px] bg-linear-to-b from-transparent via-ink/70 to-ink lg:hidden" />
        <div className="absolute inset-x-0 bottom-0 hidden h-[170px] bg-linear-to-t from-ink/90 to-transparent lg:block" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] px-6 pt-[296px] pb-[22px] has-aria-expanded:z-30 lg:items-center lg:px-[60px] lg:pt-[76px] lg:pb-0">
        <div className="w-full max-w-[600px]">
          <p className="hidden items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] text-white/65 uppercase lg:flex">
            <span className="size-1.5 rounded-full bg-[#6fad88]" />
            {t("kicker")}
          </p>
          <h1 className="max-w-[600px] font-display text-[clamp(2rem,8.7vw,2.6rem)] leading-[1.08] font-semibold tracking-[-0.01em] text-white lg:mt-[22px] lg:text-[64px] lg:leading-[1.06]">
            {t("title")}
          </h1>
          <p className="mt-3 text-[15px] leading-[1.6] text-white/75 lg:hidden">
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
          <p className="mt-[22px] hidden max-w-[540px] text-[17px] leading-[1.6] text-white/75 lg:block">
            {t("lead")}
          </p>
          <div className="mt-[18px] lg:mt-[34px]">
            <SpeciesSearch shortcut="top" variant="hero" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 lg:mt-[22px] lg:items-center lg:gap-[22px]">
            <Link
              className={`inline-flex h-12 flex-auto items-center justify-center gap-2 rounded-full border border-white/30 px-3.5 text-[14px] font-medium whitespace-nowrap text-white transition-[translate,filter] hover:-translate-y-0.5 hover:brightness-110 lg:h-[52px] lg:flex-none lg:pr-6 lg:pl-[26px] lg:text-[15px] ${FOCUS_RING}`}
              href="/species"
            >
              {t("fullAtlas")}
              <ArrowUpRight
                aria-hidden="true"
                className="hidden size-[15px] lg:block"
              />
            </Link>
            <a
              className={`group inline-flex h-12 flex-auto items-center justify-center gap-2 rounded-full border border-white/30 px-3.5 text-[14px] font-medium whitespace-nowrap text-white transition-colors hover:text-white lg:h-auto lg:flex-none lg:gap-3 lg:border-0 lg:px-0 lg:text-white/85 ${FOCUS_RING}`}
              href="#groups"
            >
              <span className="hidden size-11 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:bg-white/10 lg:flex">
                <ArrowDown aria-hidden="true" className="size-4" />
              </span>
              {t("scrollToGroups")}
              <ArrowDown aria-hidden="true" className="size-[15px] lg:hidden" />
            </a>
          </div>
          <ul className="mt-[38px] hidden items-center gap-[26px] border-t border-white/12 pt-5 lg:flex">
            {statRow.map((stat, index) => (
              <li className="flex items-center gap-[26px]" key={stat.label}>
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="h-[18px] w-px bg-white/18"
                  />
                ) : null}
                <span className="flex items-baseline gap-2">
                  <span className="text-[26px] font-semibold text-white tabular-nums">
                    {format.number(stat.count)}
                  </span>
                  <span className="text-[13px] text-white/65">
                    {stat.label}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <label className="absolute top-[214px] right-4 z-20 flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-ink/60 text-white backdrop-blur-lg transition-colors hover:bg-ink/80 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#6fad88] motion-reduce:hidden lg:top-auto lg:right-[60px] lg:bottom-6">
        <input className="hero-wall-pause peer sr-only" type="checkbox" />
        <span className="sr-only">{t("pauseWall")}</span>
        <Pause aria-hidden="true" className="size-4 peer-checked:hidden" />
        <Play aria-hidden="true" className="hidden size-4 peer-checked:block" />
      </label>
    </section>
  );
}
