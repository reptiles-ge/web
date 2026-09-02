import { species } from "./species.generated";
import type {
  DangerLevel,
  GalleryImage,
  PhotoCredit,
  Species,
} from "./speciesTypes";

export {
  defaultSpeciesSources,
  type DangerLevel,
  type GalleryImage,
  type PhotoCredit,
  type Species,
  type SpeciesAudio,
  type SpeciesFaq,
  type SpeciesIdentification,
  type SpeciesSource,
  type SpeciesStat,
  type SpeciesTranslation,
} from "./speciesTypes";

export function gallerySrcs(gallery: GalleryImage[]): string[] {
  return gallery.map((item) => item.src);
}

export function hasPhotoCredit(
  credit?: PhotoCredit,
): credit is PhotoCredit {
  return Boolean(
    credit?.photographer || credit?.location || credit?.date,
  );
}

export function overlayPhotoCredit(
  base?: PhotoCredit,
  extra?: PhotoCredit,
): PhotoCredit | undefined {
  const photographer = extra?.photographer ?? base?.photographer;
  const url = extra?.url ?? base?.url;
  const location = extra?.location ?? base?.location;
  const date = extra?.date ?? base?.date;
  const merged: PhotoCredit = {
    ...(photographer ? { photographer } : {}),
    ...(url ? { url } : {}),
    ...(location ? { location } : {}),
    ...(date ? { date } : {}),
  };
  return hasPhotoCredit(merged) ? merged : undefined;
}

export function mergeGallery(
  base: GalleryImage[],
  translated?: GalleryImage[],
): GalleryImage[] {
  if (!translated?.length) return base;
  const bySrc = new Map(translated.map((item) => [item.src, item]));
  return base.map((item) => {
    const extra = bySrc.get(item.src);
    if (!extra) return item;
    const credit = overlayPhotoCredit(item.credit, extra.credit);
    return credit ? { src: item.src, credit } : { src: item.src };
  });
}

export function resolvePhotoCredit(
  ...credits: Array<PhotoCredit | undefined>
): PhotoCredit | undefined {
  return credits.find(hasPhotoCredit);
}

export const dangerLabels: Record<DangerLevel, string> = {
  Harmless: "უვნებელი",
  Moderate: "საშუალო",
  High: "მაღალი",
};

export const images = {
  hero: "https://cdn.reptiles.ge/hero-img.webp",
  detail: "https://cdn.reptiles.ge/vipera-dinnik-3.webp",
  cta: "https://cdn.reptiles.ge/landing-cta-cover.jpeg",
};

export const featuredSpeciesIds = [
  "vipera-dinniki",
  "macrovipera-lebetina",
  "vipera-kaznakovi",
  "vipera-transcaucasiana",
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
  "mertensiella-caucasica",
  "lissotriton-lantzi",
  "ommatotriton-ophryticus",
  "triturus-karelinii",
  "pelobates-syriacus",
  "pelodytes-caucasicus",
  "bufotes-viridis",
  "bufo-verrucosissimus",
  "hyla-orientalis",
  "hyla-savignyi",
  "rana-macrocnemis",
  "pelophylax-ridibundus",
  "testudo-graeca",
  "emys-orbicularis",
  "trachemys-scripta",
  "mauremys-caspica",
  "tenuidactylus-caspius",
  "anguis-colchica",
  "paralaudakia-caucasia",
  "eumeces-schneiderii",
  "ablepharus-pannonicus",
  "eremias-velox",
  "eremias-arguta",
  "ophisops-elegans",
  "lacerta-agilis",
  "lacerta-strigata",
  "lacerta-media",
  "phoenicolacerta-laevis",
  "darevskia-adjarica",
  "darevskia-alpina",
  "darevskia-armeniaca",
  "darevskia-brauneri",
  "darevskia-caucasica",
  "darevskia-clarkorum",
  "darevskia-daghestanica",
  "darevskia-dahli",
  "darevskia-derjugini",
  "darevskia-mixta",
  "darevskia-portschinskii",
  "darevskia-praticola",
  "darevskia-pontica",
  "darevskia-obscura",
  "darevskia-raddei",
  "darevskia-valentini",
  "xerotyphlops-vermicularis",
  "eryx-jaculus",
  "zamenis-longissimus",
  "zamenis-hohenackeri",
  "dolichophis-caspius",
  "hemorrhois-ravergieri",
  "eirenis-modestus",
  "eirenis-collaris",
  "malpolon-insignitus",
  "emberiza-citrinella",
  "picus-viridis",
  "dendrocopos-major",
  "jynx-torquilla",
  "cuculus-canorus",
  "upupa-epops",
  "apus-apus",
  "strix-aluco",
  "otus-scops",
  "aegolius-funereus",
  "athene-noctua",
  "tyto-alba",
  "bubo-bubo",
  "ficedula-hypoleuca",
  "ficedula-semitorquata",
  "erithacus-rubecula",
  "luscinia-megarhynchos",
  "buteo-buteo",
  "pernis-apivorus",
  "ciconia-ciconia",
  "aquila-chrysaetos",
  "aegypius-monachus",
  "gyps-fulvus",
  "milvus-migrans",
  "accipiter-nisus",
  "accipiter-gentilis",
  "falco-peregrinus",
  "corvus-corax",
  "pica-pica",
  "garrulus-glandarius",
  "anas-platyrhynchos",
  "glareola-pratincola",
  "larus-fuscus",
  "phasianus-colchicus",
  "coturnix-coturnix",
  "turdus-merula",
  "columba-palumbus",
  "motacilla-alba",
  "vulpes-vulpes",
  "canis-aureus",
  "canis-lupus",
  "mustela-nivalis",
  "lutra-lutra",
  "meles-canescens",
  "sciurus-anomalus",
  "capreolus-capreolus",
  "ursus-arctos",
  "erinaceus-concolor",
  "sus-scrofa",
  "panthera-pardus",
  "lynx-lynx",
  "procyon-lotor",
  "capra-aegagrus",
  "argiope-bruennichi",
] as const;

export const catalogSpeciesIds = [...featuredSpeciesIds] as const;

export const unpublishedSpeciesIds = new Set<string>([
  "dolichophis-caspius",
]);

export function isPublishedSpeciesId(id: string) {
  return !unpublishedSpeciesIds.has(id);
}

export { species };

export function getSpeciesById(id: string) {
  if (!isPublishedSpeciesId(id)) return undefined;
  return species.find((item) => item.id === id);
}

export function getFeaturedSpecies() {
  return featuredSpeciesIds
    .map((id) => getSpeciesById(id))
    .filter((item): item is Species => Boolean(item));
}

export function getCatalogSpecies() {
  return catalogSpeciesIds
    .filter(isPublishedSpeciesId)
    .map((id) => getSpeciesById(id))
    .filter((item): item is Species => Boolean(item));
}

export function dangerClass(danger: DangerLevel) {
  switch (danger) {
    case "High":
      return "bg-destructive/15 text-destructive";
    case "Moderate":
      return "bg-gold/20 text-gold";
    default:
      return "bg-primary/15 text-primary";
  }
}
