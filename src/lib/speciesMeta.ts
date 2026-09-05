import type { DangerLevel, PhotoCredit } from "@/data/species";
import type { AnimalGroup } from "@/data/speciesAtlas";
import type { AppLocale } from "@/i18n/routing";

import { isVenomousDanger } from "@/data/speciesAtlas";

export function speciesFallbackDescriptionKey(
  group: AnimalGroup,
  danger?: DangerLevel,
):
  | "descriptionAmphibian"
  | "descriptionBird"
  | "descriptionMammal"
  | "descriptionReptile"
  | "descriptionSpider"
  | "descriptionVenomous" {
  if (group === "snake" && isVenomousDanger(danger)) {
    return "descriptionVenomous";
  }
  if (group === "amphibian") return "descriptionAmphibian";
  if (group === "bird") return "descriptionBird";
  if (group === "mammal") return "descriptionMammal";
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
  | "titleLizard"
  | "titleMammal"
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
  if (group === "mammal") return "titleMammal";
  if (group === "spider") return "titleSpider";
  return "titleAmphibian";
}

const SPECIES_META_TITLE_OVERRIDE: Partial<
  Record<string, { en: string; ka: string }>
> = {
  "argiope-bruennichi": {
    en: "Wasp spider (Argiope bruennichi) | Orb-weaver in Georgia",
    ka: "არგიოპა (Argiope bruennichi) | ობობა საქართველოში",
  },
  "argiope-lobata": {
    en: "Lobed argiope (Argiope lobata) | Orb-weaver in Georgia",
    ka: "ლობებიანი არგიოპა (Argiope lobata) | ობობა საქართველოში",
  },
  "columba-palumbus": {
    en: "Common woodpigeon (Columba palumbus) | Wood pigeon in Georgia",
    ka: "ქედანი (Columba palumbus) | ტყის მტრედი საქართველოში",
  },
  "streptopelia-turtur": {
    en: "European turtle dove (Streptopelia turtur) | Migratory dove in Georgia",
    ka: "გვრიტი (Streptopelia turtur) | გადამფრენი მტრედი საქართველოში",
  },
  "dolichophis-schmidti": {
    en: "Red-bellied racer (Dolichophis schmidti) | Non-venomous snake of eastern Georgia",
    ka: "წითელმუცელა მცურავი (Dolichophis schmidti) | უშხამო გველი აღმოსავლეთ საქართველოში",
  },
  "erithacus-rubecula": {
    en: "European robin (Erithacus rubecula) | Year-round resident in Georgia",
    ka: "გულწითელა (Erithacus rubecula) | მთელი წლის რეზიდენტი საქართველოში",
  },
  "latrodectus-tredecimguttatus": {
    en: "Mediterranean black widow (Latrodectus tredecimguttatus) | Widow spider in Georgia",
    ka: "ყარაყურთი (Latrodectus tredecimguttatus) | შავი ქვრივი საქართველოში",
  },
  "luscinia-megarhynchos": {
    en: "Common nightingale (Luscinia megarhynchos) | Songbird in Georgia",
    ka: "ბულბული (Luscinia megarhynchos) | მომღერალი ფრინველი საქართველოში",
  },
  "macrovipera-lebetina": {
    en: "Levantine viper (Macrovipera lebetinus) | Venomous snake of eastern Georgia",
    ka: "გიურზა (Macrovipera lebetinus) | შხამიანი გველი აღმოსავლეთ საქართველოში",
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
  "platyceps-najadum": {
    en: "Dahl's whip snake (Platyceps najadum) | Non-venomous snake in Georgia",
    ka: "წენგოსფერი მცურავი (Platyceps najadum) | უშხამო გველი საქართველოში",
  },
  "steatoda-paykulliana": {
    en: "False black widow (Steatoda paykulliana) | Cobweb spider in Georgia",
    ka: "ცრუ ყარაყურთი (Steatoda paykulliana) | ობობა საქართველოში",
  },
  "vipera-kaznakovi": {
    en: "Caucasus viper (Vipera kaznakovi) | Venomous snake of western Georgia",
    ka: "კავკასიური გველგესლა (Vipera kaznakovi) | შხამიანი გველი დასავლეთ საქართველოში",
  },
  "vipera-transcaucasiana": {
    en: "Nose-horned viper (Vipera ammodytes) | Venomous snake of the Lesser Caucasus",
    ka: "ცხვირრქოსანი გველგესლა (Vipera ammodytes) | შხამიანი გველი მცირე კავკასიონზე",
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
  const lead = firstSentence(overview);
  if (lead.length <= maxLength) return lead;

  const truncated = lead.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const clipped = (
    lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated
  ).trim();
  return `${clipped}…`;
}

export function speciesPageMetaTitle(
  speciesId: string,
  locale: AppLocale,
  commonName: string,
  scientificName: string,
  intent: string,
) {
  const override = SPECIES_META_TITLE_OVERRIDE[speciesId];
  if (override) {
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
