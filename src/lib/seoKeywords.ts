import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

const SPECIES_ALIASES: Record<string, { ka: string[]; en: string[] }> = {
  "vipera-dinniki": {
    ka: ["დინიკის გველგესლა", "Pelias dinniki"],
    en: ["Dinnik's viper", "Caucasus subalpine viper", "Pelias dinniki"],
  },
  "malpolon-insignitus": {
    ka: [
      "ხვლიკიჭამია გველი",
      "ხვლიკიჭამია",
      "Malpolon monspessulanus",
    ],
    en: [
      "Montpellier snake",
      "eastern Montpellier snake",
      "Malpolon monspessulanus",
    ],
  },
  "macrovipera-lebetina": {
    ka: ["Macrovipera lebetina", "Vipera lebetina"],
    en: [
      "Levantine viper",
      "blunt-nosed viper",
      "giurza",
      "gyurza",
      "Macrovipera lebetina",
    ],
  },
  "vipera-kaznakovi": {
    ka: ["კავკასიური გველგესლა", "გველგესლა", "Pelias kaznakovi"],
    en: [
      "Caucasus viper",
      "Caucasian viper",
      "Kaznakov's viper",
      "Pelias kaznakovi",
    ],
  },
  "vipera-transcaucasiana": {
    ka: [
      "ცხვირრქოსანი გველგესლა",
      "გველგესლა",
      "Vipera ammodytes",
      "Vipera transcaucasiana",
    ],
    en: [
      "Transcaucasian long-nosed viper",
      "nose-horned viper",
      "Transcaucasian sand viper",
      "Vipera transcaucasiana",
      "Vipera ammodytes transcaucasiana",
    ],
  },
  "vipera-darevskii": {
    ka: ["დარევსკის გველგესლა", "გველგესლა"],
    en: ["Darevsky's viper"],
  },
  "vipera-renardi": {
    ka: ["ველის გველგესლა", "სტეპის გველგესლა", "გველგესლა"],
    en: ["eastern steppe viper", "steppe viper"],
  },
  "paralaudakia-caucasia": {
    ka: ["კავკასიური ჯოჯო", "Laudakia caucasia", "Agama caucasica"],
    en: [
      "Caucasian rock agama",
      "Laudakia caucasia",
      "Agama caucasica",
      "Stellio caucasius",
    ],
  },
  "pseudopus-apodus": {
    ka: ["გველხოკერა"],
    en: ["European glass lizard", "sheltopusik"],
  },
  "platyceps-najadum": {
    ka: ["წენგოსფერი მცურავი", "Coluber najadum"],
    en: [
      "Dahl's whip snake",
      "slender whip snake",
      "Coluber najadum",
    ],
  },
  "eryx-jaculus": {
    ka: ["ქვიშიანი ბოა", "Eryx jaculus turcicus"],
    en: [
      "javelin boa",
      "sand boa",
      "western sand boa",
      "Eryx jaculus turcicus",
    ],
  },
  "eirenis-modestus": {
    ka: ["Coronella modesta", "Contia modesta"],
    en: [
      "Asia Minor dwarf snake",
      "ringheaded dwarf snake",
      "Coronella modesta",
      "Contia modesta",
    ],
  },
  "hemorrhois-ravergieri": {
    ka: [
      "Coluber ravergieri",
      "Zamenis ravergieri",
      "ჭრელი მცურავი",
      "ნაირფერი გველი",
    ],
    en: [
      "spotted whipsnake",
      "variegated racer",
      "Coluber ravergieri",
      "Zamenis ravergieri",
      "Ravergier's whip snake",
    ],
  },
  "elaphe-urartica": {
    ka: [
      "ურარტუს ხალებიანი მცურავი",
      "ლაქებიანი მცურავი",
      "Elaphe sauromates",
    ],
    en: [
      "Urartian rat snake",
      "blotched ratsnake",
      "Elaphe sauromates",
    ],
  },
  "elaphe-dione": {
    ka: ["სახეებიანი მცურავი"],
    en: ["steppe ratsnake", "Dione's ratsnake", "steppe rat snake"],
  },
  "telescopus-fallax": {
    ka: ["კატისთვალა", "Tarbophis fallax", "Telescopus fallax iberus"],
    en: [
      "European cat snake",
      "Mediterranean cat snake",
      "Tarbophis fallax",
      "Telescopus fallax iberus",
    ],
  },
  "zamenis-longissimus": {
    ka: ["ესკულაპის მცურავი", "გრძელი მცურავი"],
    en: ["Aesculapian snake"],
  },
  "coronella-austriaca": {
    ka: ["გლუვი გველი", "სპილენძა გველი"],
    en: ["smooth snake", "Coronella"],
  },
  "natrix-natrix": {
    ka: ["ანკარა", "დიდთავა ანკარა", "Natrix megalocephala"],
    en: [
      "grass snake",
      "ringed snake",
      "ring snake",
      "eastern grass snake",
      "Natrix megalocephala",
    ],
  },
  "pelodytes-caucasicus": {
    ka: [
      "კავკასიური ჯვარულა",
      "ჯვრიანა",
      "ჯვარულა",
      "Pelodytes",
    ],
    en: [
      "Caucasian mud-diver",
      "parsley frog",
      "Pelodytes",
    ],
  },
  "hyla-orientalis": {
    ka: [
      "ვასაკა",
      "Hyla arborea",
      "Hyla arborea schelkownikowi",
      "აღმოსავლური ხის ბაყაყი",
    ],
    en: [
      "eastern tree frog",
      "Oriental treefrog",
      "Hyla arborea",
      "Hyla arborea schelkownikowi",
      "European treefrog",
    ],
  },
  "hyla-savignyi": {
    ka: ["Hyla arborea savignyi"],
    en: [
      "Savigny's treefrog",
      "lemon-yellow treefrog",
      "Middle East treefrog",
      "Hyla arborea savignyi",
    ],
  },

  "bufotes-viridis": {
    ka: ["Bufo viridis", "Pseudepidalea viridis", "Bufotes sitibundus"],
    en: [
      "Bufo viridis",
      "Pseudepidalea viridis",
      "Bufotes sitibundus",
      "European green toad",
    ],
  },
  "mertensiella-caucasica": {
    ka: ["Salamandra caucasica"],
    en: ["Caucasian salamander", "Salamandra caucasica"],
  },
  "natrix-tessellata": {
    ka: ["წყლის გველი", "dice snake"],
    en: ["tessellated water snake", "water snake"],
  },
  "lissotriton-lantzi": {
    ka: [
      "ჩვეულებრივი ტრიტონი",
      "გლუვი ტრიტონი",
      "Triturus vulgaris lantzi",
      "Lissotriton vulgaris lantzi",
    ],
    en: [
      "Caucasian newt",
      "Lantz's newt",
      "smooth newt",
      "Triturus vulgaris lantzi",
      "Lissotriton vulgaris lantzi",
    ],
  },
  "ommatotriton-ophryticus": {
    ka: [
      "მცირეაზიური ტრიტონი",
      "ზოლებიანი ტრიტონი",
      "Triturus vittatus",
      "Triturus vittatus ophryticus",
    ],
    en: [
      "Caucasian banded newt",
      "northern banded newt",
      "Asia Minor newt",
      "banded newt",
      "Triturus vittatus",
      "Triturus vittatus ophryticus",
    ],
  },
  "emberiza-citrinella": {
    ka: [
      "მოყვითალო გრატა",
      "ქეროზა",
      "რუხი გულწითელა",
      "Emberiza citrinella erythrogenys",
    ],
    en: ["yellow bunting", "Emberiza citrinella erythrogenys"],
  },
  "picus-viridis": {
    ka: [
      "კოდალა",
      "სამხრული მწვანე კოდალა",
      "Picus viridis karelini",
    ],
    en: [
      "green woodpecker",
      "Eurasian green woodpecker",
      "yaffle",
      "Picus viridis karelini",
    ],
  },
  "jynx-torquilla": {
    ka: [
      "ჩვეულებრივი მაქცია",
      "კოდალასებრნი",
      "Jynx torquilla torquilla",
    ],
    en: [
      "wryneck",
      "northern wryneck",
      "European wryneck",
      "Jynx torquilla torquilla",
    ],
  },
  "cuculus-canorus": {
    ka: [
      "ჩვეულებრივი გუგული",
      "გუგულისებრნი",
      "Cuculus canorus canorus",
    ],
    en: [
      "European cuckoo",
      "Eurasian cuckoo",
      "cuckoo",
      "Cuculus canorus canorus",
    ],
  },
  "ficedula-hypoleuca": {
    ka: [
      "ჭრელი ბუზიჭერია",
      "მემატლიასებრნი",
      "Motacilla hypoleuca",
      "Muscicapa hypoleuca",
    ],
    en: [
      "pied flycatcher",
      "western pied flycatcher",
      "Motacilla hypoleuca",
      "Muscicapa hypoleuca",
      "Ficedula hypoleuca hypoleuca",
    ],
  },
  "ficedula-semitorquata": {
    ka: [
      "ნახევართეთრყელა მემატლია",
      "ნახევართეთრყელა ბუზიჭერია",
      "მემატლიასებრნი",
      "Muscicapa semitorquata",
    ],
    en: [
      "semicollared flycatcher",
      "half-collared flycatcher",
      "Muscicapa semitorquata",
    ],
  },
  "vulpes-vulpes": {
    ka: [
      "ჩვეულებრივი მელა",
      "წითელი მელა",
      "Canis vulpes",
      "Vulpes vulpes caucasica",
      "Vulpes vulpes alpherakyi",
    ],
    en: [
      "common fox",
      "cross fox",
      "silver fox",
      "Canis vulpes",
      "Vulpes vulpes caucasica",
      "Vulpes vulpes alpherakyi",
    ],
  },
  "mustela-nivalis": {
    ka: [
      "სინდიოფალა",
      "Putorius nivalis",
      "Mustela nivalis caucasica",
      "Mustela nivalis dinniki",
    ],
    en: [
      "weasel",
      "common weasel",
      "little weasel",
      "Putorius nivalis",
      "Mustela nivalis caucasica",
      "Mustela nivalis dinniki",
    ],
  },
  "sciurus-anomalus": {
    ka: [
      "სპარსული ციყვი",
      "ციყვი",
      "Sciurus persicus",
      "Sciurus anomalus anomalus",
    ],
    en: [
      "Persian squirrel",
      "golden squirrel",
      "Transcaucasian squirrel",
      "Sciurus persicus",
      "Sciurus anomalus anomalus",
    ],
  },
};

export function uniqueKeywords(values: Array<string | undefined | null>) {
  const seen = new Set<string>();
  const keywords: string[] = [];

  for (const value of values) {
    const item = value?.trim();
    if (!item) continue;
    const key = item.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    keywords.push(item);
  }

  return keywords;
}

export function siteKeywords(locale: AppLocale) {
  return locale === "en"
    ? [
        "animals of Georgia",
        "Georgia reptiles",
        "Caucasus reptiles",
        "species atlas",
      ]
    : [
        "საქართველოს ცხოველები",
        "ცხოველთა ატლასი",
        "ქვეწარმავლები",
        "საქართველოს ქვეწარმავლები",
        "კავკასია",
      ];
}

export function speciesSeoAnchor(commonName: string, scientificName: string) {
  return `${commonName} (${scientificName})`;
}

export function speciesAliasKeywords(id: string, locale: AppLocale) {
  const aliases = SPECIES_ALIASES[id];
  if (!aliases) return [];
  return locale === "en" ? aliases.en : aliases.ka;
}

export function speciesSeoKeywords(species: Species, locale: AppLocale) {
  return uniqueKeywords([
    species.commonName,
    species.scientificName,
    species.genus,
    species.family,
    ...speciesAliasKeywords(species.id, locale),
    locale === "en" ? "Georgia" : "საქართველო",
    locale === "en" ? "Caucasus" : "კავკასია",
  ]);
}

export function speciesJsonLdKeywords(species: Species, locale: AppLocale) {
  return speciesSeoKeywords(species, locale).join(", ");
}

export type SeoDefinedTerm = {
  ka: string;
  en: string;
  speciesId: string;
};

export const HOME_DEFINED_TERMS: SeoDefinedTerm[] = [
  {
    ka: "გიურზა",
    en: "Levantine viper",
    speciesId: "macrovipera-lebetina",
  },
  {
    ka: "დინიკის გველგესლა",
    en: "Dinnik's viper",
    speciesId: "vipera-dinniki",
  },
  {
    ka: "კავკასიური გველგესლა",
    en: "Caucasus viper",
    speciesId: "vipera-kaznakovi",
  },
  {
    ka: "ცხვირრქოსანი გველგესლა",
    en: "Nose-horned viper",
    speciesId: "vipera-transcaucasiana",
  },
  {
    ka: "დარევსკის გველგესლა",
    en: "Darevsky's viper",
    speciesId: "vipera-darevskii",
  },
  {
    ka: "ველის გველგესლა",
    en: "eastern steppe viper",
    speciesId: "vipera-renardi",
  },
  {
    ka: "გველხოკერა",
    en: "European glass lizard",
    speciesId: "pseudopus-apodus",
  },
  {
    ka: "წენგოსფერი მცურავი",
    en: "Dahl's whip snake",
    speciesId: "platyceps-najadum",
  },
  {
    ka: "სახეებიანი მცურავი",
    en: "steppe ratsnake",
    speciesId: "elaphe-dione",
  },
  {
    ka: "კატისთვალა",
    en: "European cat snake",
    speciesId: "telescopus-fallax",
  },
  {
    ka: "ესკულაპის მცურავი",
    en: "Aesculapian snake",
    speciesId: "zamenis-longissimus",
  },
];
