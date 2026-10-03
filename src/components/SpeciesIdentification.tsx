import { getTranslations } from "next-intl/server";

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
import { IDENTIFICATION_PHOTO_SIZES } from "@/lib/imageSizes";
import { getSpeciesCoverSrc } from "@/lib/speciesContent";
import { splitSpeciesInlineLinks } from "@/lib/speciesInlineLinks";
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

export async function SpeciesIdentification({
  identification,
  locale,
  lookalikes = [],
  name,
  photo,
  photoAlt,
  speciesId,
}: SpeciesIdentificationProps) {
  const t = await getTranslations({ locale, namespace: "profile" });
  const editable = locale === "ka" && isLocalAdminEnabled();

  return (
    <section className="bg-background py-20 lg:py-28">
      <div
        className={cn(
          "mx-auto max-w-[1400px] px-6 lg:px-10",
          photo &&
            "lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_28rem] xl:gap-16 2xl:grid-cols-[minmax(0,1fr)_32rem] 2xl:gap-20",
        )}
      >
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {t("identification")}
          </p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className="mt-5 max-w-3xl font-display text-display-title font-bold"
            id={SPECIES_SECTION_IDS.identification}
            slugSource={t("identificationTitle", { name })}
          >
            {t("identificationTitle", { name })}
          </AnchoredHeading>
          <p
            className="mt-5 max-w-2xl text-[15px] leading-relaxed whitespace-pre-line text-muted-foreground sm:text-[16px]"
            data-content-field={editable ? "identification.summary" : undefined}
            data-content-id={editable ? speciesId : undefined}
            data-content-kind={editable ? "species" : undefined}
          >
            <IdentificationRichText text={identification.summary} />
          </p>
          <SpeciesIdentificationLookalikes
            label={t("lookalikesTitle")}
            locale={locale}
            lookalikes={lookalikes}
            moreLabel={(count) => t("lookalikesMore", { count })}
            speciesId={speciesId}
          />

          {identification.traits.length > 0 ? (
            <ol className="mt-12 space-y-0">
              {identification.traits.map((trait, index) => (
                <li
                  className="grid grid-cols-[auto_1fr] gap-6 border-t border-border py-7 lg:gap-10 lg:py-9"
                  key={trait}
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-[28px] font-light text-muted-foreground lg:text-[36px]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="max-w-2xl self-center text-[16px] leading-relaxed whitespace-pre-line text-foreground/85 sm:text-[18px]"
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
          ) : null}
        </div>
        {photo ? (
          <SpeciesIdentificationPhoto
            alt={photoAlt ?? name}
            locale={locale}
            photo={photo}
          />
        ) : null}
      </div>
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

const LOOKALIKES_COLLAPSED_COUNT = 3;

function SpeciesIdentificationLookalikes({
  label,
  locale,
  lookalikes,
  moreLabel,
  speciesId,
}: {
  label: string;
  locale: AppLocale;
  lookalikes: Species[];
  moreLabel: (count: number) => string;
  speciesId: string;
}) {
  if (lookalikes.length === 0) return null;

  const labelId = `${SPECIES_SECTION_IDS.lookalikes}-label`;
  const visibleCount =
    lookalikes.length > LOOKALIKES_COLLAPSED_COUNT + 1
      ? LOOKALIKES_COLLAPSED_COUNT
      : lookalikes.length;

  return (
    <div className="mt-8" id={SPECIES_SECTION_IDS.lookalikes}>
      <p className="text-[13px] font-medium text-foreground" id={labelId}>
        {label}
      </p>
      <SpeciesLookalikeList
        items={lookalikes.map((item, index) => ({
          id: item.id,
          node: (
            <SpeciesLookalikeChip
              item={item}
              locale={locale}
              position={index + 1}
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
  locale,
  photo,
}: {
  alt: string;
  locale: AppLocale;
  photo: GalleryImage;
}) {
  const entry = optimizedEntry(photo.src);
  const portrait = Boolean(entry && entry.height > entry.width);

  return (
    <figure className="hidden lg:sticky lg:top-36 lg:block lg:self-start">
      <a
        className={cn(
          "group relative block max-h-[calc(100svh-13rem)] cursor-zoom-in overflow-hidden rounded-card bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
          portrait ? "aspect-4/5" : "aspect-4/3",
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
      </a>
      <GalleryPhotoFigcaption locale={locale} photo={photo} />
    </figure>
  );
}

function SpeciesLookalikeChip({
  item,
  locale,
  position,
}: {
  item: Species;
  locale: AppLocale;
  position: number;
}) {
  const cover = getSpeciesCoverSrc(item);

  return (
    <TrackedSpeciesLink
      className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pr-4 pl-1.5 text-[14px] font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      locale={locale}
      position={position}
      source="lookalike"
      speciesId={item.id}
    >
      <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-surface">
        {cover ? (
          <picture>
            {pictureSources(cover, { sizes: "32px" }).map((source) => (
              <source key={source.key} {...source.props} />
            ))}
            <img
              alt=""
              className="size-full object-cover"
              decoding="async"
              loading="lazy"
              sizes="32px"
              src={optimizedImgSrc(cover, 400)}
            />
          </picture>
        ) : null}
      </span>
      {item.commonName}
    </TrackedSpeciesLink>
  );
}
