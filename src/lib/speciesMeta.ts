import type { DangerLevel, PhotoCredit } from "@/data/species";
import type { AnimalGroup } from "@/data/speciesAtlas";
import { isVenomousDanger } from "@/data/speciesAtlas";
import type { AppLocale } from "@/i18n/routing";

export function speciesTitleIntentKey(
  group: AnimalGroup,
  danger?: DangerLevel,
):
  | "titleSnakeVenomous"
  | "titleSnake"
  | "titleLizard"
  | "titleTurtle"
  | "titleAmphibian"
  | "titleBird"
  | "titleMammal"
  | "titleSpider" {
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

export function speciesFallbackDescriptionKey(
  group: AnimalGroup,
  danger?: DangerLevel,
):
  | "descriptionVenomous"
  | "descriptionReptile"
  | "descriptionAmphibian"
  | "descriptionBird"
  | "descriptionMammal"
  | "descriptionSpider" {
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

const SPECIES_META_TITLE_OVERRIDE: Partial<
  Record<string, { ka: string; en: string }>
> = {
  "natrix-natrix": {
    ka: "ჩვეულებრივი ანკარა (Natrix natrix) | უშხამო გველი საქართველოში",
    en: "Grass snake (Natrix natrix) | Non-venomous snake in Georgia",
  },
  "vipera-kaznakovi": {
    ka: "კავკასიური გველგესლა (Vipera kaznakovi) | შხამიანი გველი დასავლეთ საქართველოში",
    en: "Caucasus viper (Vipera kaznakovi) | Venomous snake of western Georgia",
  },
  "ommatotriton-ophryticus": {
    ka: "კავკასიური ტრიტონი (Ommatotriton ophryticus) | ტრიტონი საქართველოში",
    en: "Northern banded newt (Ommatotriton ophryticus) | Newt in Georgia",
  },
  "macrovipera-lebetina": {
    ka: "გიურზა (Macrovipera lebetinus) | შხამიანი გველი აღმოსავლეთ საქართველოში",
    en: "Levantine viper (Macrovipera lebetinus) | Venomous snake of eastern Georgia",
  },
  "natrix-tessellata": {
    ka: "წყლის ანკარა (Natrix tessellata) | უშხამო წყლის გველი საქართველოში",
    en: "Dice snake (Natrix tessellata) | Non-venomous water snake in Georgia",
  },
  "vipera-transcaucasiana": {
    ka: "ცხვირრქოსანი გველგესლა (Vipera ammodytes) | შხამიანი გველი მცირე კავკასიონზე",
    en: "Nose-horned viper (Vipera ammodytes) | Venomous snake of the Lesser Caucasus",
  },
  "platyceps-najadum": {
    ka: "წენგოსფერი მცურავი (Platyceps najadum) | უშხამო გველი საქართველოში",
    en: "Dahl's whip snake (Platyceps najadum) | Non-venomous snake in Georgia",
  },
  "dolichophis-schmidti": {
    ka: "წითელმუცელა მცურავი (Dolichophis schmidti) | უშხამო გველი აღმოსავლეთ საქართველოში",
    en: "Red-bellied racer (Dolichophis schmidti) | Non-venomous snake of eastern Georgia",
  },
  "milvus-migrans": {
    ka: "შავი ძერა (Milvus migrans) | მტაცებელი ფრინველი საქართველოში",
    en: "Black kite (Milvus migrans) | Raptor in Georgia",
  },
  "luscinia-megarhynchos": {
    ka: "ბულბული (Luscinia megarhynchos) | მომღერალი ფრინველი საქართველოში",
    en: "Common nightingale (Luscinia megarhynchos) | Songbird in Georgia",
  },
  "erithacus-rubecula": {
    ka: "გულწითელა (Erithacus rubecula) | მთელი წლის რეზიდენტი საქართველოში",
    en: "European robin (Erithacus rubecula) | Year-round resident in Georgia",
  },
  "columba-palumbus": {
    ka: "ქედანი (Columba palumbus) | ტყის მტრედი საქართველოში",
    en: "Common woodpigeon (Columba palumbus) | Wood pigeon in Georgia",
  },
  "motacilla-alba": {
    ka: "თეთრი ბოლოქანქარა (Motacilla alba) | ბოლოქანქარა საქართველოში",
    en: "White wagtail (Motacilla alba) | Wagtail in Georgia",
  },
  "argiope-bruennichi": {
    ka: "არგიოპა (Argiope bruennichi) | ობობა საქართველოში",
    en: "Wasp spider (Argiope bruennichi) | Orb-weaver in Georgia",
  },
  "argiope-lobata": {
    ka: "ლობებიანი არგიოპა (Argiope lobata) | ობობა საქართველოში",
    en: "Lobed argiope (Argiope lobata) | Orb-weaver in Georgia",
  },
  "steatoda-paykulliana": {
    ka: "ცრუ ყარაყურთი (Steatoda paykulliana) | ობობა საქართველოში",
    en: "False black widow (Steatoda paykulliana) | Cobweb spider in Georgia",
  },
  "latrodectus-tredecimguttatus": {
    ka: "ყარაყურთი (Latrodectus tredecimguttatus) | შავი ქვრივი საქართველოში",
    en: "Mediterranean black widow (Latrodectus tredecimguttatus) | Widow spider in Georgia",
  },
};

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

export function speciesImageAlt(
  commonName: string,
  scientificName: string,
  location: string,
) {
  return `${commonName} (${scientificName}) ${location}`;
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

export function speciesMetaDescription(overview: string, maxLength = 160) {
  const lead = firstSentence(overview);
  if (lead.length <= maxLength) return lead;

  const truncated = lead.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const clipped = (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated).trim();
  return `${clipped}…`;
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?…](?=\s|$)/u);
  return match ? match[0].trim() : trimmed;
}
