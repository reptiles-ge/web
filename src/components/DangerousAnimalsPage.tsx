import type { ComponentProps, ReactNode } from "react";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type {
  DangerousAnimalsLocaleCopy,
  FeatureBlock,
  FeatureMark,
  FeaturePhoto,
  FeatureSection,
} from "@/content/features/dangerousAnimals";
import type { DangerLevel, PhotoCredit, Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { FeaturePhotoFade } from "@/components/dangerousAnimals/FeaturePhotoFade";
import { GeorgiaMapStatic } from "@/components/map/GeorgiaMapStatic";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { ScreenReaderBreadcrumb } from "@/components/ScreenReaderBreadcrumb";
import { dangerousAnimalsFeature } from "@/content/features/dangerousAnimals";
import { getRegionsForSpecies, localizeRegionText } from "@/data/mapRegions";
import { hasPhotoCredit } from "@/data/speciesMedia";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { formatContentDate, formatPhotoDate } from "@/lib/formatDate";
import { photoCreditSourceLabel } from "@/lib/photoCreditSource";
import { speciesHref } from "@/lib/speciesRoutes";

type DangerousAnimalsPageProps = {
  locale: AppLocale;
  publishedAt: string;
  species: Species[];
  updatedAt: string;
};

type FeatureContext = {
  copy: DangerousAnimalsLocaleCopy;
  locale: AppLocale;
  riskLabels: Record<DangerLevel, string>;
  speciesById: Map<string, Species>;
};

type FeatureLinkHref = ComponentProps<typeof Link>["href"];

export async function DangerousAnimalsPage({
  locale,
  publishedAt,
  species,
  updatedAt,
}: DangerousAnimalsPageProps) {
  const [t, tDanger] = await Promise.all([
    getTranslations({ locale, namespace: "dangerousAnimals" }),
    getTranslations({ locale, namespace: "danger" }),
  ]);
  const copy = dangerousAnimalsFeature.copy[locale];
  const context: FeatureContext = {
    copy,
    locale,
    riskLabels: {
      Harmless: tDanger("Harmless"),
      High: tDanger("High"),
      Moderate: tDanger("Moderate"),
    },
    speciesById: new Map(
      species.map((item) => [item.id, localizeSpecies(item, locale)]),
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <article>
        <header className="mx-auto w-full max-w-[1400px] px-6 pt-28 sm:pt-32 lg:px-10">
          <ScreenReaderBreadcrumb
            current={t("breadcrumbCurrent")}
            home={t("breadcrumbHome")}
          />
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              <span>{copy.kicker}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={updatedAt}>
                {copy.labels.updated} {formatContentDate(updatedAt, locale)}
              </time>
            </div>
            <h1 className="text-balance-tight mt-5 font-display text-display-hero font-semibold text-foreground">
              {copy.title}
            </h1>
            <p className="mt-6 text-[17px] leading-[1.65] text-foreground sm:text-[19px]">
              {copy.dek}
            </p>
            <p className="mt-7 text-[16px] leading-[1.8] text-muted-foreground sm:text-[17px]">
              <FeatureRichText context={context} parts={copy.lead} />
            </p>
          </div>
        </header>

        <div className="mx-auto mt-10 w-full max-w-[1400px] px-6 sm:mt-12 lg:px-10">
          <FeatureIllustrationFigure
            context={context}
            illustrationKey="hero"
            priority
          />
        </div>
        <FeaturePhotoFade />
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-18 lg:px-10">
          <FeatureTable context={context} />
          {copy.sections.map((section) => (
            <FeatureChapter
              context={context}
              key={section.id}
              section={section}
            />
          ))}
        </div>
      </article>

      <section
        className="bg-ink py-16 text-ink-foreground sm:py-20"
        id="emergency"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-white/65 uppercase">
              112
            </p>
            <h2 className="mt-4 font-display text-display-card font-semibold">
              {copy.labels.emergencyHeading}
            </h2>
            <p className="mt-5 text-[17px] leading-[1.75] text-white/80">
              <FeatureRichText
                context={context}
                inverted
                parts={copy.emergency}
              />
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-18 lg:px-10">
        <FeatureSources context={context} />
      </div>
      <ContentAttribution
        locale={locale}
        publishedAt={publishedAt}
        sourcesHref="#sources"
        updatedAt={updatedAt}
      />
    </div>
  );
}

function FeatureBlockView({
  block,
  context,
}: {
  block: FeatureBlock;
  context: FeatureContext;
}) {
  if (block.type === "p") {
    return (
      <p className="mt-5 text-[16px] leading-[1.8] text-muted-foreground sm:text-[17px]">
        <FeatureRichText context={context} parts={block.parts} />
      </p>
    );
  }
  if (block.type === "figure") {
    return (
      <div className="mt-10">
        <FeaturePhotoFigure
          caption={block.caption}
          context={context}
          photoKey={block.photo}
          wide={block.wide}
        />
      </div>
    );
  }
  if (block.type === "illustration") {
    return (
      <div className="mt-10">
        <FeatureIllustrationFigure
          context={context}
          illustrationKey={block.illustration}
        />
      </div>
    );
  }
  if (block.type === "lookalikes") {
    return <FeatureLookalikes block={block} context={context} />;
  }
  if (block.type === "speciesNote") {
    return <FeatureSpeciesNote block={block} context={context} />;
  }
  if (block.type === "pull") {
    return (
      <blockquote className="my-12 font-display text-[25px] leading-[1.35] font-semibold text-foreground sm:text-[32px]">
        <FeatureRichText context={context} parts={block.parts} />
      </blockquote>
    );
  }
  if (block.type === "map") {
    return <FeatureMap block={block} context={context} />;
  }
  return (
    <dl className="my-6 sm:grid sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-x-6">
      <dt className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {context.copy.labels.mythClaim}
      </dt>
      <dd className="mt-1 text-[16px] leading-[1.7] text-foreground sm:mt-0">
        <FeatureRichText context={context} parts={block.claim} />
      </dd>
      <dt className="mt-4 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase sm:mt-3">
        {context.copy.labels.mythReality}
      </dt>
      <dd className="mt-1 text-[16px] leading-[1.7] text-muted-foreground sm:mt-3">
        <FeatureRichText context={context} parts={block.reality} />
      </dd>
    </dl>
  );
}

function FeatureChapter({
  context,
  section,
}: {
  context: FeatureContext;
  section: FeatureSection;
}) {
  return (
    <section className="mt-20 scroll-mt-28 sm:mt-24" id={section.id}>
      <div>
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          {section.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-display-card font-semibold text-foreground">
          {section.heading}
        </h2>
      </div>
      <div className="mt-6 flow-root">
        {section.blocks.map((block, index) => (
          <FeatureBlockView
            block={block}
            context={context}
            key={section.id + ":" + index}
          />
        ))}
      </div>
    </section>
  );
}

function FeatureIllustrationFigure({
  context,
  illustrationKey,
  priority = false,
}: {
  context: FeatureContext;
  illustrationKey: string;
  priority?: boolean;
}) {
  const illustration = dangerousAnimalsFeature.illustrations[illustrationKey];
  if (!illustration) return null;
  return (
    <figure>
      <div className={priority ? undefined : "max-w-[920px]"}>
        <FeaturePhotoVisual
          alt={illustration.alt[context.locale]}
          aspect={priority ? "aspect-3/2 sm:aspect-2/1" : "aspect-3/2"}
          priority={priority}
          sizes={
            priority
              ? "(max-width: 1399px) 100vw, 1320px"
              : "(max-width: 959px) 100vw, 920px"
          }
          src={illustration.src}
        />
      </div>
    </figure>
  );
}

function FeatureLookalikes({
  block,
  context,
}: {
  block: Extract<FeatureBlock, { type: "lookalikes" }>;
  context: FeatureContext;
}) {
  return (
    <figure className="my-12">
      <div className="grid max-w-[920px] gap-5 sm:grid-cols-2 sm:gap-6">
        {[block.left, block.right].map((photoKey) => {
          const photo = resolveFeaturePhoto(photoKey, context);
          return (
            <div className="min-w-0" key={photoKey}>
              <FeaturePhotoVisual
                alt={photo.definition.alt[context.locale]}
                aspect="aspect-5/4"
                src={photo.definition.src}
              />
              <div className="mt-3">
                <p className="font-display text-[17px] font-semibold text-foreground">
                  {photo.species.commonName}
                </p>
                <p className="text-[13px] text-muted-foreground italic">
                  {photo.species.scientificName}
                </p>
                <FeaturePhotoCredit context={context} credit={photo.credit} />
              </div>
            </div>
          );
        })}
      </div>
      <figcaption className="mt-5 text-[13px] leading-relaxed text-muted-foreground">
        <FeatureRichText context={context} parts={block.caption} plain />
      </figcaption>
    </figure>
  );
}

function FeatureMap({
  block,
  context,
}: {
  block: Extract<FeatureBlock, { type: "map" }>;
  context: FeatureContext;
}) {
  const mapRegions = getRegionsForSpecies(block.speciesId);
  if (mapRegions.length === 0) return null;
  const item = context.speciesById.get(block.speciesId);
  const names = mapRegions.map((region) =>
    localizeRegionText(region.name, context.locale),
  );
  return (
    <figure className="my-12">
      <div
        aria-label={(item?.commonName ?? "") + ": " + names.join(", ")}
        role="img"
      >
        <GeorgiaMapStatic
          className="mx-auto max-w-[620px]"
          hatchId="dangerous-animals-gyurza-range"
          highlightedIds={mapRegions.map((region) => region.id)}
        />
      </div>
      <figcaption className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
        <FeatureRichText context={context} parts={block.caption} plain />
      </figcaption>
      <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
        {context.copy.labels.mapRegions}: {names.join(" · ")}
      </p>
    </figure>
  );
}

function FeaturePhotoCredit({
  context,
  credit,
}: {
  context: FeatureContext;
  credit: PhotoCredit;
}) {
  const sourceLabel = photoCreditSourceLabel(credit.url);
  const date = credit.date
    ? formatPhotoDate(credit.date, context.locale)
    : null;
  return (
    <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">
      {context.copy.labels.photoCredit} {credit.photographer}
      {sourceLabel && credit.url ? (
        <>
          {" · "}
          <a
            className="underline decoration-border underline-offset-2 transition-colors hover:decoration-foreground"
            href={credit.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {sourceLabel}
          </a>
        </>
      ) : null}
      {credit.location ? " · " + credit.location : null}
      {date ? " · " + date : null}
    </span>
  );
}

function FeaturePhotoFigure({
  caption,
  context,
  photoKey,
  priority = false,
  wide = false,
}: {
  caption?: FeatureMark[];
  context: FeatureContext;
  photoKey: string;
  priority?: boolean;
  wide?: boolean;
}) {
  const photo = resolveFeaturePhoto(photoKey, context);
  return (
    <figure>
      <div
        className={
          priority ? undefined : wide ? "max-w-[920px]" : "max-w-[740px]"
        }
      >
        <FeaturePhotoVisual
          alt={photo.definition.alt[context.locale]}
          aspect={wide ? "aspect-3/2 sm:aspect-2/1" : "aspect-16/10"}
          priority={priority}
          sizes={
            wide
              ? "(max-width: 1399px) 100vw, 1320px"
              : "(max-width: 767px) 100vw, 740px"
          }
          src={photo.definition.src}
        />
      </div>
      <figcaption className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
        {caption ? (
          <FeatureRichText context={context} parts={caption} plain />
        ) : (
          photo.species.commonName
        )}
        <FeaturePhotoCredit context={context} credit={photo.credit} />
      </figcaption>
    </figure>
  );
}

function FeaturePhotoVisual({
  alt,
  aspect,
  priority = false,
  sizes = "(max-width: 767px) 100vw, 460px",
  src,
}: {
  alt: string;
  aspect: string;
  priority?: boolean;
  sizes?: string;
  src: string;
}) {
  return (
    <div
      className={
        aspect +
        " relative overflow-hidden bg-surface data-[photo-ready=false]:opacity-0 motion-safe:transition-opacity motion-safe:duration-700"
      }
      data-feature-photo=""
    >
      <CoverImage
        alt={alt}
        className="object-cover"
        priority={priority}
        sizes={sizes}
        src={src}
      />
    </div>
  );
}

function FeatureRichText({
  context,
  inverted = false,
  parts,
  plain = false,
}: {
  context: FeatureContext;
  inverted?: boolean;
  parts: FeatureMark[];
  plain?: boolean;
}) {
  return (
    <>
      {parts.map((mark, index): ReactNode => {
        if (typeof mark === "string") {
          return <PhoneLinkedText key={index}>{mark}</PhoneLinkedText>;
        }
        if (plain) return <span key={index}>{mark.label}</span>;
        const linkClass = inverted
          ? "text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
          : "text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-primary";
        if (mark.type === "species") {
          return (
            <Link
              className={linkClass}
              href={speciesHref(mark.id, context.locale)}
              key={index}
            >
              {mark.label}
            </Link>
          );
        }
        if (mark.type === "guide") {
          return (
            <Link
              className={linkClass}
              href={mark.href as FeatureLinkHref}
              key={index}
            >
              {mark.label}
            </Link>
          );
        }
        return (
          <a
            className={linkClass}
            href={mark.href}
            key={index}
            rel={
              mark.href.startsWith("tel:") ? undefined : "noopener noreferrer"
            }
            target={mark.href.startsWith("tel:") ? undefined : "_blank"}
          >
            {mark.label}
          </a>
        );
      })}
    </>
  );
}

function FeatureSources({ context }: { context: FeatureContext }) {
  return (
    <aside className="mt-20 border-t border-border pt-10" id="sources">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-left marker:content-none [&::-webkit-details-marker]:hidden">
          <h2 className="font-display text-display-card font-semibold text-foreground">
            {context.copy.labels.sourcesHeading}
          </h2>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:border-foreground/20 group-open:text-foreground">
            <ChevronDown
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.75}
            />
          </span>
        </summary>
        <ul className="mt-6 space-y-3">
          {dangerousAnimalsFeature.sources.map((source) => (
            <li key={source.url}>
              <a
                className="inline-flex min-h-11 items-center gap-1 text-[14px] leading-relaxed text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
                href={source.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {source.name}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 shrink-0"
                />
              </a>
            </li>
          ))}
        </ul>
      </details>
    </aside>
  );
}

function FeatureSpeciesNote({
  block,
  context,
}: {
  block: Extract<FeatureBlock, { type: "speciesNote" }>;
  context: FeatureContext;
}) {
  const item = context.speciesById.get(block.speciesId);
  if (!item) return null;
  const photo = block.photo ? resolveFeaturePhoto(block.photo, context) : null;
  return (
    <aside className="my-10 sm:grid sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6">
      {photo ? (
        <div>
          <FeaturePhotoVisual
            alt={photo.definition.alt[context.locale]}
            aspect="aspect-5/4"
            src={photo.definition.src}
          />
          <FeaturePhotoCredit context={context} credit={photo.credit} />
        </div>
      ) : null}
      <div className={photo ? "mt-4 sm:mt-0" : ""}>
        <p className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
          {block.heading}
        </p>
        <p className="mt-2 font-display text-[19px] font-semibold text-foreground">
          {item.commonName}
        </p>
        <p className="text-[13px] text-muted-foreground italic">
          {item.scientificName}
        </p>
        {item.danger ? (
          <p
            className={
              item.danger === "High"
                ? "mt-3 text-[13px] font-medium text-destructive"
                : "mt-3 text-[13px] font-medium text-foreground"
            }
          >
            {context.riskLabels[item.danger]}
          </p>
        ) : null}
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          <FeatureRichText context={context} parts={block.parts} />
        </p>
      </div>
    </aside>
  );
}

function FeatureTable({ context }: { context: FeatureContext }) {
  const { copy } = context;
  return (
    <section
      aria-labelledby="dangerous-animals-table-heading"
      className="mt-12 sm:mt-14"
    >
      <h2
        className="font-display text-[23px] leading-tight font-semibold text-foreground sm:text-[27px]"
        id="dangerous-animals-table-heading"
      >
        {copy.labels.tableHeading}
      </h2>
      <table className="mt-5 w-full border-collapse text-left text-[13px] leading-[1.55] sm:text-[14px]">
        <thead className="sr-only sm:not-sr-only sm:table-header-group">
          <tr className="border-y border-foreground/35 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            <th className="py-3 pr-4 font-medium" scope="col">
              {copy.labels.tableAnimal}
            </th>
            <th className="py-3 pr-4 font-medium" scope="col">
              {copy.labels.tableRisk}
            </th>
            <th className="py-3 pr-4 font-medium" scope="col">
              {copy.labels.tableWhere}
            </th>
            <th className="py-3 font-medium" scope="col">
              {copy.labels.tableAction}
            </th>
          </tr>
        </thead>
        <tbody>
          {copy.tableRows.map((row) => {
            const danger = row.speciesId
              ? context.speciesById.get(row.speciesId)?.danger
              : undefined;
            return (
              <tr
                className="block border-b border-border py-3 sm:table-row sm:py-0"
                key={row.id}
              >
                <th
                  className="block py-2 text-left font-display text-[15px] font-semibold text-foreground sm:table-cell sm:py-4 sm:pr-4 sm:align-top"
                  scope="row"
                >
                  {row.subject}
                </th>
                <td className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-1.5 text-muted-foreground sm:table-cell sm:py-4 sm:pr-4 sm:align-top">
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase sm:hidden">
                    {copy.labels.tableRisk}
                  </span>
                  {danger ? (
                    <span
                      className={
                        danger === "High"
                          ? "font-medium text-destructive"
                          : "text-foreground"
                      }
                    >
                      {context.riskLabels[danger]}
                    </span>
                  ) : (
                    <span className="sr-only">{copy.labels.noRisk}</span>
                  )}
                </td>
                <td className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-1.5 text-muted-foreground sm:table-cell sm:py-4 sm:pr-4 sm:align-top">
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase sm:hidden">
                    {copy.labels.tableWhere}
                  </span>
                  {row.where}
                </td>
                <td className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-1.5 text-foreground sm:table-cell sm:py-4 sm:align-top">
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase sm:hidden">
                    {copy.labels.tableAction}
                  </span>
                  {row.action}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function resolveFeaturePhoto(
  photoKey: string,
  context: FeatureContext,
): {
  credit: PhotoCredit;
  definition: FeaturePhoto;
  species: Species;
} {
  const definition = dangerousAnimalsFeature.photos[photoKey];
  const species = definition && context.speciesById.get(definition.speciesId);
  const credit =
    species?.gallery.find((item) => item.src === definition.src)?.credit ??
    (species?.image === definition?.src ? species.imageCredit : undefined) ??
    (species?.mobileImage === definition?.src
      ? species.mobileImageCredit
      : undefined);
  if (
    !definition ||
    !species ||
    !hasPhotoCredit(credit) ||
    !credit.photographer
  ) {
    throw new Error("Missing credited catalog photo: " + photoKey);
  }
  return { credit, definition, species };
}
