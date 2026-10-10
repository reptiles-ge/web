import { TriangleAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { DangerLevel } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { TrackedSpeciesLink } from "@/components/home/TrackedSpeciesLink";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { SpeciesLookalikeList } from "@/components/SpeciesLookalikeList";
import {
  creditAuthorName,
  getPublishedCreditAuthorByName,
} from "@/data/creditAuthors";
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
import { SPECIES_COLOR_TONES } from "@/lib/speciesColors";
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
const SECTION_CLASS_NAME = "bg-background pt-9 pb-10 lg:py-20";
const LAYOUT_CLASS_NAME = "mx-auto max-w-[1440px] px-4 lg:px-[60px]";
const PHOTO_LAYOUT_CLASS_NAME =
  "lg:grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:grid-rows-[1fr_auto_auto_auto_1fr] lg:gap-x-16";
const INTRO_CLASS_NAME = "min-w-0 px-2 lg:col-start-2 lg:row-start-2 lg:px-0";
const SUMMARY_CLASS_NAME =
  "mt-3 max-w-[620px] text-[17px] leading-[1.6] whitespace-pre-line text-muted-foreground lg:mt-[18px] lg:text-[16px] lg:leading-[1.65]";
const COLORS_CARD_CLASS_NAME =
  "mt-2 rounded-[22px] bg-card px-5 py-[18px] shadow-[0_1px_2px_rgba(14,20,17,0.04)] lg:mt-5 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none";
const COLORS_LABEL_CLASS_NAME =
  "block text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase lg:mr-1.5";
const COLOR_CHIPS_CLASS_NAME = "mt-2.5 flex flex-wrap gap-1.5 lg:contents";
const COLOR_CHIP_CLASS_NAME =
  "inline-flex h-[30px] items-center gap-[7px] rounded-full bg-background pr-[11px] pl-2 text-[12.5px] font-medium text-foreground lg:h-[34px] lg:gap-2 lg:bg-card lg:pr-[13px] lg:pl-[9px] lg:text-[13.5px]";

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
    return (
      <GiurzaIdentification
        identification={identification}
        locale={locale}
        lookalikes={lookalikes}
        name={name}
        photo={photo}
        photoAlt={photoAlt}
        speciesId={speciesId}
      />
    );
  }

  return (
    <section className={SECTION_CLASS_NAME}>
      <div className={cn(LAYOUT_CLASS_NAME, photo && PHOTO_LAYOUT_CLASS_NAME)}>
        <IdentificationIntro
          anchorLabel={t("anchorLink")}
          editable={editable}
          eyebrow={t("identification")}
          speciesId={speciesId}
          summary={identification.summary}
          title={t("identificationTitle", { name })}
        />
        {photo ? (
          <SpeciesIdentificationPhoto
            alt={photoAlt ?? name}
            locale={locale}
            photo={photo}
          />
        ) : null}
        {identification.traits.length > 0 ? (
          <IdentificationTraits
            editable={editable}
            speciesId={speciesId}
            traits={identification.traits}
          />
        ) : null}
        <div className="min-w-0 lg:col-start-2 lg:row-start-4">
          <SpeciesIdentificationColors
            identification={identification}
            locale={locale}
            speciesId={speciesId}
          />
        </div>
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
  speciesId,
  traits,
}: {
  editable: boolean;
  speciesId: string;
  traits: string[];
}) {
  return (
    <ol className="mt-3 min-w-0 rounded-[28px] bg-card px-5 pt-1 pb-1.5 shadow-[0_1px_2px_rgba(14,20,17,0.04),0_14px_36px_rgba(14,20,17,0.06)] lg:col-start-2 lg:row-start-3 lg:mt-[22px] lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
      {traits.map((trait, index) => (
        <li
          className="flex items-start gap-3.5 border-t border-border py-3.5 first:border-t-0 lg:gap-4 lg:py-4 lg:first:border-t lg:last:border-b"
          key={trait}
        >
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[13px] font-bold text-background tabular-nums lg:size-8 lg:text-[14px]"
          >
            {index + 1}
          </span>
          <p
            className="min-w-0 text-[17px] leading-[1.6] whitespace-pre-line text-foreground/85 lg:text-[16px] lg:leading-[1.65]"
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
  );
}

const LOOKALIKES_COLLAPSED_COUNT = 3;

async function GiurzaIdentification({
  identification,
  locale,
  lookalikes = [],
  name,
  photo,
  photoAlt,
  speciesId,
}: SpeciesIdentificationProps & { photo: GalleryImage }) {
  const [t, tDanger] = await Promise.all([
    getTranslations({ locale, namespace: "profile" }),
    getTranslations({ locale, namespace: "danger" }),
  ]);
  const editable = locale === "ka" && isLocalAdminEnabled();
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
    <section className={SECTION_CLASS_NAME}>
      <div className={cn(LAYOUT_CLASS_NAME, PHOTO_LAYOUT_CLASS_NAME)}>
        <IdentificationIntro
          anchorLabel={t("anchorLink")}
          editable={editable}
          eyebrow={t("identification")}
          speciesId={speciesId}
          summary={identification.summary}
          title={t("identificationTitle", { name })}
        />
        <SpeciesIdentificationPhoto
          alt={photoAlt ?? name}
          locale={locale}
          photo={photo}
        />
        <IdentificationTraits
          editable={editable}
          speciesId={speciesId}
          traits={identification.traits}
        />
        <div className="min-w-0 lg:col-start-2 lg:row-start-4">
          {identification.colors?.length ||
          identification.coloration?.trim() ? (
            <SpeciesIdentificationColors
              identification={identification}
              locale={locale}
              speciesId={speciesId}
            />
          ) : (
            <div className={COLORS_CARD_CLASS_NAME}>
              <div className="lg:flex lg:flex-wrap lg:items-center lg:gap-2">
                <span className={COLORS_LABEL_CLASS_NAME}>
                  {tGiurza("color")}
                </span>
                <div className={COLOR_CHIPS_CLASS_NAME}>
                  {colors.map(({ key, tone }) => (
                    <span className={COLOR_CHIP_CLASS_NAME} key={key}>
                      <span
                        aria-hidden="true"
                        className="size-3.5 rounded-full lg:size-4"
                        style={{ backgroundColor: tone }}
                      />
                      {tGiurza(key)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="mt-2 flex items-start gap-3 rounded-[22px] bg-[#f3ecd9] px-[18px] py-4 lg:mt-5 lg:px-5">
            <TriangleAlert
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[#7d6224]"
            />
            <p className="text-[13.5px] leading-[1.55] text-[#4f3f17] lg:text-[14.5px]">
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

function IdentificationHeading({
  anchorLabel,
  eyebrow,
  title,
}: {
  anchorLabel: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <>
      <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <AnchoredHeading
        anchorLabel={anchorLabel}
        className="mt-2.5 max-w-3xl font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] lg:mt-4 lg:text-[44px] lg:leading-[1.1]"
        id={SPECIES_SECTION_IDS.identification}
        slugSource={title}
      >
        {title}
      </AnchoredHeading>
    </>
  );
}

function IdentificationIntro({
  anchorLabel,
  editable,
  eyebrow,
  speciesId,
  summary,
  title,
}: {
  anchorLabel: string;
  editable: boolean;
  eyebrow: string;
  speciesId: string;
  summary: string;
  title: string;
}) {
  return (
    <div className={INTRO_CLASS_NAME}>
      <IdentificationHeading
        anchorLabel={anchorLabel}
        eyebrow={eyebrow}
        title={title}
      />
      <p
        className={SUMMARY_CLASS_NAME}
        data-content-field={editable ? "identification.summary" : undefined}
        data-content-id={editable ? speciesId : undefined}
        data-content-kind={editable ? "species" : undefined}
      >
        <IdentificationRichText text={summary} />
      </p>
    </div>
  );
}

function photoCreditLine(
  credit: GalleryImage["credit"],
  locale: AppLocale,
): string {
  const photographer = credit?.photographer?.trim();
  const author = photographer
    ? getPublishedCreditAuthorByName(photographer)
    : undefined;
  return [
    author ? creditAuthorName(author, locale) : photographer,
    credit?.location?.trim(),
    credit?.date?.match(/\d{4}/)?.[0],
  ]
    .filter(Boolean)
    .join(" · ");
}

async function SpeciesIdentificationColors({
  identification,
  locale,
  speciesId,
}: {
  identification: Identification;
  locale: AppLocale;
  speciesId: string;
}) {
  const colors = identification.colors ?? [];
  const text = identification.coloration?.trim();
  if (!colors.length && !text) return null;
  const t = await getTranslations({ locale, namespace: "profile" });
  const editable = locale === "ka" && isLocalAdminEnabled();
  return (
    <div className={COLORS_CARD_CLASS_NAME}>
      <div className="lg:flex lg:flex-wrap lg:items-center lg:gap-2">
        <h3 className={COLORS_LABEL_CLASS_NAME}>{t("colorationTitle")}</h3>
        {colors.length ? (
          <div className={COLOR_CHIPS_CLASS_NAME}>
            {[...new Set(colors)].map((color) => (
              <span className={COLOR_CHIP_CLASS_NAME} key={color}>
                <span
                  aria-hidden="true"
                  className="size-3.5 rounded-full border border-foreground/10 lg:size-4"
                  style={{ backgroundColor: SPECIES_COLOR_TONES[color] }}
                />
                {t(`colorNames.${color}`)}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {text ? (
        <p
          className="mt-2.5 text-[13.5px] leading-[1.55] whitespace-pre-line text-muted-foreground lg:mt-3 lg:text-[16px] lg:leading-[1.65] lg:text-foreground/85"
          data-content-field={
            editable ? "identification.coloration" : undefined
          }
          data-content-id={editable ? speciesId : undefined}
          data-content-kind={editable ? "species" : undefined}
        >
          <IdentificationRichText text={text} />
        </p>
      ) : null}
      <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground lg:text-[13px]">
        {t("colorationNote")}
      </p>
    </div>
  );
}

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
          <span className="text-[12.5px] text-muted-foreground lg:text-[11px] lg:font-medium lg:tracking-[0.18em] lg:uppercase">
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
  locale,
  photo,
}: {
  alt: string;
  locale: AppLocale;
  photo: GalleryImage;
}) {
  const entry = optimizedEntry(photo.src);
  const credit = photoCreditLine(photo.credit, locale);

  return (
    <figure className="mt-5 lg:sticky lg:top-36 lg:col-start-1 lg:row-span-full lg:mt-0 lg:self-start">
      <a
        className="group relative block aspect-3/4 cursor-zoom-in overflow-hidden rounded-[28px] bg-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:aspect-4/3 lg:aspect-auto lg:h-[690px] lg:rounded-[36px]"
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
        {credit ? (
          <span className="absolute bottom-2.5 left-2.5 max-w-[calc(100%-1.25rem)] truncate rounded-full bg-ink/66 px-[9px] text-[10.5px] leading-6 text-white/90 lg:bottom-3 lg:left-3 lg:max-w-[calc(100%-1.5rem)] lg:px-2.5 lg:text-[11.5px] lg:leading-[26px]">
            {credit}
          </span>
        ) : null}
      </a>
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
