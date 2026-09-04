"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  CLUSTER_HERO_BODY,
  CLUSTER_HERO_EYEBROW,
  CLUSTER_HERO_TITLE,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";

export function VenomousSnakesCta({ heroSrc }: { heroSrc: string }) {
  const t = useTranslations("venomousSnakes");

  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden bg-ink py-24">
      <CoverImage
        alt=""
        aria-hidden
        className="object-cover opacity-50"
        sizes="100vw"
        src={heroSrc}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/60 to-black/88" />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-10">
        <div>
          <ClusterSectionIntro
            body={t("ctaBody")}
            bodyClassName={CLUSTER_HERO_BODY}
            eyebrow={t("ctaEyebrow")}
            eyebrowClassName={CLUSTER_HERO_EYEBROW}
            title={t("ctaTitle")}
            titleClassName={CLUSTER_HERO_TITLE}
          />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink transition-opacity hover:opacity-90"
              href="/species"
            >
              {t("ctaAllSpecies")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-medium text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
              href="/regions"
            >
              {t("ctaRegions")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
