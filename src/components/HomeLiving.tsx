import { getRecentlyUpdatedSpecies } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export async function HomeLiving() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home.living");
  const recent = getRecentlyUpdatedSpecies(4).map((item) =>
    localizeSpecies(item, locale),
  );

  return (
    <section id="living" className="bg-background py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h2 className="mt-5 font-display text-balance-tight text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05]">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
          >
            {t("aboutCta")}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {recent.map((species) => {
            const cover = species.mobileImage ?? species.image;
            return (
              <Link
                key={species.id}
                href={`/species/${species.id}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-ink">
                  <Image
                    src={cover}
                    alt={speciesImageAlt(
                      species.commonName,
                      species.scientificName,
                      species.location,
                    )}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[11px] italic text-white/55">
                      {species.scientificName}
                    </p>
                    <h3 className="mt-1 font-display text-[1.15rem] font-semibold leading-tight text-white">
                      {species.commonName}
                    </h3>
                    <p className="mt-2 text-[11px] tracking-wide text-white/45">
                      {t("updatedOn", {
                        date: formatContentDate(species.updatedAt, locale),
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 grid gap-8 border-t border-border pt-12 lg:mt-20 lg:grid-cols-3 lg:gap-12 lg:pt-16">
          <div>
            <h3 className="font-display text-[17px] font-semibold text-foreground">
              {t("methodTitle")}
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              {t("methodBody")}
            </p>
          </div>
          <div>
            <h3 className="font-display text-[17px] font-semibold text-foreground">
              {t("sourcesTitle")}
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              {t("sourcesBody")}
            </p>
          </div>
          <div>
            <h3 className="font-display text-[17px] font-semibold text-foreground">
              {t("photosTitle")}
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              {t("photosBody")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
