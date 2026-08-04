import { images } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-ink pb-16 pt-28 sm:pb-20 lg:min-h-[92svh] lg:items-center lg:pb-24 lg:pt-32"
    >
      <div className="absolute inset-0">
        <Image
          src={images.hero}
          alt={t("imageAlt")}
          fill
          preload
          sizes="100vw"
          className="object-cover object-[center_35%] scale-105 hero-drift"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/30 to-black/88" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_18%,transparent_20%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col px-6 lg:px-10">
        <p className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-none tracking-tight text-white">
          {t("brand")}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-balance-tight text-[clamp(1.55rem,3.8vw,2.75rem)] font-semibold leading-[1.12] text-white/95 sm:mt-6">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-xl text-balance-tight text-[15px] leading-relaxed text-white/65 sm:mt-5 sm:text-[16px]">
          {t("subtitle")}
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
          <Link
            href="/species"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink transition-transform duration-300 hover:scale-[1.02]"
          >
            {t("viewSpecies")}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/regions"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-[14px] font-medium text-white/90 backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white/10"
          >
            {t("exploreRegions")}
          </Link>
        </div>
      </div>
    </section>
  );
}
