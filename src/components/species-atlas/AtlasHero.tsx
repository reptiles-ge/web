import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CoverImage } from "@/components/CoverImage";
import { images } from "@/data/species";
import { getAtlasStats } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";

type AtlasHeroProps = {
  stats: ReturnType<typeof getAtlasStats>;
};

export async function AtlasHero({ stats }: AtlasHeroProps) {
  const t = await getTranslations("speciesAtlas");

  return (
    <section
      className="relative flex min-h-[72svh] w-full flex-col justify-end overflow-hidden bg-ink pb-12 sm:pb-14 lg:min-h-[78svh] lg:pb-20"
      style={{
        paddingTop: "7rem",
      }}
    >
      <CoverImage
        alt={t("heroImageAlt")}
        className="object-cover"
        priority
        sizes="100vw"
        src={images.hero}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/40 to-black/92" />
      <div className="absolute inset-0 bg-[radial-gradient(95%_70%_at_50%_15%,transparent_20%,rgba(0,0,0,0.6)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-350 px-6 lg:px-10">
        <div>
          <nav aria-label="Breadcrumb" className="mb-5 sm:mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/55">
              <li>
                <Link className="transition-colors hover:text-white" href="/">
                  {t("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden="true" className="text-white/30">
                /
              </li>
              <li className="text-white/80">{t("breadcrumbSpecies")}</li>
            </ol>
          </nav>

          <p className="text-[11px] font-medium tracking-[0.32em] text-white/45 uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="text-balance-tight mt-3 max-w-4xl font-display text-[clamp(2rem,5.8vw,4.6rem)] leading-[1.05] font-semibold text-white sm:mt-4">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65 sm:mt-5 sm:text-[16px]">
            {t("subtitle")}
          </p>

          <div className="mt-10 max-w-4xl sm:mt-12">
            <div className="flex flex-wrap items-end gap-x-4 gap-y-2 border-b border-white/12 pb-5">
              <p className="font-display text-[clamp(3rem,8vw,4.75rem)] leading-none font-semibold tracking-tight text-white">
                {stats.total}
              </p>
              <div className="pb-1.5">
                <p className="text-[13px] font-medium text-white/80 sm:text-[14px]">
                  {t("stats.catalogTitle")}
                </p>
                <p className="mt-1 text-[12px] text-white/45">
                  {t("stats.catalogMeta", {
                    photos: stats.photos,
                    regions: stats.regions,
                  })}
                </p>
              </div>
            </div>

            <p className="mt-5 text-[11px] font-medium tracking-[0.28em] text-white/40 uppercase">
              {t("stats.pathwaysLabel")}
            </p>

            <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1 sm:mt-4 sm:flex-wrap sm:gap-3 sm:overflow-visible">
              <HeroPathway
                delay={0}
                eyebrow={t("groups.snake")}
                href="/snakes"
                meta={t("stats.pathwayExplore")}
                title={t("stats.pathwaySnakesTitle", {
                  count: stats.snakes,
                })}
              />
              <HeroPathway
                delay={60}
                eyebrow={t("stats.pathwayRisk")}
                href="/venomous-snakes"
                meta={t("stats.pathwayExplore")}
                title={t("stats.pathwayVenomousTitle", {
                  count: stats.venomous,
                })}
              />
              {stats.lizards > 0 ? (
                <HeroPathway
                  delay={120}
                  eyebrow={t("groups.lizard")}
                  href="/lizards"
                  meta={t("stats.pathwayExplore")}
                  title={t("stats.pathwayLizardsTitle", {
                    count: stats.lizards,
                  })}
                />
              ) : null}
              {stats.turtles > 0 ? (
                <HeroPathway
                  delay={180}
                  eyebrow={t("groups.turtle")}
                  href="/turtles"
                  meta={t("stats.pathwayExplore")}
                  title={t("stats.pathwayTurtlesTitle", {
                    count: stats.turtles,
                  })}
                />
              ) : null}
              {stats.amphibians > 0 ? (
                <HeroPathway
                  delay={240}
                  eyebrow={t("groups.amphibian")}
                  href="/amphibians"
                  meta={t("stats.pathwayExplore")}
                  title={t("stats.pathwayAmphibiansTitle", {
                    count: stats.amphibians,
                  })}
                />
              ) : null}
              {stats.birds > 0 ? (
                <HeroPathway
                  delay={260}
                  eyebrow={t("groups.bird")}
                  href="/birds"
                  meta={t("stats.pathwayExplore")}
                  title={t("stats.pathwayBirdsTitle", {
                    count: stats.birds,
                  })}
                />
              ) : null}
              {stats.mammals > 0 ? (
                <HeroPathway
                  delay={280}
                  eyebrow={t("groups.mammal")}
                  href="/mammals"
                  meta={t("stats.pathwayExplore")}
                  title={t("stats.pathwayMammalsTitle", {
                    count: stats.mammals,
                  })}
                />
              ) : null}
              {stats.spiders > 0 ? (
                <HeroPathway
                  delay={300}
                  eyebrow={t("groups.spider")}
                  href="/spiders"
                  meta={t("stats.pathwayExplore")}
                  title={t("stats.pathwaySpidersTitle", {
                    count: stats.spiders,
                  })}
                />
              ) : null}
              <Link
                className="group flex min-w-42 flex-1 flex-col items-start rounded-[22px] border border-white/10 bg-white/4 p-4 text-left backdrop-blur-md transition-[border-color,background-color] duration-300 hover:border-white/25 hover:bg-white/8 sm:min-w-48 sm:p-5"
                href="/regions"
              >
                <span className="text-[10px] font-medium tracking-[0.22em] text-white/40 uppercase">
                  {t("stats.pathwayPlace")}
                </span>
                <span className="mt-3 font-display text-[1.35rem] leading-tight font-semibold text-white sm:text-2xl">
                  {t("stats.pathwayRegionsTitle", {
                    count: stats.regions,
                  })}
                </span>
                <span className="mt-2 flex items-center gap-1.5 text-[13px] text-white/55 transition-colors group-hover:text-white/80">
                  {t("stats.pathwayMap")}
                  <ArrowUpRight className="size-3.5 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>

            <p className="mt-5 max-w-xl text-[13px] leading-relaxed text-white/40">
              {t("stats.expandingNote")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPathway({
  delay = 0,
  eyebrow,
  href,
  meta,
  onClick,
  title,
}: {
  delay?: number;
  eyebrow: string;
  href?:
    | "/amphibians"
    | "/birds"
    | "/lizards"
    | "/mammals"
    | "/snakes"
    | "/spiders"
    | "/turtles"
    | "/venomous-snakes";
  meta: string;
  onClick?: () => void;
  title: string;
}) {
  const className =
    "group flex min-w-[10.5rem] flex-1 flex-col items-start rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-left backdrop-blur-md transition-[border-color,background-color] duration-300 hover:border-white/25 hover:bg-white/[0.08] sm:min-w-[12rem] sm:px-5 sm:py-5";
  const style = { animationDelay: `${delay}ms` };
  const content = (
    <>
      <span className="text-[10px] font-medium tracking-[0.22em] text-white/40 uppercase">
        {eyebrow}
      </span>
      <span className="mt-3 font-display text-[1.35rem] leading-tight font-semibold text-white sm:text-2xl">
        {title}
      </span>
      <span className="mt-2 flex items-center gap-1.5 text-[13px] text-white/55 transition-colors group-hover:text-white/80">
        {meta}
        <ArrowUpRight className="size-3.5 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </>
  );

  if (href) {
    return (
      <Link className={className} href={href} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick} style={style} type="button">
      {content}
    </button>
  );
}
