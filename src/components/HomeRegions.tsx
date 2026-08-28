import { CoverImage } from "@/components/CoverImage";
import {
  localizeRegionText,
  regions,
  type Region,
} from "@/data/regions";
import { getRegionHeroImage } from "@/data/regionImages";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { regionHref } from "@/lib/speciesRoutes";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

const FEATURED_REGION_IDS = ["adjara", "kakheti", "mtskheta-mtianeti"] as const;

function pickFeaturedRegions(): Region[] {
  return FEATURED_REGION_IDS.map(
    (id) => regions.find((region) => region.id === id)!,
  ).filter(Boolean);
}

export async function HomeRegions() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home.regions");
  const tMap = await getTranslations("map");
  const featured = pickFeaturedRegions();

  return (
    <section className="bg-background pt-20 pb-24 lg:pt-28 lg:pb-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h2 className="mt-5 font-display text-balance-tight text-[clamp(1.65rem,3.2vw,2.35rem)] font-semibold leading-[1.1]">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/regions"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
          >
            {tMap("allRegions")}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3 lg:mt-16">
          {featured.map((region) => {
            const name = localizeRegionText(region.name, locale);
            const description = localizeRegionText(region.description, locale);
            return (
              <Link
                key={region.id}
                href={regionHref(region.id)}
                className="group relative block overflow-hidden rounded-[24px] bg-ink"
              >
                <div className="relative aspect-[5/6] sm:aspect-[4/5]">
                  <Image
                    src={getRegionHeroImage(region.id)}
                    alt={t("imageAlt", { name })}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
                      {tMap("speciesCount", {
                        count: region.speciesIds.length,
                      })}
                    </p>
                    <h3 className="mt-2 font-display text-[1.35rem] font-semibold leading-tight text-white">
                      {name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/60">
                      {description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
