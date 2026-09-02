import { CoverImage } from "@/components/CoverImage";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { getAtlasStats } from "@/data/speciesAtlas";
import { images } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Hero() {
  const t = await getTranslations("hero");
  const tProof = await getTranslations("home.proof");
  const stats = getAtlasStats();

  return (
    <section
      id="top"
      className="relative flex min-h-[34rem] w-full items-end overflow-hidden bg-ink pb-12 pt-28 sm:min-h-[38rem] sm:pb-16 lg:h-[88svh] lg:max-h-[54rem] lg:items-end lg:pb-20 lg:pt-32"
    >
      <CoverImagePreload src={images.hero} sizes="100vw" />
      <div className="absolute inset-0">
        <CoverImage
          src={images.hero}
          alt={t("imageAlt")}
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] scale-105 hero-drift"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col px-6 lg:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">
          {t("kicker")}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-balance-tight text-[clamp(1.7rem,4.2vw,3.15rem)] font-semibold leading-[1.12] text-white">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/68 sm:mt-5 sm:text-[16px]">
          {t("subtitle")}
        </p>
        <p className="mt-5 text-[12px] tracking-[0.04em] text-white/45">
          <span className="tabular-nums text-white/70">{stats.total}</span>
          {` ${tProof("species")}`}
          <span aria-hidden="true" className="mx-2.5 text-white/25">
            ·
          </span>
          <span className="tabular-nums text-white/70">{stats.regions}</span>
          {` ${tProof("regions")}`}
          <span aria-hidden="true" className="mx-2.5 text-white/25">
            ·
          </span>
          <span className="tabular-nums text-white/70">{stats.photos}</span>
          {` ${tProof("photos")}`}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
          <Link
            href="/species"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[14px] font-medium text-ink transition-transform duration-300 motion-safe:hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {t("viewSpecies")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/regions"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3 text-[14px] font-medium text-white/90 transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {t("exploreRegions")}
          </Link>
        </div>
      </div>
    </section>
  );
}
