import { JsonLd } from "@/components/JsonLd";
import { QuizzesPage, type QuizCardModel } from "@/components/QuizzesPage";
import { openGraphLocale } from "@/i18n/localeMeta";
import { routing, type AppLocale } from "@/i18n/routing";
import { liveQuizzes } from "@/lib/quizzes";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  quizPageUrl,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const PATH = "/quiz";
const OG_IMAGE = "/images/guides/snake-quiz-og.jpg";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
    title: { absolute: title },
    description,
    keywords: t("keywords")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    alternates: localeAlternates(locale, PATH),
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: openGraphLocale(locale),
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
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
        position: 1,
        name: tShared("breadcrumbHome"),
        item: absoluteUrl(localePath(locale, "/")),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumbCurrent"),
        item: url,
      },
    ],
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url,
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    hasPart: [
      {
        "@type": "Quiz",
        name: t("snakeTitle"),
        url: quizPageUrl(locale, "snake"),
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <QuizzesPage items={items} />
    </>
  );
}
