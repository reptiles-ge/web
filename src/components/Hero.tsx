import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CoverImage } from "@/components/CoverImage";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { images } from "@/data/species";
import { getAtlasStats } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";

export async function Hero() {
  const t = await getTranslations("hero");
  const tProof = await getTranslations("home.proof");
  const stats = getAtlasStats();

  return (
    <section
      className="relative flex min-h-136 w-full items-end overflow-hidden bg-ink pt-28 pb-12 sm:min-h-152 sm:pb-16 lg:h-[88svh] lg:max-h-216 lg:items-end lg:pt-32 lg:pb-20"
      id="top"
    >
      <CoverImagePreload sizes="100vw" src={images.hero} />
      <div className="absolute inset-0">
        <CoverImage
          alt={t("imageAlt")}
          className="hero-drift scale-105 object-cover object-[center_35%]"
          priority
          sizes="100vw"
          src={images.hero}
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/25" />
      <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col px-6 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.28em] text-white/55 uppercase">
          {t("kicker")}
        </p>
        <h1 className="text-balance-tight mt-4 max-w-3xl font-display text-display-lead font-semibold text-white">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/68 sm:mt-5 sm:text-[16px]">
          {t("subtitle")}
        </p>
        <p className="mt-5 text-[12px] tracking-[0.04em] text-white/45">
          <span className="text-white/70 tabular-nums">{stats.total}</span>
          {` ${tProof("species")}`}
          <span aria-hidden="true" className="mx-2.5 text-white/25">
            ·
          </span>
          <span className="text-white/70 tabular-nums">{stats.regions}</span>
          {` ${tProof("regions")}`}
          <span aria-hidden="true" className="mx-2.5 text-white/25">
            ·
          </span>
          <span className="text-white/70 tabular-nums">{stats.photos}</span>
          {` ${tProof("photos")}`}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[14px] font-medium text-ink transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none motion-safe:hover:scale-[1.02]"
            href="/species"
          >
            {t("viewSpecies")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3 text-[14px] font-medium text-white/90 transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            href="/regions"
          >
            {t("exploreRegions")}
          </Link>
        </div>
      </div>
    </section>
  );
}
