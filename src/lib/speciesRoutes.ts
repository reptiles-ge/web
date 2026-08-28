import {
  getCatalogSpecies,
  getSpeciesById,
  isPublishedSpeciesId,
  type Species,
} from "@/data/species";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import type { AppLocale } from "@/i18n/routing";
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
    | "/mammals/[slug]";
  params: { slug: string };
};

const KA_SLUG_OVERRIDES: Record<string, string> = {
  "macrovipera-lebetina": "giurza",
  "paralaudakia-caucasia": "jojo",
  "pseudopus-apodus": "gvelxokera",
};

const KA_SLUG_ALIASES: Record<string, string[]> = {
  "pelodytes-caucasicus": ["kavkasiuri-jvarula"],
  "ficedula-hypoleuca": ["chreli-buzicheria"],
  "ficedula-semitorquata": [
    "naxevartetqela-mematlia",
    "naxevartetqela-buzicheria",
  ],
  "sciurus-anomalus": ["sparsuli-tsiqvi"],
  "capreolus-capreolus": ["shveli"],
  "ursus-arctos": ["datvi", "mura-dathvi"],
  "canis-aureus": ["tura"],
  "panthera-pardus": ["jiqi", "jiki", "leopardi", "kavkasiuri-jiqi"],
  "sus-scrofa": ["taxi", "gareuli-gori"],
  "erinaceus-concolor": [
    "evropuli-zgarbi",
    "tetrmkerda-zgharbi",
    "aghmosavletevropuli-zgharbi",
  ],
  "canis-lupus": ["mgeli"],
  "meles-canescens": ["evropuli-machvi", "meles-meles", "machvi"],
  "jynx-torquilla": ["chveulebrivi-maktsia", "maqcia"],
};

const LOOKALIKES: Record<string, string[]> = {
  "capreolus-capreolus": ["sus-scrofa"],
  "ursus-arctos": ["canis-lupus", "sus-scrofa"],
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
  "dolichophis-schmidti": ["malpolon-insignitus"],
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
  "darevskia-portschinskii": ["darevskia-obscura", "darevskia-valentini"],
  "darevskia-valentini": ["darevskia-obscura", "darevskia-armeniaca"],
  "darevskia-praticola": ["darevskia-pontica"],
  "darevskia-raddei": ["darevskia-obscura"],
  "ficedula-hypoleuca": ["ficedula-semitorquata"],
  "ficedula-semitorquata": ["ficedula-hypoleuca"],
  "vulpes-vulpes": ["canis-lupus"],
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
  if (locale === "en") return id;
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
      return (["ka", "en"] as const).flatMap((locale) =>
        [...slugs].map((slug) => ({ locale, slug })),
      );
    });
}

export function legacySpeciesStaticParams() {
  const seen = new Set<string>();
  const params: Array<{ locale: AppLocale; id: string }> = [];
  for (const locale of ["ka", "en"] as const) {
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
    /^\/(snakes|lizards|turtles|amphibians|birds|mammals)\/([^/]+)$/,
  );
  if (!match) return pathname;
  const hub = match[1] as GroupHubId;
  const species = resolveSpeciesInHub(hub, match[2]);
  if (!species) return pathname;
  const slug = getSpeciesPublicSlug(species.id, locale);
  return `/${hub}/${slug}`;
}
