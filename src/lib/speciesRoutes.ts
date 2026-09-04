import {
  getCatalogSpecies,
  getSpeciesById,
  isPublishedSpeciesId,
  type Species,
} from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { type AppLocale, routing } from "@/i18n/routing";
import {
  ANIMAL_GROUP_TO_HUB,
  type GroupHubId,
  RESERVED_HUB_SLUGS,
} from "@/lib/groupHubs";
import { kaToSlug } from "@/lib/slugify";

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

const KA_SLUG_OVERRIDES: Record<string, string> = {
  "macrovipera-lebetina": "giurza",
  "paralaudakia-caucasia": "jojo",
  "pseudopus-apodus": "gvelxokera",
  "tyto-alba": "bukhrintsa",
};

const KA_SLUG_ALIASES: Record<string, string[]> = {
  "accipiter-gentilis": [
    "didi-kori",
    "goshawk",
    "northern-goshawk",
    "eurasian-goshawk",
    "astur-gentilis",
  ],
  "accipiter-nisus": ["mimino", "korisebri-mimino"],
  "aegolius-funereus": [
    "bukioti",
    "mikoti",
    "omidi",
    "boreal-owl",
    "tengmalms-owl",
  ],
  "aegypius-monachus": ["cinereous-vulture", "black-vulture", "shavi-svavi"],
  "anas-platyrhynchos": ["gareuli-ikhvi", "ikhvi", "mallard"],
  "apus-apus": ["chveulebrivi-namgala", "namgala"],
  "aquila-chrysaetos": ["okrosferi-artsivi", "okrosperi-artsivi"],
  "argiope-bruennichi": [
    "argiopa",
    "brunnikis-argiopa",
    "wasp-spider",
    "wasp-spider-argiope",
    "bzikebri-oboba",
  ],
  "argiope-lobata": [
    "argiope-lobata",
    "lobebiani-argiopa",
    "lobed-argiope",
    "black-lobed-argiope",
    "loblu-orumcek",
  ],
  "athene-noctua": ["choti", "little-owl", "buknacho"],
  "bubo-bubo": [
    "chveulebrivi-zarnasho",
    "eagle-owl",
    "eurasian-eagle-owl",
    "filin",
    "puhu",
  ],
  "buteo-buteo": ["kakacha", "chveulebrivi-arwivi"],
  "canis-aureus": ["tura"],
  "canis-lupus": ["mgeli"],
  "capra-aegagrus": ["niamori", "veluri-txa", "bezoaruli-txa"],
  "capreolus-capreolus": ["shveli"],
  "ciconia-ciconia": ["laklaki", "tetri-qarqati"],
  "columba-palumbus": [
    "kedani",
    "tqis-mtredi",
    "woodpigeon",
    "common-woodpigeon",
    "wood-pigeon",
  ],
  "corvus-corax": ["qorani", "northern-raven", "common-raven", "raven"],
  "coturnix-coturnix": ["mtsqeri", "mwyeri"],
  "dendrocopos-major": [
    "chreli-kodala",
    "didi-kodala",
    "great-spotted-woodpecker",
  ],
  "erinaceus-concolor": [
    "evropuli-zgarbi",
    "tetrmkerda-zgharbi",
    "aghmosavletevropuli-zgharbi",
  ],
  "erithacus-rubecula": ["gultitela", "bultsitela", "european-robin", "robin"],
  "falco-peregrinus": [
    "shavardeni",
    "chveulebrivi-shavardeni",
    "peregrine",
    "peregrine-falcon",
  ],
  "ficedula-hypoleuca": ["chreli-buzicheria"],
  "ficedula-semitorquata": [
    "naxevartetqela-mematlia",
    "naxevartetqela-buzicheria",
  ],
  "garrulus-glandarius": ["japara", "chxikvi"],
  "glareola-pratincola": [
    "mertsxala",
    "mdelos-mertsxala",
    "zhghalfrtiana-mertsxala",
    "mertskhala",
    "mdelos-mertskhala",
    "collared-pratincole",
  ],
  "gyps-fulvus": [
    "orbi",
    "tetrtava-orbi",
    "chveulebrivi-orbi",
    "griffon",
    "eurasian-griffon",
  ],
  "jynx-torquilla": ["chveulebrivi-maktsia", "maqcia"],
  "larus-fuscus": [
    "shavzurga-tolia",
    "lesser-black-backed-gull",
    "baltic-gull",
    "heuglini",
    "klusha",
  ],
  "latrodectus-tredecimguttatus": [
    "shavi-qvrivi",
    "qaraqurti",
    "karakurt",
    "latrodectus-mactans",
    "black-widow",
    "european-black-widow",
    "mediterranean-black-widow",
  ],
  "luscinia-megarhynchos": [
    "samxretuli-bulbuli",
    "samhruli-bulbuli",
    "iadoni",
    "nightingale",
    "common-nightingale",
    "rufous-nightingale",
  ],
  "lutra-lutra": ["tsavi", "wavi", "evraziuli-tsavi"],
  "lynx-lynx": ["fotsxveri", "lynx", "evraziuli-fotsxveri"],
  "meles-canescens": ["evropuli-machvi", "meles-meles", "machvi"],
  "milvus-migrans": [
    "dzera",
    "black-kite",
    "eurasian-black-kite",
    "milvus-korschun",
  ],
  "motacilla-alba": [
    "tetri-bolokankara",
    "tetri-boloqanqara",
    "white-wagtail",
    "pied-wagtail",
  ],
  "otus-scops": ["tsqromi", "wqromi", "scops-owl"],
  "panthera-pardus": ["jiqi", "jiki", "leopardi", "kavkasiuri-jiqi"],
  "pelodytes-caucasicus": ["kavkasiuri-jvarula"],
  "pernis-apivorus": [
    "kvernachamia",
    "krazanachamia",
    "irao",
    "chveulebrivi-bolokarkazi",
    "tsudkora",
    "honey-buzzard",
    "european-honey-buzzard",
  ],
  "phasianus-colchicus": [
    "khokhobi",
    "kolkhuri-khokhobi",
    "common-pheasant",
    "pheasant",
  ],
  "pica-pica": ["kachkachi", "eurasian-magpie", "common-magpie"],
  "procyon-lotor": ["enoti", "chveulebrivi-enoti", "raccoon", "racoon"],
  "sciurus-anomalus": ["sparsuli-tsiqvi"],
  "steatoda-paykulliana": [
    "tsru-qaraqurti",
    "tsru-shavi-qvrivi",
    "cru-qaraqurti",
    "false-black-widow",
    "false-widow",
    "yalancı-karakurt",
    "yalancı-kara-dul",
    "lozhnyi-karakurt",
  ],
  "streptopelia-turtur": ["gvriti", "chveulebrivi-gvriti"],
  "strix-aluco": ["tqis-bu", "ruxi-bu", "chveulebrivi-tqis-bu"],
  "sus-scrofa": ["taxi", "gareuli-gori"],
  "turdus-merula": ["shashvi", "shavi-shashvi"],
  "tyto-alba": ["buxrintsa", "bukhrintsa", "barn-owl", "western-barn-owl"],
  "upupa-epops": [
    "hoopoe",
    "eurasian-hoopoe",
    "common-hoopoe",
    "chveulebrivi-ofofi",
    "udod",
    "ibibik",
  ],
  "ursus-arctos": ["datvi", "mura-dathvi"],
};

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

function hubForSpeciesId(id: string): GroupHubId {
  return ANIMAL_GROUP_TO_HUB[getSpeciesAtlasMeta(id).group];
}

function uniqueKaSlug(id: string, commonName: string, hub: GroupHubId) {
  const reserved = new Set(RESERVED_HUB_SLUGS[hub]);
  const takenSlugs = new Set(Object.values(kaSlugById));
  const preferred = KA_SLUG_OVERRIDES[id] ?? kaToSlug(commonName) ?? id;
  if (!preferred) return id;
  if (!reserved.has(preferred) && !takenSlugs.has(preferred)) {
    return preferred;
  }
  const epithet = id.split("-").at(-1) ?? id;
  let candidate = `${preferred}-${epithet}`;
  let n = 2;
  while (reserved.has(candidate) || takenSlugs.has(candidate)) {
    candidate = `${preferred}-${epithet}-${n}`;
    n += 1;
  }
  return candidate;
}

const kaSlugById: Record<string, string> = {};
const idByKaSlug: Record<string, string> = {};
const idByAnySlug: Record<string, string> = {};

for (const species of getCatalogSpecies()) {
  const hub = hubForSpeciesId(species.id);
  const slug = uniqueKaSlug(species.id, species.commonName, hub);
  kaSlugById[species.id] = slug;
  idByKaSlug[slug] = species.id;
  idByAnySlug[species.id] = species.id;
  idByAnySlug[slug] = species.id;
}

for (const [id, aliases] of Object.entries(KA_SLUG_ALIASES)) {
  for (const slug of aliases) {
    idByAnySlug[slug] = id;
  }
}

export function getSpeciesHubId(id: string): GroupHubId {
  return hubForSpeciesId(id);
}

export function getSpeciesLookalikes(id: string): string[] {
  return [...(lookalikeIndex[id] ?? [])].filter(isPublishedSpeciesId);
}

export function getSpeciesPublicSlug(id: string, locale: AppLocale) {
  if (locale !== "ka") return id;
  return kaSlugById[id] ?? id;
}

export function legacySpeciesStaticParams() {
  const seen = new Set<string>();
  const params: Array<{ id: string; locale: AppLocale }> = [];
  for (const locale of routing.locales) {
    for (const item of getCatalogSpecies()) {
      const keys = new Set([getSpeciesPublicSlug(item.id, "ka"), item.id]);
      for (const id of keys) {
        const token = `${locale}:${id}`;
        if (seen.has(token)) continue;
        seen.add(token);
        params.push({ id, locale });
      }
    }
  }
  return params;
}

export function regionHref(id: string) {
  return { params: { id }, pathname: "/regions/[id]" as const };
}

export function resolveSpecies(param: string): Species | undefined {
  const id = resolveSpeciesId(param);
  if (!id) return undefined;
  return getSpeciesById(id);
}

export function resolveSpeciesId(param: string): string | undefined {
  return idByAnySlug[param];
}

export function resolveSpeciesInHub(
  hubId: GroupHubId,
  slug: string,
): Species | undefined {
  const species = resolveSpecies(slug);
  if (!species) return undefined;
  if (getSpeciesHubId(species.id) !== hubId) return undefined;
  if (RESERVED_HUB_SLUGS[hubId].includes(slug)) return undefined;
  return species;
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
    const slugs = new Set([
      getSpeciesPublicSlug(item.id, "en"),
      getSpeciesPublicSlug(item.id, "ka"),
      ...(KA_SLUG_ALIASES[item.id] ?? []),
    ]);
    for (const locale of routing.locales) {
      for (const slug of slugs) {
        params.push({ locale, slug });
      }
    }
  }
  return params;
}
