import { JsonLd } from "@/components/JsonLd";
import { SnakeQuizPage } from "@/components/SnakeQuizPage";
import { getCatalogSpecies } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  absoluteUrl,
  cdnOgImageUrl,
  localeAlternates,
  localePath,
  siteConfig,
  siteEntityId,
} from "@/lib/site";
import { getSnakeQuizCatalog, QUIZ_LENGTH } from "@/lib/snakeQuiz";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const PATH = "/quiz/gvelis-identifikacia";
const OG_SPECIES = "macrovipera-lebetina";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};

  const locale = localeParam as AppLocale;
  const t = await getTranslations({ locale, namespace: "snakeQuiz" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const url = absoluteUrl(localePath(locale, PATH));
  const ogImage = cdnOgImageUrl(OG_SPECIES);

  return {
    title,
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
      locale: locale === "en" ? "en_US" : siteConfig.locale,
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

export default async function SnakeIdentifyQuizRoute({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "snakeQuiz" });
  const tShared = await getTranslations({
    locale,
    namespace: "groupHubShared",
  });
  const tSnakes = await getTranslations({ locale, namespace: "snakes" });
  const url = absoluteUrl(localePath(locale, PATH));
  const snakes = getSnakeQuizCatalog(
    getCatalogSpecies().map((item) => localizeSpecies(item, locale)),
  );

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
        name: tSnakes("breadcrumbCurrent"),
        item: absoluteUrl(localePath(locale, "/snakes")),
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
      name: locale === "en" ? "Snakes of Georgia" : "საქართველოს გველები",
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
      <SnakeQuizPage snakes={snakes} />
    </>
  );
}
