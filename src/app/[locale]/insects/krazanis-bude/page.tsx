import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ContentAttribution } from "@/components/ContentAttribution";
import { JsonLd } from "@/components/JsonLd";
import { WASP_NEST_COPY, WASP_NEST_SOURCES } from "@/content/guides/waspNest";
import { openGraphLocale } from "@/i18n/localeMeta";
import { Link } from "@/i18n/navigation";
import { type AppLocale, routing } from "@/i18n/routing";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  organizationJsonLd,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { pageDateFields } from "@/lib/structuredDataDates";

type Props = { params: Promise<{ locale: string }> };

const PATH = "/insects/krazanis-bude";

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

  return {
    alternates: localeAlternates(locale, PATH),
    description,
    openGraph: {
      description,
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title: copy.metaTitle,
      type: "article",
      url,
    },
    robots: { follow: true, index: true },
    title: { absolute: copy.metaTitle },
    twitter: { card: "summary", description, title: copy.metaTitle },
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

  const [tShared, tInsects] = await Promise.all([
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "insects" }),
  ]);
  const copy = WASP_NEST_COPY[locale];
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
        <article className="mx-auto max-w-[900px] px-6 pt-30 pb-16 sm:pt-36 sm:pb-24">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-muted-foreground"
          >
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
          <h1 className="mt-8 font-display text-display-lead font-semibold text-foreground">
            {copy.title}
          </h1>
          <p className="mt-7 border-l-4 border-primary pl-5 text-[18px] leading-[1.7] text-foreground">
            {copy.lead}
          </p>

          <div className="mt-16 space-y-14">
            {copy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-display-card font-semibold text-foreground">
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-4 text-[16px] leading-[1.8] text-muted-foreground sm:text-[17px]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-display text-display-card font-semibold text-foreground">
              {LABELS[locale].faq}
            </h2>
            <div className="mt-7 space-y-8">
              {copy.faq.map((item) => (
                <div key={item.question}>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-[16px] leading-[1.8] text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 border-t border-border pt-10" id="sources">
            <h2 className="font-display text-display-card font-semibold text-foreground">
              {LABELS[locale].sources}
            </h2>
            <ul className="mt-6 space-y-5">
              {WASP_NEST_SOURCES.map((source) => (
                <li className="text-[15px] leading-relaxed" key={source.url}>
                  <a
                    className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                    href={source.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {source.name}
                  </a>
                  <p className="mt-1 text-muted-foreground">
                    {source.supports[locale]}
                  </p>
                </li>
              ))}
            </ul>
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
