import { type GroupHubId, RESERVED_HUB_SLUGS } from "@/lib/groupHubs";
import { kaToSlug } from "@/lib/slugify";

export type SpeciesSlugMaps = {
  hubById: Record<string, GroupHubId>;
  idByAnySlug: Record<string, string>;
  kaSlugById: Record<string, string>;
};

export type SpeciesSlugRow = {
  commonName: string;
  hub: GroupHubId;
  id: string;
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

export function buildSpeciesSlugMaps(rows: SpeciesSlugRow[]): SpeciesSlugMaps {
  const hubById: Record<string, GroupHubId> = {};
  const idByAnySlug: Record<string, string> = {};
  const kaSlugById: Record<string, string> = {};
  const takenSlugs = new Set<string>();

  for (const row of rows) {
    const slug = uniqueKaSlug(row.id, row.commonName, row.hub, takenSlugs);
    takenSlugs.add(slug);
    hubById[row.id] = row.hub;
    kaSlugById[row.id] = slug;
    idByAnySlug[row.id] = row.id;
    idByAnySlug[slug] = row.id;
  }

  for (const [id, aliases] of Object.entries(KA_SLUG_ALIASES)) {
    for (const slug of aliases) {
      idByAnySlug[slug] = id;
    }
  }

  return { hubById, idByAnySlug, kaSlugById };
}

function uniqueKaSlug(
  id: string,
  commonName: string,
  hub: GroupHubId,
  takenSlugs: Set<string>,
) {
  const reserved = new Set(RESERVED_HUB_SLUGS[hub]);
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
