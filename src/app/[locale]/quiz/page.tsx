import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { type QuizCardModel, QuizzesPage } from "@/components/QuizzesPage";
import { openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import { liveQuizzes } from "@/lib/quizzes";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  quizPageUrl,
  siteConfig,
  siteEntityId,
} from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

const PATH = "/quiz";
const OG_IMAGE = "/images/guides/snake-quiz-og.jpg";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "quizzes" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const url = absoluteUrl(localePath(locale, PATH));
  const ogImage = absoluteUrl(OG_IMAGE);

  return {
    alternates: localeAlternates(locale, PATH),
    description,
    keywords: t("keywords")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    openGraph: {
      description,
      images: [
        {
          alt: title,
          height: 630,
          url: ogImage,
          width: 1200,
        },
      ],
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      title,
      type: "website",
      url,
    },
    robots: {
      follow: true,
      index: true,
    },
    title: { absolute: title },
    twitter: {
      card: "summary_large_image",
      description,
      images: [ogImage],
      title,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function QuizzesIndexRoute({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "quizzes" });
  const tShared = await getTranslations({
    locale,
    namespace: "groupHubShared",
  });
  const url = absoluteUrl(localePath(locale, PATH));

  const items: QuizCardModel[] = liveQuizzes().map((quiz) => ({
    ...quiz,
    image: quiz.ogImage,
    imageAlt: t("snakeTitle"),
  }));

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
        item: url,
        name: t("breadcrumbCurrent"),
        position: 2,
      },
    ],
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    description: t("metaDescription"),
    hasPart: [
      {
        "@type": "Quiz",
        name: t("snakeTitle"),
        url: quizPageUrl(locale, "snake"),
      },
    ],
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    name: t("metaTitle"),
    url,
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <QuizzesPage items={items} />
    </>
  );
}
