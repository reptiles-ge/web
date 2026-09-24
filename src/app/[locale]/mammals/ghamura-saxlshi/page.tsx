import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ContentAttribution } from "@/components/ContentAttribution";
import { GuideFaqItems } from "@/components/GuideFaqItems";
import { GuideSources } from "@/components/GuideSources";
import { JsonLd } from "@/components/JsonLd";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import {
  BAT_IN_HOUSE_COPY,
  BAT_IN_HOUSE_SOURCES,
} from "@/content/guides/batInHouse";
import { optimizedImgSrc } from "@/data/optimizedImages";
import { openGraphLocale } from "@/i18n/localeMeta";
import { Link } from "@/i18n/navigation";
import { type AppLocale, routing } from "@/i18n/routing";
import { formatContentDate } from "@/lib/formatDate";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import {
  absoluteImageUrl,
  absoluteUrl,
  localeAlternates,
  localePath,
  openGraphJpeg,
  organizationJsonLd,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { hasMeaningfulUpdate, pageDateFields } from "@/lib/structuredDataDates";

type Props = { params: Promise<{ locale: string }> };

const PATH = "/mammals/ghamura-saxlshi";
const HERO_IMAGE = "/images/guides/bat-house-hero.jpg";
const OG_IMAGE = "https://cdn.reptiles.ge/og/images/guides/bat-in-house.jpg";
const WALL_IMAGE = "/images/guides/bat-on-wall.jpg";
const ROOST_IMAGE = "/images/guides/bat-roost-natural.jpg";

const PHOTO_ALT: Record<
  AppLocale,
  { hero: string; onWall: string; roost: string }
> = {
  en: {
    hero: "Small bat near an open residential window at dusk",
    onWall: "Small bat resting on an interior wall near a curtain",
    roost: "Bat roosting naturally in a rocky outdoor crevice at dusk",
  },
  ka: {
    hero: "პატარა ღამურა საცხოვრებელი ფანჯრის ღიობთან ბინდობაში",
    onWall: "პატარა ღამურა შიდა კედელზე ფარდასთან",
    roost: "ღამურა ბუნებრივ ქვის ნაპრალში ბინდობაში",
  },
  ru: {
    hero: "Небольшая летучая мышь у открытого окна дома в сумерках",
    onWall: "Небольшая летучая мышь на внутренней стене у занавески",
    roost: "Летучая мышь в природной каменной расщелине в сумерках",
  },
  tr: {
    hero: "Alacakaranlıkta açık konut penceresi yakınında küçük yarasa",
    onWall: "Perde yakınında iç duvarda dinlenen küçük yarasa",
    roost: "Alacakaranlıkta doğal kayalık yarıkta tüneyen yarasa",
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

export default async function BatInHousePage({ params }: Props) {
  const { locale: value } = await params;
  if (!hasLocale(routing.locales, value)) notFound();
  const locale = value as AppLocale;
  setRequestLocale(locale);

  const [tShared, tMammals, tNews] = await Promise.all([
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "mammals" }),
    getTranslations({ locale, namespace: "news" }),
  ]);
  const copy = BAT_IN_HOUSE_COPY[locale];
  const photoAlt = PHOTO_ALT[locale];
  const url = absoluteUrl(localePath(locale, PATH));
  const imageUrl = absoluteImageUrl(optimizedImgSrc(HERO_IMAGE));
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
        item: absoluteUrl(localePath(locale, "/mammals")),
        name: tMammals("breadcrumbCurrent"),
        position: 2,
      },
      { "@type": "ListItem", item: url, name: copy.title, position: 3 },
    ],
  };
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    author: { "@id": siteEntityId("organization") },
    citation: BAT_IN_HOUSE_SOURCES.map((source) => ({
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
      contentUrl: imageUrl,
      height: 864,
      url: imageUrl,
      width: 1152,
    },
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    mainEntityOfPage: { "@id": url, "@type": "WebPage" },
    publisher: organizationJsonLd(),
    url,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map((item) => ({
      "@type": "Question",
      acceptedAnswer: { "@type": "Answer", text: item.answer },
      name: item.question,
    })),
  };

  return (
    <>
      <JsonLd data={[articleLd, breadcrumbLd, faqLd]} />
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
                <Link className="hover:text-foreground" href="/mammals">
                  {tMammals("breadcrumbCurrent")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground">{copy.title}</li>
            </ol>
          </nav>
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            <Link
              className="transition-colors hover:text-foreground"
              href="/mammals"
            >
              {tMammals("breadcrumbCurrent")}
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
          <figure className="mt-10">
            <Image
              alt={photoAlt.hero}
              className="h-auto w-full rounded-card"
              height={864}
              preload
              sizes="(max-width: 1023px) 100vw, 1400px"
              src={optimizedImgSrc(HERO_IMAGE)}
              width={1152}
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
                {section.image === "on-wall" ? (
                  <figure className="mt-7">
                    <Image
                      alt={photoAlt.onWall}
                      className="h-auto w-full rounded-card"
                      height={864}
                      sizes="(max-width: 1023px) 100vw, 1400px"
                      src={optimizedImgSrc(WALL_IMAGE)}
                      width={1152}
                    />
                  </figure>
                ) : null}
                {section.image === "roost" ? (
                  <figure className="mt-7">
                    <Image
                      alt={photoAlt.roost}
                      className="h-auto w-full rounded-card"
                      height={864}
                      sizes="(max-width: 1023px) 100vw, 1400px"
                      src={optimizedImgSrc(ROOST_IMAGE)}
                      width={1152}
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
            <GuideFaqItems items={copy.faq} />
          </section>

          <GuideSources
            heading={LABELS[locale].sources}
            locale={locale}
            sources={BAT_IN_HOUSE_SOURCES}
          />
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: value } = await params;
  if (!hasLocale(routing.locales, value)) return {};
  const locale = value as AppLocale;
  const copy = BAT_IN_HOUSE_COPY[locale];
  const url = absoluteUrl(localePath(locale, PATH));
  const description = kaMetaDescriptionOverride(
    locale,
    new URL(url).pathname,
    copy.description,
  );

  return {
    alternates: localeAlternates(locale, PATH),
    description,
    openGraph: {
      description,
      images: [openGraphJpeg(OG_IMAGE, PHOTO_ALT[locale].hero)],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title: copy.metaTitle,
      type: "article",
      url,
    },
    robots: { follow: true, index: true, "max-image-preview": "large" },
    title: { absolute: copy.metaTitle },
    twitter: {
      card: "summary_large_image",
      description,
      images: [OG_IMAGE],
      title: copy.metaTitle,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
