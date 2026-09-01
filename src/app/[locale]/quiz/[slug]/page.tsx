import { JsonLd } from "@/components/JsonLd";
import { QuizLanding } from "@/components/QuizLanding";
import { QuizPlayer } from "@/components/QuizPlayer";
import { getCatalogSpecies } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { routing, type AppLocale } from "@/i18n/routing";
import { openGraphLocale } from "@/i18n/localeMeta";
import {
  quizStaticParams,
  resolveQuizBySlug,
} from "@/lib/quizzes";
import {
  absoluteUrl,
  localePath,
  quizAlternates,
  quizPageUrl,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { getSnakeQuizCatalog, QUIZ_LENGTH } from "@/lib/snakeQuiz";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const OG_SIZE = { width: 1200, height: 630 };

export const dynamicParams = false;

export function generateStaticParams() {
  return quizStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const quiz = resolveQuizBySlug(locale, slug);
  if (!quiz) return {};

  const t = await getTranslations({
    locale,
    namespace: quiz.messageNamespace,
  });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const url = quizPageUrl(locale, quiz.id);
  const ogImage = absoluteUrl(quiz.ogImage);

  return {
    title: { absolute: title },
    description,
    keywords: t("keywords")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    alternates: quizAlternates(locale, quiz.id),
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
          width: OG_SIZE.width,
          height: OG_SIZE.height,
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

export default async function QuizSlugRoute({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  const quiz = resolveQuizBySlug(locale, slug);
  if (!quiz) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: quiz.messageNamespace,
  });
  const tShared = await getTranslations({
    locale,
    namespace: "groupHubShared",
  });
  const tQuizzes = await getTranslations({ locale, namespace: "quizzes" });
  const url = quizPageUrl(locale, quiz.id);
  const catalog = getCatalogSpecies().map((item) =>
    localizeSpecies(item, locale),
  );
  const snakes = getSnakeQuizCatalog(catalog);

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
        name: tQuizzes("breadcrumbCurrent"),
        item: absoluteUrl(localePath(locale, "/quiz")),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("breadcrumbCurrent"),
        item: url,
      },
    ],
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url,
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    about: {
      "@type": "Thing",
      name: t("title"),
    },
    educationalLevel: "beginner",
    numberOfQuestions: QUIZ_LENGTH,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4].map((n) => ({
      "@type": "Question",
      name: t(`faq${n}Q` as Parameters<typeof t>[0]),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq${n}A` as Parameters<typeof t>[0]),
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <JsonLd data={faqLd} />
      <QuizPlayer quizId={quiz.id} snakes={snakes} shareUrl={url} />
      <QuizLanding snakes={snakes} species={catalog} />
    </>
  );
}
