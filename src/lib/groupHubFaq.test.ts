import { describe, expect, it } from "vitest";

import { hubFaqLinks } from "@/lib/groupHubFaq";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";

const LOCALES = { en, ka, ru, tr } as const;
const TAG = /<([a-z]+)>/g;

function faqAnswer(
  messages: (typeof LOCALES)[keyof typeof LOCALES],
  hubId: GroupHubId,
  n: number,
) {
  const namespace = (messages as Record<string, unknown>)[
    GROUP_HUBS[hubId].messageKey
  ] as Record<string, unknown> | undefined;
  const answer = namespace?.[`faq${n}A`];
  return typeof answer === "string" ? answer : null;
}

describe("group hub FAQ links", () => {
  const hubIds = Object.keys(GROUP_HUBS) as GroupHubId[];

  it("matches the link tags in every locale", () => {
    for (const hubId of hubIds) {
      for (let n = 1; n <= 8; n += 1) {
        const expected = Object.keys(hubFaqLinks(hubId, n) ?? {}).sort();
        for (const [locale, messages] of Object.entries(LOCALES)) {
          const answer = faqAnswer(messages, hubId, n);
          if (answer === null) continue;
          const tags = [...answer.matchAll(TAG)].map((match) => match[1]);
          expect(tags.sort(), `${locale} ${hubId}.faq${n}A`).toEqual(expected);
        }
      }
    }
  });
});
