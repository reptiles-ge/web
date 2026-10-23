import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ClientMessagesProvider } from "@/components/ClientMessagesProvider";
import { JsonLd } from "@/components/JsonLd";
import { OptimizedImageScope } from "@/components/OptimizedImageScope";
import { QuizLanding } from "@/components/QuizLanding";
import { QuizPlayer } from "@/components/QuizPlayer";
import { openGraphLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import { faqPageJsonLd } from "@/lib/faqJsonLd";
import { kaMetaDescriptionOverride } from "@/lib/kaMetaDescriptionOverrides";
import { quizStaticParams, resolveQuizBySlug } from "@/lib/quizzes";
import { INDEXABLE_ROBOTS } from "@/lib/robots";
import {
  absoluteUrl,
  localePath,
  quizAlternates,
  quizPageUrl,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { getLizardQuizCatalog, getSnakeQuizCatalog } from "@/lib/snakeQuiz";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";
import { quizDateFields } from "@/lib/structuredDataDates";

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
  const url = quizPageUrl(locale, quiz.id);
  const description = kaMetaDescriptionOverride(
    locale,
    new URL(url).pathname,
    t("metaDescription"),
  );
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
    robots: INDEXABLE_ROBOTS,
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
  const catalog = await getSpeciesCatalog(locale, "quiz");
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
    ...(await quizDateFields(quiz.id, locale)),
    description: t("metaDescription"),
    educationalLevel: "beginner",
    inLanguage: locale,
    isPartOf: { "@id": siteEntityId("website") },
    name: t("metaTitle"),
    url,
  };

  const faqLd = faqPageJsonLd(
    [1, 2, 3, 4].map((n) => ({
      answer: t(`faq${n}A` as Parameters<typeof t>[0]),
      question: t(`faq${n}Q` as Parameters<typeof t>[0]),
    })),
  );

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={pageLd} />
      {faqLd ? <JsonLd data={faqLd} /> : null}
      <ClientMessagesProvider
        locale={locale}
        namespaces={["groupHubShared", "quizzes", quiz.messageNamespace]}
      >
        <OptimizedImageScope>
          <QuizPlayer pool={pool} quizId={quiz.id} shareUrl={url} />
        </OptimizedImageScope>
        <QuizLanding
          locale={locale}
          namespace={quiz.messageNamespace}
          pool={pool}
          quizId={quiz.id}
          species={catalog}
        />
      </ClientMessagesProvider>
    </>
  );
}
