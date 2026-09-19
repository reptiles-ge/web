import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { DangerLevel, PhotoCredit } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { isVenomousDanger } from "@/data/speciesAtlasMeta";

export function speciesFallbackDescriptionKey(
  group: AnimalGroup,
  danger?: DangerLevel,
):
  | "descriptionAmphibian"
  | "descriptionBird"
  | "descriptionInsect"
  | "descriptionMammal"
  | "descriptionReptile"
  | "descriptionScorpion"
  | "descriptionSpider"
  | "descriptionVenomous" {
  if (group === "snake" && isVenomousDanger(danger)) {
    return "descriptionVenomous";
  }
  if (group === "amphibian") return "descriptionAmphibian";
  if (group === "bird") return "descriptionBird";
  if (group === "insect") return "descriptionInsect";
  if (group === "mammal") return "descriptionMammal";
  if (group === "scorpion") return "descriptionScorpion";
  if (group === "spider") return "descriptionSpider";
  return "descriptionReptile";
}

export function speciesMetaTitle(
  commonName: string,
  scientificName: string,
  intent: string,
) {
  return `${commonName} (${scientificName}) | ${intent}`;
}

export function speciesTitleIntentKey(
  group: AnimalGroup,
  danger?: DangerLevel,
):
  | "titleAmphibian"
  | "titleBird"
  | "titleInsect"
  | "titleLizard"
  | "titleMammal"
  | "titleScorpion"
  | "titleSnake"
  | "titleSnakeVenomous"
  | "titleSpider"
  | "titleTurtle" {
  if (group === "snake") {
    return isVenomousDanger(danger) ? "titleSnakeVenomous" : "titleSnake";
  }
  if (group === "lizard") return "titleLizard";
  if (group === "turtle") return "titleTurtle";
  if (group === "bird") return "titleBird";
  if (group === "insect") return "titleInsect";
  if (group === "mammal") return "titleMammal";
  if (group === "scorpion") return "titleScorpion";
  if (group === "spider") return "titleSpider";
  return "titleAmphibian";
}

const SPECIES_META_TITLE_OVERRIDE: Partial<
  Record<string, { en: string; ka: string }>
> = {
  "araneus-diadematus": {
    en: "European garden spider (Araneus diadematus) | Cross orb-weaver in Georgia",
    ka: "ჩვეულებრივი ჯვრიანა (Araneus diadematus) | ობობა საქართველოში",
  },
  "argiope-bruennichi": {
    en: "Wasp spider (Argiope bruennichi) | Orb-weaver in Georgia",
    ka: "არგიოპა (Argiope bruennichi) | ობობა საქართველოში",
  },
  "argiope-lobata": {
    en: "Lobed argiope (Argiope lobata) | Orb-weaver in Georgia",
    ka: "ლობებიანი არგიოპა (Argiope lobata) | ობობა საქართველოში",
  },
  "cheiracanthium-punctorium": {
    en: "European yellow sac spider (Cheiracanthium punctorium) | Spider in Georgia",
    ka: "Cheiracanthium punctorium | ობობა საქართველოში",
  },
  "columba-palumbus": {
    en: "Common woodpigeon (Columba palumbus) | Wood pigeon in Georgia",
    ka: "ქედანი (Columba palumbus) | ტყის მტრედი საქართველოში",
  },
  "dolichophis-schmidti": {
    en: "Red-bellied racer (Dolichophis schmidti) | Non-venomous snake of eastern Georgia",
    ka: "წითელმუცელა მცურავი (Dolichophis schmidti) | უშხამო გველი აღმოსავლეთ საქართველოში",
  },
  "erithacus-rubecula": {
    en: "European robin (Erithacus rubecula) | Year-round resident in Georgia",
    ka: "გულწითელა (Erithacus rubecula) | მთელი წლის რეზიდენტი საქართველოში",
  },
  "euscorpius-italicus": {
    en: "Italian scorpion (Euscorpius italicus) | Western Georgia",
    ka: "იტალიური მორიელი (Euscorpius italicus) | მორიელი დასავლეთ საქართველოში",
  },
  "euscorpius-mingrelicus": {
    en: "Mingrelian scorpion (Euscorpius mingrelicus) | Western Georgia",
    ka: "მეგრული მორიელი (Euscorpius mingrelicus) | მორიელი დასავლეთ საქართველოში",
  },
  "latrodectus-tredecimguttatus": {
    en: "Mediterranean black widow (Latrodectus tredecimguttatus) | Widow spider in Georgia",
    ka: "ყარაყურთი (Latrodectus tredecimguttatus) | შავი ქვრივი საქართველოში",
  },
  "luscinia-megarhynchos": {
    en: "Common nightingale (Luscinia megarhynchos) | Songbird in Georgia",
    ka: "ბულბული (Luscinia megarhynchos) | მომღერალი ფრინველი საქართველოში",
  },
  "lycosa-singoriensis": {
    en: "South Russian tarantula (Lycosa singoriensis) | Wolf spider in Georgia",
    ka: "ტარანტული (Lycosa singoriensis) | დიდი მგლის ობობა საქართველოში",
  },
  "macrovipera-lebetina": {
    en: "Levantine viper (Macrovipera lebetinus) | High-risk venomous snake in Georgia",
    ka: "გიურზა (Macrovipera lebetinus) | შხამიანი გველი საქართველოში — რისკი",
  },
  "mantis-religiosa": {
    en: "European mantis (Mantis religiosa) | Praying mantis in Georgia",
    ka: "ჩოქელა (Mantis religiosa) | მწერი საქართველოში",
  },
  "mesobuthus-eupeus": {
    en: "Mottled scorpion (Mesobuthus eupeus) | Scorpion in Georgia",
    ka: "ჭრელი მორიელი (Mesobuthus eupeus) | მორიელი საქართველოში",
  },
  "milvus-migrans": {
    en: "Black kite (Milvus migrans) | Raptor in Georgia",
    ka: "შავი ძერა (Milvus migrans) | მტაცებელი ფრინველი საქართველოში",
  },
  "motacilla-alba": {
    en: "White wagtail (Motacilla alba) | Wagtail in Georgia",
    ka: "თეთრი ბოლოქანქარა (Motacilla alba) | ბოლოქანქარა საქართველოში",
  },
  "natrix-natrix": {
    en: "Grass snake (Natrix natrix) | Non-venomous snake in Georgia",
    ka: "ჩვეულებრივი ანკარა (Natrix natrix) | უშხამო გველი საქართველოში",
  },
  "natrix-tessellata": {
    en: "Dice snake (Natrix tessellata) | Non-venomous water snake in Georgia",
    ka: "წყლის ანკარა (Natrix tessellata) | უშხამო წყლის გველი საქართველოში",
  },
  "ommatotriton-ophryticus": {
    en: "Northern banded newt (Ommatotriton ophryticus) | Newt in Georgia",
    ka: "კავკასიური ტრიტონი (Ommatotriton ophryticus) | ტრიტონი საქართველოში",
  },
  "phoenicolacerta-laevis": {
    en: "Lebanon lizard (Phoenicolacerta laevis) | Introduced lizard in Georgia",
    ka: "ლიბანური ხვლიკი (Phoenicolacerta laevis) | შემოტანილი ხვლიკი საქართველოში",
  },
  "pholcus-phalangioides": {
    en: "Long-bodied cellar spider (Pholcus phalangioides) | Cellar spider in Georgia",
    ka: "გრძელფეხა ფოლკუსი (Pholcus phalangioides) | სახლის ობობა საქართველოში",
  },
  "platyceps-najadum": {
    en: "Dahl's whip snake (Platyceps najadum) | Non-venomous snake in Georgia",
    ka: "წენგოსფერი მცურავი (Platyceps najadum) | უშხამო გველი საქართველოში",
  },
  "pseudopus-apodus": {
    en: "European glass lizard (Pseudopus apodus) | Legless lizard of eastern Georgia",
    ka: "გველხოკერა (Pseudopus apodus) | უფეხო ხვლიკი აღმოსავლეთ საქართველოში",
  },
  "steatoda-paykulliana": {
    en: "False black widow (Steatoda paykulliana) | Cobweb spider in Georgia",
    ka: "ცრუ ყარაყურთი (Steatoda paykulliana) | ობობა საქართველოში",
  },
  "streptopelia-turtur": {
    en: "European turtle dove (Streptopelia turtur) | Migratory dove in Georgia",
    ka: "გვრიტი (Streptopelia turtur) | გადამფრენი მტრედი საქართველოში",
  },
  "vipera-kaznakovi": {
    en: "Caucasus viper (Vipera kaznakovi) | Venomous snake of western Georgia",
    ka: "კავკასიური გველგესლა (Vipera kaznakovi) | შხამიანი გველი დასავლეთ საქართველოში",
  },
  "vipera-transcaucasiana": {
    en: "Nose-horned viper (Vipera ammodytes) | Venomous snake of the Lesser Caucasus",
    ka: "ცხვირრქოსანი გველგესლა (Vipera ammodytes) | შხამიანი გველი მცირე კავკასიონზე",
  },
  "xerotyphlops-vermicularis": {
    en: "European blind snake (Xerotyphlops vermicularis) | Harmless blind snake in Georgia",
    ka: "გველბრუცა (Xerotyphlops vermicularis) | უშხამო ბრმა გველი საქართველოში",
  },
};

const SPECIES_META_DESCRIPTION_OVERRIDE: Partial<
  Record<string, Partial<Record<AppLocale, string>>>
> = {
  "araneus-diadematus": {
    ka: "ჩვეულებრივი ჯვრიანა (Araneus diadematus) საქართველოში — ამოცნობის ნიშნები, დადასტურებული გავრცელება, ჰაბიტატი, ზომა და რამდენად საშიშია ადამიანისთვის.",
  },
  "argiope-bruennichi": {
    ka: "არგიოპა (Argiope bruennichi) საქართველოში — როგორ ამოიცნოთ ყვითელ-შავი ობობა, სად გვხვდება, რა ზომისაა და რატომ არ ითვლება ადამიანისთვის სამედიცინო რისკად.",
  },
  "buteo-buteo": {
    ka: "ჩვეულებრივი კაკაჩა (Buteo buteo) საქართველოში — ამოცნობის ნიშნები, გავრცელება, ჰაბიტატი, კვება, მიგრაცია ბათუმის გავლით და რატომ არის ადამიანისთვის უვნებელი.",
  },
  "cheiracanthium-punctorium": {
    en: "European yellow sac spider (Cheiracanthium punctorium) in Georgia: confirmed records, identification, habitat, size, and realistic bite risk.",
    ka: "Cheiracanthium punctorium საქართველოში — დადასტურებული ჩანაწერები, ამოცნობის ნიშნები, ჰაბიტატი, ზომა და მტკივნეული ნაკბენის რეალური რისკი.",
  },
  "dolichophis-schmidti": {
    ka: "წითელმუცელა მცურავი (Dolichophis schmidti) საქართველოში — ამოცნობის ნიშნები, აღმოსავლეთ საქართველოს ჰაბიტატები, ზომა, ქცევა და რამდენად საშიშია ადამიანისთვის.",
  },
  "erinaceus-concolor": {
    ka: "ევროპული ზღარბი (Erinaceus concolor) საქართველოში — ამოცნობის ნიშნები, გავრცელება, ჰაბიტატი, კვება და რატომ არის ადამიანისთვის უვნებელი.",
  },
  "euscorpius-italicus": {
    en: "Italian scorpion (Euscorpius italicus) in Georgia: taxonomy, western Georgian records, identification, human-associated habitat, and sting risk.",
    ka: "იტალიური მორიელი (Euscorpius italicus) საქართველოში — ტაქსონომია, დასავლეთ საქართველოს ჩანაწერები, ამოცნობა, ანთროპოგენური ჰაბიტატი და ჩხვლეტის რისკი.",
  },
  "euscorpius-mingrelicus": {
    en: "Mingrelian scorpion (Euscorpius mingrelicus) in Georgia: taxonomy, western Georgian range, identification, humid forest habitat, and sting risk.",
    ka: "მეგრული მორიელი (Euscorpius mingrelicus) საქართველოში — ტაქსონომია, დასავლეთ საქართველოს არეალი, ამოცნობა, ნოტიო ტყის ჰაბიტატი და ჩხვლეტის რისკი.",
  },
  "lutra-lutra": {
    ka: "ჩვეულებრივი წავი (Lutra lutra) საქართველოში — როგორ ამოიცნოთ, სად გვხვდება, რა ზომისაა, რას ჭამს და რა სტატუსით არის დაცული.",
  },
  "macrovipera-lebetina": {
    ka: "გიურზა (Macrovipera lebetinus) საქართველოში: ამოცნობის ნიშნები, გავრცელება, აღმოსავლეთ საქართველოს მშრალი ჰაბიტატები, ზომა და მაღალი რისკი ადამიანისთვის.",
  },
  "meles-canescens": {
    ka: "მაჩვი (Meles canescens) საქართველოში: ამოცნობის ნიშნები, გავრცელება, ტყისა და ბუჩქნარის ჰაბიტატები, კვება, ქცევა და კონსერვაციის სტატუსი.",
  },
  "mesobuthus-eupeus": {
    en: "Mottled scorpion (Mesobuthus eupeus) in Georgia: taxonomy, Tbilisi evidence, identification notes, habitat, sting risk, and sources.",
    ka: "ჭრელი მორიელი (Mesobuthus eupeus) საქართველოში — ტაქსონომია, თბილისის მტკიცებულება, ამოცნობა, ჰაბიტატი, ნაკბენის რისკი და წყაროები.",
  },
  "pholcus-phalangioides": {
    ka: "გრძელფეხა ფოლკუსი (Pholcus phalangioides) საქართველოში — სახლისა და სარდაფის გრძელფეხა ობობის ამოცნობა, დადასტურებული ჩანაწერები და ადამიანისთვის რეალური რისკი.",
  },
  "platyceps-najadum": {
    ka: "წენგოსფერი მცურავი (Platyceps najadum) საქართველოში — უშხამო გველის ამოცნობა, გავრცელება, მშრალი და ქვიანი ჰაბიტატები, ზომა და როგორ მოვიქცეთ შეხვედრისას.",
  },
  "ursus-arctos": {
    ka: "მურა დათვი (Ursus arctos) საქართველოში — როგორ ამოვიცნოთ, სად ბინადრობს, რა ზომისაა, რას ჭამს, რა რისკს ქმნის ადამიანისთვის და რა კონსერვაციული სტატუსი აქვს.",
  },
  "vipera-kaznakovi": {
    ka: "კავკასიური გველგესლა (Vipera kaznakovi) საქართველოში — როგორ ამოვიცნოთ, სად გვხვდება დასავლეთ საქართველოს კოლხურ ზონებში, რა რისკს ქმნის მისი ნაკბენი და რატომ აქვს EN კონსერვაციული სტატუსი.",
  },
  "vulpes-vulpes": {
    ka: "მელა (Vulpes vulpes) საქართველოში — სად გვხვდება, როგორ ამოვიცნოთ, რა ზომისაა, რას ჭამს და რა უნდა ვიცოდეთ ადამიანისთვის ცოფის შესაძლო რისკზე.",
  },
};

export function speciesImageAlt(
  commonName: string,
  scientificName: string,
  location: string,
) {
  return `${commonName} (${scientificName}) ${location}`;
}

export function speciesMetaDescription(overview: string, maxLength = 160) {
  const lead = firstSentence(stripInlineMarkdownLinks(overview));
  if (lead.length <= maxLength) return lead;

  const truncated = lead.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const clipped = (
    lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated
  ).trim();
  return `${clipped}…`;
}

export function speciesMetaDescriptionOverride(
  speciesId: string,
  locale: AppLocale,
) {
  return SPECIES_META_DESCRIPTION_OVERRIDE[speciesId]?.[locale];
}

export function speciesPageMetaTitle(
  speciesId: string,
  locale: AppLocale,
  commonName: string,
  scientificName: string,
  intent: string,
) {
  const override = SPECIES_META_TITLE_OVERRIDE[speciesId];
  if (override && (locale === "ka" || locale === "en")) {
    return locale === "ka" ? override.ka : override.en;
  }
  return speciesMetaTitle(commonName, scientificName, intent);
}

export function speciesPhotoAlt(
  commonName: string,
  scientificName: string,
  location: string,
  credit?: PhotoCredit,
) {
  const place = credit?.location?.trim() || location;
  const parts = [`${commonName} (${scientificName})`];
  if (place) parts.push(place);
  if (credit?.photographer) parts.push(credit.photographer);
  return parts.join(" — ");
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?…](?=\s|$)/u);
  return match ? match[0].trim() : trimmed;
}

function stripInlineMarkdownLinks(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}
