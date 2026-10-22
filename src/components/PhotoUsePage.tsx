import type { ReactNode } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  CircleHelp,
  type LucideIcon,
  Mail,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { BrandText } from "@/components/BrandName";
import { ContactMailto } from "@/components/ContactMailto";
import { PhotoPermissionNotes } from "@/components/PhotoPermissionNotes";
import { creditAuthorHref, creditAuthorName } from "@/data/creditAuthors";
import {
  optimizedEntry,
  optimizedImgSrc,
  pictureSources,
} from "@/data/optimizedImages";
import { PHOTO_PERMISSION_NOTES } from "@/data/photoPermissionNotes";
import { Link } from "@/i18n/navigation";
import { photoCreditSourceLabel } from "@/lib/photoCreditSource";
import {
  getPhotoUseCreditExample,
  getPhotoUseHeroPhotos,
  getPhotoUsePhotos,
  getPhotoUseShowcase,
  getPhotoUseStats,
  PHOTO_USE_FAQ,
  photoLicenseLabel,
  type PhotoUsePhoto,
} from "@/lib/photoUse";
import { CONTACT_EMAIL } from "@/lib/site";
import {
  type CatalogCard,
  getCreditPhotoCatalog,
  getSpeciesCatalog,
} from "@/lib/speciesCatalogApi";
import { speciesPhotoAlt } from "@/lib/speciesMeta";
import { speciesHref } from "@/lib/speciesRoutes";

const wrapClass =
  "mx-auto box-content max-w-[1320px] px-4 md:px-10 lg:px-[60px]";
const eyebrowClass =
  "text-[10.5px] font-semibold tracking-[0.16em] text-(--nw-muted) md:text-[11px]";
const h2Class =
  "mt-3 text-[26px] leading-[1.15] font-semibold tracking-[-0.015em] md:text-[36px] md:leading-[1.1]";
const linkClass =
  "font-medium underline decoration-current/30 underline-offset-2 transition-colors hover:text-(--nw-accent) hover:decoration-current";
const TILE_SIZES =
  "(max-width: 767px) calc(50vw - 22px), (max-width: 1023px) calc(50vw - 48px), min(427px, calc((100vw - 160px) / 3))";
const EXAMPLE_SIZES =
  "(max-width: 1023px) calc(100vw - 32px), (max-width: 1439px) 50vw, 660px";
const EAGER_TILES = 2;
const ASK_ITEMS = ["link", "purpose", "medium", "commercial"] as const;
const OWN_ITEMS = ["contributors", "open", "permission"] as const;
const PHOTOGRAPHERS_ID = "photographers";
const NUMBER_FORMATS = new Map<AppLocale, Intl.NumberFormat>();

type Translate = Awaited<ReturnType<typeof getTranslations<"photoUse">>>;

export async function PhotoUsePage({ locale }: { locale: AppLocale }) {
  const [t, creditPhotos, catalog] = await Promise.all([
    getTranslations({ locale, namespace: "photoUse" }),
    getCreditPhotoCatalog(),
    getSpeciesCatalog(locale),
  ]);
  const photos = getPhotoUsePhotos(creditPhotos);
  const showcase = getPhotoUseShowcase(getPhotoUseHeroPhotos(creditPhotos));
  const speciesById = new Map(catalog.map((item) => [item.id, item]));

  return (
    <div className="editorial-page min-h-screen bg-background text-(--nw-ink) antialiased">
      <section className={`${wrapClass} pt-[107px] md:pt-[147px]`}>
        <h1 className="max-w-[880px] font-display text-[36px] leading-[1.06] font-semibold tracking-tight md:text-[56px] md:leading-[1.02] md:tracking-[-0.03em]">
          <BrandText text={t("title")} />
        </h1>
        <p className="mt-4 max-w-[640px] text-[16.5px] leading-[1.55] text-(--nw-soft) md:mt-6 md:text-[19px]">
          {t("intro")}
        </p>
        <PhotoUseShowcase
          locale={locale}
          showcase={showcase}
          speciesById={speciesById}
          t={t}
        />
        <PhotoUseStats locale={locale} photos={photos} t={t} />
      </section>
      <PhotoUseCards locale={locale} t={t} />
      <PhotoUseCreditExample
        locale={locale}
        photos={photos}
        speciesById={speciesById}
        t={t}
      />
      <PhotoUsePhotographers t={t} />
      <PhotoUseFaq t={t} />
    </div>
  );
}

function numberFormat(locale: AppLocale) {
  const cached = NUMBER_FORMATS.get(locale);
  if (cached) return cached;
  const created = new Intl.NumberFormat(locale);
  NUMBER_FORMATS.set(locale, created);
  return created;
}

function PhotoUseCards({ locale, t }: { locale: AppLocale; t: Translate }) {
  const permissionNotes = PHOTO_PERMISSION_NOTES[locale];
  const bodyClass =
    "mt-1.5 text-[14.5px] leading-[1.6] text-(--nw-muted) md:mt-2.5 md:text-[15.5px]";
  const cards: Array<{
    action?: ReactNode;
    body: ReactNode;
    icon: LucideIcon;
    title: string;
  }> = [
    {
      body: (
        <ul className={`${bodyClass} space-y-2`}>
          {OWN_ITEMS.map((key) => (
            <li key={key}>
              <strong className="font-semibold text-(--nw-ink)">
                {t(`ownItems.${key}.label`)}
              </strong>{" "}
              {t.rich(`ownItems.${key}.body`, {
                terms: (chunks) => (
                  <Link
                    className={linkClass}
                    href={{
                      hash: "reptiles-ge-license",
                      pathname: "/terms-and-conditions",
                    }}
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </li>
          ))}
        </ul>
      ),
      icon: Camera,
      title: t("ownTitle"),
    },
    {
      body: (
        <div className={bodyClass}>
          <p>{t("useBody")}</p>
          <p className="mt-2">
            {t.rich("useUnknown", {
              link: (chunks) => (
                <a className={linkClass} href={`#${PHOTOGRAPHERS_ID}`}>
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
      ),
      icon: CircleHelp,
      title: t("useTitle"),
    },
    {
      action: (
        <ContactMailto
          className="mt-5 inline-flex h-12 max-w-full items-center gap-2.5 self-start rounded-full bg-(--nw-strong) px-5 text-[15px] font-medium text-(--nw-on-strong) transition-opacity hover:opacity-90"
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t("askSubject"))}`}
        >
          <Mail aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate">{CONTACT_EMAIL}</span>
        </ContactMailto>
      ),
      body: (
        <div className={bodyClass}>
          <p>{t("askBody")}</p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
            {ASK_ITEMS.map((key) => (
              <li key={key}>{t(`askItems.${key}`)}</li>
            ))}
          </ul>
          <p className="mt-2">{t("askForward")}</p>
          <PhotoPermissionNotes
            className="mt-2"
            notes={[permissionNotes.responseTime, permissionNotes.feePolicy]}
          />
        </div>
      ),
      icon: Mail,
      title: t("askTitle"),
    },
  ];

  return (
    <section className={`${wrapClass} pt-14 md:pt-[104px]`}>
      <ul className="grid gap-2.5 md:grid-cols-3 md:gap-4">
        {cards.map((card) => (
          <li
            className="flex flex-col rounded-3xl bg-(--nw-card) p-5 shadow-(--nw-shadow) md:rounded-[28px] md:p-7"
            key={card.title}
          >
            <span className="inline-flex size-11 items-center justify-center rounded-[14px] bg-(--nw-surface) text-(--nw-accent)">
              <card.icon aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-4 text-[19px] font-semibold md:mt-6 md:text-[22px]">
              {card.title}
            </h2>
            {card.body}
            {card.action}
          </li>
        ))}
      </ul>
    </section>
  );
}

function PhotoUseCreditExample({
  locale,
  photos,
  speciesById,
  t,
}: {
  locale: AppLocale;
  photos: PhotoUsePhoto[];
  speciesById: ReadonlyMap<string, CatalogCard>;
  t: Translate;
}) {
  const example = getPhotoUseCreditExample(photos);
  const photographer = example?.photo.credit?.photographer?.trim();
  const localized = example && speciesById.get(example.photo.speciesId);
  if (!example || !photographer || !localized) return null;
  const source = photoCreditSourceLabel(example.sourceUrl) ?? "";
  const license = photoLicenseLabel(example.licenseUrl);
  const steps = [
    { body: t("readAuthorBody"), title: t("readAuthorTitle") },
    { body: t("readSourceBody", { source }), title: t("readSourceTitle") },
    { body: t("readLicenseBody", { license }), title: t("readLicenseTitle") },
  ];

  return (
    <section className={`${wrapClass} pt-14 md:pt-[104px]`}>
      <p className={eyebrowClass}>{t("readEyebrow")}</p>
      <h2 className={h2Class}>{t("readTitle")}</h2>
      <div className="mt-5 grid gap-5 md:mt-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
        <figure className="overflow-hidden rounded-3xl bg-ink md:rounded-[30px]">
          <Link
            className="relative block aspect-4/3"
            href={speciesHref(example.photo.speciesId, locale)}
          >
            <PhotoUsePicture
              alt={speciesPhotoAlt(
                localized.commonName,
                localized.scientificName,
                example.photo.credit,
                locale,
              )}
              sizes={EXAMPLE_SIZES}
              src={example.photo.src}
            />
          </Link>
          <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-1.5 px-4 py-3.5 text-[13px] leading-snug tracking-[0.02em] text-white/70 md:px-6 md:py-4">
            <span>
              {t.rich("photoBy", {
                author: (chunks) => (
                  <>
                    <StepMark n={1} />{" "}
                    <span className="text-white/85">{chunks}</span>
                  </>
                ),
                name: photographer,
              })}
            </span>
            <span aria-hidden="true">·</span>
            <StepMark n={2} />
            <a
              className="inline-flex items-center gap-0.5 underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/70"
              href={example.sourceUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {source}
              <ArrowUpRight aria-hidden="true" className="size-[0.85em]" />
            </a>
            <span aria-hidden="true">·</span>
            <StepMark n={3} />
            <a
              className="inline-flex items-center gap-0.5 underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/70"
              href={example.licenseUrl}
              rel="noopener noreferrer license"
              target="_blank"
            >
              {license}
              <ArrowUpRight aria-hidden="true" className="size-[0.85em]" />
            </a>
          </figcaption>
        </figure>
        <ol className="flex flex-col gap-2.5 md:gap-3">
          {steps.map((step, index) => (
            <li
              className="flex gap-4 rounded-[22px] bg-(--nw-card) p-4 md:p-5"
              key={step.title}
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-(--nw-accent) text-[14px] font-semibold text-white tabular-nums dark:text-(--nw-on-strong)">
                {index + 1}
              </span>
              <div className="min-w-0 pt-1">
                <h3 className="text-[16.5px] font-semibold md:text-[18px]">
                  {step.title}
                </h3>
                <p className="mt-1 text-[14.5px] leading-[1.6] text-(--nw-muted) md:text-[15px]">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PhotoUseFaq({ t }: { t: Translate }) {
  return (
    <section className={`${wrapClass} pt-14 pb-16 md:pt-[104px] md:pb-24`}>
      <h2 className={h2Class}>{t("faqTitle")}</h2>
      <dl className="mt-5 divide-y divide-(--nw-rule) border-y border-(--nw-rule) md:mt-8">
        {PHOTO_USE_FAQ.map((key) => (
          <div
            className="py-5 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10 md:py-7"
            key={key}
          >
            <dt className="text-[17px] leading-snug font-semibold md:text-[19px]">
              {t(`faq.${key}.q`)}
            </dt>
            <dd className="mt-2 text-[15px] leading-[1.65] text-(--nw-muted) md:mt-0 md:text-[16px]">
              {t.rich(`faq.${key}.a`, {
                terms: (chunks) => (
                  <Link
                    className={linkClass}
                    href={{
                      hash: "intellectual-property",
                      pathname: "/terms-and-conditions",
                    }}
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function PhotoUsePhotographers({ t }: { t: Translate }) {
  const items = [
    { body: t("creditBody"), title: t("creditTitle") },
    { body: t("shareBody"), title: t("shareTitle") },
  ];

  return (
    <section
      className={`${wrapClass} scroll-mt-24 pt-14 md:pt-[104px]`}
      id={PHOTOGRAPHERS_ID}
    >
      <div className="rounded-[28px] bg-(--nw-panel) px-[22px] py-7 text-white md:rounded-[36px] md:px-14 md:py-12">
        <h2 className="text-[10.5px] font-semibold tracking-[0.16em] text-white/55 md:text-[11px]">
          {t("photographersEyebrow")}
        </h2>
        <div className="mt-4 grid gap-6 md:mt-6 md:grid-cols-2 md:gap-12">
          {items.map((item) => (
            <div key={item.title}>
              <h3 className="text-[21px] leading-[1.2] font-semibold md:text-[28px] md:tracking-[-0.012em]">
                {item.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-[1.65] text-white/72 md:mt-3 md:text-[16.5px]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-col gap-3 md:mt-10 md:flex-row md:items-center md:gap-6">
          <Link
            className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-white px-6 text-[15px] font-semibold text-[#1a211c] transition-opacity hover:opacity-90"
            href="/contact"
          >
            {t("contactCta")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 text-[15px] font-medium text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
            href="/authors"
          >
            {t("contributorsCta")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PhotoUsePicture({
  alt,
  eager = false,
  sizes,
  src,
}: {
  alt: string;
  eager?: boolean;
  sizes: string;
  src: string;
}) {
  const entry = optimizedEntry(src);
  return (
    <picture className="media-placeholder absolute inset-0 block size-full">
      {pictureSources(src, { sizes }).map((source) => (
        <source key={source.key} {...source.props} />
      ))}
      <img
        alt={alt}
        className="absolute inset-0 size-full object-cover text-transparent transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
        decoding="async"
        height={entry?.height}
        loading={eager ? "eager" : "lazy"}
        sizes={sizes}
        src={optimizedImgSrc(src, 800)}
        width={entry?.width}
      />
    </picture>
  );
}

function PhotoUseShowcase({
  locale,
  showcase,
  speciesById,
  t,
}: {
  locale: AppLocale;
  showcase: ReturnType<typeof getPhotoUseShowcase>;
  speciesById: ReadonlyMap<string, CatalogCard>;
  t: Translate;
}) {
  const tiles = showcase.flatMap((photo) => {
    const species = speciesById.get(photo.speciesId);
    return species ? [{ photo, species }] : [];
  });

  return (
    <ul
      aria-label={t("gridLabel")}
      className="mt-8 grid grid-cols-2 gap-x-3 gap-y-5 md:mt-12 md:gap-x-4 md:gap-y-7 lg:grid-cols-3 lg:gap-x-5"
    >
      {tiles.map(({ photo, species }, index) => {
        const href = speciesHref(photo.speciesId, locale);
        return (
          <li key={photo.src}>
            <figure>
              <Link
                aria-hidden="true"
                className="group relative block aspect-3/2 overflow-hidden rounded-[16px] bg-ink lg:rounded-[22px]"
                href={href}
                tabIndex={-1}
              >
                <PhotoUsePicture
                  alt={speciesPhotoAlt(
                    species.commonName,
                    species.scientificName,
                    photo.credit,
                    locale,
                  )}
                  eager={index < EAGER_TILES}
                  sizes={TILE_SIZES}
                  src={photo.src}
                />
              </Link>
              <figcaption className="mt-2.5 px-0.5 wrap-break-word md:mt-3">
                <Link
                  className="block text-[15px] leading-snug font-semibold text-(--nw-ink) transition-colors hover:text-(--nw-accent) md:text-[17px]"
                  href={href}
                >
                  {species.commonName}
                </Link>
                <span className="mt-0.5 block text-[13px] leading-snug text-(--nw-muted) md:text-[14px]">
                  {t.rich("photoBy", {
                    author: (chunks) => (
                      <Link
                        className={`${linkClass} text-(--nw-soft)`}
                        href={creditAuthorHref(photo.author.slug)}
                      >
                        {chunks}
                      </Link>
                    ),
                    name: creditAuthorName(photo.author, locale),
                  })}
                </span>
              </figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}

function PhotoUseStats({
  locale,
  photos,
  t,
}: {
  locale: AppLocale;
  photos: PhotoUsePhoto[];
  t: Translate;
}) {
  const stats = getPhotoUseStats(photos);
  const format = numberFormat(locale);
  const totals = [
    { label: t("stats.photos", { count: stats.photos }), value: stats.photos },
    {
      label: t("stats.photographers", { count: stats.photographers }),
      value: stats.photographers,
    },
  ];
  const breakdown = (
    ["contributors", "open", "permission", "unknown"] as const
  ).map((key) => ({ label: t(`stats.${key}`), value: stats[key] }));

  return (
    <div className="mt-12 md:mt-[88px]">
      <h2 className="text-[20px] leading-tight font-semibold md:text-[26px]">
        {t("statsTitle")}
      </h2>
      <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-3 md:mt-6">
        {totals.map((item) => (
          <div
            className="flex flex-row-reverse items-baseline justify-end gap-2.5"
            key={item.label}
          >
            <dt className="text-[14px] text-(--nw-muted) md:text-[16px]">
              {item.label}
            </dt>
            <dd className="text-[30px] leading-none font-semibold tabular-nums md:text-[44px] md:tracking-[-0.02em]">
              {format.format(item.value)}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-[13px] font-medium text-(--nw-muted) md:mt-8 md:text-[14px]">
        {t("stats.breakdown")}
      </p>
      <dl className="mt-2.5 grid grid-cols-2 gap-2 md:mt-3 md:grid-cols-4 md:gap-0 md:border-y md:border-(--nw-rule)">
        {breakdown.map((item, index) => (
          <div
            className={`flex flex-col-reverse justify-end rounded-[18px] bg-(--nw-card) p-4 md:rounded-none md:bg-transparent md:px-0 md:py-6 ${
              index > 0 ? "md:border-l md:border-(--nw-rule) md:pl-8" : ""
            }`}
            key={item.label}
          >
            <dt className="mt-1.5 text-[13px] text-(--nw-muted) md:mt-2 md:text-[14px]">
              {item.label}
            </dt>
            <dd className="text-[24px] leading-none font-semibold tabular-nums md:text-[32px] md:tracking-[-0.02em]">
              {format.format(item.value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function StepMark({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-5 items-center justify-center rounded-full bg-white/90 text-[11px] font-semibold text-ink tabular-nums"
    >
      {n}
    </span>
  );
}
