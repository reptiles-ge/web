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
  nameIn: LocalizedText;
  description: LocalizedText;
  speciesIds: string[];
  path: string;
};

export const regions: Region[] = [
  {
    id: "abkhazia",
    name: { ka: "აფხაზეთი", en: "Abkhazia" },
    nameIn: { ka: "აფხაზეთში", en: "Abkhazia" },
    description: {
      ka: "შავი ზღვის სანაპირო, კოლხური ტყეები და კავკასიონის მთისწინეთი ქმნის ნოტიო, მრავალფეროვან ჰაბიტატს.",
      en: "The Black Sea coast, Colchic forests, and Caucasus foothills form a humid, biodiverse habitat.",
    },
    speciesIds: [
      "vipera-kaznakovi",
      "vipera-dinniki",
      "natrix-tessellata",
      "natrix-natrix",
      "coronella-austriaca",
      "pseudopus-apodus",
      "zamenis-longissimus",
    ],
    path: georgiaRegionPaths.abkhazia,
  },
  {
    id: "samegrelo",
    name: { ka: "სამეგრელო — ზემო სვანეთი", en: "Samegrelo — Zemo Svaneti" },
    nameIn: {
      ka: "სამეგრელო — ზემო სვანეთში",
      en: "Samegrelo — Zemo Svaneti",
    },
    description: {
      ka: "კოლხეთის დაბლობიდან სვანეთის მაღალმთამდე — ტენიანი ტყეები, მდინარის ხეობები და ალპური ზონა.",
      en: "From the Colchis lowlands to high Svaneti — humid forests, river valleys, and alpine zones.",
    },
    speciesIds: [
      "vipera-kaznakovi",
      "vipera-dinniki",
      "natrix-tessellata",
      "natrix-natrix",
      "coronella-austriaca",
      "pseudopus-apodus",
      "zamenis-longissimus",
      "emys-orbicularis",
      "pelophylax-ridibundus",
      "phoenicolacerta-laevis",
      "darevskia-brauneri",
      "darevskia-mixta",
      "darevskia-derjugini",
      "darevskia-obscura",
    ],
    path: georgiaRegionPaths.samegrelo,
  },
  {
    id: "guria",
    name: { ka: "გურია", en: "Guria" },
    nameIn: { ka: "გურიაში", en: "Guria" },
    description: {
      ka: "ნოტიო სუბტროპიკული კოლხური ტყეები და მდინარის ხეობები ხელს უწყობს ტენიანობის მოყვარულ სახეობებს.",
      en: "Humid subtropical Colchic forests and river valleys favor moisture-loving species.",
    },
    speciesIds: [
      "vipera-kaznakovi",
      "natrix-tessellata",
      "natrix-natrix",
      "coronella-austriaca",
      "pseudopus-apodus",
      "zamenis-longissimus",
      "mertensiella-caucasica",
      "hyla-orientalis",
      "rana-macrocnemis",
    ],
    path: georgiaRegionPaths.guria,
  },
  {
    id: "adjara",
    name: { ka: "აჭარა", en: "Adjara" },
    nameIn: { ka: "აჭარაში", en: "Adjara" },
    description: {
      ka: "ნოტიო სუბტროპიკული ტყეები, მთიანი ხეობები და შავი ზღვის სანაპირო ქმნის უნიკალურ გარემოს მრავალი რეპტილიისთვის.",
      en: "Humid subtropical forests, mountain valleys, and the Black Sea coast create a unique setting for many reptiles.",
    },
    speciesIds: [
      "vipera-kaznakovi",
      "vipera-transcaucasiana",
      "natrix-tessellata",
      "natrix-natrix",
      "coronella-austriaca",
      "pseudopus-apodus",
      "zamenis-longissimus",
      "trachemys-scripta",
      "mertensiella-caucasica",
      "darevskia-adjarica",
      "darevskia-clarkorum",
      "darevskia-derjugini",
    ],
    path: georgiaRegionPaths.adjara,
  },
  {
    id: "imereti",
    name: { ka: "იმერეთი", en: "Imereti" },
    nameIn: { ka: "იმერეთში", en: "Imereti" },
    description: {
      ka: "კარსტული მთები, ტყიანი ხეობები და რიონის აუზი აერთიანებს დასავლეთ საქართველოს ჰაბიტატებს.",
      en: "Karst mountains, wooded valleys, and the Rioni basin unite western Georgia’s habitats.",
    },
    speciesIds: [
      "vipera-kaznakovi",
      "coronella-austriaca",
      "natrix-tessellata",
      "natrix-natrix",
      "pseudopus-apodus",
      "zamenis-longissimus",
      "triturus-karelinii",
      "darevskia-mixta",
    ],
    path: georgiaRegionPaths.imereti,
  },
  {
    id: "racha",
    name: {
      ka: "რაჭა — ლეჩხუმი — ქვემო სვანეთი",
      en: "Racha — Lechkhumi — Kvemo Svaneti",
    },
    nameIn: {
      ka: "რაჭა — ლეჩხუმი — ქვემო სვანეთში",
      en: "Racha — Lechkhumi — Kvemo Svaneti",
    },
    description: {
      ka: "მაღალმთიანი ტყეები, სუბალპური მდელოები და კლდოვანი ხეობები — იდეალური გარემო მთის სახეობებისთვის.",
      en: "High-mountain forests, subalpine meadows, and rocky gorges — ideal for montane species.",
    },
    speciesIds: [
      "vipera-dinniki",
      "coronella-austriaca",
      "natrix-tessellata",
      "natrix-natrix",
      "pseudopus-apodus",
      "zamenis-longissimus",
      "darevskia-derjugini",
    ],
    path: georgiaRegionPaths.racha,
  },
  {
    id: "samtskhe-javakheti",
    name: { ka: "სამცხე — ჯავახეთი", en: "Samtskhe — Javakheti" },
    nameIn: { ka: "სამცხე — ჯავახეთში", en: "Samtskhe — Javakheti" },
    description: {
      ka: "ვულკანური პლატოები, მთის ტბები და მშრალი მთისწინეთი ქმნის მკაცრ, ღია ჰაბიტატს.",
      en: "Volcanic plateaus, highland lakes, and dry foothills form a harsh, open habitat.",
    },
    speciesIds: [
      "vipera-transcaucasiana",
      "vipera-darevskii",
      "vipera-renardi",
      "vipera-kaznakovi",
      "coronella-austriaca",
      "natrix-tessellata",
      "natrix-natrix",
      "pseudopus-apodus",
      "platyceps-najadum",
      "telescopus-fallax",
      "elaphe-dione",
      "dolichophis-schmidti",
      "ommatotriton-ophryticus",
      "bufo-verrucosissimus",
      "rana-macrocnemis",
      "mertensiella-caucasica",
      "zamenis-hohenackeri",
      "hemorrhois-ravergieri",
      "lacerta-media",
      "paralaudakia-caucasia",
      "darevskia-armeniaca",
      "darevskia-obscura",
      "darevskia-raddei",
      "darevskia-valentini",
      "darevskia-derjugini",
      "darevskia-mixta",
    ],
    path: georgiaRegionPaths["samtskhe-javakheti"],
  },
  {
    id: "shida-kartli",
    name: { ka: "შიდა ქართლი", en: "Shida Kartli" },
    nameIn: { ka: "შიდა ქართლში", en: "Shida Kartli" },
    description: {
      ka: "შიდა ქართლის ვაკე, მთისწინეთი და მტკვრის ხეობა აერთიანებს მშრალ და ნახევრად ნოტიო ზონებს.",
      en: "The Shida Kartli plain, foothills, and Mtkvari valley bridge dry and semi-humid zones.",
    },
    speciesIds: [
      "vipera-transcaucasiana",
      "elaphe-urartica",
      "elaphe-dione",
      "dolichophis-schmidti",
      "natrix-tessellata",
      "natrix-natrix",
      "pseudopus-apodus",
      "platyceps-najadum",
      "telescopus-fallax",
      "coronella-austriaca",
    ],
    path: georgiaRegionPaths["shida-kartli"],
  },
  {
    id: "mtskheta-mtianeti",
    name: { ka: "მცხეთა — მთიანეთი", en: "Mtskheta — Mtianeti" },
    nameIn: { ka: "მცხეთა — მთიანეთში", en: "Mtskheta — Mtianeti" },
    description: {
      ka: "დიდი კავკასიონის მთები, ტყის ზედა ზონა და სუბალპური მდელოები — მთის რეპტილიების სამყოფელი.",
      en: "Greater Caucasus peaks, upper forest belt, and subalpine meadows — home to montane reptiles.",
    },
    speciesIds: [
      "vipera-dinniki",
      "coronella-austriaca",
      "natrix-tessellata",
      "natrix-natrix",
      "elaphe-urartica",
      "elaphe-dione",
      "pseudopus-apodus",
      "telescopus-fallax",
      "darevskia-caucasica",
      "darevskia-praticola",
      "darevskia-derjugini",
    ],
    path: georgiaRegionPaths["mtskheta-mtianeti"],
  },
  {
    id: "kvemo-kartli",
    name: { ka: "ქვემო ქართლი", en: "Kvemo Kartli" },
    nameIn: { ka: "ქვემო ქართლში", en: "Kvemo Kartli" },
    description: {
      ka: "მშრალი ვაკეები, კლდოვანი მთისწინეთი და მტკვრის აუზი ხელს უწყობს თბომოყვარე სახეობებს.",
      en: "Dry plains, rocky foothills, and the Mtkvari basin favor warmth-loving species.",
    },
    speciesIds: [
      "macrovipera-lebetina",
      "vipera-transcaucasiana",
      "elaphe-urartica",
      "elaphe-dione",
      "dolichophis-schmidti",
      "natrix-tessellata",
      "natrix-natrix",
      "pseudopus-apodus",
      "platyceps-najadum",
      "telescopus-fallax",
      "coronella-austriaca",
    ],
    path: georgiaRegionPaths["kvemo-kartli"],
  },
  {
    id: "kakheti",
    name: { ka: "კახეთი", en: "Kakheti" },
    nameIn: { ka: "კახეთში", en: "Kakheti" },
    description: {
      ka: "ალაზნის ველი, მშრალი მთისწინეთი და ნახევრად უდაბნო ზონები ქმნის აღმოსავლეთ საქართველოს უნიკალურ ფაუნას.",
      en: "The Alazani valley, dry foothills, and semi-arid zones shape eastern Georgia’s unique fauna.",
    },
    speciesIds: [
      "macrovipera-lebetina",
      "vipera-renardi",
      "elaphe-urartica",
      "elaphe-dione",
      "dolichophis-schmidti",
      "natrix-tessellata",
      "natrix-natrix",
      "pseudopus-apodus",
      "platyceps-najadum",
      "telescopus-fallax",
      "coronella-austriaca",
      "zamenis-longissimus",
      "malpolon-insignitus",
      "pelobates-syriacus",
      "pelodytes-caucasicus",
      "bufotes-viridis",
      "hyla-savignyi",
      "tenuidactylus-caspius",
      "eumeces-schneiderii",
      "eremias-velox",
      "ophisops-elegans",
      "lacerta-strigata",
      "eirenis-collaris",
      "xerotyphlops-vermicularis",
      "paralaudakia-caucasia",
      "darevskia-daghestanica",
      "darevskia-derjugini",
    ],
    path: georgiaRegionPaths.kakheti,
  },
  {
    id: "tbilisi",
    name: { ka: "თბილისი", en: "Tbilisi" },
    nameIn: { ka: "თბილისში", en: "Tbilisi" },
    description: {
      ka: "ქალაქის მიმდებარე ხეობები, პარკები და მდინარის პირას არსებული ჰაბიტატები იშვიათად, მაგრამ მაინც მასპინძლობს რეპტილიებს.",
      en: "Suburban valleys, parks, and riverside habitats occasionally host reptiles within the capital.",
    },
    speciesIds: [
      "macrovipera-lebetina",
      "vipera-transcaucasiana",
      "dolichophis-schmidti",
      "pseudopus-apodus",
      "coronella-austriaca",
      "natrix-tessellata",
      "natrix-natrix",
      "telescopus-fallax",
      "elaphe-dione",
      "elaphe-urartica",
      "platyceps-najadum",
      "trachemys-scripta",
      "testudo-graeca",
      "mauremys-caspica",
      "pelobates-syriacus",
      "lissotriton-lantzi",
      "tenuidactylus-caspius",
      "eryx-jaculus",
      "eirenis-modestus",
      "darevskia-dahli",
      "darevskia-portschinskii",
    ],
    path: georgiaRegionPaths.tbilisi,
  },
];

export function getRegionById(id: string) {
  return regions.find((region) => region.id === id);
}

export function getRegionsForSpecies(speciesId: string): Region[] {
  return regions.filter((region) => region.speciesIds.includes(speciesId));
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

export function getRegionVenomousSpecies(region: Region): Species[] {
  return getRegionSpecies(region).filter(
    (item) => item.danger === "High" || item.danger === "Moderate",
  );
}

export function getCatalogRegionStats() {
  const speciesIds = new Set<string>();
  let venomous = 0;
  for (const region of regions) {
    for (const id of region.speciesIds) {
      if (speciesIds.has(id)) continue;
      speciesIds.add(id);
      const species = getSpeciesById(id);
      if (
        species &&
        (species.danger === "High" || species.danger === "Moderate")
      ) {
        venomous += 1;
      }
    }
  }
  return {
    regionCount: regions.length,
    speciesCount: speciesIds.size,
    venomousCount: venomous,
  };
}
