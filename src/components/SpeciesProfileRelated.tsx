import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { CoverImage } from "@/components/CoverImage";
import { TrackedSpeciesLink } from "@/components/home/TrackedSpeciesLink";
import { Link } from "@/i18n/navigation";
import { RELATED_CARD_SIZES } from "@/lib/imageSizes";
import { isPlaceholderMedia } from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type SpeciesProfileRelatedProps = {
  locale: AppLocale;
  related: Species[];
  variant?: "lookalikes" | "related";
};

export async function SpeciesProfileRelated({
  locale,
  related,
  variant = "related",
}: SpeciesProfileRelatedProps) {
  if (related.length === 0) {
    return null;
  }

  const t = await getTranslations("profile");
  const lookalikes = variant === "lookalikes";

  return (
    <section className="border-t border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
              {lookalikes ? t("lookalikes") : t("related")}
            </p>
            <AnchoredHeading
              anchorLabel={t("anchorLink")}
              className="mt-4 font-display text-display-title"
              id={
                lookalikes
                  ? SPECIES_SECTION_IDS.lookalikes
                  : SPECIES_SECTION_IDS.related
              }
            >
              {lookalikes ? t("lookalikesTitle") : t("relatedTitle")}
            </AnchoredHeading>
          </div>
          {lookalikes ? null : (
            <Link
              className="hidden items-center gap-1.5 text-[13px] font-medium text-primary sm:inline-flex"
              href="/species"
            >
              {t("allSpecies")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          )}
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item, relatedIndex) => (
            <SpeciesProfileRelatedCard
              item={item}
              key={item.id}
              locale={locale}
              position={relatedIndex + 1}
              source={lookalikes ? "lookalike" : "related"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function relatedCoverSrc(item: Species) {
  if (item.mobileImage && !isPlaceholderMedia(item.mobileImage)) {
    return item.mobileImage;
  }
  if (!isPlaceholderMedia(item.image)) {
    return item.image;
  }
  return null;
}

function SpeciesProfileRelatedCard({
  item,
  locale,
  position,
  source,
}: {
  item: Species;
  locale: AppLocale;
  position: number;
  source: "lookalike" | "related";
}) {
  const cover = relatedCoverSrc(item);

  return (
    <TrackedSpeciesLink
      className="group relative block aspect-4/5 overflow-hidden rounded-media bg-ink"
      locale={locale}
      position={position}
      source={source}
      speciesId={item.id}
    >
      {cover ? (
        <CoverImage
          alt={speciesImageAlt(
            item.commonName,
            item.scientificName,
            item.location,
          )}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes={RELATED_CARD_SIZES}
          src={cover}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.1),transparent_65%),linear-gradient(165deg,#24201c,#12100e)]"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[12px] text-white/50 italic">
          {item.scientificName}
        </p>
        <h3 className="mt-1 font-display text-[22px] font-semibold text-white">
          {item.commonName}
        </h3>
        <p className="mt-2 text-[12px] text-white/50">{item.location}</p>
      </div>
    </TrackedSpeciesLink>
  );
}
