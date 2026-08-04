import { getSpeciesById, type Species } from "@/data/species";
import type { RegionPathId } from "@/data/georgia-paths";
import { georgiaRegionPaths } from "@/data/georgia-paths";

export type LocalizedText = {
  ka: string;
  en: string;
};

export type Region = {
  id: RegionPathId;
  name: LocalizedText;
  description: LocalizedText;
  speciesIds: string[];
  path: string;
};

export const regions: Region[] = [
  {
    id: "abkhazia",
    name: { ka: "აფხაზეთი", en: "Abkhazia" },
    description: {
      ka: "შავი ზღვის სანაპირო, კოლხური ტყეები და კავკასიონის მთისწინეთი ქმნის ნოტიო, მრავალფეროვან ჰაბიტატს.",
      en: "The Black Sea coast, Colchic forests, and Caucasus foothills form a humid, biodiverse habitat.",
    },
    speciesIds: [
      "vipera-kaznakovi",
      "vipera-dinniki",
      "natrix-tessellata",
      "coronella-austriaca",
      "pseudopus-apodus",
    ],
    path: georgiaRegionPaths.abkhazia,
  },
  {
    id: "samegrelo",
    name: { ka: "სამეგრელო — ზემო სვანეთი", en: "Samegrelo — Zemo Svaneti" },
    description: {
      ka: "კოლხეთის დაბლობიდან სვანეთის მაღალმთამდე — ტენიანი ტყეები, მდინარის ხეობები და ალპური ზონა.",
      en: "From the Colchis lowlands to high Svaneti — humid forests, river valleys, and alpine zones.",
    },
    speciesIds: [
      "vipera-kaznakovi",
      "natrix-tessellata",
      "pseudopus-apodus",
      "coronella-austriaca",
    ],
    path: georgiaRegionPaths.samegrelo,
  },
  {
    id: "guria",
    name: { ka: "გურია", en: "Guria" },
    description: {
      ka: "ნოტიო სუბტროპიკული კოლხური ტყეები და მდინარის ხეობები ხელს უწყობს ტენიანობის მოყვარულ სახეობებს.",
      en: "Humid subtropical Colchic forests and river valleys favor moisture-loving species.",
    },
    speciesIds: [
      "vipera-kaznakovi",
      "natrix-tessellata",
      "coronella-austriaca",
      "pseudopus-apodus",
    ],
    path: georgiaRegionPaths.guria,
  },
  {
    id: "adjara",
    name: { ka: "აჭარა", en: "Adjara" },
    description: {
      ka: "ნოტიო სუბტროპიკული ტყეები, მთიანი ხეობები და შავი ზღვის სანაპირო ქმნის უნიკალურ გარემოს მრავალი რეპტილიისთვის.",
      en: "Humid subtropical forests, mountain valleys, and the Black Sea coast create a unique setting for many reptiles.",
    },
    speciesIds: [
      "vipera-kaznakovi",
      "natrix-tessellata",
      "coronella-austriaca",
      "pseudopus-apodus",
    ],
    path: georgiaRegionPaths.adjara,
  },
  {
    id: "imereti",
    name: { ka: "იმერეთი", en: "Imereti" },
    description: {
      ka: "კარსტული მთები, ტყიანი ხეობები და რიონის აუზი აერთიანებს დასავლეთ საქართველოს ჰაბიტატებს.",
      en: "Karst mountains, wooded valleys, and the Rioni basin unite western Georgia’s habitats.",
    },
    speciesIds: [
      "vipera-kaznakovi",
      "coronella-austriaca",
      "natrix-tessellata",
      "pseudopus-apodus",
      "elaphe-urartica",
    ],
    path: georgiaRegionPaths.imereti,
  },
  {
    id: "racha",
    name: { ka: "რაჭა — ლეჩხუმი — ქვემო სვანეთი", en: "Racha — Lechkhumi — Kvemo Svaneti" },
    description: {
      ka: "მაღალმთიანი ტყეები, სუბალპური მდელოები და კლდოვანი ხეობები — იდეალური გარემო მთის სახეობებისთვის.",
      en: "High-mountain forests, subalpine meadows, and rocky gorges — ideal for montane species.",
    },
    speciesIds: [
      "vipera-dinniki",
      "coronella-austriaca",
      "natrix-tessellata",
    ],
    path: georgiaRegionPaths.racha,
  },
  {
    id: "samtskhe-javakheti",
    name: { ka: "სამცხე — ჯავახეთი", en: "Samtskhe — Javakheti" },
    description: {
      ka: "ვულკანური პლატოები, მთის ტბები და მშრალი მთისწინეთი ქმნის მკაცრ, ღია ჰაბიტატს.",
      en: "Volcanic plateaus, highland lakes, and dry foothills form a harsh, open habitat.",
    },
    speciesIds: [
      "vipera-ammodytes",
      "coronella-austriaca",
      "natrix-tessellata",
      "pseudopus-apodus",
    ],
    path: georgiaRegionPaths["samtskhe-javakheti"],
  },
  {
    id: "shida-kartli",
    name: { ka: "შიდა ქართლი", en: "Shida Kartli" },
    description: {
      ka: "შიდა ქართლის ვაკე, მთისწინეთი და მტკვრის ხეობა აერთიანებს მშრალ და ნახევრად ნოტიო ზონებს.",
      en: "The Shida Kartli plain, foothills, and Mtkvari valley bridge dry and semi-humid zones.",
    },
    speciesIds: [
      "vipera-ammodytes",
      "elaphe-urartica",
      "dolichophis-schmidti",
      "natrix-tessellata",
      "pseudopus-apodus",
    ],
    path: georgiaRegionPaths["shida-kartli"],
  },
  {
    id: "mtskheta-mtianeti",
    name: { ka: "მცხეთა — მთიანეთი", en: "Mtskheta — Mtianeti" },
    description: {
      ka: "დიდი კავკასიონის მთები, ტყის ზედა ზონა და სუბალპური მდელოები — მთის რეპტილიების სამყოფელი.",
      en: "Greater Caucasus peaks, upper forest belt, and subalpine meadows — home to montane reptiles.",
    },
    speciesIds: [
      "vipera-dinniki",
      "coronella-austriaca",
      "natrix-tessellata",
      "elaphe-urartica",
    ],
    path: georgiaRegionPaths["mtskheta-mtianeti"],
  },
  {
    id: "kvemo-kartli",
    name: { ka: "ქვემო ქართლი", en: "Kvemo Kartli" },
    description: {
      ka: "მშრალი ვაკეები, კლდოვანი მთისწინეთი და მტკვრის აუზი ხელს უწყობს თბომოყვარე სახეობებს.",
      en: "Dry plains, rocky foothills, and the Mtkvari basin favor warmth-loving species.",
    },
    speciesIds: [
      "macrovipera-lebetina",
      "elaphe-urartica",
      "dolichophis-schmidti",
      "natrix-tessellata",
      "pseudopus-apodus",
    ],
    path: georgiaRegionPaths["kvemo-kartli"],
  },
  {
    id: "kakheti",
    name: { ka: "კახეთი", en: "Kakheti" },
    description: {
      ka: "ალაზნის ველი, მშრალი მთისწინეთი და ნახევრად უდაბნო ზონები ქმნის აღმოსავლეთ საქართველოს უნიკალურ ფაუნას.",
      en: "The Alazani valley, dry foothills, and semi-arid zones shape eastern Georgia’s unique fauna.",
    },
    speciesIds: [
      "macrovipera-lebetina",
      "elaphe-urartica",
      "dolichophis-schmidti",
      "natrix-tessellata",
      "pseudopus-apodus",
      "hogna-radiata",
    ],
    path: georgiaRegionPaths.kakheti,
  },
  {
    id: "tbilisi",
    name: { ka: "თბილისი", en: "Tbilisi" },
    description: {
      ka: "ქალაქის მიმდებარე ხეობები, პარკები და მდინარის პირას არსებული ჰაბიტატები იშვიათად, მაგრამ მაინც მასპინძლობს რეპტილიებს.",
      en: "Suburban valleys, parks, and riverside habitats occasionally host reptiles within the capital.",
    },
    speciesIds: [],
    path: georgiaRegionPaths.tbilisi,
  },
];

export function getRegionById(id: string) {
  return regions.find((region) => region.id === id);
}

export function getRegionSpecies(region: Region): Species[] {
  return region.speciesIds
    .map((id) => getSpeciesById(id))
    .filter((item): item is Species => Boolean(item));
}

export function localizeRegionText(
  text: LocalizedText,
  locale: string,
): string {
  return locale === "en" ? text.en : text.ka;
}
