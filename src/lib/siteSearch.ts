import { getRegionHeroImage } from "@/data/regionImages";
import {
  localizeRegionText,
  regions,
  type LocalizedText,
} from "@/data/regions";
import {
  featuredSpeciesIds,
  getCatalogSpecies,
  getSpeciesById,
  type Species,
} from "@/data/species";
import {
  getSpeciesAtlasMeta,
  groupHasVenomConcept,
  isVenomousDanger,
  type AnimalGroup,
} from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale, AppPathnames } from "@/i18n/routing";
import {
  CLUSTER_GUIDE_LIST,
  isFrogSpecies,
  isNewtSpecies,
  type ClusterGuideId,
} from "@/lib/clusterGuides";
import { GROUP_HUB_LIST, type GroupHubId } from "@/lib/groupHubs";
import { quizHref, type QuizHref } from "@/lib/quizzes";
import { transliterateKa } from "@/lib/slugify";
import { speciesAliasKeywords } from "@/lib/seoKeywords";
import {
  regionHref,
  speciesHref,
  type SpeciesHref,
} from "@/lib/speciesRoutes";

export type SearchKind = "page" | "species" | "region";
export type SearchFilter = "all" | SearchKind;
export type SearchIcon =
  | "atlas"
  | "hub"
  | "guide"
  | "identify"
  | "safety"
  | "map"
  | "yard"
  | "info"
  | "contact";

export type SearchPageHref = Exclude<
  AppPathnames,
  | "/species/[id]"
  | "/snakes/[slug]"
  | "/lizards/[slug]"
  | "/turtles/[slug]"
  | "/amphibians/[slug]"
  | "/birds/[slug]"
  | "/quiz/[slug]"
  | "/regions/[id]"
>;

export type SearchHref =
  | SearchPageHref
  | SpeciesHref
  | QuizHref
  | { pathname: "/regions/[id]"; params: { id: string } };

export type SearchDocument = {
  key: string;
  kind: SearchKind;
  id: string;
  href: SearchHref;
  title: string;
  subtitle: string;
  searchText: string;
  scoreTitles: string[];
  image?: string;
  icon: SearchIcon;
  suggested?: boolean;
  rank?: number;
  featured?: boolean;
};

export type ScoredDocument = SearchDocument & { score: number };

export type SearchGroup = {
  kind: SearchKind;
  items: ScoredDocument[];
};

type PageCopy = {
  title: LocalizedText;
  subtitle: LocalizedText;
  keywords: string[];
  icon: SearchIcon;
  suggested?: boolean;
  rank?: number;
};

const GROUP_LABELS: Record<AnimalGroup, LocalizedText> = {
  snake: { ka: "გველი", en: "Snake" },
  lizard: { ka: "ხვლიკი", en: "Lizard" },
  turtle: { ka: "კუ", en: "Turtle" },
  amphibian: { ka: "ამფიბია", en: "Amphibian" },
  bird: { ka: "ფრინველი", en: "Bird" },
};

const HUB_COPY: Record<GroupHubId, PageCopy> = {
  snakes: {
    title: { ka: "გველები საქართველოში", en: "Snakes in Georgia" },
    subtitle: {
      ka: "სრული ჰაბი — შხამიანი და უშხამო სახეობები",
      en: "The hub for venomous and harmless snakes",
    },
    keywords: ["გველები", "gvelebi", "snakes", "snake hub"],
    icon: "hub",
    suggested: true,
    rank: 6,
  },
  lizards: {
    title: { ka: "ხვლიკები საქართველოში", en: "Lizards in Georgia" },
    subtitle: {
      ka: "Darevskia, ჯოჯო და გველხოკერა",
      en: "Darevskia, agama, and glass lizard",
    },
    keywords: ["ხვლიკები", "xvlikebi", "lizards", "darevskia"],
    icon: "hub",
  },
  turtles: {
    title: { ka: "კუები საქართველოში", en: "Turtles in Georgia" },
    subtitle: {
      ka: "ხმელეთის და წყლის კუები ერთ ჰაბში",
      en: "Land and freshwater turtles in one hub",
    },
    keywords: ["კუები", "kuebi", "turtles", "tortoise"],
    icon: "hub",
  },
  amphibians: {
    title: { ka: "ამფიბიები საქართველოში", en: "Amphibians in Georgia" },
    subtitle: {
      ka: "ბაყაყები, ტრიტონები და სალამანდრები",
      en: "Frogs, newts, and salamanders",
    },
    keywords: ["ამფიბიები", "amfibiebi", "amphibians", "ბაყაყები", "frogs"],
    icon: "hub",
  },
  birds: {
    title: { ka: "ფრინველები საქართველოში", en: "Birds in Georgia" },
    subtitle: {
      ka: "ფრინველების პროფილები ბუნების ატლასში",
      en: "Bird profiles in the nature atlas",
    },
    keywords: [
      "ფრინველები",
      "prinvelebi",
      "birds",
      "გრატა",
      "yellowhammer",
    ],
    icon: "hub",
  },
};

const CLUSTER_COPY: Record<ClusterGuideId, PageCopy> = {
  "snake-index": {
    title: {
      ka: "გველის სახეობები საქართველოში",
      en: "Snake species of Georgia",
    },
    subtitle: {
      ka: "სრული ინდექსი — სახელი, რისკი, არეალი",
      en: "Full index — names, venom, range",
    },
    keywords: ["სახეობები", "index", "სია", "list", "კატალოგი"],
    icon: "atlas",
  },
  "snake-identify": {
    title: { ka: "შხამიანი თუ უშხამო?", en: "Venomous or harmless?" },
    subtitle: {
      ka: "ამოცნობის გიდი გველებისთვის",
      en: "Identification guide for snakes",
    },
    keywords: [
      "ამოცნობა",
      "identifikacia",
      "identify",
      "შხამიანი თუ",
      "venomous or",
      "გველგესლა",
    ],
    icon: "identify",
    suggested: true,
    rank: 7,
  },
  "snake-bite": {
    title: {
      ka: "გველის ნაკბენი — რა უნდა გავაკეთოთ?",
      en: "Snakebite — what should you do?",
    },
    subtitle: {
      ka: "პირველი ნაბიჯები და რა არ უნდა გააკეთო",
      en: "First steps and what not to do",
    },
    keywords: [
      "ნაკბენი",
      "nakbeni",
      "bite",
      "snakebite",
      "112",
      "პირველადი",
      "first aid",
    ],
    icon: "safety",
    suggested: true,
    rank: 3,
  },
  "snake-range": {
    title: {
      ka: "სად გვხვდება გველები საქართველოში?",
      en: "Where do snakes occur in Georgia?",
    },
    subtitle: {
      ka: "გავრცელება რეგიონების მიხედვით",
      en: "Occurrence by region",
    },
    keywords: ["გავრცელება", "gavrtseleba", "range", "სად გვხვდება", "habitat"],
    icon: "map",
  },
  "snake-largest": {
    title: {
      ka: "საქართველოს ყველაზე დიდი გველები",
      en: "The largest snakes of Georgia",
    },
    subtitle: {
      ka: "ზომით, არა მითებით",
      en: "By published length — not myths",
    },
    keywords: ["დიდი გველები", "largest", "გრძელი", "longest", "ზომა"],
    icon: "guide",
  },
  "lizard-index": {
    title: {
      ka: "საქართველოს ხვლიკების სახეობები",
      en: "Lizard species of Georgia",
    },
    subtitle: {
      ka: "სრული ინდექსი ხვლიკებზე",
      en: "Full lizard index",
    },
    keywords: ["ხვლიკების სახეობები", "lizard species", "darevskia"],
    icon: "atlas",
  },
  "lizard-identify": {
    title: { ka: "ეს რა ხვლიკია?", en: "What lizard is this?" },
    subtitle: {
      ka: "ამოცნობის გიდი ხვლიკებისთვის",
      en: "Identification guide for lizards",
    },
    keywords: ["ამოცნობა", "identify", "რა ხვლიკია", "what lizard"],
    icon: "identify",
  },
  "lizard-glass": {
    title: {
      ka: "ხვლიკი, გველხოკერა თუ გველი?",
      en: "Lizard, glass lizard, or snake?",
    },
    subtitle: {
      ka: "როგორ გაარჩიო უფეხო ხვლიკი გველისგან",
      en: "How to tell a legless lizard from a snake",
    },
    keywords: [
      "გველხოკერა",
      "gvelxokera",
      "glass lizard",
      "pseudopus",
      "უფეხო",
      "legless",
    ],
    icon: "identify",
  },
  "turtle-index": {
    title: {
      ka: "საქართველოს კუების სახეობები",
      en: "Turtle species of Georgia",
    },
    subtitle: {
      ka: "სრული ინდექსი კუებზე",
      en: "Full turtle index",
    },
    keywords: ["კუების სახეობები", "turtle species"],
    icon: "atlas",
  },
  "turtle-land": {
    title: { ka: "ხმელეთის კუები საქართველოში", en: "Land turtles of Georgia" },
    subtitle: {
      ka: "ხმელეთის კუ — Spur-thighed tortoise",
      en: "The spur-thighed tortoise",
    },
    keywords: ["ხმელეთის კუ", "land turtle", "tortoise", "testudo"],
    icon: "guide",
  },
  "turtle-water": {
    title: { ka: "წყლის კუები საქართველოში", en: "Freshwater turtles of Georgia" },
    subtitle: {
      ka: "ჭაობის კუ, კასპიური კუ, წითელყურა",
      en: "Pond turtle, Caspian turtle, slider",
    },
    keywords: [
      "წყლის კუ",
      "freshwater",
      "pond turtle",
      "წითელყურა",
      "slider",
      "emys",
    ],
    icon: "guide",
  },
  "turtle-identify": {
    title: { ka: "ეს რა კუა?", en: "What turtle is this?" },
    subtitle: {
      ka: "ამოცნობის გიდი კუებისთვის",
      en: "Identification guide for turtles",
    },
    keywords: ["ამოცნობა", "identify", "რა კუა", "what turtle"],
    icon: "identify",
  },
  "amphibian-index": {
    title: {
      ka: "საქართველოს ამფიბიების სახეობები",
      en: "Amphibian species of Georgia",
    },
    subtitle: {
      ka: "სრული ინდექსი ამფიბიებზე",
      en: "Full amphibian index",
    },
    keywords: ["ამფიბიების სახეობები", "amphibian species"],
    icon: "atlas",
  },
  "amphibian-frogs": {
    title: { ka: "ბაყაყები საქართველოში", en: "Frogs of Georgia" },
    subtitle: {
      ka: "ბაყაყების ჰაბი — Anura",
      en: "The frog hub — Anura",
    },
    keywords: ["ბაყაყები", "bayayi", "frogs", "anura", "გომბეშო", "toad"],
    icon: "hub",
    suggested: true,
    rank: 8,
  },
  "amphibian-frogs-index": {
    title: {
      ka: "საქართველოს ბაყაყების სახეობები",
      en: "Frog species of Georgia",
    },
    subtitle: {
      ka: "სრული ინდექსი ბაყაყებზე",
      en: "Full frog index",
    },
    keywords: ["ბაყაყების სახეობები", "frog species"],
    icon: "atlas",
  },
  "amphibian-newts": {
    title: {
      ka: "ტრიტონები და სალამანდრები საქართველოში",
      en: "Newts and salamanders of Georgia",
    },
    subtitle: {
      ka: "Caudata — ოთხი სახეობა ატლასში",
      en: "Caudata — four species in the atlas",
    },
    keywords: [
      "ტრიტონი",
      "tritoni",
      "სალამანდრა",
      "newt",
      "salamander",
      "caudata",
    ],
    icon: "guide",
  },
};

const STATIC_PAGES: Array<
  PageCopy & {
    id: string;
    href: SearchPageHref;
    heroSpeciesId?: string;
    heroImage?: string;
  }
> = [
  {
    id: "species-atlas",
    href: "/species",
    title: {
      ka: "სახეობების ატლასი",
      en: "Species atlas",
    },
    subtitle: {
      ka: "სრული კატალოგი ტიპის, რისკისა და რეგიონის მიხედვით",
      en: "The full catalog by type, risk, and region",
    },
    keywords: ["ატლასი", "atlas", "კატალოგი", "catalog", "სახეობები"],
    icon: "atlas",
    suggested: true,
    rank: 4,
    heroSpeciesId: "vipera-kaznakovi",
  },
  {
    id: "venomous-snakes",
    href: "/venomous-snakes",
    title: {
      ka: "შხამიანი გველები საქართველოში",
      en: "Venomous snakes in Georgia",
    },
    subtitle: {
      ka: "ექვსი სამედიცინოდ მნიშვნელოვანი სახეობა",
      en: "Six medically important species",
    },
    keywords: [
      "შხამიანი",
      "shxamiani",
      "venomous",
      "viper",
      "გველგესლა",
      "გიურზა",
      "giurza",
    ],
    icon: "safety",
    suggested: true,
    rank: 1,
    heroSpeciesId: "macrovipera-lebetina",
  },
  {
    id: "risk-to-humans",
    href: "/risk-to-humans",
    title: {
      ka: "რისკი ადამიანისთვის",
      en: "Risk to humans",
    },
    subtitle: {
      ka: "უვნებელი, საშუალო, მაღალი — რას ნიშნავს თითოეული ნიშანი",
      en: "Harmless, moderate, high — what each label means",
    },
    keywords: [
      "რისკი",
      "risk",
      "მაღალი რისკი",
      "საშუალო რისკი",
      "უვნებელი",
      "harmless",
      "danger",
      "შხამი",
    ],
    icon: "safety",
    suggested: true,
    rank: 2,
    heroSpeciesId: "macrovipera-lebetina",
  },
  {
    id: "snakes-in-yard",
    href: "/snakes-in-the-yard",
    title: {
      ka: "როგორ მოვიშოროთ გველი ეზოდან?",
      en: "How do we get snakes out of the yard?",
    },
    subtitle: {
      ka: "რა მუშაობს, რა არა — პრაქტიკული გიდი",
      en: "What works, what doesn’t — a practical guide",
    },
    keywords: [
      "ეზო",
      "ezoshi",
      "yard",
      "garden",
      "დასაფრთხობი",
      "repellent",
      "გოგირდი",
    ],
    icon: "yard",
    suggested: true,
    rank: 6,
    heroImage: "/images/guides/snakes-in-the-yard-cover.jpg",
  },
  {
    id: "quizzes",
    href: "/quiz",
    title: { ka: "ქვიზები", en: "Quizzes" },
    subtitle: {
      ka: "ფოტო-ქვიზი საქართველოს გველებზე",
      en: "A photo quiz of Georgia’s snakes",
    },
    keywords: ["ქვიზი", "ქვიზები", "quiz", "quizzes", "ამოცნობა"],
    icon: "identify",
    suggested: true,
    rank: 3,
    heroImage: "/images/guides/snake-quiz-og.jpg",
  },
  {
    id: "regions-index",
    href: "/regions",
    title: { ka: "საქართველოს რეგიონები", en: "Regions of Georgia" },
    subtitle: {
      ka: "ქვეწარმავლები ადგილის მიხედვით",
      en: "Reptiles by place",
    },
    keywords: ["რეგიონები", "regions", "რუკა", "map", "ატლასი"],
    icon: "map",
    suggested: true,
    rank: 5,
  },
  {
    id: "about",
    href: "/about",
    title: { ka: "შესახებ", en: "About" },
    subtitle: {
      ka: "როგორ შედგება ატლასი და საიდან მოდის ცოდნა",
      en: "How the atlas is built and sourced",
    },
    keywords: ["შესახებ", "about", "წყაროები", "sources", "პროექტი"],
    icon: "info",
  },
  {
    id: "contact",
    href: "/contact",
    title: { ka: "კონტაქტი", en: "Contact" },
    subtitle: {
      ka: "კითხვა, შენიშვნა ან თანამშრომლობა",
      en: "Questions, notes, or collaboration",
    },
    keywords: ["კონტაქტი", "contact", "ელფოსტა", "email"],
    icon: "contact",
  },
];

const SNAKE_QUIZ_COPY: PageCopy = {
  title: { ka: "რომელი გველია?", en: "Which snake is it?" },
  subtitle: {
    ka: "ფოტო-ქვიზი საქართველოს გველებზე",
    en: "A photo quiz of Georgia’s snakes",
  },
  keywords: [
    "ქვიზი",
    "quiz",
    "რომელი გველია",
    "which snake",
    "გველების ქვიზი",
  ],
  icon: "identify",
  suggested: true,
  rank: 9,
};

const FEATURED_SPECIES = new Set<string>(featuredSpeciesIds.slice(0, 8));

function pickLocale(text: LocalizedText, locale: AppLocale) {
  return locale === "en" ? text.en : text.ka;
}

function coverFromSpecies(id?: string, fallback?: string) {
  if (fallback) return fallback;
  if (!id) return undefined;
  const species = getSpeciesById(id);
  return species?.mobileImage ?? species?.image;
}

function blob(parts: Array<string | undefined>) {
  const raw = parts.filter(Boolean).join(" ");
  return `${raw} ${transliterateKa(raw)}`.toLowerCase();
}

function normalize(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

function fieldScore(query: string, field: string, weight: number) {
  if (!field) return 0;
  if (field === query) return weight;
  if (field.startsWith(query)) return Math.round(weight * 0.92);
  const tokens = field.split(/[\s,./():+_|–—-]+/);
  if (tokens.some((token) => token.startsWith(query))) {
    return Math.round(weight * 0.78);
  }
  if (field.includes(query)) return Math.round(weight * 0.48);
  return 0;
}

function hrefSearchText(href: SearchHref) {
  if (typeof href === "string") return href;
  if ("slug" in href.params) return href.params.slug;
  if ("id" in href.params) return href.params.id;
  return "";
}

function toPageDocument(
  locale: AppLocale,
  id: string,
  href: SearchHref,
  copy: PageCopy,
  image?: string,
): SearchDocument {
  return {
    key: `page:${id}`,
    kind: "page",
    id,
    href,
    title: pickLocale(copy.title, locale),
    subtitle: pickLocale(copy.subtitle, locale),
    scoreTitles: [copy.title.ka, copy.title.en],
    searchText: blob([
      copy.title.ka,
      copy.title.en,
      copy.subtitle.ka,
      copy.subtitle.en,
      ...copy.keywords,
      hrefSearchText(href),
    ]),
    image,
    icon: copy.icon,
    suggested: copy.suggested,
    rank: copy.rank,
  };
}

function speciesGroupText(species: Species) {
  const group = getSpeciesAtlasMeta(species.id).group;
  const extra: string[] = [];
  if (groupHasVenomConcept(group)) {
    if (isVenomousDanger(species.danger)) {
      extra.push("შხამიანი", "venomous", "viper");
    } else {
      extra.push("უშხამო", "harmless");
    }
  }
  if (isFrogSpecies(species.id)) extra.push("ბაყაყი", "frog", "toad");
  if (isNewtSpecies(species.id)) extra.push("ტრიტონი", "სალამანდრა", "newt");
  extra.push(GROUP_LABELS[group].ka, GROUP_LABELS[group].en);
  extra.push(group === "snake" ? "გველი გველები snakes" : "");
  extra.push(group === "lizard" ? "ხვლიკი lizards" : "");
  extra.push(group === "turtle" ? "კუ turtles tortoise" : "");
  extra.push(group === "amphibian" ? "ამფიბია amphibian" : "");
  extra.push(group === "bird" ? "ფრინველი bird გრატა" : "");
  return extra;
}

function toSpeciesDocument(locale: AppLocale, raw: Species): SearchDocument {
  const localized = localizeSpecies(raw, locale);
  const ka = localizeSpecies(raw, "ka");
  const en = localizeSpecies(raw, "en");
  const group = getSpeciesAtlasMeta(raw.id).group;

  return {
    key: `species:${raw.id}`,
    kind: "species",
    id: raw.id,
    href: speciesHref(raw.id, locale),
    title: localized.commonName,
    subtitle: raw.scientificName,
    scoreTitles: [ka.commonName, en.commonName, raw.scientificName, raw.genus],
    searchText: blob([
      ka.commonName,
      en.commonName,
      raw.scientificName,
      raw.genus,
      raw.family,
      ka.location,
      en.location,
      raw.id,
      ...speciesAliasKeywords(raw.id, "ka"),
      ...speciesAliasKeywords(raw.id, "en"),
      ...speciesGroupText(raw),
    ]),
    image: raw.mobileImage ?? raw.image,
    icon: group === "snake" ? "safety" : "guide",
    featured: FEATURED_SPECIES.has(raw.id),
  };
}

function toRegionDocument(locale: AppLocale, region: (typeof regions)[number]): SearchDocument {
  return {
    key: `region:${region.id}`,
    kind: "region",
    id: region.id,
    href: regionHref(region.id),
    title: localizeRegionText(region.name, locale),
    subtitle: localizeRegionText(region.description, locale),
    scoreTitles: [
      region.name.ka,
      region.name.en,
      region.nameIn.ka,
      region.nameIn.en,
    ],
    searchText: blob([
      region.name.ka,
      region.name.en,
      region.nameIn.ka,
      region.nameIn.en,
      region.description.ka,
      region.description.en,
      region.id,
    ]),
    image: getRegionHeroImage(region.id),
    icon: "map",
  };
}

export function buildSearchIndex(locale: AppLocale): SearchDocument[] {
  const pages = [
    ...STATIC_PAGES.map((page) =>
      toPageDocument(
        locale,
        page.id,
        page.href,
        page,
        coverFromSpecies(page.heroSpeciesId, page.heroImage),
      ),
    ),
    toPageDocument(
      locale,
      "snake-quiz",
      quizHref("snake", locale),
      SNAKE_QUIZ_COPY,
      "/images/guides/snake-quiz-og.jpg",
    ),
    ...GROUP_HUB_LIST.map((hub) =>
      toPageDocument(
        locale,
        hub.id,
        hub.path,
        HUB_COPY[hub.id],
        coverFromSpecies(hub.heroSpeciesId),
      ),
    ),
    ...CLUSTER_GUIDE_LIST.map((guide) =>
      toPageDocument(
        locale,
        guide.id,
        guide.pathname,
        CLUSTER_COPY[guide.id],
        coverFromSpecies(guide.heroSpeciesId, guide.heroImage),
      ),
    ),
  ];

  const species = getCatalogSpecies().map((item) =>
    toSpeciesDocument(locale, item),
  );
  const regionDocs = regions.map((region) => toRegionDocument(locale, region));

  return [...pages, ...species, ...regionDocs];
}

export function scoreDocument(query: string, doc: SearchDocument) {
  const q = normalize(query);
  if (!q) return 0;
  const text = doc.searchText;
  const tokens = q.split(" ").filter(Boolean);
  if (tokens.some((token) => !text.includes(token))) return 0;

  const titleScore = Math.max(
    ...doc.scoreTitles.map((title) => fieldScore(q, normalize(title), 100)),
    0,
  );
  const tokenTitle = tokens.reduce(
    (sum, token) =>
      sum +
      Math.max(
        ...doc.scoreTitles.map((title) =>
          fieldScore(token, normalize(title), 34),
        ),
        0,
      ),
    0,
  );
  let score = Math.max(titleScore, tokenTitle);
  score += Math.min(16, q.length);
  if (doc.kind === "page" && titleScore >= 48) score += 10;
  if (doc.kind === "region" && titleScore >= 70) score += 6;
  return score;
}

const LIMITS: Record<SearchKind, number> = {
  page: 5,
  species: 6,
  region: 4,
};

export function searchIndex(
  index: SearchDocument[],
  query: string,
  filter: SearchFilter,
): { groups: SearchGroup[]; totals: Record<SearchKind, number> } {
  const trimmed = query.trim();
  const scoped = index.filter(
    (item) => filter === "all" || item.kind === filter,
  );

  const totals: Record<SearchKind, number> = {
    page: 0,
    species: 0,
    region: 0,
  };

  if (!trimmed) {
    const idle = scoped
      .filter((item) => {
        if (filter === "species") return item.kind === "species" && item.featured;
        if (filter === "region") return item.kind === "region";
        if (filter === "page") return item.kind === "page";
        return (
          (item.kind === "page" && item.suggested) ||
          (item.kind === "species" && item.featured)
        );
      })
      .sort((a, b) => (a.rank ?? 50) - (b.rank ?? 50));

    const groups = groupDocuments(
      idle.map((item) => ({ ...item, score: 0 })),
      filter === "all"
        ? { page: 6, species: 5, region: 0 }
        : { page: 12, species: 8, region: 12 },
    );
    for (const group of groups) totals[group.kind] = group.items.length;
    return { groups, totals };
  }

  const scored: ScoredDocument[] = [];
  for (const item of scoped) {
    const score = scoreDocument(trimmed, item);
    if (score <= 0) continue;
    totals[item.kind] += 1;
    scored.push({ ...item, score });
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const limits =
    filter === "all" ? LIMITS : { page: 12, species: 12, region: 12 };

  return { groups: groupDocuments(scored, limits), totals };
}

function groupDocuments(
  items: ScoredDocument[],
  limits: Record<SearchKind, number>,
): SearchGroup[] {
  const buckets: Record<SearchKind, ScoredDocument[]> = {
    page: [],
    species: [],
    region: [],
  };
  for (const item of items) {
    if (buckets[item.kind].length >= limits[item.kind]) continue;
    buckets[item.kind].push(item);
  }

  const groups = (Object.keys(buckets) as SearchKind[])
    .map((kind) => ({ kind, items: buckets[kind] }))
    .filter((group) => group.items.length > 0);

  groups.sort((a, b) => {
    const aScore = a.items[0]?.score ?? 0;
    const bScore = b.items[0]?.score ?? 0;
    if (bScore !== aScore) return bScore - aScore;
    const order: SearchKind[] = ["page", "species", "region"];
    return order.indexOf(a.kind) - order.indexOf(b.kind);
  });

  return groups;
}

export function flattenGroups(groups: SearchGroup[]) {
  return groups.flatMap((group) => group.items);
}

export type RecentRef = { kind: SearchKind; id: string };

export const SEARCH_RECENT_KEY = "reptiles.search.recent";

export function readRecent(): RecentRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SEARCH_RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentRef[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        (item.kind === "page" ||
          item.kind === "species" ||
          item.kind === "region") &&
        typeof item.id === "string",
    );
  } catch {
    return [];
  }
}

export function writeRecent(entry: RecentRef) {
  const next = [
    entry,
    ...readRecent().filter(
      (item) => !(item.kind === entry.kind && item.id === entry.id),
    ),
  ].slice(0, 5);
  window.localStorage.setItem(SEARCH_RECENT_KEY, JSON.stringify(next));
  return next;
}

export function resolveRecent(index: SearchDocument[], recent: RecentRef[]) {
  return recent
    .map((item) =>
      index.find((doc) => doc.kind === item.kind && doc.id === item.id),
    )
    .filter((item): item is SearchDocument => Boolean(item));
}
