import {
  herpetofaunaChecklist,
  herpetofaunaDownscaled,
  herpetofaunaExcluded,
  type HerpetofaunaChecklistTaxon,
} from "./herpetofauna-checklist";

export const iteration0BeforeExpansion = {
  inProjectCount: 15,
  missingCount: 53,
  inProjectSlugs: [
    "vipera-dinniki",
    "macrovipera-lebetina",
    "vipera-kaznakovi",
    "vipera-ammodytes",
    "vipera-darevskii",
    "vipera-renardi",
    "coronella-austriaca",
    "elaphe-urartica",
    "elaphe-dione",
    "natrix-tessellata",
    "natrix-natrix",
    "dolichophis-schmidti",
    "platyceps-najadum",
    "telescopus-fallax",
    "pseudopus-apodus",
  ],
  missingByGroup: {
    amphibians: [
      "Mertensiella caucasica",
      "Lissotriton lantzi",
      "Ommatotriton ophryticus",
      "Triturus karelinii",
      "Pelobates syriacus",
      "Pelodytes caucasicus",
      "Bufotes viridis",
      "Bufo verrucosissimus",
      "Hyla orientalis",
      "Hyla savignyi",
      "Rana macrocnemis",
      "Pelophylax ridibundus",
    ],
    turtles: [
      "Testudo graeca",
      "Emys orbicularis",
      "Trachemys scripta",
      "Mauremys caspica",
    ],
    lizardsNonDarevskia: [
      "Tenuidactylus caspius",
      "Anguis colchica",
      "Paralaudakia caucasia",
      "Eumeces schneiderii",
      "Ablepharus pannonicus",
      "Eremias velox",
      "Eremias arguta",
      "Ophisops elegans",
      "Lacerta agilis",
      "Lacerta strigata",
      "Lacerta media",
      "Phoenicolacerta laevis",
    ],
    darevskia: [
      "Darevskia adjarica",
      "Darevskia alpina",
      "Darevskia armeniaca",
      "Darevskia brauneri",
      "Darevskia caucasica",
      "Darevskia clarkorum",
      "Darevskia daghestanica",
      "Darevskia dahli",
      "Darevskia derjugini",
      "Darevskia mixta",
      "Darevskia portschinskii",
      "Darevskia praticola",
      "Darevskia pontica",
      "Darevskia obscura",
      "Darevskia raddei",
      "Darevskia valentini",
    ],
    snakes: [
      "Xerotyphlops vermicularis",
      "Eryx jaculus",
      "Zamenis longissimus",
      "Zamenis hohenackeri",
      "Dolichophis caspius",
      "Hemorrhois ravergieri",
      "Eirenis modestus",
      "Eirenis collaris",
      "Malpolon insignitus",
    ],
  },
  taxonomicConflicts: [
    "Macrovipera lebetinus is the checklist-accepted name; project slug remains macrovipera-lebetina.",
    "Vipera kaznakovi, V. dinniki, V. darevskii, V. renardi, Elaphe urartica, Dolichophis schmidti are candidate species in Tarkhnishvili et al. 2026.",
    "Vipera transcaucasiana, V. eriwanensis, V. tuniyevi downscaled to subspecies — no separate pages.",
  ],
  sourcesUsed: [
    "Tarkhnishvili et al. 2026 — https://doi.org/10.3897/caucasiana.5.e189214",
    "IUCN Red List (corroboration)",
    "GBIF (corroboration)",
    "The Reptile Database / AmphibiaWeb (taxonomy corroboration)",
    "Iankoshvili & Tarkhnishvili 2021 and citations listed in checklist species accounts",
  ],
  validationStatus:
    "Iteration 0 inventory complete. Inclusion allowlist locked to the 68 checklist taxa. Anecdotal and border taxa excluded from publishing.",
} as const;

export type GapReport = {
  iteration: "live" | "0";
  authority: string;
  totals: {
    checklistConfirmed: number;
    amphibians: number;
    reptiles: number;
    inProject: number;
    missing: number;
    introduced: number;
    candidates: number;
    excludedAnecdotal: number;
    excludedBorder: number;
    downscaled: number;
  };
  inProject: HerpetofaunaChecklistTaxon[];
  missing: HerpetofaunaChecklistTaxon[];
  missingByGroup: {
    amphibians: string[];
    turtles: string[];
    lizardsNonDarevskia: string[];
    darevskia: string[];
    snakes: string[];
  };
  taxonomicConflicts: string[];
  sourcesUsed: string[];
  validationStatus: string;
};

export function buildHerpetofaunaGapReport(): GapReport {
  const inProject = herpetofaunaChecklist.filter((t) => t.inProject);
  const missing = herpetofaunaChecklist.filter((t) => !t.inProject);
  const amphibians = herpetofaunaChecklist.filter(
    (t) => t.className === "Amphibia",
  );
  const reptiles = herpetofaunaChecklist.filter(
    (t) => t.className === "Reptilia",
  );

  const missingAmph = missing.filter((t) => t.className === "Amphibia");
  const missingTurtles = missing.filter((t) => t.order === "Testudines");
  const missingDarevskia = missing.filter((t) => t.genus === "Darevskia");
  const missingSnakes = missing.filter((t) =>
    [
      "Typhlopidae",
      "Boidae",
      "Colubridae",
      "Psammophiidae",
      "Viperidae",
    ].includes(t.family),
  );
  const missingSnakeSet = new Set(missingSnakes);
  const missingLizards = missing.filter(
    (t) =>
      t.order === "Squamata" &&
      !missingSnakeSet.has(t) &&
      t.genus !== "Darevskia",
  );

  return {
    iteration: "live",
    authority: "Tarkhnishvili et al. 2026 (Caucasiana 5: 59–138)",
    totals: {
      checklistConfirmed: herpetofaunaChecklist.length,
      amphibians: amphibians.length,
      reptiles: reptiles.length,
      inProject: inProject.length,
      missing: missing.length,
      introduced: herpetofaunaChecklist.filter(
        (t) => t.statusInChecklist === "introduced",
      ).length,
      candidates: herpetofaunaChecklist.filter(
        (t) => t.taxonomicConfidence === "candidate",
      ).length,
      excludedAnecdotal: herpetofaunaExcluded.filter(
        (t) => t.statusInChecklist === "anecdotal_rejected",
      ).length,
      excludedBorder: herpetofaunaExcluded.filter(
        (t) => t.statusInChecklist === "border_potential",
      ).length,
      downscaled: herpetofaunaDownscaled.length,
    },
    inProject,
    missing,
    missingByGroup: {
      amphibians: missingAmph.map((t) => t.scientificName),
      turtles: missingTurtles.map((t) => t.scientificName),
      lizardsNonDarevskia: missingLizards.map((t) => t.scientificName),
      darevskia: missingDarevskia.map((t) => t.scientificName),
      snakes: missingSnakes.map((t) => t.scientificName),
    },
    taxonomicConflicts: [...iteration0BeforeExpansion.taxonomicConflicts],
    sourcesUsed: [...iteration0BeforeExpansion.sourcesUsed],
    validationStatus:
      missing.length === 0
        ? "All 68 checklist taxa are published. Photos for newly added taxa remain placeholders pending verified Georgia photography. Regional map membership was not invented for new taxa. Anecdotal and border taxa remain excluded."
        : iteration0BeforeExpansion.validationStatus,
  };
}
