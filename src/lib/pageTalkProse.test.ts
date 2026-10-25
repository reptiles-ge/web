import { describe, expect, it } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import {
  addedPageTalk,
  findPageTalk,
  findPageTalkInRecord,
} from "@/lib/pageTalkProse";

describe("findPageTalk", () => {
  it.each<[AppLocale, string]>([
    ["en", "A tabulated Georgian diet study is not given on this page."],
    ["en", "This page does not colour a municipality-by-municipality map."],
    [
      "en",
      "The sources used on this profile do not specify the diet of Anguis colchica.",
    ],
    [
      "en",
      "This atlas does not yet have a separate page for Levant sparrowhawk.",
    ],
    [
      "en",
      "The atlas map is left uncoloured until named localities are listed.",
    ],
    ["en", "The map below shows only publicly posted records."],
    ["en", "Only regions on the records-by-region table are shaded."],
    [
      "en",
      "A region is shaded only when the records table lists enough records.",
    ],
    ["ka", "ცალკე აწონილი ქართული კვების ცხრილი ამ გვერდზე არ არის."],
    ["ka", "ამ პროფილზე გამოყენებული წყაროები დიეტას ცალკე არ აზუსტებს."],
    ["ka", "ეს გვერდი მუნიციპალიტეტების რუკას არ აფერადებს."],
    ["ka", "ატლასის რუკაზე მონიშნულია თბილისი, ქვემო ქართლი და კახეთი."],
    ["ka", "ამ ატლასში ქორცქვიტას ცალკე გვერდი ჯერ არ არის."],
    ["ru", "Отдельного грузинского исследования рациона на этой странице нет."],
    ["ru", "Эта страница не раскрашивает карту по муниципалитетам."],
    ["ru", "Отдельной страницы тювика в этом атласе пока нет."],
    ["ru", "Источники, использованные в этом профиле, не уточняют рацион."],
    ["tr", "Bu sayfada ayrı bir Gürcistan diyet çalışması yoktur."],
    ["tr", "Bu profilde kullanılan kaynaklar beslenmesini ayrıca belirtmez."],
    ["tr", "Bu atlasın henüz Levant atmacası için ayrı bir sayfası yoktur."],
  ])("flags %s: %s", (locale, text) => {
    expect(findPageTalk(text, locale)).not.toEqual([]);
  });

  it.each<[AppLocale, string]>([
    ["en", "These places are not a complete list of its range."],
    ["en", "It is recorded in Kakheti and Tbilisi."],
    ["en", "The 2024 checklist confirms it at country level as a resident."],
    ["en", "The page of a book is not a habitat."],
    ["ka", "ეს ადგილები მისი გავრცელების სრული სია არ არის."],
    ["ka", "2024 წლის ჩამონათვალი მას რეზიდენტად ადასტურებს."],
    ["ka", "გვერდზე გამოკვეთილი ნაოჭი არ უჩანს."],
    ["ru", "Эти места не полный список ареала."],
    ["ru", "На странице книги он не живёт, а в Кахетии встречается."],
    ["tr", "Bu yerler yayılışının tam listesi değildir."],
  ])("leaves %s alone: %s", (locale, text) => {
    expect(findPageTalk(text, locale)).toEqual([]);
  });
});

describe("findPageTalkInRecord", () => {
  it("names the locale and field of every hit, nested fields included", () => {
    expect(
      findPageTalkInRecord({
        base: {
          diet: "ამ გვერდზე კვების ცხრილი არ არის.",
          faq: [{ answer: "კი.", question: "ბუდობს?" }],
          sources: [{ name: "ამ გვერდზე", url: "https://example.org" }],
        } as never,
        translations: {
          en: {
            faq: [
              {
                answer: "Diet is not tabulated on this page.",
                question: "Diet?",
              },
            ],
          },
        },
      }),
    ).toEqual([
      { field: "diet", locale: "ka", match: "ამ გვერდ" },
      {
        field: "faq.0.answer",
        locale: "en",
        match: "not tabulated on this page",
      },
    ]);
  });
});

describe("addedPageTalk", () => {
  const before = {
    base: { habitat: "ეს გვერდი რუკას არ აფერადებს. ტყეში ცხოვრობს." },
    translations: { en: { habitat: "This page does not colour a map." } },
  };

  it("lets an edit keep or remove page talk that was already there", () => {
    expect(addedPageTalk(before, before)).toEqual([]);
    expect(
      addedPageTalk(before, {
        base: { habitat: "ტყეში ცხოვრობს." },
        translations: { en: { habitat: "It lives in forest." } },
      }),
    ).toEqual([]);
  });

  it("refuses new page talk in any field or locale", () => {
    expect(
      addedPageTalk(before, {
        ...before,
        translations: {
          en: {
            diet: "Diet is not given on this page.",
            habitat: "This page does not colour a map.",
          },
        },
      }),
    ).toEqual([
      { field: "diet", locale: "en", match: "not given on this page" },
    ]);
  });

  it("checks a whole new record when there is no previous one", () => {
    expect(
      addedPageTalk(null, {
        base: { overview: "ამ ატლასში ცალკე გვერდი აქვს." },
      }),
    ).toEqual([{ field: "overview", locale: "ka", match: "ამ ატლას" }]);
  });
});
