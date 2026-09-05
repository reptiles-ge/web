import type { AppLocale } from "@/i18n/routing";
import type { ClusterGuidePath } from "@/lib/clusterGuides";

export type SafetyGuideConfig = {
  dangerCount: 4;
  doCount: 5 | 6;
  dontCount: 5 | 6;
  externalCount: 3 | 4;
  externalHrefs: Record<AppLocale, Record<number, string>>;
  extraLinks: readonly SafetyLink[];
  namespace: SafetyNamespace;
  showSymptoms: boolean;
  showUnseen: boolean;
  siteSourceCount: 2;
  speciesIndexHref: SafetyLinkHref;
  summaryCount: 4;
  symptomCount?: 6;
};

type SafetyLink = {
  href: SafetyLinkHref;
  key: SafetyLinkKey;
};

type SafetyLinkHref = "/lizards" | "/risk-to-humans" | ClusterGuidePath;

type SafetyLinkKey = "linkHub" | "linkIndex" | "linkRisk" | "linkVenomous";

type SafetyNamespace = "mammalBear" | "spiderBite";

export const SPIDER_BITE_CONFIG: SafetyGuideConfig = {
  dangerCount: 4,
  doCount: 5,
  dontCount: 5,
  externalCount: 4,
  externalHrefs: {
    en: {
      1: "https://112.gov.ge/?lang=en&page_id=1686",
      2: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-spiders.html",
      3: "https://doi.org/10.1016/j.toxicon.2004.02.006",
      4: "https://doi.org/10.1016/j.toxicon.2013.07.020",
    },
    ka: {
      1: "https://112.gov.ge/?page_id=599",
      2: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-spiders.html",
      3: "https://doi.org/10.1016/j.toxicon.2004.02.006",
      4: "https://doi.org/10.1016/j.toxicon.2013.07.020",
    },
    ru: {
      1: "https://112.gov.ge/?lang=en&page_id=1686",
      2: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-spiders.html",
      3: "https://doi.org/10.1016/j.toxicon.2004.02.006",
      4: "https://doi.org/10.1016/j.toxicon.2013.07.020",
    },
    tr: {
      1: "https://112.gov.ge/?lang=en&page_id=1686",
      2: "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-spiders.html",
      3: "https://doi.org/10.1016/j.toxicon.2004.02.006",
      4: "https://doi.org/10.1016/j.toxicon.2013.07.020",
    },
  },
  extraLinks: [
    { href: "/spiders/shxamiani-obobebi", key: "linkVenomous" },
    { href: "/spiders", key: "linkHub" },
    { href: "/risk-to-humans", key: "linkRisk" },
  ],
  namespace: "spiderBite",
  showSymptoms: true,
  showUnseen: true,
  siteSourceCount: 2,
  speciesIndexHref: "/spiders",
  summaryCount: 4,
  symptomCount: 6,
};

export const BEAR_ENCOUNTER_CONFIG: SafetyGuideConfig = {
  dangerCount: 4,
  doCount: 5,
  dontCount: 5,
  externalCount: 4,
  externalHrefs: {
    en: {
      1: "https://112.gov.ge/?lang=en&page_id=1686",
      2: "https://www.bearsinmind.org/en/projecten/human-carnivore-conflict-study-in-georgia/",
      3: "https://doi.org/10.2192/09GR017.1",
      4: "https://matsne.gov.ge/ka/document/view/2256983/0",
    },
    ka: {
      1: "https://112.gov.ge/?page_id=599",
      2: "https://www.bearsinmind.org/en/projecten/human-carnivore-conflict-study-in-georgia/",
      3: "https://doi.org/10.2192/09GR017.1",
      4: "https://matsne.gov.ge/ka/document/view/2256983/0",
    },
    ru: {
      1: "https://112.gov.ge/?lang=en&page_id=1686",
      2: "https://www.bearsinmind.org/en/projecten/human-carnivore-conflict-study-in-georgia/",
      3: "https://doi.org/10.2192/09GR017.1",
      4: "https://matsne.gov.ge/ka/document/view/2256983/0",
    },
    tr: {
      1: "https://112.gov.ge/?lang=en&page_id=1686",
      2: "https://www.bearsinmind.org/en/projecten/human-carnivore-conflict-study-in-georgia/",
      3: "https://doi.org/10.2192/09GR017.1",
      4: "https://matsne.gov.ge/ka/document/view/2256983/0",
    },
  },
  extraLinks: [
    { href: "/mammals", key: "linkHub" },
    { href: "/mammals/saxeoebebi", key: "linkIndex" },
  ],
  namespace: "mammalBear",
  showSymptoms: false,
  showUnseen: false,
  siteSourceCount: 2,
  speciesIndexHref: "/mammals/saxeoebebi",
  summaryCount: 4,
};
