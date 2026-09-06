import type { DangerLevel } from "./speciesTypes";

export type AnimalGroup =
  "amphibian" | "bird" | "lizard" | "mammal" | "snake" | "spider" | "turtle";

export type HabitatTag = "forest" | "grassland" | "mountain" | "wetland";

export type SpeciesAtlasMeta = {
  group: AnimalGroup;
  habitats: HabitatTag[];
};

export const speciesAtlasMeta: Record<string, SpeciesAtlasMeta> = {
  "ablepharus-pannonicus": {
    group: "lizard",
    habitats: ["grassland", "mountain"],
  },
  "accipiter-gentilis": {
    group: "bird",
    habitats: ["forest", "mountain"],
  },
  "accipiter-nisus": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "aegolius-funereus": {
    group: "bird",
    habitats: ["forest", "mountain"],
  },
  "aegypius-monachus": {
    group: "bird",
    habitats: ["grassland"],
  },
  "anas-platyrhynchos": {
    group: "bird",
    habitats: ["wetland"],
  },
  "anguis-colchica": {
    group: "lizard",
    habitats: ["grassland", "forest", "mountain"],
  },
  "apus-apus": {
    group: "bird",
    habitats: ["grassland", "mountain"],
  },
  "aquila-chrysaetos": {
    group: "bird",
    habitats: ["mountain", "forest", "grassland"],
  },
  "argiope-bruennichi": {
    group: "spider",
    habitats: ["grassland", "wetland"],
  },
  "argiope-lobata": {
    group: "spider",
    habitats: ["grassland"],
  },
  "athene-noctua": {
    group: "bird",
    habitats: ["grassland"],
  },
  "bubo-bubo": {
    group: "bird",
    habitats: ["mountain", "forest", "grassland"],
  },
  "bufo-verrucosissimus": {
    group: "amphibian",
    habitats: ["wetland", "forest"],
  },
  "bufotes-viridis": {
    group: "amphibian",
    habitats: ["grassland", "wetland"],
  },
  "buteo-buteo": {
    group: "bird",
    habitats: ["forest", "grassland", "mountain"],
  },
  "canis-aureus": {
    group: "mammal",
    habitats: ["grassland", "forest", "wetland"],
  },
  "canis-lupus": {
    group: "mammal",
    habitats: ["mountain", "forest", "grassland"],
  },
  "capra-aegagrus": {
    group: "mammal",
    habitats: ["mountain", "forest"],
  },
  "capreolus-capreolus": {
    group: "mammal",
    habitats: ["forest", "grassland", "mountain"],
  },
  "ciconia-ciconia": {
    group: "bird",
    habitats: ["wetland", "grassland"],
  },
  "columba-palumbus": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "coronella-austriaca": {
    group: "snake",
    habitats: ["forest", "mountain", "grassland"],
  },
  "corvus-corax": {
    group: "bird",
    habitats: ["mountain", "grassland", "forest"],
  },
  "coturnix-coturnix": {
    group: "bird",
    habitats: ["grassland"],
  },
  "cuculus-canorus": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "darevskia-adjarica": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-alpina": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-armeniaca": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-brauneri": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-caucasica": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-clarkorum": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-daghestanica": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-dahli": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-derjugini": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-mixta": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-obscura": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-pontica": {
    group: "lizard",
    habitats: ["forest", "grassland"],
  },
  "darevskia-portschinskii": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-praticola": {
    group: "lizard",
    habitats: ["forest", "grassland"],
  },
  "darevskia-raddei": {
    group: "lizard",
    habitats: ["mountain", "forest"],
  },
  "darevskia-valentini": {
    group: "lizard",
    habitats: ["mountain", "grassland"],
  },
  "dendrocopos-major": {
    group: "bird",
    habitats: ["forest"],
  },
  "dolichophis-caspius": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "dolichophis-schmidti": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "eirenis-collaris": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "eirenis-modestus": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "elaphe-dione": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "elaphe-urartica": {
    group: "snake",
    habitats: ["grassland", "forest"],
  },
  "emberiza-citrinella": {
    group: "bird",
    habitats: ["grassland"],
  },
  "emys-orbicularis": {
    group: "turtle",
    habitats: ["wetland"],
  },
  "eremias-arguta": {
    group: "lizard",
    habitats: ["grassland"],
  },
  "eremias-velox": {
    group: "lizard",
    habitats: ["grassland", "forest"],
  },
  "erinaceus-concolor": {
    group: "mammal",
    habitats: ["forest", "grassland"],
  },
  "erithacus-rubecula": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "eryx-jaculus": {
    group: "snake",
    habitats: ["grassland"],
  },
  "eumeces-schneiderii": {
    group: "lizard",
    habitats: ["grassland", "mountain"],
  },
  "falco-peregrinus": {
    group: "bird",
    habitats: ["mountain", "grassland", "wetland"],
  },
  "ficedula-hypoleuca": {
    group: "bird",
    habitats: ["forest"],
  },
  "ficedula-semitorquata": {
    group: "bird",
    habitats: ["forest"],
  },
  "garrulus-glandarius": {
    group: "bird",
    habitats: ["forest"],
  },
  "glareola-pratincola": {
    group: "bird",
    habitats: ["wetland", "grassland"],
  },
  "gyps-fulvus": {
    group: "bird",
    habitats: ["mountain", "grassland"],
  },
  "hemorrhois-ravergieri": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "hyla-orientalis": {
    group: "amphibian",
    habitats: ["wetland", "forest"],
  },
  "hyla-savignyi": {
    group: "amphibian",
    habitats: ["grassland", "wetland"],
  },
  "jynx-torquilla": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "lacerta-agilis": {
    group: "lizard",
    habitats: ["grassland", "forest"],
  },
  "lacerta-media": {
    group: "lizard",
    habitats: ["grassland", "forest"],
  },
  "lacerta-strigata": {
    group: "lizard",
    habitats: ["grassland"],
  },
  "larus-fuscus": {
    group: "bird",
    habitats: ["wetland"],
  },
  "latrodectus-tredecimguttatus": {
    group: "spider",
    habitats: ["grassland"],
  },
  "lissotriton-lantzi": {
    group: "amphibian",
    habitats: ["wetland", "forest"],
  },
  "luscinia-megarhynchos": {
    group: "bird",
    habitats: ["forest"],
  },
  "lutra-lutra": {
    group: "mammal",
    habitats: ["wetland", "forest", "mountain"],
  },
  "lynx-lynx": {
    group: "mammal",
    habitats: ["forest", "mountain", "grassland"],
  },
  "macrovipera-lebetina": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "malpolon-insignitus": {
    group: "snake",
    habitats: ["grassland"],
  },
  "mauremys-caspica": {
    group: "turtle",
    habitats: ["wetland"],
  },
  "meles-canescens": {
    group: "mammal",
    habitats: ["forest", "grassland", "mountain"],
  },
  "mertensiella-caucasica": {
    group: "amphibian",
    habitats: ["wetland", "forest"],
  },
  "milvus-migrans": {
    group: "bird",
    habitats: ["wetland", "forest", "grassland"],
  },
  "motacilla-alba": {
    group: "bird",
    habitats: ["grassland", "wetland"],
  },
  "mustela-nivalis": {
    group: "mammal",
    habitats: ["grassland", "forest", "mountain"],
  },
  "natrix-natrix": {
    group: "snake",
    habitats: ["wetland", "forest"],
  },
  "natrix-tessellata": {
    group: "snake",
    habitats: ["wetland"],
  },
  "ommatotriton-ophryticus": {
    group: "amphibian",
    habitats: ["wetland", "forest", "mountain"],
  },
  "ophisops-elegans": {
    group: "lizard",
    habitats: ["grassland", "forest"],
  },
  "otus-scops": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "panthera-pardus": {
    group: "mammal",
    habitats: ["mountain", "forest", "grassland"],
  },
  "paralaudakia-caucasia": {
    group: "lizard",
    habitats: ["grassland", "mountain"],
  },
  "pelobates-syriacus": {
    group: "amphibian",
    habitats: ["grassland", "wetland"],
  },
  "pelodytes-caucasicus": {
    group: "amphibian",
    habitats: ["wetland", "forest", "mountain"],
  },
  "pelophylax-ridibundus": {
    group: "amphibian",
    habitats: ["wetland"],
  },
  "pernis-apivorus": {
    group: "bird",
    habitats: ["forest", "mountain"],
  },
  "phasianus-colchicus": {
    group: "bird",
    habitats: ["grassland", "forest"],
  },
  "phoenicolacerta-laevis": {
    group: "lizard",
    habitats: ["grassland", "forest"],
  },
  "pica-pica": {
    group: "bird",
    habitats: ["grassland", "forest"],
  },
  "picus-viridis": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "platyceps-najadum": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "procyon-lotor": {
    group: "mammal",
    habitats: ["forest", "wetland", "grassland"],
  },
  "pseudopus-apodus": {
    group: "lizard",
    habitats: ["grassland", "forest", "mountain"],
  },
  "rana-macrocnemis": {
    group: "amphibian",
    habitats: ["wetland", "forest"],
  },
  "sciurus-anomalus": {
    group: "mammal",
    habitats: ["forest"],
  },
  "steatoda-paykulliana": {
    group: "spider",
    habitats: ["grassland"],
  },
  "streptopelia-turtur": {
    group: "bird",
    habitats: ["grassland", "forest"],
  },
  "strix-aluco": {
    group: "bird",
    habitats: ["forest"],
  },
  "sus-scrofa": {
    group: "mammal",
    habitats: ["forest", "grassland", "mountain"],
  },
  "telescopus-fallax": {
    group: "snake",
    habitats: ["mountain", "grassland"],
  },
  "tenuidactylus-caspius": {
    group: "lizard",
    habitats: ["grassland", "mountain"],
  },
  "testudo-graeca": {
    group: "turtle",
    habitats: ["grassland"],
  },
  "trachemys-scripta": {
    group: "turtle",
    habitats: ["wetland"],
  },
  "triturus-karelinii": {
    group: "amphibian",
    habitats: ["wetland", "forest"],
  },
  "turdus-merula": {
    group: "bird",
    habitats: ["forest", "grassland"],
  },
  "tyto-alba": {
    group: "bird",
    habitats: ["grassland"],
  },
  "upupa-epops": {
    group: "bird",
    habitats: ["grassland", "forest"],
  },
  "ursus-arctos": {
    group: "mammal",
    habitats: ["forest", "mountain", "grassland"],
  },
  "vipera-ammodytes": {
    group: "snake",
    habitats: ["mountain", "grassland"],
  },
  "vipera-darevskii": {
    group: "snake",
    habitats: ["mountain", "grassland"],
  },
  "vipera-dinniki": {
    group: "snake",
    habitats: ["mountain", "forest"],
  },
  "vipera-kaznakovi": {
    group: "snake",
    habitats: ["forest", "mountain", "wetland"],
  },
  "vipera-renardi": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "vipera-transcaucasiana": {
    group: "snake",
    habitats: ["mountain", "grassland"],
  },
  "vulpes-vulpes": {
    group: "mammal",
    habitats: ["forest", "grassland", "mountain"],
  },
  "xerotyphlops-vermicularis": {
    group: "snake",
    habitats: ["grassland"],
  },
  "zamenis-hohenackeri": {
    group: "snake",
    habitats: ["grassland", "mountain"],
  },
  "zamenis-longissimus": {
    group: "snake",
    habitats: ["forest", "mountain"],
  },
};

export function getSpeciesAtlasMeta(id: string): SpeciesAtlasMeta {
  return (
    speciesAtlasMeta[id] ?? {
      group: "snake",
      habitats: ["forest"],
    }
  );
}

export function groupHasVenomConcept(group: AnimalGroup) {
  return (
    group === "snake" ||
    group === "lizard" ||
    group === "turtle" ||
    group === "amphibian" ||
    group === "spider"
  );
}

export function isVenomousDanger(danger?: DangerLevel) {
  return danger === "High" || danger === "Moderate";
}
