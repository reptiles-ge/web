import { CoverImage } from "@/components/CoverImage";
import { images } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function FinalCTA() {
  const t = await getTranslations("cta");

  return (
    <section className="relative flex min-h-112 items-end overflow-hidden bg-ink sm:min-h-128 lg:min-h-152">
      <CoverImage
        src={images.cta}
        alt={t("imageAlt")}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/88 via-black/45 to-black/25" />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
        <p className="text-[11px] font-medium tracking-[0.28em] text-white/45 uppercase">
          {t("eyebrow")}
        </p>
        <h2 className="text-balance-tight mt-4 max-w-2xl font-display text-[clamp(1.7rem,3.6vw,2.75rem)] leading-[1.1] font-semibold text-white">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
          {t("subtitle")}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/species"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[14px] font-medium text-ink transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none motion-safe:hover:scale-[1.02]"
          >
            {t("button")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/venomous-snakes"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3 text-[14px] font-medium text-white/90 transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
          >
            {t("secondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
