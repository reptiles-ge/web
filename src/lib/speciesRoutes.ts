import {
  getCatalogSpecies,
  getSpeciesById,
  isPublishedSpeciesId,
  type Species,
} from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  ANIMAL_GROUP_TO_HUB,
  RESERVED_HUB_SLUGS,
  type GroupHubId,
} from "@/lib/groupHubs";
import { kaToSlug } from "@/lib/slugify";

export type SpeciesHref = {
  pathname:
    | "/snakes/[slug]"
    | "/lizards/[slug]"
    | "/turtles/[slug]"
    | "/amphibians/[slug]"
    | "/birds/[slug]"
    | "/mammals/[slug]"
    | "/spiders/[slug]";
  params: { slug: string };
};

const KA_SLUG_OVERRIDES: Record<string, string> = {
  "macrovipera-lebetina": "giurza",
  "paralaudakia-caucasia": "jojo",
  "pseudopus-apodus": "gvelxokera",
  "tyto-alba": "bukhrintsa",
};

const KA_SLUG_ALIASES: Record<string, string[]> = {
  "pelodytes-caucasicus": ["kavkasiuri-jvarula"],
  "ficedula-hypoleuca": ["chreli-buzicheria"],
  "ficedula-semitorquata": [
    "naxevartetqela-mematlia",
    "naxevartetqela-buzicheria",
  ],
  "erithacus-rubecula": [
    "gultitela",
    "bultsitela",
    "european-robin",
    "robin",
  ],
  "sciurus-anomalus": ["sparsuli-tsiqvi"],
  "capreolus-capreolus": ["shveli"],
  "ursus-arctos": ["datvi", "mura-dathvi"],
  "canis-aureus": ["tura"],
  "panthera-pardus": ["jiqi", "jiki", "leopardi", "kavkasiuri-jiqi"],
  "lynx-lynx": ["fotsxveri", "lynx", "evraziuli-fotsxveri"],
  "sus-scrofa": ["taxi", "gareuli-gori"],
  "erinaceus-concolor": [
    "evropuli-zgarbi",
    "tetrmkerda-zgharbi",
    "aghmosavletevropuli-zgharbi",
  ],
  "canis-lupus": ["mgeli"],
  "meles-canescens": ["evropuli-machvi", "meles-meles", "machvi"],
  "lutra-lutra": ["tsavi", "wavi", "evraziuli-tsavi"],
  "jynx-torquilla": ["chveulebrivi-maktsia", "maqcia"],
  "dendrocopos-major": [
    "chreli-kodala",
    "didi-kodala",
    "great-spotted-woodpecker",
  ],
  "upupa-epops": [
    "hoopoe",
    "eurasian-hoopoe",
    "common-hoopoe",
    "chveulebrivi-ofofi",
    "udod",
    "ibibik",
  ],
  "apus-apus": ["chveulebrivi-namgala", "namgala"],
  "streptopelia-turtur": ["gvriti", "chveulebrivi-gvriti"],
  "columba-palumbus": [
    "kedani",
    "tqis-mtredi",
    "woodpigeon",
    "common-woodpigeon",
    "wood-pigeon",
  ],
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
  "strix-aluco": ["tqis-bu", "ruxi-bu", "chveulebrivi-tqis-bu"],
  "otus-scops": ["tsqromi", "wqromi", "scops-owl"],
  "aegolius-funereus": [
    "bukioti",
    "mikoti",
    "omidi",
    "boreal-owl",
    "tengmalms-owl",
  ],
  "tyto-alba": [
    "buxrintsa",
    "bukhrintsa",
    "barn-owl",
    "western-barn-owl",
  ],
  "athene-noctua": ["choti", "little-owl", "buknacho"],
  "bubo-bubo": [
    "chveulebrivi-zarnasho",
    "eagle-owl",
    "eurasian-eagle-owl",
    "filin",
    "puhu",
  ],
  "ciconia-ciconia": ["laklaki", "tetri-qarqati"],
  "anas-platyrhynchos": ["gareuli-ikhvi", "ikhvi", "mallard"],
  "coturnix-coturnix": ["mtsqeri", "mwyeri"],
  "phasianus-colchicus": [
    "khokhobi",
    "kolkhuri-khokhobi",
    "common-pheasant",
    "pheasant",
  ],
  "aquila-chrysaetos": ["okrosferi-artsivi", "okrosperi-artsivi"],
  "accipiter-nisus": ["mimino", "korisebri-mimino"],
  "accipiter-gentilis": [
    "didi-kori",
    "goshawk",
    "northern-goshawk",
    "eurasian-goshawk",
    "astur-gentilis",
  ],
  "turdus-merula": ["shashvi", "shavi-shashvi"],
  "motacilla-alba": [
    "tetri-bolokankara",
    "tetri-boloqanqara",
    "white-wagtail",
    "pied-wagtail",
  ],
  "luscinia-megarhynchos": [
    "samxretuli-bulbuli",
    "samhruli-bulbuli",
    "iadoni",
    "nightingale",
    "common-nightingale",
    "rufous-nightingale",
  ],
  "falco-peregrinus": [
    "shavardeni",
    "chveulebrivi-shavardeni",
    "peregrine",
    "peregrine-falcon",
  ],
  "glareola-pratincola": [
    "mertsxala",
    "mdelos-mertsxala",
    "zhghalfrtiana-mertsxala",
    "mertskhala",
    "mdelos-mertskhala",
    "collared-pratincole",
  ],
  "larus-fuscus": [
    "shavzurga-tolia",
    "lesser-black-backed-gull",
    "baltic-gull",
    "heuglini",
    "klusha",
  ],
  "garrulus-glandarius": ["japara", "chxikvi"],
  "buteo-buteo": ["kakacha", "chveulebrivi-arwivi"],
  "pernis-apivorus": [
    "kvernachamia",
    "krazanachamia",
    "irao",
    "chveulebrivi-bolokarkazi",
    "tsudkora",
    "honey-buzzard",
    "european-honey-buzzard",
  ],
  "aegypius-monachus": [
    "cinereous-vulture",
    "black-vulture",
    "shavi-svavi",
  ],
  "gyps-fulvus": [
    "orbi",
    "tetrtava-orbi",
    "chveulebrivi-orbi",
    "griffon",
    "eurasian-griffon",
  ],
  "milvus-migrans": [
    "dzera",
    "black-kite",
    "eurasian-black-kite",
    "milvus-korschun",
  ],
  "corvus-corax": [
    "qorani",
    "northern-raven",
    "common-raven",
    "raven",
  ],
  "pica-pica": ["kachkachi", "eurasian-magpie", "common-magpie"],
  "procyon-lotor": [
    "enoti",
    "chveulebrivi-enoti",
    "raccoon",
    "racoon",
  ],
  "capra-aegagrus": ["niamori", "veluri-txa", "bezoaruli-txa"],
};

const LOOKALIKES: Record<string, string[]> = {
  "argiope-bruennichi": ["argiope-lobata"],
  "capreolus-capreolus": ["sus-scrofa", "capra-aegagrus"],
  "ursus-arctos": ["canis-lupus", "sus-scrofa"],
  "lynx-lynx": ["panthera-pardus", "canis-lupus"],
  "canis-aureus": ["vulpes-vulpes", "canis-lupus"],
  "meles-canescens": ["mustela-nivalis"],
  "pseudopus-apodus": [
    "anguis-colchica",
    "natrix-natrix",
    "natrix-tessellata",
  ],
  "anguis-colchica": ["pseudopus-apodus", "natrix-natrix"],
  "paralaudakia-caucasia": [
    "tenuidactylus-caspius",
    "darevskia-portschinskii",
    "eumeces-schneiderii",
  ],
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
  "vipera-kaznakovi": [
    "natrix-natrix",
    "vipera-dinniki",
    "coronella-austriaca",
    "vipera-transcaucasiana",
  ],
  "vipera-dinniki": [
    "vipera-kaznakovi",
    "vipera-darevskii",
    "coronella-austriaca",
  ],
  "vipera-transcaucasiana": [
    "vipera-kaznakovi",
    "coronella-austriaca",
    "macrovipera-lebetina",
    "vipera-dinniki",
    "vipera-darevskii",
  ],
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
  "coronella-austriaca": [
    "vipera-transcaucasiana",
    "vipera-kaznakovi",
    "vipera-dinniki",
    "vipera-darevskii",
  ],
  "elaphe-urartica": [
    "elaphe-dione",
    "zamenis-hohenackeri",
    "dolichophis-schmidti",
    "hemorrhois-ravergieri",
    "macrovipera-lebetina",
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
  "hemorrhois-ravergieri": [
    "platyceps-najadum",
    "elaphe-urartica",
    "dolichophis-schmidti",
    "macrovipera-lebetina",
    "vipera-transcaucasiana",
  ],
  "zamenis-longissimus": [
    "zamenis-hohenackeri",
    "natrix-natrix",
    "coronella-austriaca",
    "vipera-kaznakovi",
  ],
  "zamenis-hohenackeri": [
    "zamenis-longissimus",
    "elaphe-dione",
    "elaphe-urartica",
    "coronella-austriaca",
    "hemorrhois-ravergieri",
    "vipera-transcaucasiana",
  ],
  "dolichophis-schmidti": [
    "malpolon-insignitus",
    "platyceps-najadum",
    "hemorrhois-ravergieri",
    "elaphe-urartica",
    "macrovipera-lebetina",
    "elaphe-dione",
  ],
  "platyceps-najadum": [
    "hemorrhois-ravergieri",
    "dolichophis-schmidti",
    "elaphe-urartica",
    "elaphe-dione",
    "telescopus-fallax",
    "macrovipera-lebetina",
    "vipera-transcaucasiana",
  ],
  "telescopus-fallax": [
    "vipera-transcaucasiana",
    "coronella-austriaca",
    "elaphe-dione",
  ],
  "eirenis-modestus": [
    "eirenis-collaris",
    "coronella-austriaca",
    "xerotyphlops-vermicularis",
  ],
  "eirenis-collaris": [
    "eirenis-modestus",
    "coronella-austriaca",
    "xerotyphlops-vermicularis",
  ],
  "eryx-jaculus": ["xerotyphlops-vermicularis", "telescopus-fallax"],
  "xerotyphlops-vermicularis": ["eryx-jaculus"],
  "testudo-graeca": [
    "emys-orbicularis",
    "mauremys-caspica",
    "trachemys-scripta",
  ],
  "emys-orbicularis": [
    "mauremys-caspica",
    "trachemys-scripta",
    "testudo-graeca",
  ],
  "mauremys-caspica": [
    "emys-orbicularis",
    "trachemys-scripta",
    "testudo-graeca",
  ],
  "trachemys-scripta": [
    "emys-orbicularis",
    "mauremys-caspica",
    "testudo-graeca",
  ],
  "mertensiella-caucasica": [
    "lissotriton-lantzi",
    "ommatotriton-ophryticus",
    "triturus-karelinii",
  ],
  "lissotriton-lantzi": [
    "ommatotriton-ophryticus",
    "triturus-karelinii",
    "mertensiella-caucasica",
  ],
  "ommatotriton-ophryticus": [
    "lissotriton-lantzi",
    "triturus-karelinii",
    "mertensiella-caucasica",
  ],
  "triturus-karelinii": [
    "ommatotriton-ophryticus",
    "lissotriton-lantzi",
    "mertensiella-caucasica",
  ],
  "hyla-orientalis": [
    "hyla-savignyi",
    "pelophylax-ridibundus",
    "bufotes-viridis",
  ],
  "hyla-savignyi": ["hyla-orientalis", "pelophylax-ridibundus"],
  "pelobates-syriacus": [
    "pelodytes-caucasicus",
    "bufotes-viridis",
    "pelophylax-ridibundus",
    "rana-macrocnemis",
    "bufo-verrucosissimus",
  ],
  "bufotes-viridis": [
    "bufo-verrucosissimus",
    "pelobates-syriacus",
    "hyla-orientalis",
  ],
  "bufo-verrucosissimus": [
    "bufotes-viridis",
    "pelodytes-caucasicus",
    "rana-macrocnemis",
    "pelobates-syriacus",
  ],
  "rana-macrocnemis": [
    "pelophylax-ridibundus",
    "pelodytes-caucasicus",
    "bufo-verrucosissimus",
    "bufotes-viridis",
  ],
  "pelophylax-ridibundus": [
    "rana-macrocnemis",
    "hyla-orientalis",
    "bufotes-viridis",
    "pelodytes-caucasicus",
  ],
  "pelodytes-caucasicus": [
    "pelobates-syriacus",
    "rana-macrocnemis",
    "pelophylax-ridibundus",
    "bufo-verrucosissimus",
    "hyla-orientalis",
    "bufotes-viridis",
  ],
  "eumeces-schneiderii": ["ablepharus-pannonicus"],
  "ablepharus-pannonicus": [
    "ophisops-elegans",
    "eumeces-schneiderii",
    "anguis-colchica",
  ],
  "eremias-velox": ["eremias-arguta"],
  "eremias-arguta": ["eremias-velox", "ophisops-elegans"],
  "ophisops-elegans": ["ablepharus-pannonicus"],
  "lacerta-agilis": [
    "lacerta-strigata",
    "lacerta-media",
    "darevskia-derjugini",
  ],
  "lacerta-strigata": [
    "lacerta-agilis",
    "lacerta-media",
    "ophisops-elegans",
  ],
  "lacerta-media": ["lacerta-strigata", "lacerta-agilis"],
  "darevskia-adjarica": [
    "darevskia-clarkorum",
    "darevskia-derjugini",
    "darevskia-mixta",
  ],
  "darevskia-mixta": [
    "darevskia-clarkorum",
    "darevskia-caucasica",
    "darevskia-derjugini",
    "darevskia-adjarica",
    "darevskia-brauneri",
  ],
  "darevskia-alpina": ["darevskia-caucasica", "darevskia-brauneri"],
  "darevskia-armeniaca": [
    "darevskia-valentini",
    "darevskia-mixta",
    "darevskia-dahli",
  ],
  "darevskia-caucasica": ["darevskia-daghestanica", "darevskia-mixta"],
  "darevskia-daghestanica": ["darevskia-caucasica", "darevskia-derjugini"],
  "darevskia-clarkorum": [
    "darevskia-adjarica",
    "darevskia-derjugini",
    "darevskia-mixta",
  ],
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
  "darevskia-portschinskii": [
    "darevskia-dahli",
    "darevskia-obscura",
    "darevskia-valentini",
  ],
  "darevskia-valentini": ["darevskia-obscura", "darevskia-armeniaca"],
  "darevskia-pontica": [
    "darevskia-praticola",
    "darevskia-derjugini",
    "lacerta-agilis",
  ],
  "darevskia-praticola": ["darevskia-pontica", "lacerta-agilis"],
  "darevskia-raddei": ["darevskia-obscura"],
  "otus-scops": ["strix-aluco", "athene-noctua"],
  "aegolius-funereus": ["strix-aluco", "otus-scops", "athene-noctua"],
  "athene-noctua": ["otus-scops", "strix-aluco", "aegolius-funereus"],
  "tyto-alba": ["strix-aluco", "otus-scops", "aegolius-funereus", "athene-noctua"],
  "bubo-bubo": [
    "strix-aluco",
    "athene-noctua",
    "otus-scops",
    "tyto-alba",
    "aegolius-funereus",
  ],
  "ficedula-hypoleuca": ["ficedula-semitorquata"],
  "ficedula-semitorquata": ["ficedula-hypoleuca"],
  "erithacus-rubecula": ["luscinia-megarhynchos"],
  "luscinia-megarhynchos": ["erithacus-rubecula"],
  "buteo-buteo": [
    "pernis-apivorus",
    "aquila-chrysaetos",
    "accipiter-nisus",
    "falco-peregrinus",
  ],
  "pernis-apivorus": [
    "buteo-buteo",
    "accipiter-nisus",
    "accipiter-gentilis",
    "falco-peregrinus",
  ],
  "accipiter-nisus": ["accipiter-gentilis", "falco-peregrinus", "buteo-buteo"],
  "accipiter-gentilis": ["accipiter-nisus", "buteo-buteo", "falco-peregrinus"],
  "falco-peregrinus": ["accipiter-nisus", "buteo-buteo", "aquila-chrysaetos"],
  "aegypius-monachus": ["aquila-chrysaetos", "buteo-buteo"],
  "gyps-fulvus": ["aegypius-monachus", "aquila-chrysaetos", "buteo-buteo"],
  "milvus-migrans": ["buteo-buteo", "pernis-apivorus", "aquila-chrysaetos"],
  "pica-pica": ["corvus-corax", "garrulus-glandarius"],
  "columba-palumbus": ["streptopelia-turtur"],
  "garrulus-glandarius": ["pica-pica", "corvus-corax"],
  "dendrocopos-major": ["picus-viridis", "jynx-torquilla"],
  "coturnix-coturnix": ["phasianus-colchicus"],
  "phasianus-colchicus": ["coturnix-coturnix"],
  "vulpes-vulpes": ["canis-lupus"],
  "procyon-lotor": ["meles-canescens", "vulpes-vulpes"],
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
  const taken = kaSlugById;
  const preferred = KA_SLUG_OVERRIDES[id] ?? kaToSlug(commonName) ?? id;
  if (!preferred) return id;
  if (!reserved.has(preferred) && !Object.values(taken).includes(preferred)) {
    return preferred;
  }
  const epithet = id.split("-").at(-1) ?? id;
  let candidate = `${preferred}-${epithet}`;
  let n = 2;
  while (reserved.has(candidate) || Object.values(taken).includes(candidate)) {
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

export function getSpeciesPublicSlug(id: string, locale: AppLocale) {
  if (locale !== "ka") return id;
  return kaSlugById[id] ?? id;
}

export function getSpeciesLookalikes(id: string): string[] {
  return [...(lookalikeIndex[id] ?? [])].filter(isPublishedSpeciesId);
}

export function resolveSpeciesId(param: string): string | undefined {
  return idByAnySlug[param];
}

export function resolveSpecies(param: string): Species | undefined {
  const id = resolveSpeciesId(param);
  if (!id) return undefined;
  return getSpeciesById(id);
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
    case "snakes":
      return { pathname: "/snakes/[slug]", params: { slug } };
    case "lizards":
      return { pathname: "/lizards/[slug]", params: { slug } };
    case "turtles":
      return { pathname: "/turtles/[slug]", params: { slug } };
    case "birds":
      return { pathname: "/birds/[slug]", params: { slug } };
    case "mammals":
      return { pathname: "/mammals/[slug]", params: { slug } };
    case "spiders":
      return { pathname: "/spiders/[slug]", params: { slug } };
    default:
      return { pathname: "/amphibians/[slug]", params: { slug } };
  }
}

export function speciesStaticParams(hubId: GroupHubId) {
  return getCatalogSpecies()
    .filter((item) => getSpeciesHubId(item.id) === hubId)
    .flatMap((item) => {
      const slugs = new Set([
        getSpeciesPublicSlug(item.id, "ka"),
        getSpeciesPublicSlug(item.id, "en"),
        ...(KA_SLUG_ALIASES[item.id] ?? []),
      ]);
      return routing.locales.flatMap((locale) =>
        [...slugs].map((slug) => ({ locale, slug })),
      );
    });
}

export function legacySpeciesStaticParams() {
  const seen = new Set<string>();
  const params: Array<{ locale: AppLocale; id: string }> = [];
  for (const locale of routing.locales) {
    for (const item of getCatalogSpecies()) {
      const keys = new Set([item.id, getSpeciesPublicSlug(item.id, "ka")]);
      for (const id of keys) {
        const token = `${locale}:${id}`;
        if (seen.has(token)) continue;
        seen.add(token);
        params.push({ locale, id });
      }
    }
  }
  return params;
}

export function regionHref(id: string) {
  return { pathname: "/regions/[id]" as const, params: { id } };
}

export function remapSpeciesPathname(pathname: string, locale: AppLocale) {
  const match = pathname.match(
    /^\/(snakes|lizards|turtles|amphibians|birds|mammals|spiders)\/([^/]+)$/,
  );
  if (!match) return pathname;
  const hub = match[1] as GroupHubId;
  const species = resolveSpeciesInHub(hub, match[2]);
  if (!species) return pathname;
  const slug = getSpeciesPublicSlug(species.id, locale);
  return `/${hub}/${slug}`;
}
