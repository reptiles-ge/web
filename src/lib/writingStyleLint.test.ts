import { describe, expect, it } from "vitest";

import {
  lintFieldStyle,
  lintHedgeLoss,
  lintSpeciesStyle,
  splitSentences,
} from "@/lib/writingStyleLint";

const rules = (issues: { rule: string }[]) => issues.map(({ rule }) => rule);

describe("writing style lint", () => {
  it("passes the approved reference overview", () => {
    expect(
      lintFieldStyle(
        "გიურზა საქართველოს ყველაზე დიდი გველგესლაა და ერთადერთი, რომელიც კვერცხს დებს. აღმოსავლეთის მშრალ, ქვიან ფერდობებზე ცხოვრობს, შირაქიდან და გარეჯიდან ქვემო ქართლის მთისწინეთამდე. ბოლო ათწლეულებში ალაზნის ხეობამდე და თბილისამდეც მიაღწია. მისი ნაკბენი ჩვენს გველებს შორის ერთ-ერთი ყველაზე საშიშია. ლაქებიანი ზურგით კი უწყინარ მცურავებს ჰგავს. ამიტომ ლაქებს ნუ ენდობით და ახლოს ნუ მიხვალთ.",
        "overview",
        "ka",
        "გიურზა",
      ),
    ).toEqual([]);
  });

  it("flags site talk, comma thousands and a colon label", () => {
    expect(
      rules(
        lintFieldStyle(
          "გიურზა: 1,500 მ-მდე გვხვდება. ამ ატლასში ასე წერია.",
          "description",
          "ka",
        ),
      ),
    ).toEqual(["R13", "R14", "R13"]);
  });

  it("flags a repeated subject and stacked hedges", () => {
    const issues = lintFieldStyle(
      "გიურზა მშრალ ადგილებში ცხოვრობს. გიურზას ჩვეულებრივ შეიძლება დაახლოებით ერთი მეტრი ჰქონდეს.",
      "habitat",
      "ka",
      "გიურზა",
    );
    expect(rules(issues)).toEqual(["R4", "R5", "R5"]);
  });

  it("flags one-line FAQ answers and one-sentence paragraphs", () => {
    expect(rules(lintFieldStyle("Yes.", "faq.0.answer", "en"))).toEqual(["R8"]);
    expect(
      rules(
        lintFieldStyle(
          "It lives on dry slopes. It hides under stones.\nIt is rare.",
          "habitat",
          "en",
        ),
      ),
    ).toEqual(["R8"]);
  });

  it("keeps abbreviated genus names inside one sentence", () => {
    expect(splitSentences("It differs from D. rudis by colour. Done.")).toEqual(
      ["It differs from D. rudis by colour.", "Done."],
    );
  });

  it("reads every prose field from MDX frontmatter", () => {
    const raw = `---\ncommonName: გიურზა\ndescription: "გიურზა: მაღალი რისკის გველგესლა."\nfaq:\n  - question: საშიშია?\n    answer: დიახ.\n---\n`;
    expect(
      lintSpeciesStyle(raw, "ka").map(({ field, rule }) => `${field}:${rule}`),
    ).toEqual(["description:R13", "faq.0.answer:R8"]);
  });

  it("flags removed hedges in KA and EN by whole word", () => {
    expect(
      lintHedgeLoss(
        "ჩვეულებრივ აპრილიდან აქტიურია. შხამმა შეიძლება სისხლდენა გამოიწვიოს.",
        "აპრილიდან აქტიურია. შხამი სისხლდენას იწვევს.",
        "behavior",
        "ka",
      ).map(({ message }) => message.split(" ")[1]),
    ).toEqual(["„ჩვეულებრივ“", "„შეიძლება“"]);
    expect(
      lintHedgeLoss("Maybe it bites.", "It bites.", "faq.0.answer", "en"),
    ).toEqual([]);
    expect(
      lintHedgeLoss("It may bite.", "It bites.", "faq.0.answer", "en"),
    ).toHaveLength(1);
    expect(lintHedgeLoss("Может укусить.", "", "diet", "ru")).toEqual([]);
  });
});
