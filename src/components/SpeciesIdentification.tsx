import { ChevronDown, TriangleAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { DangerLevel } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { TrackedSpeciesLink } from "@/components/home/TrackedSpeciesLink";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { GalleryPhotoFigcaption } from "@/components/SpeciesGallery";
import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { SpeciesLookalikeList } from "@/components/SpeciesLookalikeList";
import {
  optimizedEntry,
  optimizedImgSrc,
  pictureSources,
} from "@/data/optimizedImages";
import {
  type GalleryImage,
  type SpeciesIdentification as Identification,
  type Species,
} from "@/data/speciesTypes";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
import { cn } from "@/lib/cn";
import { dangerLevelTone } from "@/lib/dangerLevels";
import { IDENTIFICATION_PHOTO_SIZES } from "@/lib/imageSizes";
import { getSpeciesCoverSrc } from "@/lib/speciesContent";
import { splitSpeciesInlineLinks } from "@/lib/speciesInlineLinks";
import { getSpeciesRiskChip } from "@/lib/speciesRisk";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type SpeciesIdentificationProps = {
  identification: Identification;
  locale: AppLocale;
  lookalikes?: Species[];
  name: string;
  photo?: GalleryImage | null;
  photoAlt?: string;
  speciesId: string;
};

const inlineSpeciesLinkClassName =
  "font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary";
const LOOKALIKE_COVER_SIZES = "(max-width: 1023px) 264px, 420px";
const TRAITS_VISIBLE_COUNT = 3;

export async function SpeciesIdentification({
  identification,
  locale,
  lookalikes = [],
  name,
  photo,
  photoAlt,
  speciesId,
}: SpeciesIdentificationProps) {
  const [t, tDanger] = await Promise.all([
    getTranslations({ locale, namespace: "profile" }),
    getTranslations({ locale, namespace: "danger" }),
  ]);
  const editable = locale === "ka" && isLocalAdminEnabled();

  if (speciesId === "macrovipera-lebetina" && photo) {
    const tGiurza = await getTranslations({
      locale,
      namespace: "giurzaIdentification",
    });
    const colors = [
      { key: "gray", tone: "#8f8c82" },
      { key: "sand", tone: "#c4ab7e" },
      { key: "brown", tone: "#7d5f43" },
    ] as const;

    return (
      <section className="bg-background py-11 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-6 lg:grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-start lg:gap-x-16 lg:px-[60px]">
          <div className="min-w-0 lg:col-start-2 lg:row-start-1 lg:self-end">
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("identification")}
            </p>
            <AnchoredHeading
              anchorLabel={t("anchorLink")}
              className="mt-3 max-w-3xl font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] lg:mt-4 lg:text-[44px] lg:leading-[1.1]"
              id={SPECIES_SECTION_IDS.identification}
              slugSource={t("identificationTitle", { name })}
            >
              {t("identificationTitle", { name })}
            </AnchoredHeading>
            <p
              className="mt-3 max-w-2xl text-[16px] leading-[1.65] whitespace-pre-line text-muted-foreground lg:mt-[18px]"
              data-content-field={
                editable ? "identification.summary" : undefined
              }
              data-content-id={editable ? speciesId : undefined}
              data-content-kind={editable ? "species" : undefined}
            >
              <IdentificationRichText text={identification.summary} />
            </p>
          </div>
          <SpeciesIdentificationPhoto
            alt={photoAlt ?? name}
            featured
            locale={locale}
            photo={photo}
          />
          <div className="min-w-0 lg:col-start-2 lg:row-start-2 lg:self-start">
            <ol className="mt-6 lg:mt-[22px]">
              {identification.traits.map((trait, index) => (
                <li
                  className="flex items-start gap-4 border-t border-border py-4 last:border-b lg:py-5"
                  key={trait}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-[14px] font-bold text-background"
                  >
                    {index + 1}
                  </span>
                  <p
                    className="min-w-0 text-[16px] leading-[1.65] whitespace-pre-line text-foreground/85"
                    data-content-field={
                      editable ? `identification.traits.${index}` : undefined
                    }
                    data-content-id={editable ? speciesId : undefined}
                    data-content-kind={editable ? "species" : undefined}
                  >
                    <IdentificationRichText text={trait} />
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {tGiurza("color")}
              </span>
              {colors.map(({ key, tone }) => (
                <span
                  className="inline-flex h-[34px] items-center gap-2 rounded-full bg-card pr-[13px] pl-[9px] text-[13.5px] font-medium text-foreground"
                  key={key}
                >
                  <span
                    aria-hidden="true"
                    className="size-4 rounded-full"
                    style={{ backgroundColor: tone }}
                  />
                  {tGiurza(key)}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-[22px] bg-[#f3ecd9] px-5 py-4">
              <TriangleAlert
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-[#7d6224]"
              />
              <p className="text-[14.5px] leading-[1.55] text-[#4f3f17]">
                {tGiurza("warning")}
              </p>
            </div>
          </div>
        </div>
        <SpeciesIdentificationLookalikes
          countLabel={tGiurza("lookalikeCount", { count: lookalikes.length })}
          differenceLabel={tGiurza("differenceLabel")}
          differences={{
            "elaphe-urartica": tGiurza("urarticaDifference"),
            "hemorrhois-ravergieri": tGiurza("ravergieriDifference"),
            "vipera-transcaucasiana": tGiurza("transcaucasianaDifference"),
          }}
          label={t("lookalikesTitle")}
          locale={locale}
          lookalikes={lookalikes}
          moreLabel={(count) => t("lookalikesMore", { count })}
          riskLabels={{
            Harmless: tDanger("Harmless"),
            High: tDanger("High"),
            Moderate: tDanger("Moderate"),
          }}
          speciesId={speciesId}
        />
      </section>
    );
  }

  return (
    <section className="bg-background py-11 lg:py-20">
      <div
        className={cn(
          "mx-auto max-w-[1440px] px-6 lg:px-[60px]",
          photo &&
            "lg:grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-x-16",
        )}
      >
        <div className="min-w-0 lg:col-start-2 lg:row-start-1 lg:self-end">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {t("identification")}
          </p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className="mt-3 max-w-3xl font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] lg:mt-4 lg:text-[44px] lg:leading-[1.1]"
            id={SPECIES_SECTION_IDS.identification}
            slugSource={t("identificationTitle", { name })}
          >
            {t("identificationTitle", { name })}
          </AnchoredHeading>
          <p
            className="mt-3 max-w-2xl text-[15px] leading-[1.6] whitespace-pre-line text-muted-foreground lg:mt-[18px] lg:text-[16px] lg:leading-[1.65]"
            data-content-field={editable ? "identification.summary" : undefined}
            data-content-id={editable ? speciesId : undefined}
            data-content-kind={editable ? "species" : undefined}
          >
            <IdentificationRichText text={identification.summary} />
          </p>
        </div>
        {photo ? (
          <SpeciesIdentificationPhoto
            alt={photoAlt ?? name}
            locale={locale}
            photo={photo}
          />
        ) : null}
        {identification.traits.length > 0 ? (
          <div className="mt-3 min-w-0 rounded-[28px] bg-card px-5 py-1 shadow-[0_14px_36px_rgba(14,20,17,0.06)] lg:col-start-2 lg:row-start-2 lg:mt-6 lg:self-start lg:rounded-[32px] lg:px-7 lg:py-2">
            <IdentificationTraits
              editable={editable}
              offset={0}
              speciesId={speciesId}
              traits={identification.traits.slice(0, TRAITS_VISIBLE_COUNT)}
            />
            {identification.traits.length > TRAITS_VISIBLE_COUNT ? (
              <details className="group border-t border-border">
                <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 text-[14.5px] font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">{t("readMore")}</span>
                  <span className="hidden group-open:inline">
                    {t("readLess")}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 transition-transform group-open:rotate-180"
                  />
                </summary>
                <IdentificationTraits
                  editable={editable}
                  offset={TRAITS_VISIBLE_COUNT}
                  speciesId={speciesId}
                  traits={identification.traits.slice(TRAITS_VISIBLE_COUNT)}
                />
              </details>
            ) : null}
          </div>
        ) : null}
      </div>
      <SpeciesIdentificationLookalikes
        label={t("lookalikesTitle")}
        locale={locale}
        lookalikes={lookalikes}
        moreLabel={(count) => t("lookalikesMore", { count })}
        riskLabels={{
          Harmless: tDanger("Harmless"),
          High: tDanger("High"),
          Moderate: tDanger("Moderate"),
        }}
        speciesId={speciesId}
      />
    </section>
  );
}

function IdentificationRichText({ text }: { text: string }) {
  const parts = splitSpeciesInlineLinks(text);

  return (
    <>
      {parts.map((part) =>
        part.type === "text" ? (
          <PhoneLinkedText key={part.key}>{part.value}</PhoneLinkedText>
        ) : (
          <SpeciesInlineLink
            className={inlineSpeciesLinkClassName}
            id={part.id}
            key={part.key}
            source="identification"
          >
            {part.label}
          </SpeciesInlineLink>
        ),
      )}
    </>
  );
}

function IdentificationTraits({
  editable,
  offset,
  speciesId,
  traits,
}: {
  editable: boolean;
  offset: number;
  speciesId: string;
  traits: string[];
}) {
  return (
    <ol start={offset + 1}>
      {traits.map((trait, index) => (
        <li
          className="flex items-start gap-3.5 border-t border-border py-4 first:border-t-0 lg:gap-4 lg:py-5"
          key={trait}
        >
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[13px] font-bold text-background tabular-nums lg:size-8 lg:text-[14px]"
          >
            {offset + index + 1}
          </span>
          <p
            className="min-w-0 text-[14.5px] leading-[1.6] whitespace-pre-line text-foreground/85 lg:text-[16px] lg:leading-[1.65]"
            data-content-field={
              editable ? `identification.traits.${offset + index}` : undefined
            }
            data-content-id={editable ? speciesId : undefined}
            data-content-kind={editable ? "species" : undefined}
          >
            <IdentificationRichText text={trait} />
          </p>
        </li>
      ))}
    </ol>
  );
}

const LOOKALIKES_COLLAPSED_COUNT = 3;

function SpeciesIdentificationLookalikes({
  countLabel,
  differenceLabel,
  differences,
  label,
  locale,
  lookalikes,
  moreLabel,
  riskLabels,
  speciesId,
}: {
  countLabel?: string;
  differenceLabel?: string;
  differences?: Record<string, string>;
  label: string;
  locale: AppLocale;
  lookalikes: Species[];
  moreLabel: (count: number) => string;
  riskLabels: Record<DangerLevel, string>;
  speciesId: string;
}) {
  if (lookalikes.length === 0) return null;

  const labelId = `${SPECIES_SECTION_IDS.lookalikes}-label`;
  const visibleCount =
    lookalikes.length > LOOKALIKES_COLLAPSED_COUNT + 1
      ? LOOKALIKES_COLLAPSED_COUNT
      : lookalikes.length;

  return (
    <div
      className="mx-auto mt-8 max-w-[1440px] px-6 lg:mt-[72px] lg:px-[60px]"
      id={SPECIES_SECTION_IDS.lookalikes}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3
          className="font-display text-[21px] leading-tight font-semibold text-foreground lg:text-[28px]"
          id={labelId}
        >
          {label}
        </h3>
        {countLabel ? (
          <span className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {countLabel}
          </span>
        ) : null}
      </div>
      <SpeciesLookalikeList
        items={lookalikes.map((item, index) => ({
          id: item.id,
          node: (
            <SpeciesLookalikeCard
              difference={differences?.[item.id]}
              differenceLabel={differenceLabel}
              item={item}
              locale={locale}
              position={index + 1}
              riskLabels={riskLabels}
            />
          ),
        }))}
        labelledBy={labelId}
        moreLabel={moreLabel(lookalikes.length - visibleCount)}
        speciesId={speciesId}
        visibleCount={visibleCount}
      />
    </div>
  );
}

function SpeciesIdentificationPhoto({
  alt,
  featured = false,
  locale,
  photo,
}: {
  alt: string;
  featured?: boolean;
  locale: AppLocale;
  photo: GalleryImage;
}) {
  const entry = optimizedEntry(photo.src);
  const portrait = Boolean(entry && entry.height > entry.width);

  return (
    <figure
      className={cn(
        "mt-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-0",
        featured ? "lg:self-start" : "lg:sticky lg:top-36 lg:self-start",
      )}
    >
      <a
        className={cn(
          "group relative block cursor-zoom-in overflow-hidden rounded-[28px] bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:rounded-[36px]",
          featured
            ? "aspect-4/5 sm:aspect-4/3 lg:aspect-auto lg:h-[690px]"
            : cn(
                "max-h-[calc(100svh-13rem)]",
                portrait ? "aspect-3/4" : "aspect-4/3",
              ),
        )}
        data-species-gallery-src={optimizedImgSrc(photo.src, 1200)}
        href={`#${SPECIES_SECTION_IDS.gallery}`}
      >
        <picture className="media-placeholder absolute inset-0 block size-full">
          {pictureSources(photo.src, { sizes: IDENTIFICATION_PHOTO_SIZES }).map(
            (source) => (
              <source key={source.key} {...source.props} />
            ),
          )}
          <img
            alt={alt}
            className="absolute inset-0 size-full object-cover text-transparent transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
            decoding="async"
            height={entry?.height}
            loading="lazy"
            sizes={IDENTIFICATION_PHOTO_SIZES}
            src={optimizedImgSrc(photo.src, 800)}
            width={entry?.width}
          />
        </picture>
        {featured && photo.credit ? (
          <span className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-ink/75 px-3 py-1.5 text-[11.5px] text-white">
            {photo.credit.photographer}
            {photo.credit.location ? ` · ${photo.credit.location}` : ""}
            {photo.credit.date ? ` · ${photo.credit.date.slice(0, 4)}` : ""}
          </span>
        ) : null}
      </a>
      {featured ? null : (
        <GalleryPhotoFigcaption locale={locale} photo={photo} />
      )}
    </figure>
  );
}

function SpeciesLookalikeCard({
  difference,
  differenceLabel,
  item,
  locale,
  position,
  riskLabels,
}: {
  difference?: string;
  differenceLabel?: string;
  item: Species;
  locale: AppLocale;
  position: number;
  riskLabels: Record<DangerLevel, string>;
}) {
  const cover = getSpeciesCoverSrc(item);
  const risk = getSpeciesRiskChip(item);

  return (
    <TrackedSpeciesLink
      className="group block h-full rounded-[26px] bg-card p-2 pb-4 shadow-[0_14px_36px_rgba(14,20,17,0.06)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:rounded-[30px] lg:p-3 lg:pb-[22px]"
      locale={locale}
      position={position}
      source="lookalike"
      speciesId={item.id}
    >
      <span className="relative block h-[164px] overflow-hidden rounded-[19px] bg-ink lg:aspect-3/2 lg:h-auto lg:rounded-[20px]">
        {cover ? (
          <picture>
            {pictureSources(cover, { sizes: LOOKALIKE_COVER_SIZES }).map(
              (source) => (
                <source key={source.key} {...source.props} />
              ),
            )}
            <img
              alt=""
              className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
              decoding="async"
              loading="lazy"
              sizes={LOOKALIKE_COVER_SIZES}
              src={optimizedImgSrc(cover, 800)}
            />
          </picture>
        ) : null}
        {risk ? (
          <span className="absolute top-2.5 left-2.5 inline-flex h-[26px] items-center gap-1.5 rounded-full bg-white px-2.5 text-[11.5px] font-medium text-[#1a211c] shadow-[0_2px_8px_rgba(14,20,17,0.18)] lg:top-3 lg:left-3 lg:h-7 lg:text-[12px]">
            <span
              aria-hidden="true"
              className={cn(
                "size-[7px] rounded-full",
                dangerLevelTone(risk.level).dot,
              )}
            />
            {riskLabels[risk.level]}
          </span>
        ) : null}
      </span>
      <span className="mt-3 block px-2 font-display text-[17px] leading-tight font-semibold text-foreground lg:mt-4 lg:text-[19px]">
        {item.commonName}
      </span>
      <span className="mt-0.5 block px-2 text-[12.5px] text-muted-foreground italic lg:text-[13.5px]">
        {item.scientificName}
      </span>
      {difference ? (
        <span className="mx-2 mt-3.5 block border-t border-border pt-3">
          <span className="block text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {differenceLabel}
          </span>
          <span className="mt-1.5 block text-[14.5px] leading-normal text-foreground">
            {difference}
          </span>
        </span>
      ) : null}
    </TrackedSpeciesLink>
  );
}
