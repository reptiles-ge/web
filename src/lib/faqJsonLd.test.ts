import { createTranslator } from "next-intl";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import QuizSlugRoute, {
  generateStaticParams as quizStaticParams,
} from "@/app/[locale]/quiz/[slug]/page";
import RegionPage, {
  generateStaticParams as regionStaticParams,
} from "@/app/[locale]/regions/[id]/page";
import RiskToHumansRoute from "@/app/[locale]/risk-to-humans/page";
import { JsonLd } from "@/components/JsonLd";
import { getCatalogSpecies } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { routing } from "@/i18n/routing";
import { createGroupHubRoute } from "@/lib/createGroupHubRoute";
import { speciesStructuredData } from "@/lib/createSpeciesRoute";
import {
  faqPageJsonLd,
  givesFirstAidSteps,
  schemaFaqEntries,
  schemaPlainText,
} from "@/lib/faqJsonLd";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";

const messages = { en, ka, ru, tr };

vi.mock("@/i18n/navigation", async () => {
  const { pathnames } = await import("@/i18n/pathnames");
  return {
    getPathname: ({
      href,
      locale,
    }: {
      href: string | { params?: Record<string, string>; pathname: string };
      locale: string;
    }) => {
      const key = typeof href === "string" ? href : href.pathname;
      const entry = pathnames[key as keyof typeof pathnames];
      const pattern =
        typeof entry === "string" ? entry : entry[locale as keyof typeof entry];
      const path =
        typeof href === "string"
          ? pattern
          : pattern.replace(
              /\[(\w+)\]/g,
              (_match, name: string) => href.params?.[name] ?? name,
            );
      if (locale === "ka") return path;
      return path === "/" ? `/${locale}` : `/${locale}${path}`;
    },
    Link: () => null,
  };
});

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: string;
  }) =>
    createTranslator({
      locale,
      messages: messages[locale],
      namespace: namespace as "site",
    }),
  setRequestLocale: () => undefined,
}));

type FaqPage = {
  "@type": "FAQPage";
  mainEntity: Array<{ acceptedAnswer: { text: string }; name: string }>;
};

const SRC = join(__dirname, "..");

function expectPlain(pages: FaqPage[], label: string) {
  for (const page of pages) {
    expect(page.mainEntity.length, label).toBeGreaterThan(0);
    for (const entry of page.mainEntity) {
      for (const text of [entry.name, entry.acceptedAnswer.text]) {
        expect(text, label).not.toContain("](");
        expect(text, label).not.toContain("**");
        expect(text, label).not.toContain("__");
        expect(givesFirstAidSteps(text), `${label}: ${text}`).toBe(false);
      }
    }
  }
}

function faqPagesIn(node: ReactNode): FaqPage[] {
  if (Array.isArray(node)) return node.flatMap(faqPagesIn);
  if (!isValidElement<{ children?: ReactNode; data?: unknown }>(node)) {
    return [];
  }
  const own =
    node.type === JsonLd
      ? [node.props.data].flat().filter(isFaqPage)
      : ([] as FaqPage[]);
  return [...own, ...faqPagesIn(node.props.children)];
}

function isFaqPage(value: unknown): value is FaqPage {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { "@type"?: unknown })["@type"] === "FAQPage"
  );
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("schemaPlainText", () => {
  it("keeps link labels and drops Markdown emphasis and code", () => {
    expect(
      schemaPlainText(
        "The [largest viper](/snakes/didi-gvelebi) and a [toad](bufo-bufo) are **not** _the same_ `thing`.",
      ),
    ).toBe("The largest viper and a toad are not the same thing.");
  });

  it("collapses line breaks and leaves snake_case and arithmetic alone", () => {
    expect(schemaPlainText("Line one.\nLine two, 2 * 3 * 4.")).toBe(
      "Line one. Line two, 2 * 3 * 4.",
    );
    expect(schemaPlainText("id vipera_berus_x stays")).toBe(
      "id vipera_berus_x stays",
    );
  });
});

describe("givesFirstAidSteps", () => {
  it("flags bite first-aid steps in every locale", () => {
    for (const answer of [
      "Call 112. Have the person lie down. Do not cut the bite.",
      "დაზარალებული დააწვინეთ, ნაკბენი არ გაჭრათ.",
      "Уложите пострадавшего, не накладывайте жгут.",
      "Yaralıyı yatırın ve sıkı bir turnike uygulamayın.",
      "If it bites you, wash the wound with soap and water.",
    ]) {
      expect(givesFirstAidSteps(answer), answer).toBe(true);
    }
  });

  it("keeps answers that only say to call 112 or to wash hands after touching", () => {
    for (const answer of [
      "It is venomous. If bitten, call 112 immediately.",
      "დაუყოვნებლივ დარეკეთ 112-ზე.",
      "Do not pick it up; wash your hands after touching it.",
      "Если вы её коснулись, вымойте руки водой с мылом.",
    ]) {
      expect(givesFirstAidSteps(answer), answer).toBe(false);
    }
  });

  it("leaves a question out of FAQPage markup but keeps the others", () => {
    const entries = [
      { answer: "It is venomous. Call 112.", question: "Is it venomous?" },
      {
        answer: "Call 112. Have the person lie down.",
        question: "What should I do if bitten?",
      },
    ];
    expect(schemaFaqEntries(entries)).toEqual([entries[0]]);
    expect(faqPageJsonLd([entries[1]])).toBeNull();
  });
});

describe("FAQPage generators", () => {
  it("are all built through faqPageJsonLd", () => {
    const owners = sourceFiles(SRC)
      .filter((path) => readFileSync(path, "utf8").includes('"FAQPage"'))
      .map((path) => relative(SRC, path));
    expect(owners).toEqual(["lib/faqJsonLd.ts"]);
  });

  it("write plain text without first-aid steps on species pages", () => {
    for (const raw of getCatalogSpecies()) {
      for (const locale of routing.locales) {
        const item = localizeSpecies(raw, locale);
        const pages = (
          speciesStructuredData({
            breadcrumbCrumbs: [{ name: item.commonName }],
            galleryTitle: "gallery",
            item,
            locale,
            ogImage: item.image,
            pageUrl: "https://reptiles.ge/species",
            raw,
          }) as unknown[]
        ).filter(isFaqPage);
        expectPlain(pages, `${raw.id}/${locale}`);
      }
    }
  });

  it("drop the giurza bite steps but keep its other questions", () => {
    const raw = getCatalogSpecies().find(
      (entry) => entry.id === "macrovipera-lebetina",
    )!;
    for (const locale of routing.locales) {
      const item = localizeSpecies(raw, locale);
      const page = (
        speciesStructuredData({
          breadcrumbCrumbs: [{ name: item.commonName }],
          galleryTitle: "gallery",
          item,
          locale,
          ogImage: item.image,
          pageUrl: "https://reptiles.ge/species",
          raw,
        }) as unknown[]
      ).find(isFaqPage);
      const questions = page?.mainEntity.map((entry) => entry.name) ?? [];
      expect(questions, locale).toHaveLength((item.faq?.length ?? 0) - 1);
      expect(questions, locale).not.toContain(item.faq?.[4]?.question);
      expect(questions, locale).toContain(item.faq?.[3]?.question);
    }
  });

  it("leave out the same species questions in every locale", () => {
    const counts = (locale: (typeof routing.locales)[number]) =>
      getCatalogSpecies().map((raw) => {
        const faq = localizeSpecies(raw, locale).faq ?? [];
        return `${raw.id}:${faq.length - schemaFaqEntries(faq).length}`;
      });
    for (const locale of routing.locales) {
      expect(counts(locale), locale).toEqual(counts("ka"));
    }
  });

  it("write plain text on group hubs", async () => {
    for (const hubId of Object.keys(GROUP_HUBS) as GroupHubId[]) {
      const { Page } = createGroupHubRoute(hubId);
      for (const locale of routing.locales) {
        const tree = await Page({ params: Promise.resolve({ locale }) });
        const pages = faqPagesIn(tree);
        expect(pages, `${hubId}/${locale}`).toHaveLength(1);
        expectPlain(pages, `${hubId}/${locale}`);
      }
    }
  });

  it("write plain text on region pages", async () => {
    let seen = 0;
    for (const params of regionStaticParams()) {
      const tree = await RegionPage({ params: Promise.resolve(params) });
      const pages = faqPagesIn(tree);
      seen += pages.length;
      expectPlain(pages, `${params.id}/${params.locale}`);
    }
    expect(seen).toBeGreaterThan(0);
  });

  it("write plain text on quiz and risk pages", async () => {
    for (const params of quizStaticParams()) {
      const pages = faqPagesIn(
        await QuizSlugRoute({ params: Promise.resolve(params) }),
      );
      expect(pages, params.slug).toHaveLength(1);
      expectPlain(pages, `${params.slug}/${params.locale}`);
    }
    for (const locale of routing.locales) {
      const pages = faqPagesIn(
        await RiskToHumansRoute({ params: Promise.resolve({ locale }) }),
      );
      expect(pages, locale).toHaveLength(1);
      expectPlain(pages, `risk/${locale}`);
    }
  });
});
