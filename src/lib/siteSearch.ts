import type { AppLocale, AppPathnames } from "@/i18n/routing";

import {
  getPublishedNewsArticles,
  newsLocalizedDek,
  newsLocalizedTitle,
  newsSearchKeywords,
} from "@/data/news";
import { getRegionHeroImage } from "@/data/regionImages";
import {
  type LocalizedText,
  localizeRegionText,
  regions,
} from "@/data/regions";
import {
  featuredSpeciesIds,
  getCatalogSpecies,
  getSpeciesById,
  type Species,
} from "@/data/species";
import {
  type AnimalGroup,
  getSpeciesAtlasMeta,
  groupHasVenomConcept,
  isVenomousDanger,
} from "@/data/speciesAtlas";
import { pickLocalized } from "@/i18n/localeMeta";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import {
  CLUSTER_GUIDE_LIST,
  type ClusterGuideId,
  isFrogSpecies,
  isNewtSpecies,
} from "@/lib/clusterGuides";
import { GROUP_HUB_LIST, type GroupHubId } from "@/lib/groupHubs";
import { newsArticleHref } from "@/lib/news";
import { quizHref, type QuizHref } from "@/lib/quizzes";
import { speciesAliasKeywords } from "@/lib/seoKeywords";
import { transliterateKa } from "@/lib/slugify";
import { regionHref, speciesHref, type SpeciesHref } from "@/lib/speciesRoutes";

export type ScoredDocument = SearchDocument & { score: number };
export type SearchDocument = {
  featured?: boolean;
  href: SearchHref;
  icon: SearchIcon;
  id: string;
  image?: string;
  key: string;
  kind: SearchKind;
  rank?: number;
  scoreTitles: string[];
  searchText: string;
  subtitle: string;
  suggested?: boolean;
  title: string;
};
export type SearchFilter = "all" | SearchKind;

export type SearchGroup = {
  items: ScoredDocument[];
  kind: SearchKind;
};

export type SearchHref =
  | QuizHref
  | SearchPageHref
  | SpeciesHref
  | { params: { id: string }; pathname: "/regions/[id]"; }
  | { params: { slug: string }; pathname: "/news/[slug]"; };

export type SearchIcon =
  | "atlas"
  | "contact"
  | "guide"
  | "hub"
  | "identify"
  | "info"
  | "map"
  | "news"
  | "safety"
  | "yard";

export type SearchKind = "page" | "region" | "species";

export type SearchPageHref = Exclude<
  AppPathnames,
  | "/amphibians/[slug]"
  | "/birds/[slug]"
  | "/lizards/[slug]"
  | "/mammals/[slug]"
  | "/news/[slug]"
  | "/quiz/[slug]"
  | "/regions/[id]"
  | "/snakes/[slug]"
  | "/species/[id]"
  | "/spiders/[slug]"
  | "/turtles/[slug]"
>;

type PageCopy = {
  icon: SearchIcon;
  keywords: string[];
  rank?: number;
  subtitle: LocalizedText;
  suggested?: boolean;
  title: LocalizedText;
};

const GROUP_LABELS: Record<AnimalGroup, LocalizedText> = {
  amphibian: { en: "Amphibian", ka: "ამფიბია", ru: "Амфибия", tr: "Amfibi" },
  bird: { en: "Bird", ka: "ფრინველი", ru: "Птица", tr: "Kuş" },
  lizard: { en: "Lizard", ka: "ხვლიკი", ru: "Ящерица", tr: "Kertenkele" },
  mammal: {
    en: "Mammal",
    ka: "ძუძუმწოვარი",
    ru: "Млекопитающее",
    tr: "Memeli",
  },
  snake: { en: "Snake", ka: "გველი", ru: "Змея", tr: "Yılan" },
  spider: { en: "Spider", ka: "ობობა", ru: "Паук", tr: "Örümcek" },
  turtle: { en: "Turtle", ka: "კუ", ru: "Черепаха", tr: "Kaplumbağa" },
};

const HUB_COPY: Record<GroupHubId, PageCopy> = {
  amphibians: {
    icon: "hub",
    keywords: [
      "ამფიბიები",
      "amfibiebi",
      "amphibians",
      "ბაყაყები",
      "frogs",
      "амфибии",
      "amfibi",
    ],
    subtitle: {
      en: "Frogs, newts, and salamanders",
      ka: "ბაყაყები, ტრიტონები და სალამანდრები",
    },
    title: {
      en: "Amphibians in Georgia",
      ka: "ამფიბიები საქართველოში",
      ru: "Амфибии Грузии",
      tr: "Gürcistan amfibileri",
    },
  },
  birds: {
    icon: "hub",
    keywords: ["ფრინველები", "prinvelebi", "birds", "გრატა", "yellowhammer"],
    subtitle: {
      en: "Bird profiles in the nature atlas",
      ka: "ფრინველების პროფილები ბუნების ატლასში",
    },
    title: {
      en: "Birds in Georgia",
      ka: "ფრინველები საქართველოში",
      ru: "Птицы Грузии",
      tr: "Gürcistan kuşları",
    },
  },
  lizards: {
    icon: "hub",
    keywords: [
      "ხვლიკები",
      "xvlikebi",
      "lizards",
      "darevskia",
      "ящерицы",
      "kertenkele",
    ],
    subtitle: {
      en: "Darevskia, agama, and glass lizard",
      ka: "Darevskia, ჯოჯო და გველხოკერა",
    },
    title: {
      en: "Lizards in Georgia",
      ka: "ხვლიკები საქართველოში",
      ru: "Ящерицы Грузии",
      tr: "Gürcistan kertenkeleleri",
    },
  },
  mammals: {
    icon: "hub",
    keywords: [
      "ძუძუმწოვრები",
      "dzuzumtsovrebi",
      "mammals",
      "მელა",
      "fox",
      "vulpes",
      "ტურა",
      "jackal",
      "canis",
      "ციყვი",
      "squirrel",
      "დათვი",
      "bear",
      "ursus",
      "ღორი",
      "ტახი",
      "boar",
      "ჯიქი",
      "leopard",
      "შველი",
      "roe deer",
      "capreolus",
      "წავი",
      "otter",
      "lutra",
      "ენოტი",
      "enoti",
      "raccoon",
      "procyon",
    ],
    subtitle: {
      en: "Mammal profiles in the nature atlas",
      ka: "ძუძუმწოვრების პროფილები ბუნების ატლასში",
    },
    title: {
      en: "Mammals in Georgia",
      ka: "ძუძუმწოვრები საქართველოში",
      ru: "Млекопитающие Грузии",
      tr: "Gürcistan memelileri",
    },
  },
  snakes: {
    icon: "hub",
    keywords: ["გველები", "gvelebi", "snakes", "snake hub", "змеи", "yılanlar"],
    rank: 6,
    subtitle: {
      en: "The hub for venomous and harmless snakes",
      ka: "სრული ჰაბი — შხამიანი და უშხამო სახეობები",
    },
    suggested: true,
    title: {
      en: "Snakes in Georgia",
      ka: "გველები საქართველოში",
      ru: "Змеи Грузии",
      tr: "Gürcistan yılanları",
    },
  },
  spiders: {
    icon: "hub",
    keywords: [
      "ობობები",
      "obobebi",
      "spiders",
      "არგიოპა",
      "argiope",
      "wasp spider",
      "ლობებიანი არგიოპა",
      "lobed argiope",
      "Argiope lobata",
      "ცრუ ყარაყურთი",
      "ცრუ შავი ქვრივი",
      "ყარაყურთი",
      "false black widow",
      "false widow",
      "steatoda",
      "пауки",
      "örümcek",
    ],
    subtitle: {
      en: "Spider profiles in the nature atlas",
      ka: "ობობების პროფილები ბუნების ატლასში",
      ru: "Профили пауков в атласе природы",
      tr: "Doğa atlasında örümcek profilleri",
    },
    title: {
      en: "Spiders in Georgia",
      ka: "ობობები საქართველოში",
      ru: "Пауки Грузии",
      tr: "Gürcistan örümcekleri",
    },
  },
  turtles: {
    icon: "hub",
    keywords: [
      "კუები",
      "kuebi",
      "turtles",
      "tortoise",
      "черепахи",
      "kaplumbağa",
    ],
    subtitle: {
      en: "Land and freshwater turtles in one hub",
      ka: "ხმელეთის და წყლის კუები ერთ ჰაბში",
    },
    title: {
      en: "Turtles in Georgia",
      ka: "კუები საქართველოში",
      ru: "Черепахи Грузии",
      tr: "Gürcistan kaplumbağaları",
    },
  },
};

const CLUSTER_COPY: Record<ClusterGuideId, PageCopy> = {
  "amphibian-frogs": {
    icon: "hub",
    keywords: ["ბაყაყები", "bayayi", "frogs", "anura", "გომბეშო", "toad"],
    rank: 8,
    subtitle: {
      en: "The frog hub — Anura",
      ka: "ბაყაყების ჰაბი — Anura",
    },
    suggested: true,
    title: { en: "Frogs of Georgia", ka: "ბაყაყები საქართველოში" },
  },
  "amphibian-frogs-index": {
    icon: "atlas",
    keywords: ["ბაყაყების სახეობები", "frog species"],
    subtitle: {
      en: "Full frog index",
      ka: "სრული ინდექსი ბაყაყებზე",
    },
    title: {
      en: "Frog species of Georgia",
      ka: "საქართველოს ბაყაყების სახეობები",
    },
  },
  "amphibian-index": {
    icon: "atlas",
    keywords: ["ამფიბიების სახეობები", "amphibian species"],
    subtitle: {
      en: "Full amphibian index",
      ka: "სრული ინდექსი ამფიბიებზე",
    },
    title: {
      en: "Amphibian species of Georgia",
      ka: "საქართველოს ამფიბიების სახეობები",
    },
  },
  "amphibian-newts": {
    icon: "guide",
    keywords: [
      "ტრიტონი",
      "tritoni",
      "სალამანდრა",
      "newt",
      "salamander",
      "caudata",
    ],
    subtitle: {
      en: "Caudata — four species in the atlas",
      ka: "Caudata — ოთხი სახეობა ატლასში",
    },
    title: {
      en: "Newts and salamanders of Georgia",
      ka: "ტრიტონები და სალამანდრები საქართველოში",
    },
  },
  "lizard-glass": {
    icon: "identify",
    keywords: [
      "გველხოკერა",
      "gvelxokera",
      "glass lizard",
      "pseudopus",
      "უფეხო",
      "legless",
    ],
    subtitle: {
      en: "How to tell a legless lizard from a snake",
      ka: "როგორ გაარჩიო უფეხო ხვლიკი გველისგან",
    },
    title: {
      en: "Lizard, glass lizard, or snake?",
      ka: "ხვლიკი, გველხოკერა თუ გველი?",
    },
  },
  "lizard-identify": {
    icon: "identify",
    keywords: ["ამოცნობა", "identify", "რა ხვლიკია", "what lizard"],
    subtitle: {
      en: "Identification guide for lizards",
      ka: "ამოცნობის გიდი ხვლიკებისთვის",
    },
    title: { en: "What lizard is this?", ka: "ეს რა ხვლიკია?" },
  },
  "lizard-index": {
    icon: "atlas",
    keywords: ["ხვლიკების სახეობები", "lizard species", "darevskia"],
    subtitle: {
      en: "Full lizard index",
      ka: "სრული ინდექსი ხვლიკებზე",
    },
    title: {
      en: "Lizard species of Georgia",
      ka: "საქართველოს ხვლიკების სახეობები",
    },
  },
  "snake-bite": {
    icon: "safety",
    keywords: [
      "ნაკბენი",
      "nakbeni",
      "bite",
      "snakebite",
      "112",
      "პირველადი",
      "first aid",
      "სიმპტომები",
      "symptoms",
      "მიკბინა",
      "შხამი",
    ],
    rank: 3,
    subtitle: {
      en: "112, what to do and what not to do",
      ka: "112, რა გააკეთო და რა არ გააკეთო",
    },
    suggested: true,
    title: {
      en: "Snakebite in Georgia — what should you do?",
      ka: "გველის ნაკბენი საქართველოში — რა უნდა გავაკეთოთ?",
    },
  },
  "snake-identify": {
    icon: "identify",
    keywords: [
      "ამოცნობა",
      "identifikacia",
      "identify",
      "შხამიანი თუ",
      "venomous or",
      "გველგესლა",
    ],
    rank: 7,
    subtitle: {
      en: "Identification guide for snakes",
      ka: "ამოცნობის გიდი გველებისთვის",
    },
    suggested: true,
    title: {
      en: "Venomous or harmless?",
      ka: "შხამიანი თუ უშხამო?",
      ru: "Ядовитая или нет?",
      tr: "Zehirli mi zararsız mı?",
    },
  },
  "snake-index": {
    icon: "atlas",
    keywords: ["სახეობები", "index", "სია", "list", "კატალოგი"],
    subtitle: {
      en: "Full index — names, venom, range",
      ka: "სრული ინდექსი — სახელი, რისკი, არეალი",
    },
    title: {
      en: "Snake species of Georgia",
      ka: "გველის სახეობები საქართველოში",
    },
  },
  "snake-largest": {
    icon: "guide",
    keywords: ["დიდი გველები", "largest", "გრძელი", "longest", "ზომა"],
    subtitle: {
      en: "By published length — not myths",
      ka: "ზომით, არა მითებით",
    },
    title: {
      en: "The largest snakes of Georgia",
      ka: "საქართველოს ყველაზე დიდი გველები",
    },
  },
  "snake-range": {
    icon: "map",
    keywords: ["გავრცელება", "gavrtseleba", "range", "სად გვხვდება", "habitat"],
    subtitle: {
      en: "Occurrence by region",
      ka: "გავრცელება რეგიონების მიხედვით",
    },
    title: {
      en: "Where do snakes occur in Georgia?",
      ka: "სად გვხვდება გველები საქართველოში?",
    },
  },
  "turtle-identify": {
    icon: "identify",
    keywords: [
      "ამოცნობა",
      "identify",
      "რა კუა",
      "what turtle",
      "კუს ამოცნობა",
      "ხმელეთის კუ",
      "წყლის კუ",
      "წითელყურა",
    ],
    subtitle: {
      en: "Identification guide for turtles",
      ka: "ამოცნობის გიდი კუებისთვის",
    },
    title: { en: "Identify a turtle", ka: "კუს ამოცნობა" },
  },
  "turtle-index": {
    icon: "atlas",
    keywords: ["კუების სახეობები", "turtle species"],
    subtitle: {
      en: "Full turtle index",
      ka: "სრული ინდექსი კუებზე",
    },
    title: {
      en: "Turtle species of Georgia",
      ka: "საქართველოს კუების სახეობები",
    },
  },
  "turtle-land": {
    icon: "guide",
    keywords: ["ხმელეთის კუ", "land turtle", "tortoise", "testudo"],
    subtitle: {
      en: "The spur-thighed tortoise",
      ka: "ხმელეთის კუ — Spur-thighed tortoise",
    },
    title: { en: "Land turtles of Georgia", ka: "ხმელეთის კუები საქართველოში" },
  },
  "turtle-water": {
    icon: "guide",
    keywords: [
      "წყლის კუ",
      "freshwater",
      "pond turtle",
      "წითელყურა",
      "slider",
      "emys",
    ],
    subtitle: {
      en: "Pond turtle, Caspian turtle, slider",
      ka: "ჭაობის კუ, კასპიური კუ, წითელყურა",
    },
    title: {
      en: "Freshwater turtles of Georgia",
      ka: "წყლის კუები საქართველოში",
    },
  },
};

const STATIC_PAGES: Array<
  PageCopy & {
    heroImage?: string;
    heroSpeciesId?: string;
    href: SearchPageHref;
    id: string;
  }
> = [
  {
    heroSpeciesId: "vipera-kaznakovi",
    href: "/species",
    icon: "atlas",
    id: "species-atlas",
    keywords: ["ატლასი", "atlas", "კატალოგი", "catalog", "სახეობები"],
    rank: 4,
    subtitle: {
      en: "The full catalog by type, risk, and region",
      ka: "სრული კატალოგი ტიპის, რისკისა და რეგიონის მიხედვით",
    },
    suggested: true,
    title: {
      en: "Species atlas",
      ka: "სახეობების ატლასი",
      ru: "Атлас видов",
      tr: "Tür atlası",
    },
  },
  {
    heroSpeciesId: "macrovipera-lebetina",
    href: "/venomous-snakes",
    icon: "safety",
    id: "venomous-snakes",
    keywords: [
      "შხამიანი",
      "shxamiani",
      "venomous",
      "viper",
      "გველგესლა",
      "გიურზა",
      "giurza",
    ],
    rank: 1,
    subtitle: {
      en: "Six medically important species",
      ka: "ექვსი სამედიცინოდ მნიშვნელოვანი სახეობა",
    },
    suggested: true,
    title: {
      en: "Venomous snakes in Georgia",
      ka: "შხამიანი გველები საქართველოში",
      ru: "Ядовитые змеи Грузии",
      tr: "Gürcistan’ın zehirli yılanları",
    },
  },
  {
    heroSpeciesId: "macrovipera-lebetina",
    href: "/risk-to-humans",
    icon: "safety",
    id: "risk-to-humans",
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
    rank: 2,
    subtitle: {
      en: "Harmless, moderate, high — what each label means",
      ka: "უვნებელი, საშუალო, მაღალი — რას ნიშნავს თითოეული ნიშანი",
    },
    suggested: true,
    title: {
      en: "Risk to humans",
      ka: "რისკი ადამიანისთვის",
      ru: "Риск для человека",
      tr: "İnsan için risk",
    },
  },
  {
    heroImage: "/images/guides/snakes-in-the-yard-cover.jpg",
    href: "/snakes-in-the-yard",
    icon: "yard",
    id: "snakes-in-yard",
    keywords: [
      "ეზო",
      "ezoshi",
      "yard",
      "garden",
      "დასაფრთხობი",
      "repellent",
      "გოგირდი",
    ],
    rank: 6,
    subtitle: {
      en: "What works, what doesn’t — a practical guide",
      ka: "რა მუშაობს, რა არა — პრაქტიკული გიდი",
    },
    suggested: true,
    title: {
      en: "How do we get snakes out of the yard?",
      ka: "როგორ მოვიშოროთ გველი ეზოდან?",
    },
  },
  {
    heroImage: "/images/guides/snake-quiz-og.jpg",
    href: "/quiz",
    icon: "identify",
    id: "quizzes",
    keywords: ["ქვიზი", "ქვიზები", "quiz", "quizzes", "ამოცნობა"],
    rank: 3,
    subtitle: {
      en: "A photo quiz of Georgia’s snakes",
      ka: "ფოტო-ქვიზი საქართველოს გველებზე",
    },
    suggested: true,
    title: { en: "Quizzes", ka: "ქვიზები" },
  },
  {
    href: "/regions",
    icon: "map",
    id: "regions-index",
    keywords: ["რეგიონები", "regions", "რუკა", "map", "ატლასი"],
    rank: 5,
    subtitle: {
      en: "Reptiles by place",
      ka: "ქვეწარმავლები ადგილის მიხედვით",
    },
    suggested: true,
    title: { en: "Regions of Georgia", ka: "საქართველოს რეგიონები" },
  },
  {
    href: "/about",
    icon: "info",
    id: "about",
    keywords: ["შესახებ", "about", "წყაროები", "sources", "პროექტი"],
    subtitle: {
      en: "How the atlas is built and sourced",
      ka: "როგორ შედგება ატლასი და საიდან მოდის ცოდნა",
    },
    title: { en: "About", ka: "შესახებ" },
  },
  {
    href: "/news",
    icon: "news",
    id: "news",
    keywords: [
      "სიახლეები",
      "news",
      "новости",
      "haberler",
      "ბათუმი",
      "batumi",
      "მიგრაცია",
    ],
    rank: 11,
    subtitle: {
      en: "Field counts and migration days",
      ka: "საველე აღრიცხვები და მიგრაციის დღეები",
      ru: "Полевые учёты и дни миграции",
      tr: "Saha sayımları ve göç günleri",
    },
    suggested: true,
    title: {
      en: "News",
      ka: "სიახლეები",
      ru: "Новости",
      tr: "Haberler",
    },
  },
  {
    href: "/contact",
    icon: "contact",
    id: "contact",
    keywords: ["კონტაქტი", "contact", "ელფოსტა", "email"],
    subtitle: {
      en: "Questions, notes, or collaboration",
      ka: "კითხვა, შენიშვნა ან თანამშრომლობა",
    },
    title: { en: "Contact", ka: "კონტაქტი" },
  },
];

const SNAKE_QUIZ_COPY: PageCopy = {
  icon: "identify",
  keywords: ["ქვიზი", "quiz", "რომელი გველია", "which snake", "გველების ქვიზი"],
  rank: 9,
  subtitle: {
    en: "A photo quiz of Georgia’s snakes",
    ka: "ფოტო-ქვიზი საქართველოს გველებზე",
  },
  suggested: true,
  title: {
    en: "Which snake is it?",
    ka: "რომელი გველია?",
    ru: "Какая это змея?",
    tr: "Bu hangi yılan?",
  },
};

const FEATURED_SPECIES = new Set<string>(featuredSpeciesIds.slice(0, 8));

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
  const newsDocs = getPublishedNewsArticles().map((article) => {
    const title = newsLocalizedTitle(article, locale);
    const dek = newsLocalizedDek(article, locale);
    return {
      href: newsArticleHref(article.slug),
      icon: "news" as const,
      id: article.id,
      key: `news:${article.id}`,
      kind: "page" as const,
      scoreTitles: Object.values(article.copy).map((copy) => copy.title),
      searchText: blob(newsSearchKeywords(article)),
      subtitle: dek,
      title,
    };
  });

  return [...pages, ...species, ...regionDocs, ...newsDocs];
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

function blob(parts: Array<string | undefined>) {
  const raw = parts.filter(Boolean).join(" ");
  return `${raw} ${transliterateKa(raw)}`.toLowerCase();
}

function coverFromSpecies(id?: string, fallback?: string) {
  if (fallback) return fallback;
  if (!id) return undefined;
  const species = getSpeciesById(id);
  return species?.mobileImage ?? species?.image;
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

function normalize(value: string) {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

function pickLocale(text: LocalizedText, locale: AppLocale) {
  return pickLocalized(text, locale);
}

function speciesGroupText(species: Species) {
  const group = getSpeciesAtlasMeta(species.id).group;
  const extra: string[] = [];
  if (groupHasVenomConcept(group)) {
    if (isVenomousDanger(species.danger)) {
      extra.push("შხამიანი", "venomous", "viper", "ядовитые", "zehirli");
    } else {
      extra.push("უშხამო", "harmless", "неядовитые", "zararsız");
    }
  }
  if (isFrogSpecies(species.id))
    extra.push("ბაყაყი", "frog", "toad", "лягушка", "kurbağa");
  if (isNewtSpecies(species.id))
    extra.push("ტრიტონი", "სალამანდრა", "newt", "тритон", "semender");
  extra.push(
    GROUP_LABELS[group].ka,
    GROUP_LABELS[group].en,
    GROUP_LABELS[group].ru ?? "",
    GROUP_LABELS[group].tr ?? "",
  );
  extra.push(group === "snake" ? "გველი გველები snakes змеи yılanlar" : "");
  extra.push(group === "lizard" ? "ხვლიკი lizards ящерицы kertenkele" : "");
  extra.push(
    group === "turtle" ? "კუ turtles tortoise черепахи kaplumbağa" : "",
  );
  extra.push(group === "amphibian" ? "ამფიბია amphibian амфибии amfibi" : "");
  extra.push(group === "bird" ? "ფრინველი bird გრატა птицы kuşlar" : "");
  extra.push(
    group === "mammal"
      ? "ძუძუმწოვარი mammal მელა fox დედოფალა სინდიოფალა weasel ციყვი squirrel დათვი bear ursus ჯიქი leopard წავი otter lutra ფოცხვერი lynx"
      : "",
  );
  extra.push(
    group === "spider"
      ? "ობობა spiders argiope არგიოპა lobata ცრუ ყარაყურთი ყარაყურთი steatoda false widow паук örümcek wasp"
      : "",
  );
  return extra;
}

function toPageDocument(
  locale: AppLocale,
  id: string,
  href: SearchHref,
  copy: PageCopy,
  image?: string,
): SearchDocument {
  return {
    href,
    icon: copy.icon,
    id,
    image,
    key: `page:${id}`,
    kind: "page",
    rank: copy.rank,
    scoreTitles: [copy.title.ka, copy.title.en],
    searchText: blob([
      copy.title.ka,
      copy.title.en,
      copy.subtitle.ka,
      copy.subtitle.en,
      ...copy.keywords,
      hrefSearchText(href),
    ]),
    subtitle: pickLocale(copy.subtitle, locale),
    suggested: copy.suggested,
    title: pickLocale(copy.title, locale),
  };
}

function toRegionDocument(
  locale: AppLocale,
  region: (typeof regions)[number],
): SearchDocument {
  return {
    href: regionHref(region.id),
    icon: "map",
    id: region.id,
    image: getRegionHeroImage(region.id),
    key: `region:${region.id}`,
    kind: "region",
    scoreTitles: [
      region.name.ka,
      region.name.en,
      region.name.ru ?? "",
      region.name.tr ?? "",
      region.nameIn.ka,
      region.nameIn.en,
      region.nameIn.ru ?? "",
      region.nameIn.tr ?? "",
    ],
    searchText: blob([
      region.name.ka,
      region.name.en,
      region.name.ru,
      region.name.tr,
      region.nameIn.ka,
      region.nameIn.en,
      region.nameIn.ru,
      region.nameIn.tr,
      region.description.ka,
      region.description.en,
      region.description.ru,
      region.description.tr,
      region.id,
    ]),
    subtitle: localizeRegionText(region.description, locale),
    title: localizeRegionText(region.name, locale),
  };
}

function toSpeciesDocument(locale: AppLocale, raw: Species): SearchDocument {
  const localized = localizeSpecies(raw, locale);
  const ka = localizeSpecies(raw, "ka");
  const en = localizeSpecies(raw, "en");
  const ru = localizeSpecies(raw, "ru");
  const tr = localizeSpecies(raw, "tr");
  const group = getSpeciesAtlasMeta(raw.id).group;

  return {
    featured: FEATURED_SPECIES.has(raw.id),
    href: speciesHref(raw.id, locale),
    icon: group === "snake" ? "safety" : "guide",
    id: raw.id,
    image: raw.mobileImage ?? raw.image,
    key: `species:${raw.id}`,
    kind: "species",
    scoreTitles: [
      ka.commonName,
      en.commonName,
      ru.commonName,
      tr.commonName,
      raw.scientificName,
      raw.genus,
    ],
    searchText: blob([
      ka.commonName,
      en.commonName,
      ru.commonName,
      tr.commonName,
      raw.scientificName,
      raw.genus,
      raw.family,
      ka.location,
      en.location,
      ru.location,
      tr.location,
      raw.id,
      ...speciesAliasKeywords(raw.id, "ka"),
      ...speciesAliasKeywords(raw.id, "en"),
      ...speciesGroupText(raw),
    ]),
    subtitle: raw.scientificName,
    title: localized.commonName,
  };
}

const LIMITS: Record<SearchKind, number> = {
  page: 5,
  region: 4,
  species: 6,
};

export type RecentRef = { id: string; kind: SearchKind; };

export function flattenGroups(groups: SearchGroup[]) {
  return groups.flatMap((group) => group.items);
}

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
    region: 0,
    species: 0,
  };

  if (!trimmed) {
    const idle = scoped
      .filter((item) => {
        if (filter === "species")
          return item.kind === "species" && item.featured;
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
        ? { page: 6, region: 0, species: 5 }
        : { page: 12, region: 12, species: 8 },
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
    filter === "all" ? LIMITS : { page: 12, region: 12, species: 12 };

  return { groups: groupDocuments(scored, limits), totals };
}

function groupDocuments(
  items: ScoredDocument[],
  limits: Record<SearchKind, number>,
): SearchGroup[] {
  const buckets: Record<SearchKind, ScoredDocument[]> = {
    page: [],
    region: [],
    species: [],
  };
  for (const item of items) {
    if (buckets[item.kind].length >= limits[item.kind]) continue;
    buckets[item.kind].push(item);
  }

  const groups: Array<{ items: typeof buckets.page; kind: SearchKind; }> = [];
  for (const kind of Object.keys(buckets) as SearchKind[]) {
    const items = buckets[kind];
    if (items.length > 0) groups.push({ items, kind });
  }

  groups.sort((a, b) => {
    const aScore = a.items[0]?.score ?? 0;
    const bScore = b.items[0]?.score ?? 0;
    if (bScore !== aScore) return bScore - aScore;
    const order: SearchKind[] = ["page", "species", "region"];
    return order.indexOf(a.kind) - order.indexOf(b.kind);
  });

  return groups;
}

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

export function resolveRecent(index: SearchDocument[], recent: RecentRef[]) {
  return recent
    .map((item) =>
      index.find((doc) => doc.kind === item.kind && doc.id === item.id),
    )
    .filter((item): item is SearchDocument => Boolean(item));
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
