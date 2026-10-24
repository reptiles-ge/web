import { describe, expect, it } from "vitest";

import type { NewsSection } from "@/data/newsTypes";

import { NEWS_ARTICLES } from "@/data/news.generated";
import { locales } from "@/i18n/locales";

import {
  newsDocFigures,
  newsDocToSections,
  newsSectionIssues,
  newsSectionsToDoc,
} from "./newsDoc";

describe("news editor document", () => {
  it("round-trips every article body in every locale without a change", () => {
    let checked = 0;
    for (const article of NEWS_ARTICLES) {
      for (const locale of locales) {
        const copy = article.copy[locale];
        if (!copy) continue;
        expect(newsDocToSections(newsSectionsToDoc(copy.sections))).toEqual(
          copy.sections,
        );
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(NEWS_ARTICLES.length);
  });

  it("turns every kind of mark into editor text and back", () => {
    const sections: NewsSection[] = [
      {
        blocks: [
          {
            parts: [
              "Read ",
              { href: "https://example.org", label: "this", type: "external" },
              " about ",
              {
                id: "vipera-dinniki",
                label: "Dinnik's viper",
                type: "species",
              },
              " (",
              { name: "Vipera dinniki", type: "sci" },
              ") in ",
              { id: "kakheti", label: "Kakheti", type: "region" },
              ", ",
              { id: "snakes", label: "snakes", type: "hub" },
              ", ",
              {
                label: "Sandro",
                slug: "sandro-khakhva",
                type: "credit-author",
              },
              " and ",
              { label: "news", type: "news-index" },
              ".",
            ],
            type: "p",
          },
          { src: "https://cdn.reptiles.ge/a.jpg", type: "figure" },
        ],
        heading: "Heading",
      },
    ];
    const doc = newsSectionsToDoc(sections);
    expect(newsDocFigures(doc)).toEqual(["https://cdn.reptiles.ge/a.jpg"]);
    expect(newsDocToSections(doc)).toEqual(sections);
  });

  it("joins split text, drops empty paragraphs and blank link labels", () => {
    const doc = {
      content: [
        {
          content: [
            {
              content: [{ text: " Title ", type: "text" }],
              type: "sectionHeading",
            },
            {
              content: [
                { text: "One ", type: "text" },
                { text: "two", type: "text" },
                {
                  marks: [
                    {
                      attrs: { kind: "species", target: "a" },
                      type: "newsLink",
                    },
                  ],
                  text: "A",
                  type: "text",
                },
                {
                  marks: [
                    {
                      attrs: { kind: "species", target: "a" },
                      type: "newsLink",
                    },
                  ],
                  text: "B",
                  type: "text",
                },
                {
                  marks: [{ type: "sci" }],
                  text: " ",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
            { type: "paragraph" },
          ],
          type: "section",
        },
        { content: [{ type: "sectionHeading" }], type: "section" },
      ],
      type: "doc",
    };
    const sections = newsDocToSections(doc);
    expect(sections).toEqual([
      {
        blocks: [
          {
            parts: ["One two", { id: "a", label: "AB", type: "species" }, " "],
            type: "p",
          },
        ],
        heading: "Title",
      },
      { blocks: [], heading: "" },
    ]);
    expect(newsSectionIssues(sections)).toEqual([
      "Section 2 needs a heading.",
      "Section 2 needs at least one paragraph or photo.",
    ]);
  });
});
