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
    | "/lizards/[slug]"
    | "/mammals/[slug]"
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
  "accipiter-nisus": ["accipiter-gentilis", "falco-peregrinus", "buteo-buteo"],
  "aegolius-funereus": ["strix-aluco", "otus-scops", "athene-noctua"],
  "aegypius-monachus": ["aquila-chrysaetos", "buteo-buteo"],
  "anguis-colchica": ["pseudopus-apodus", "natrix-natrix"],
  "argiope-bruennichi": ["argiope-lobata"],
  "athene-noctua": ["otus-scops", "strix-aluco", "aegolius-funereus"],
  "bubo-bubo": [
    "strix-aluco",
    "athene-noctua",
    "otus-scops",
    "tyto-alba",
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
    "accipiter-nisus",
    "falco-peregrinus",
  ],
  "canis-aureus": ["vulpes-vulpes", "canis-lupus"],
  "capreolus-capreolus": ["sus-scrofa", "capra-aegagrus"],
  "columba-palumbus": ["streptopelia-turtur"],
  "coronella-austriaca": [
    "vipera-transcaucasiana",
    "vipera-kaznakovi",
    "vipera-dinniki",
    "vipera-darevskii",
  ],
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
  "darevskia-caucasica": ["darevskia-daghestanica", "darevskia-mixta"],
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
  "dendrocopos-major": ["picus-viridis", "jynx-torquilla"],
  "dolichophis-schmidti": [
    "malpolon-insignitus",
    "platyceps-najadum",
    "hemorrhois-ravergieri",
    "elaphe-urartica",
    "macrovipera-lebetina",
    "elaphe-dione",
  ],
  "eirenis-collaris": [
    "eirenis-modestus",
    "coronella-austriaca",
    "xerotyphlops-vermicularis",
  ],
  "eirenis-modestus": [
    "eirenis-collaris",
    "coronella-austriaca",
    "xerotyphlops-vermicularis",
  ],
  "elaphe-dione": [
    "elaphe-urartica",
    "zamenis-hohenackeri",
    "hemorrhois-ravergieri",
    "dolichophis-schmidti",
    "macrovipera-lebetina",
    "platyceps-najadum",
    "telescopus-fallax",
  ],
  "elaphe-urartica": [
    "elaphe-dione",
    "zamenis-hohenackeri",
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
  "eumeces-schneiderii": ["ablepharus-pannonicus"],
  "falco-peregrinus": ["accipiter-nisus", "buteo-buteo", "aquila-chrysaetos"],
  "ficedula-hypoleuca": ["ficedula-semitorquata"],
  "ficedula-semitorquata": ["ficedula-hypoleuca"],
  "garrulus-glandarius": ["pica-pica", "corvus-corax"],
  "gyps-fulvus": ["aegypius-monachus", "aquila-chrysaetos", "buteo-buteo"],
  "hemorrhois-ravergieri": [
    "platyceps-najadum",
    "elaphe-urartica",
    "dolichophis-schmidti",
    "macrovipera-lebetina",
    "vipera-transcaucasiana",
  ],
  "hyla-orientalis": [
    "hyla-savignyi",
    "pelophylax-ridibundus",
    "bufotes-viridis",
  ],
  "hyla-savignyi": ["hyla-orientalis", "pelophylax-ridibundus"],
  "lacerta-agilis": [
    "lacerta-strigata",
    "lacerta-media",
    "darevskia-derjugini",
  ],
  "lacerta-media": ["lacerta-strigata", "lacerta-agilis"],
  "lacerta-strigata": ["lacerta-agilis", "lacerta-media", "ophisops-elegans"],
  "latrodectus-tredecimguttatus": ["steatoda-paykulliana"],
  "lissotriton-lantzi": [
    "ommatotriton-ophryticus",
    "triturus-karelinii",
    "mertensiella-caucasica",
  ],
  "luscinia-megarhynchos": ["erithacus-rubecula"],
  "lynx-lynx": ["panthera-pardus", "canis-lupus"],
  "macrovipera-lebetina": [
    "malpolon-insignitus",
    "dolichophis-schmidti",
    "vipera-renardi",
  ],
  "malpolon-insignitus": [
    "macrovipera-lebetina",
    "dolichophis-schmidti",
    "hemorrhois-ravergieri",
  ],
  "mauremys-caspica": [
    "emys-orbicularis",
    "trachemys-scripta",
    "testudo-graeca",
  ],
  "meles-canescens": ["mustela-nivalis"],
  "mertensiella-caucasica": [
    "lissotriton-lantzi",
    "ommatotriton-ophryticus",
    "triturus-karelinii",
  ],
  "milvus-migrans": ["buteo-buteo", "pernis-apivorus", "aquila-chrysaetos"],
  "natrix-natrix": [
    "natrix-tessellata",
    "vipera-kaznakovi",
    "pseudopus-apodus",
  ],
  "natrix-tessellata": [
    "natrix-natrix",
    "vipera-kaznakovi",
    "pseudopus-apodus",
  ],
  "ommatotriton-ophryticus": [
    "lissotriton-lantzi",
    "triturus-karelinii",
    "mertensiella-caucasica",
  ],
  "ophisops-elegans": ["ablepharus-pannonicus"],
  "otus-scops": ["strix-aluco", "athene-noctua"],
  "paralaudakia-caucasia": [
    "tenuidactylus-caspius",
    "darevskia-portschinskii",
    "eumeces-schneiderii",
  ],
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
    "accipiter-nisus",
    "accipiter-gentilis",
    "falco-peregrinus",
  ],
  "phasianus-colchicus": ["coturnix-coturnix"],
  "phoenicolacerta-laevis": ["darevskia-pontica", "lacerta-agilis"],
  "pica-pica": ["corvus-corax", "garrulus-glandarius"],
  "platyceps-najadum": [
    "hemorrhois-ravergieri",
    "dolichophis-schmidti",
    "elaphe-urartica",
    "elaphe-dione",
    "telescopus-fallax",
    "macrovipera-lebetina",
    "vipera-transcaucasiana",
  ],
  "procyon-lotor": ["meles-canescens", "vulpes-vulpes"],
  "pseudopus-apodus": ["anguis-colchica", "natrix-natrix", "natrix-tessellata"],
  "rana-macrocnemis": [
    "pelophylax-ridibundus",
    "pelodytes-caucasicus",
    "bufo-verrucosissimus",
    "bufotes-viridis",
  ],
  "streptopelia-turtur": ["columba-palumbus"],
  "telescopus-fallax": [
    "vipera-transcaucasiana",
    "coronella-austriaca",
    "elaphe-dione",
  ],
  "testudo-graeca": [
    "emys-orbicularis",
    "mauremys-caspica",
    "trachemys-scripta",
  ],
  "trachemys-scripta": [
    "emys-orbicularis",
    "mauremys-caspica",
    "testudo-graeca",
  ],
  "triturus-karelinii": [
    "ommatotriton-ophryticus",
    "lissotriton-lantzi",
    "mertensiella-caucasica",
  ],
  "tyto-alba": [
    "strix-aluco",
    "otus-scops",
    "aegolius-funereus",
    "athene-noctua",
  ],
  "ursus-arctos": ["canis-lupus", "sus-scrofa"],
  "vipera-dinniki": [
    "vipera-kaznakovi",
    "vipera-darevskii",
    "coronella-austriaca",
  ],
  "vipera-kaznakovi": [
    "natrix-natrix",
    "vipera-dinniki",
    "coronella-austriaca",
    "vipera-transcaucasiana",
  ],
  "vipera-transcaucasiana": [
    "vipera-kaznakovi",
    "coronella-austriaca",
    "macrovipera-lebetina",
    "vipera-dinniki",
    "vipera-darevskii",
  ],
  "vulpes-vulpes": ["canis-lupus"],
  "xerotyphlops-vermicularis": ["eryx-jaculus"],
  "zamenis-hohenackeri": [
    "zamenis-longissimus",
    "elaphe-dione",
    "elaphe-urartica",
    "coronella-austriaca",
    "hemorrhois-ravergieri",
    "vipera-transcaucasiana",
  ],
  "zamenis-longissimus": [
    "zamenis-hohenackeri",
    "natrix-natrix",
    "coronella-austriaca",
    "vipera-kaznakovi",
  ],
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
  return [...(lookalikeIndex[id] ?? [])].filter(isPublishedSpeciesId);
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
    case "lizards":
      return { params: { slug }, pathname: "/lizards/[slug]" };
    case "mammals":
      return { params: { slug }, pathname: "/mammals/[slug]" };
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
