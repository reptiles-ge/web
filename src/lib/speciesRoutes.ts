import {
  getCatalogSpecies,
  getSpeciesById,
  isPublishedSpeciesId,
  type Species,
} from "@/data/species";
import { type AppLocale, routing } from "@/i18n/routing";
import { type GroupHubId } from "@/lib/groupHubs";
import {
  getSpeciesHubId,
  getSpeciesPublicSlug,
  resolveSpeciesId,
  resolveSpeciesIdInHub,
} from "@/lib/speciesSlugTable";

export type SpeciesHref = {
  params: { slug: string };
  pathname:
    | "/amphibians/[slug]"
    | "/birds/[slug]"
    | "/insects/[slug]"
    | "/lizards/[slug]"
    | "/mammals/[slug]"
    | "/scorpions/[slug]"
    | "/snakes/[slug]"
    | "/spiders/[slug]"
    | "/turtles/[slug]";
};

export { regionHref } from "@/lib/regionHref";

const LOOKALIKES: Record<string, string[]> = {
  "ablepharus-pannonicus": [
    "ophisops-elegans",
    "eumeces-schneiderii",
    "anguis-colchica",
  ],
  "accipiter-gentilis": ["accipiter-nisus", "buteo-buteo", "falco-peregrinus"],
  "accipiter-nisus": ["accipiter-gentilis", "falco-peregrinus"],
  "aegolius-funereus": ["strix-aluco", "otus-scops", "athene-noctua"],
  "aegypius-monachus": ["aquila-chrysaetos"],
  "alectoris-chukar": ["coturnix-coturnix", "phasianus-colchicus"],
  "anguis-colchica": ["pseudopus-apodus"],
  "araneus-diadematus": ["argiope-bruennichi", "argiope-lobata"],
  "argiope-bruennichi": ["argiope-lobata"],
  "athene-noctua": ["otus-scops", "strix-aluco", "aegolius-funereus"],
  "bubo-bubo": [
    "strix-aluco",
    "athene-noctua",
    "otus-scops",
    "aegolius-funereus",
  ],
  "bufo-verrucosissimus": [
    "bufotes-viridis",
    "pelodytes-caucasicus",
    "rana-macrocnemis",
    "pelobates-syriacus",
  ],
  "bufotes-viridis": [
    "bufo-verrucosissimus",
    "pelobates-syriacus",
    "hyla-orientalis",
  ],
  "buteo-buteo": [
    "pernis-apivorus",
    "aquila-chrysaetos",
    "falco-peregrinus",
  ],
  "canis-aureus": ["vulpes-vulpes", "canis-lupus"],
  "capra-cylindricornis": [
    "capra-aegagrus",
    "capreolus-capreolus",
    "cervus-elaphus",
  ],
  "capreolus-capreolus": ["cervus-elaphus", "sus-scrofa", "capra-aegagrus"],
  "cervus-elaphus": ["capreolus-capreolus", "capra-aegagrus", "sus-scrofa"],
  "coronella-austriaca": ["vipera-transcaucasiana"],
  "coturnix-coturnix": ["phasianus-colchicus"],
  "darevskia-adjarica": [
    "darevskia-clarkorum",
    "darevskia-derjugini",
    "darevskia-mixta",
  ],
  "darevskia-alpina": ["darevskia-caucasica", "darevskia-brauneri"],
  "darevskia-armeniaca": [
    "darevskia-valentini",
    "darevskia-mixta",
    "darevskia-dahli",
  ],
  "darevskia-caucasica": [
    "darevskia-daghestanica",
    "darevskia-mixta",
    "darevskia-obscura",
    "darevskia-brauneri",
    "darevskia-derjugini",
  ],
  "darevskia-clarkorum": [
    "darevskia-adjarica",
    "darevskia-derjugini",
    "darevskia-mixta",
  ],
  "darevskia-daghestanica": ["darevskia-caucasica", "darevskia-derjugini"],
  "darevskia-dahli": [
    "darevskia-mixta",
    "darevskia-portschinskii",
    "darevskia-armeniaca",
  ],
  "darevskia-derjugini": [
    "darevskia-praticola",
    "darevskia-pontica",
    "darevskia-mixta",
  ],
  "darevskia-mixta": [
    "darevskia-clarkorum",
    "darevskia-caucasica",
    "darevskia-derjugini",
    "darevskia-adjarica",
    "darevskia-brauneri",
  ],
  "darevskia-pontica": [
    "darevskia-praticola",
    "darevskia-derjugini",
    "lacerta-agilis",
  ],
  "darevskia-portschinskii": [
    "darevskia-dahli",
    "darevskia-obscura",
    "darevskia-valentini",
  ],
  "darevskia-praticola": ["darevskia-pontica", "lacerta-agilis"],
  "darevskia-raddei": ["darevskia-obscura"],
  "darevskia-valentini": ["darevskia-obscura", "darevskia-armeniaca"],
  "dolichophis-schmidti": [
    "malpolon-insignitus",
    "platyceps-najadum",
    "hemorrhois-ravergieri",
    "elaphe-urartica",
  ],
  "eirenis-collaris": ["eirenis-modestus", "xerotyphlops-vermicularis"],
  "eirenis-modestus": ["eirenis-collaris", "xerotyphlops-vermicularis"],
  "elaphe-dione": [
    "elaphe-urartica",
    "zamenis-hohenackeri",
    "hemorrhois-ravergieri",
    "platyceps-najadum",
    "telescopus-fallax",
  ],
  "elaphe-urartica": [
    "elaphe-dione",
    "dolichophis-schmidti",
    "hemorrhois-ravergieri",
    "macrovipera-lebetina",
  ],
  "emys-orbicularis": [
    "mauremys-caspica",
    "trachemys-scripta",
    "testudo-graeca",
  ],
  "eremias-arguta": ["eremias-velox", "ophisops-elegans"],
  "eremias-velox": ["eremias-arguta"],
  "erithacus-rubecula": ["luscinia-megarhynchos"],
  "eryx-jaculus": ["xerotyphlops-vermicularis", "telescopus-fallax"],
  "eumeces-schneiderii": ["ablepharus-pannonicus", "ophisops-elegans"],
  "euscorpius-italicus": ["euscorpius-mingrelicus", "olivierus-caucasicus"],
  "euscorpius-mingrelicus": ["euscorpius-italicus", "olivierus-caucasicus"],
  "falco-peregrinus": ["accipiter-nisus", "buteo-buteo"],
  "falco-tinnunculus": ["falco-peregrinus"],
  "ficedula-hypoleuca": ["ficedula-semitorquata"],
  "ficedula-semitorquata": ["ficedula-hypoleuca"],
  "gypaetus-barbatus": ["gyps-fulvus", "aquila-chrysaetos"],
  "gyps-fulvus": ["aegypius-monachus", "aquila-chrysaetos"],
  "hemorrhois-ravergieri": [
    "platyceps-najadum",
    "elaphe-urartica",
    "dolichophis-schmidti",
    "vipera-transcaucasiana",
    "macrovipera-lebetina",
  ],
  "hyla-orientalis": [
    "hyla-savignyi",
    "pelophylax-ridibundus",
    "bufotes-viridis",
  ],
  "hyla-savignyi": ["hyla-orientalis", "pelophylax-ridibundus"],
  "jynx-torquilla": ["lanius-collurio"],
  "lacerta-agilis": [
    "lacerta-strigata",
    "lacerta-media",
    "darevskia-derjugini",
  ],
  "lacerta-media": ["lacerta-strigata", "lacerta-agilis"],
  "lacerta-strigata": [
    "lacerta-media",
    "lacerta-agilis",
    "eremias-velox",
    "ophisops-elegans",
  ],
  "latrodectus-tredecimguttatus": ["steatoda-paykulliana"],
  "lissotriton-lantzi": ["ommatotriton-ophryticus", "triturus-karelinii"],
  "luscinia-megarhynchos": ["erithacus-rubecula"],
  "lynx-lynx": ["panthera-pardus", "canis-lupus"],
  "macrovipera-lebetina": ["elaphe-urartica", "hemorrhois-ravergieri"],
  "malpolon-insignitus": ["dolichophis-schmidti", "hemorrhois-ravergieri"],
  "mauremys-caspica": ["emys-orbicularis", "trachemys-scripta"],
  "mesobuthus-eupeus": ["olivierus-caucasicus"],
  "milvus-migrans": ["buteo-buteo", "pernis-apivorus"],
  "natrix-natrix": ["natrix-tessellata", "vipera-kaznakovi"],
  "natrix-tessellata": ["natrix-natrix"],
  "olivierus-caucasicus": [
    "mesobuthus-eupeus",
    "euscorpius-italicus",
    "euscorpius-mingrelicus",
  ],
  "ommatotriton-ophryticus": ["lissotriton-lantzi", "triturus-karelinii"],
  "ophisops-elegans": ["ablepharus-pannonicus"],
  "otus-scops": ["strix-aluco", "athene-noctua"],
  "paralaudakia-caucasia": ["tenuidactylus-caspius"],
  "pelobates-syriacus": [
    "pelodytes-caucasicus",
    "bufotes-viridis",
    "pelophylax-ridibundus",
    "rana-macrocnemis",
    "bufo-verrucosissimus",
  ],
  "pelodytes-caucasicus": [
    "pelobates-syriacus",
    "rana-macrocnemis",
    "pelophylax-ridibundus",
    "bufo-verrucosissimus",
    "hyla-orientalis",
    "bufotes-viridis",
  ],
  "pelophylax-ridibundus": [
    "rana-macrocnemis",
    "hyla-orientalis",
    "bufotes-viridis",
    "pelodytes-caucasicus",
  ],
  "pernis-apivorus": [
    "buteo-buteo",
    "accipiter-gentilis",
    "falco-peregrinus",
  ],
  "phasianus-colchicus": ["coturnix-coturnix"],
  "phoenicolacerta-laevis": ["darevskia-pontica", "lacerta-agilis"],
  "pholcus-phalangioides": ["araneus-diadematus"],
  "pica-pica": ["corvus-corax"],
  "platyceps-najadum": [
    "hemorrhois-ravergieri",
    "dolichophis-schmidti",
    "elaphe-dione",
    "telescopus-fallax",
  ],
  "procyon-lotor": ["meles-canescens"],
  "pseudopus-apodus": ["anguis-colchica"],
  "rana-macrocnemis": [
    "pelophylax-ridibundus",
    "pelodytes-caucasicus",
    "bufo-verrucosissimus",
    "bufotes-viridis",
  ],
  "streptopelia-turtur": ["columba-palumbus"],
  "telescopus-fallax": ["vipera-transcaucasiana", "elaphe-dione"],
  "testudo-graeca": ["emys-orbicularis", "trachemys-scripta"],
  "trachemys-scripta": [
    "emys-orbicularis",
    "mauremys-caspica",
    "testudo-graeca",
  ],
  "triturus-karelinii": ["ommatotriton-ophryticus", "lissotriton-lantzi"],
  "turdus-merula": ["erithacus-rubecula"],
  "tyto-alba": ["strix-aluco"],
  "vipera-dinniki": ["vipera-kaznakovi", "vipera-darevskii"],
  "vipera-kaznakovi": [
    "natrix-natrix",
    "vipera-dinniki",
    "vipera-transcaucasiana",
  ],
  "vipera-transcaucasiana": [
    "vipera-kaznakovi",
    "coronella-austriaca",
    "vipera-dinniki",
  ],
  "vulpes-vulpes": ["canis-lupus"],
  "xerotyphlops-vermicularis": ["eryx-jaculus"],
  "zamenis-hohenackeri": [
    "elaphe-dione",
    "coronella-austriaca",
    "hemorrhois-ravergieri",
    "vipera-transcaucasiana",
  ],
  "zamenis-longissimus": ["natrix-natrix", "vipera-kaznakovi"],
};

const lookalikeIndex: Record<string, Set<string>> = {};
for (const [id, peers] of Object.entries(LOOKALIKES)) {
  lookalikeIndex[id] ??= new Set();
  for (const peer of peers) {
    lookalikeIndex[id].add(peer);
    lookalikeIndex[peer] ??= new Set();
    lookalikeIndex[peer].add(id);
  }
}

export function getSpeciesLookalikes(id: string): string[] {
  const direct = LOOKALIKES[id] ?? [];
  const directIds = new Set(direct);
  return [
    ...direct,
    ...[...(lookalikeIndex[id] ?? [])].filter((peer) => !directIds.has(peer)),
  ].filter(isPublishedSpeciesId);
}

export function legacySpeciesStaticParams(): Array<{
  id: string;
  locale: AppLocale;
}> {
  return [];
}

export {
  getSpeciesHubId,
  getSpeciesPublicSlug,
  resolveSpeciesId,
} from "@/lib/speciesSlugTable";

export function resolveSpecies(param: string): Species | undefined {
  const id = resolveSpeciesId(param);
  if (!id) return undefined;
  return getSpeciesById(id);
}

export function resolveSpeciesInHub(
  hubId: GroupHubId,
  slug: string,
): Species | undefined {
  const id = resolveSpeciesIdInHub(hubId, slug);
  if (!id) return undefined;
  return getSpeciesById(id);
}

export function speciesHref(id: string, locale: AppLocale): SpeciesHref {
  const hub = getSpeciesHubId(id);
  const slug = getSpeciesPublicSlug(id, locale);
  switch (hub) {
    case "birds":
      return { params: { slug }, pathname: "/birds/[slug]" };
    case "insects":
      return { params: { slug }, pathname: "/insects/[slug]" };
    case "lizards":
      return { params: { slug }, pathname: "/lizards/[slug]" };
    case "mammals":
      return { params: { slug }, pathname: "/mammals/[slug]" };
    case "scorpions":
      return { params: { slug }, pathname: "/scorpions/[slug]" };
    case "snakes":
      return { params: { slug }, pathname: "/snakes/[slug]" };
    case "spiders":
      return { params: { slug }, pathname: "/spiders/[slug]" };
    case "turtles":
      return { params: { slug }, pathname: "/turtles/[slug]" };
    default:
      return { params: { slug }, pathname: "/amphibians/[slug]" };
  }
}

export function speciesStaticParams(hubId: GroupHubId) {
  const params: Array<{ locale: AppLocale; slug: string }> = [];
  for (const item of getCatalogSpecies()) {
    if (getSpeciesHubId(item.id) !== hubId) continue;
    for (const locale of routing.locales) {
      params.push({
        locale,
        slug: getSpeciesPublicSlug(item.id, locale),
      });
    }
  }
  return params;
}
