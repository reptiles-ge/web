import type { AppLocale } from "@/i18n/routing";

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
import { quizHref } from "@/lib/quizzes";
import { speciesAliasKeywords } from "@/lib/seoKeywords";
import {
  type SearchDocument,
  type SearchHref,
  type SearchIcon,
  type SearchPageHref,
} from "@/lib/siteSearch";
import { transliterateKa } from "@/lib/slugify";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";

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
  "bird-index": {
    icon: "atlas",
    keywords: [
      "ფრინველების სახეობები",
      "bird species",
      "орнитофауна",
      "kuş türleri",
    ],
    subtitle: {
      en: "Published bird profiles — not a full national list",
      ka: "გამოქვეყნებული პროფილები — არა სრული ეროვნული სია",
    },
    title: {
      en: "Bird species of Georgia",
      ka: "საქართველოს ფრინველების სახეობები",
    },
  },
  "lizard-darevskia": {
    icon: "identify",
    keywords: [
      "darevskia",
      "კლდის ხვლიკი",
      "rock lizard",
      "скальная ящерица",
      "kaya kertenkelesi",
    ],
    subtitle: {
      en: "Colour is not identification",
      ka: "ფერი ამოცნობა არ არის",
    },
    title: {
      en: "Darevskia rock lizards of Georgia",
      ka: "Darevskia — კლდის ხვლიკები საქართველოში",
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
  "lizard-house": {
    icon: "yard",
    keywords: [
      "ხვლიკი სახლში",
      "გეკონი",
      "gecko",
      "ჯოჯო",
      "lizard in the house",
      "ящерица в доме",
      "evde kertenkele",
    ],
    rank: 6,
    subtitle: {
      en: "Harmless — how to get it out without killing it",
      ka: "უვნებელია — როგორ გაიყვანო მოკვლის გარეშე",
      ru: "Безопасна — как вывести, не убивая",
      tr: "Zararsız — öldürmeden nasıl çıkarılır",
    },
    suggested: true,
    title: {
      en: "A lizard in the house — what should you do?",
      ka: "ხვლიკი სახლში — რა უნდა გავაკეთოთ?",
      ru: "Ящерица в доме — что делать?",
      tr: "Evde kertenkele — ne yapmalıyım?",
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
  "mammal-index": {
    icon: "atlas",
    keywords: [
      "ძუძუმწოვრების სახეობები",
      "mammal species",
      "териофауна",
      "memeli türleri",
    ],
    subtitle: {
      en: "Published mammal profiles — not a full national list",
      ka: "გამოქვეყნებული პროფილები — არა სრული ეროვნული სია",
    },
    title: {
      en: "Mammal species of Georgia",
      ka: "საქართველოს ძუძუმწოვრების სახეობები",
    },
  },
  "mammal-bear": {
    icon: "safety",
    keywords: [
      "დათვი",
      "მურა დათვი",
      "bear",
      "შეხვედრა",
      "encounter",
      "медведь",
      "ayı",
      "112",
    ],
    rank: 5,
    subtitle: {
      en: "Brown bear only — stay back, call 112 if injured",
      ka: "მხოლოდ მურა დათვი — არ მიუახლოვდე, დაზიანებისას 112",
      ru: "Только бурый медведь — не подходите, при травме 112",
      tr: "Yalnızca boz ayı — yaklaşmayın, yaralanırsanız 112",
    },
    suggested: true,
    title: {
      en: "If you meet a bear in Georgia",
      ka: "რა ვქნა თუ დათვი შემხვდა",
      ru: "Если встретил медведя в Грузии",
      tr: "Gürcistan’da ayı ile karşılaşırsam",
    },
  },
  "mammal-jackal-yard": {
    icon: "yard",
    keywords: [
      "ტურა",
      "მელა",
      "jackal",
      "fox",
      "ეზოში",
      "yard",
      "шакал",
      "çakal",
    ],
    rank: 5,
    subtitle: {
      en: "Jackal or fox in the yard — food, fence, don’t feed",
      ka: "ტურა ან მელა ეზოში — საკვები, ღობე, ნუ აჭმევ",
      ru: "Шакал или лиса во дворе — еда, забор, не кормить",
      tr: "Bahçede çakal veya tilki — yem, çit, beslemeyin",
    },
    suggested: true,
    title: {
      en: "A jackal in the yard",
      ka: "ტურა ეზოში",
      ru: "Шакал во дворе",
      tr: "Bahçede çakal",
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
  "spider-bite": {
    icon: "safety",
    keywords: [
      "ობობის ნაკბენი",
      "ყარაყურთი",
      "spider bite",
      "112",
      "укус паука",
      "örümcek ısırığı",
    ],
    rank: 4,
    subtitle: {
      en: "Call 112 — do not cut or suck the bite",
      ka: "დარეკე 112 — ნუ გაჭრი და ნუ წოვ",
      ru: "Звоните 112 — не режьте и не отсасывайте",
      tr: "112’yi arayın — kesmeyin, emmeyin",
    },
    suggested: true,
    title: {
      en: "Spider bite in Georgia — what should you do?",
      ka: "ობობის ნაკბენი — რა უნდა გავაკეთოთ?",
      ru: "Укус паука в Грузии — что делать?",
      tr: "Örümcek ısırığı — ne yapmalıyım?",
    },
  },
  "spider-venomous": {
    icon: "safety",
    keywords: [
      "შხამიანი ობობა",
      "ყარაყურთი",
      "შავი ქვრივი",
      "venomous spider",
      "black widow",
      "каракурт",
      "karakurt",
    ],
    rank: 4,
    subtitle: {
      en: "Karakurt vs false widow vs Argiope",
      ka: "ყარაყურთი, ცრუ ყარაყურთი და არგიოპა",
      ru: "Каракурт, ложный каракурт и аргиопа",
      tr: "Karakurt, sahte kara dul ve Argiope",
    },
    suggested: true,
    title: {
      en: "Venomous spiders in Georgia?",
      ka: "შხამიანი ობობები საქართველოში",
      ru: "Ядовитые пауки Грузии",
      tr: "Gürcistan’da zehirli örümcekler",
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
      en: "Photo quizzes of Georgia’s snakes and lizards",
      ka: "ფოტო-ქვიზები საქართველოს გველებსა და ხვლიკებზე",
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

const LIZARD_QUIZ_COPY: PageCopy = {
  icon: "identify",
  keywords: [
    "ქვიზი",
    "quiz",
    "რომელი ხვლიკია",
    "which lizard",
    "ხვლიკების ქვიზი",
  ],
  rank: 8,
  subtitle: {
    en: "A photo quiz of Georgia’s lizards",
    ka: "ფოტო-ქვიზი საქართველოს ხვლიკებზე",
  },
  suggested: true,
  title: {
    en: "Which lizard is it?",
    ka: "რომელი ხვლიკია?",
    ru: "Какая это ящерица?",
    tr: "Bu hangi kertenkele?",
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
    toPageDocument(
      locale,
      "lizard-quiz",
      quizHref("lizard", locale),
      LIZARD_QUIZ_COPY,
      "/images/home/groups/lizards.jpg",
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

function hrefSearchText(href: SearchHref) {
  if (typeof href === "string") return href;
  if ("slug" in href.params) return href.params.slug;
  if ("id" in href.params) return href.params.id;
  return "";
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
      ...speciesAliasKeywords(raw.id, "ru"),
      ...speciesAliasKeywords(raw.id, "tr"),
      ...speciesGroupText(raw),
    ]),
    subtitle: raw.scientificName,
    title: localized.commonName,
  };
}
