import type { Metadata } from "next";

import { ChevronDown } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ContentAttribution } from "@/components/ContentAttribution";
import { JsonLd } from "@/components/JsonLd";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { WaspNestFaqItems } from "@/components/WaspNestFaqItems";
import { WASP_NEST_COPY, WASP_NEST_SOURCES } from "@/content/guides/waspNest";
import { optimizedImgSrc } from "@/data/optimizedImages";
import { openGraphLocale } from "@/i18n/localeMeta";
import { Link } from "@/i18n/navigation";
import { type AppLocale, routing } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  organizationJsonLd,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { hasMeaningfulUpdate, pageDateFields } from "@/lib/structuredDataDates";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 86400;

const PATH = "/insects/krazanis-bude";
const HERO_IMAGE = "/images/guides/wasp-nest-enclosed.jpg";
const COMB_IMAGE = "/images/guides/wasp-nest-open-comb.jpg";

const PHOTO_ALT: Record<AppLocale, { comb: string; hero: string }> = {
  en: {
    comb: "Black-and-yellow wasps on the open cells of a papery nest",
    hero: "Enclosed papery wasp nest beneath a wooden roof edge",
  },
  ka: {
    comb: "შავ-ყვითელი მწერები ქაღალდისმაგვარი ბუდის ღია ფიჭაზე",
    hero: "დახურული, ქაღალდისებრი კრაზანის ბუდე ხის გადახურვის ქვეშ",
  },
  ru: {
    comb: "Чёрно-жёлтые осы на открытых ячейках бумагообразного гнезда",
    hero: "Закрытое бумагообразное осиное гнездо под деревянным краем крыши",
  },
  tr: {
    comb: "Kâğıt benzeri yuvanın açık hücreleri üzerindeki siyah-sarı eşek arıları",
    hero: "Ahşap çatı kenarı altındaki kapalı, kâğıt benzeri eşek arısı yuvası",
  },
};

const LABELS: Record<AppLocale, { faq: string; sources: string }> = {
  en: {
    faq: "Frequently asked questions",
    sources: "Sources and supported claims",
  },
  ka: { faq: "ხშირი კითხვები", sources: "წყაროები და რას ადასტურებს თითოეული" },
  ru: { faq: "Частые вопросы", sources: "Источники и подтверждаемые сведения" },
  tr: {
    faq: "Sık sorulan sorular",
    sources: "Kaynaklar ve destekledikleri bilgiler",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: value } = await params;
  if (!hasLocale(routing.locales, value)) return {};
  const locale = value as AppLocale;
  const copy = WASP_NEST_COPY[locale];
  const url = absoluteUrl(localePath(locale, PATH));
  const description = kaMetaDescriptionOverride(
    locale,
    new URL(url).pathname,
    copy.description,
  );
  const imageUrl = optimizedImgSrc(HERO_IMAGE);

  return {
    alternates: localeAlternates(locale, PATH),
    description,
    openGraph: {
      description,
      images: [
        {
          alt: PHOTO_ALT[locale].hero,
          height: 1107,
          url: imageUrl,
          width: 1421,
        },
      ],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title: copy.metaTitle,
      type: "article",
      url,
    },
    robots: { follow: true, index: true },
    title: { absolute: copy.metaTitle },
    twitter: {
      card: "summary_large_image",
      description,
      images: [imageUrl],
      title: copy.metaTitle,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function WaspNestPage({ params }: Props) {
  const { locale: value } = await params;
  if (!hasLocale(routing.locales, value)) notFound();
  const locale = value as AppLocale;
  setRequestLocale(locale);

  const [tShared, tInsects, tNews] = await Promise.all([
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "insects" }),
    getTranslations({ locale, namespace: "news" }),
  ]);
  const copy = WASP_NEST_COPY[locale];
  const photoAlt = PHOTO_ALT[locale];
  const url = absoluteUrl(localePath(locale, PATH));
  const dates = pageDateFields(PATH);
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/")),
        name: tShared("breadcrumbHome"),
        position: 1,
      },
      {
        "@type": "ListItem",
        item: absoluteUrl(localePath(locale, "/insects")),
        name: tInsects("breadcrumbCurrent"),
        position: 2,
      },
      { "@type": "ListItem", item: url, name: copy.title, position: 3 },
    ],
  };
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    author: { "@id": siteEntityId("organization") },
    citation: WASP_NEST_SOURCES.map((source) => ({
      "@type": "CreativeWork",
      name: source.name,
      url: source.url,
    })),
    dateModified: dates.dateModified,
    datePublished: dates.datePublished,
    description: copy.description,
    headline: copy.title,
    image: {
      "@type": "ImageObject",
      contentUrl: optimizedImgSrc(HERO_IMAGE),
      height: 1107,
      url: optimizedImgSrc(HERO_IMAGE),
      width: 1421,
    },
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntityOfPage: { "@id": url, "@type": "WebPage" },
    publisher: organizationJsonLd(),
    url,
  };

  return (
    <>
      <JsonLd data={[articleLd, breadcrumbLd]} />
      <main className="min-h-screen bg-background">
        <article className="mx-auto max-w-[1400px] px-6 pt-30 pb-16 sm:pt-33 sm:pb-24 lg:px-10">
          <nav aria-label="Breadcrumb" className="sr-only">
            <ol className="flex flex-wrap gap-x-2 gap-y-1">
              <li>
                <Link className="hover:text-foreground" href="/">
                  {tShared("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link className="hover:text-foreground" href="/insects">
                  {tInsects("breadcrumbCurrent")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground">{copy.title}</li>
            </ol>
          </nav>
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            <Link
              className="transition-colors hover:text-foreground"
              href="/insects"
            >
              {tInsects("breadcrumbCurrent")}
            </Link>
            <span aria-hidden="true"> · </span>
            <time dateTime={dates.datePublished}>
              {tNews("published", {
                date: formatContentDate(dates.datePublished, locale),
              })}
            </time>
            {hasMeaningfulUpdate(dates.datePublished, dates.dateModified) ? (
              <>
                <span aria-hidden="true"> · </span>
                <time dateTime={dates.dateModified}>
                  {tNews("updated", {
                    date: formatContentDate(dates.dateModified, locale),
                  })}
                </time>
              </>
            ) : null}
          </p>
          <h1 className="mt-5 font-display text-display-lead font-semibold text-foreground">
            {copy.title}
          </h1>
          <p className="mt-7 border-l-4 border-primary pl-5 text-[18px] leading-[1.7] text-foreground">
            <PhoneLinkedText>{copy.lead}</PhoneLinkedText>
          </p>
          <figure className="mt-10">
            <Image
              alt={photoAlt.hero}
              className="h-auto w-full rounded-card"
              height={1107}
              preload
              sizes="(max-width: 1023px) 100vw, 1400px"
              src={optimizedImgSrc(HERO_IMAGE)}
              width={1421}
            />
          </figure>

          <div className="mt-16 space-y-14">
            {copy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-display-card font-semibold text-foreground">
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-4 text-[16px] leading-[1.8] text-muted-foreground sm:text-[17px]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>
                      <PhoneLinkedText>{paragraph}</PhoneLinkedText>
                    </p>
                  ))}
                </div>
                {section.image === "open-comb" ? (
                  <figure className="mt-7">
                    <Image
                      alt={photoAlt.comb}
                      className="h-auto w-full rounded-card"
                      height={1024}
                      sizes="(max-width: 1023px) 100vw, 1400px"
                      src={optimizedImgSrc(COMB_IMAGE)}
                      width={1536}
                    />
                  </figure>
                ) : null}
              </section>
            ))}
          </div>

          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-display text-display-card font-semibold text-foreground">
              {LABELS[locale].faq}
            </h2>
            <WaspNestFaqItems items={copy.faq} />
          </section>

          <section className="mt-16 border-t border-border pt-10">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-left marker:content-none [&::-webkit-details-marker]:hidden">
                <h2
                  className="font-display text-display-card font-semibold text-foreground"
                  id="sources"
                >
                  {LABELS[locale].sources}
                </h2>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:border-foreground/20 group-open:text-foreground">
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.75}
                  />
                </span>
              </summary>
              <ul className="mt-8 border-t border-border">
                {WASP_NEST_SOURCES.map((source) => (
                  <li
                    className="border-b border-border py-4 text-[15px] leading-relaxed"
                    key={source.url}
                  >
                    <a
                      className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                      href={source.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {source.name}
                    </a>
                    <p className="mt-1 text-muted-foreground">
                      <PhoneLinkedText>
                        {source.supports[locale]}
                      </PhoneLinkedText>
                    </p>
                  </li>
                ))}
              </ul>
            </details>
          </section>
        </article>
        <ContentAttribution
          publishedAt={dates.datePublished}
          sourcesHref="#sources"
          updatedAt={dates.dateModified}
        />
      </main>
    </>
  );
}
