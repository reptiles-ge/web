import type { ClusterGuidePath } from "@/lib/clusterGuides";

import { AGENCY_PHONE_DISPLAY, AGENCY_PHONE_TEL } from "@/lib/phoneLinks";

export type ConflictGuideConfig = {
  actionCount: 4;
  agencyPhone?: { display: string; tel: string };
  contactSpeciesId?: string;
  extraLinks: readonly { href: ConflictLinkHref; key: ConflictLinkKey }[];
  mythCount: 4;
  namespace: ConflictNamespace;
  show112: boolean;
  summaryCount: 4;
};

type ConflictLinkHref = "/lizards" | ClusterGuidePath;

type ConflictLinkKey = "linkHub" | "linkIdentify" | "linkIndex";

type ConflictNamespace = "lizardHouse" | "mammalJackalYard";

export const JACKAL_YARD_CONFIG: ConflictGuideConfig = {
  actionCount: 4,
  extraLinks: [
    { href: "/mammals/saxeoebebi", key: "linkIndex" },
    { href: "/mammals", key: "linkHub" },
  ],
  mythCount: 4,
  namespace: "mammalJackalYard",
  show112: true,
  summaryCount: 4,
};

export const LIZARD_HOUSE_CONFIG: ConflictGuideConfig = {
  actionCount: 4,
  agencyPhone: { display: AGENCY_PHONE_DISPLAY, tel: AGENCY_PHONE_TEL },
  contactSpeciesId: "tenuidactylus-caspius",
  extraLinks: [
    { href: "/lizards/identifikacia", key: "linkIdentify" },
    { href: "/lizards", key: "linkHub" },
  ],
  mythCount: 4,
  namespace: "lizardHouse",
  show112: false,
  summaryCount: 4,
};
