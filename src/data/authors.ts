import type { AppLocale } from "@/i18n/routing";

import { pickLocalized } from "@/i18n/localeMeta";

export type AuthorKind = "page" | "person";

export type AuthorProfile = {
  affiliations: AuthorAffiliationId[];
  aliases: string[];
  bio?: string;
  id: string;
  isContributor: boolean;
  jobTitle: AuthorJobTitle | null;
  kind: AuthorKind;
  links: {
    facebook?: string;
    inaturalist?: string;
    instagram?: string;
    researchGate?: string;
  };
  metaDescription?: string;
  name: string;
  photoCount: number;
  portraitClass: null | string;
  portraitSrc: null | string;
  publishedAt: null | string;
  role: AuthorRole | null;
  updatedAt: null | string;
};

export type AuthorRole =
  "herpetologist" | "photographer" | "professor" | "ranger" | "researcher";

export type ContributorProfile = AuthorProfile & {
  portraitSrc: string;
  role: AuthorRole;
};

type AuthorAffiliationId =
  | "borjomi-kharagauli-national-park"
  | "connecticut-college"
  | "georgian-society-of-nature-friends"
  | "ilia-state-university"
  | "institute-of-zoology"
  | "naturehistorium";

type AuthorJobTitle = "director" | "professor" | "ranger" | "researcher";

const AFFILIATION_NAMES: Record<
  AuthorAffiliationId,
  { en: string; ka: string; ru: string; tr: string }
> = {
  "borjomi-kharagauli-national-park": {
    en: "Borjomi-Kharagauli National Park",
    ka: "ბორჯომ-ხარაგაულის ეროვნული პარკი",
    ru: "Боржомско-Харагаульский национальный парк",
    tr: "Borjomi-Kharagauli Millî Parkı",
  },
  "connecticut-college": {
    en: "Connecticut College",
    ka: "Connecticut College",
    ru: "Connecticut College",
    tr: "Connecticut College",
  },
  "georgian-society-of-nature-friends": {
    en: "Georgian Society of Nature Friends",
    ka: "საქართველოს ბუნების მეგობრები",
    ru: "Georgian Society of Nature Friends",
    tr: "Georgian Society of Nature Friends",
  },
  "ilia-state-university": {
    en: "Ilia State University",
    ka: "ილიას სახელმწიფო უნივერსიტეტი",
    ru: "Государственный университет Ильи",
    tr: "Ilia Devlet Üniversitesi",
  },
  "institute-of-zoology": {
    en: "Institute of Zoology",
    ka: "ზოოლოგიის ინსტიტუტი",
    ru: "Институт зоологии",
    tr: "Zooloji Enstitüsü",
  },
  naturehistorium: {
    en: "NatureHistorium",
    ka: "NatureHistorium",
    ru: "NatureHistorium",
    tr: "NatureHistorium",
  },
};

export function authorAffiliationNames(
  author: Pick<AuthorProfile, "affiliations">,
  locale: AppLocale,
) {
  return author.affiliations.map((id) =>
    pickLocalized(AFFILIATION_NAMES[id], locale),
  );
}

export function authorSameAs(author: Pick<AuthorProfile, "links">) {
  return [
    author.links.facebook,
    author.links.instagram,
    author.links.inaturalist,
    author.links.researchGate,
  ].filter((href): href is string => Boolean(href));
}

export function creditAuthorHref(slug: string) {
  return {
    params: { slug },
    pathname: "/authors/[slug]" as const,
  };
}

export function creditAuthorIndexHref() {
  return "/authors" as const;
}
