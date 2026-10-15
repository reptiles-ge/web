import { describe, expect, it } from "vitest";

import {
  getHerpetofaunaChecklistStatus,
  herpetofaunaChecklistIds,
  isHerpetofaunaGroup,
} from "@/data/herpetofauna-checklist";
import { getCatalogSpecies } from "@/data/species";
import { getCatalogSpeciesByGroup } from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { routing } from "@/i18n/routing";
import { hubCandidateSpecies, hubFaqValues } from "@/lib/groupHubFaqValues";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";

const MESSAGES = { en, ka, ru, tr } as const;

const herpHubs = (Object.keys(GROUP_HUBS) as GroupHubId[]).filter((hubId) =>
  isHerpetofaunaGroup(GROUP_HUBS[hubId].group),
);

function faq1A(locale: keyof typeof MESSAGES, hubId: GroupHubId) {
  const namespace = (MESSAGES[locale] as Record<string, unknown>)[
    GROUP_HUBS[hubId].messageKey
  ] as Record<string, string>;
  return namespace.faq1A;
}

describe("hub FAQ checklist candidates", () => {
  it("lists every published candidate taxon of the hub group and nothing else", () => {
    const published = new Set(getCatalogSpecies().map((item) => item.id));
    for (const hubId of herpHubs) {
      const group = GROUP_HUBS[hubId].group;
      const expected = herpetofaunaChecklistIds()
        .filter(
          (id) =>
            published.has(id) &&
            getHerpetofaunaChecklistStatus(id) === "candidate",
        )
        .filter((id) =>
          getCatalogSpeciesByGroup(group).some((item) => item.id === id),
        )
        .sort();
      const listed = hubCandidateSpecies(getCatalogSpeciesByGroup(group))
        .map((item) => item.id)
        .sort();
      expect(listed, hubId).toEqual(expected);
    }
  });

  it("names each candidate in the rendered list and no confirmed species", () => {
    for (const hubId of herpHubs) {
      for (const locale of routing.locales) {
        const species = getCatalogSpeciesByGroup(GROUP_HUBS[hubId].group).map(
          (item) => localizeSpecies(item, locale),
        );
        const { candidates } = hubFaqValues(species, locale);
        const lower = candidates.toLocaleLowerCase(locale);
        for (const item of species) {
          const name = item.commonName.toLocaleLowerCase(locale);
          const isCandidate =
            getHerpetofaunaChecklistStatus(item.id) === "candidate";
          if (isCandidate) {
            expect(lower, `${locale} ${hubId} ${item.id}`).toContain(name);
          } else if (
            !species.some(
              (other) =>
                other.id !== item.id &&
                getHerpetofaunaChecklistStatus(other.id) === "candidate" &&
                other.commonName.toLocaleLowerCase(locale).includes(name),
            )
          ) {
            expect(lower, `${locale} ${hubId} ${item.id}`).not.toContain(name);
          }
        }
      }
    }
  });

  it("fills the candidate names from the checklist data in every locale", () => {
    for (const hubId of herpHubs) {
      const hasCandidates =
        hubCandidateSpecies(getCatalogSpeciesByGroup(GROUP_HUBS[hubId].group))
          .length > 0;
      for (const locale of routing.locales) {
        const answer = faq1A(locale, hubId);
        expect(answer.includes("{candidates}"), `${locale} ${hubId}`).toBe(
          hasCandidates,
        );
      }
    }
  });
});
