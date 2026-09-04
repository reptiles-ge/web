import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { QuizLanding } from "@/components/QuizLanding";
import { QuizPlayer } from "@/components/QuizPlayer";
import { getCatalogSpecies } from "@/data/species";
import { openGraphLocale } from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { type AppLocale, routing } from "@/i18n/routing";
import { quizStaticParams, resolveQuizBySlug } from "@/lib/quizzes";
import {
  absoluteUrl,
  localePath,
  quizAlternates,
  quizPageUrl,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import {
  getLizardQuizCatalog,
  getSnakeQuizCatalog,
  QUIZ_LENGTH,
} from "@/lib/snakeQuiz";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const OG_SIZE = { height: 630, width: 1200 };

export const dynamicParams = false;

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
    alternates: quizAlternates(locale, quiz.id),
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
          height: OG_SIZE.height,
          url: ogImage,
          width: OG_SIZE.width,
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
  return quizStaticParams();
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

  const [t, tShared, tQuizzes] = await Promise.all([
    getTranslations({
      locale,
      namespace: quiz.messageNamespace,
    }),
    getTranslations({
      locale,
      namespace: "groupHubShared",
    }),
    getTranslations({ locale, namespace: "quizzes" }),
  ]);
  const url = quizPageUrl(locale, quiz.id);
  const catalog = getCatalogSpecies().map((item) =>
    localizeSpecies(item, locale),
  );
  const pool =
    quiz.generator === "lizard"
      ? getLizardQuizCatalog(catalog)
      : getSnakeQuizCatalog(catalog);

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
        item: absoluteUrl(localePath(locale, "/quiz")),
        name: tQuizzes("breadcrumbCurrent"),
        position: 2,
      },
      {
        "@type": "ListItem",
        item: url,
        name: t("breadcrumbCurrent"),
        position: 3,
      },
    ],
  };

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    about: {
      "@type": "Thing",
      name: t("title"),
    },
    description: t("metaDescription"),
    educationalLevel: "beginner",
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    name: t("metaTitle"),
    numberOfQuestions: QUIZ_LENGTH,
    url,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4].map((n) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq${n}A` as Parameters<typeof t>[0]),
      },
      name: t(`faq${n}Q` as Parameters<typeof t>[0]),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      <JsonLd data={faqLd} />
      <QuizPlayer pool={pool} quizId={quiz.id} shareUrl={url} />
      <QuizLanding
        namespace={quiz.messageNamespace}
        pool={pool}
        quizId={quiz.id}
        species={catalog}
      />
    </>
  );
}
