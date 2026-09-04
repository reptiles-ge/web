import type { RegionPathId } from "@/data/georgia-paths";
import type { AppLocale } from "@/i18n/routing";

import { georgiaRegionPaths } from "@/data/georgia-paths";
import { getSpeciesById, type Species } from "@/data/species";
import { pickLocalized } from "@/i18n/localeMeta";

export type LocalizedText = {
  en: string;
  ka: string;
  ru?: string;
  tr?: string;
};

export type Region = {
  description: LocalizedText;
  id: RegionPathId;
  name: LocalizedText;
  nameIn: LocalizedText;
  path: string;
  speciesIds: string[];
};

export const regions: Region[] = [
  {
    description: {
      en: "The Black Sea coast, Colchic forests, and Caucasus foothills form a humid, biodiverse habitat.",
      ka: "შავი ზღვის სანაპირო, კოლხური ტყეები და კავკასიონის მთისწინეთი ქმნის ნოტიო, მრავალფეროვან ჰაბიტატს.",
      ru: "Черноморское побережье, колхидские леса и предгорья Кавказа образуют влажную, богатую видами среду.",
      tr: "Karadeniz kıyısı, Kolhis ormanları ve Kafkas etekleri nemli, türce zengin bir ortam oluşturur.",
    },
    id: "abkhazia",
    name: { en: "Abkhazia", ka: "აფხაზეთი", ru: "Абхазия", tr: "Abhazya" },
    nameIn: {
      en: "Abkhazia",
      ka: "აფხაზეთში",
      ru: "Абхазии",
      tr: "Abhazya",
    },
    path: georgiaRegionPaths.abkhazia,
    speciesIds: [
      "vipera-kaznakovi",
      "vipera-dinniki",
      "natrix-tessellata",
      "natrix-natrix",
      "anguis-colchica",
      "hyla-orientalis",
      "rana-macrocnemis",
      "pelophylax-ridibundus",
      "bufotes-viridis",
      "bufo-verrucosissimus",
      "coronella-austriaca",
      "zamenis-longissimus",
      "ommatotriton-ophryticus",
      "lissotriton-lantzi",
      "triturus-karelinii",
      "pelodytes-caucasicus",
      "lacerta-agilis",
      "darevskia-pontica",
      "argiope-bruennichi",
    ],
  },
  {
    description: {
      en: "From the Colchis lowlands to high Svaneti — humid forests, river valleys, and alpine zones.",
      ka: "კოლხეთის დაბლობიდან სვანეთის მაღალმთამდე — ტენიანი ტყეები, მდინარის ხეობები და ალპური ზონა.",
      ru: "От Колхидской низменности до высокогорной Сванетии — влажные леса, речные долины и альпийский пояс.",
      tr: "Kolhis ovasından yüksek Svaneti’ye — nemli ormanlar, nehir vadileri ve alpin kuşak.",
    },
    id: "samegrelo",
    name: {
      en: "Samegrelo — Zemo Svaneti",
      ka: "სამეგრელო — ზემო სვანეთი",
      ru: "Самегрело — Верхняя Сванетия",
      tr: "Samegrelo — Zemo Svaneti",
    },
    nameIn: {
      en: "Samegrelo — Zemo Svaneti",
      ka: "სამეგრელო — ზემო სვანეთში",
      ru: "Самегрело — Верхней Сванетии",
      tr: "Samegrelo — Zemo Svaneti",
    },
    path: georgiaRegionPaths.samegrelo,
    speciesIds: [
      "vipera-kaznakovi",
      "vipera-dinniki",
      "natrix-tessellata",
      "natrix-natrix",
      "anguis-colchica",
      "hyla-orientalis",
      "rana-macrocnemis",
      "pelophylax-ridibundus",
      "bufotes-viridis",
      "bufo-verrucosissimus",
      "coronella-austriaca",
      "zamenis-longissimus",
      "emys-orbicularis",
      "phoenicolacerta-laevis",
      "darevskia-brauneri",
      "darevskia-mixta",
      "darevskia-derjugini",
      "darevskia-obscura",
      "ommatotriton-ophryticus",
      "lissotriton-lantzi",
      "triturus-karelinii",
      "pelodytes-caucasicus",
      "lacerta-agilis",
      "anas-platyrhynchos",
      "larus-fuscus",
      "phasianus-colchicus",
      "tyto-alba",
      "argiope-bruennichi",
    ],
  },
  {
    description: {
      en: "Humid subtropical Colchic forests and river valleys favor moisture-loving species.",
      ka: "ნოტიო სუბტროპიკული კოლხური ტყეები და მდინარის ხეობები ხელს უწყობს ტენიანობის მოყვარულ სახეობებს.",
      ru: "Влажные субтропические колхидские леса и речные долины благоприятны для влаголюбивых видов.",
      tr: "Nemli subtropik Kolhis ormanları ve nehir vadileri neme bağlı türlüre elverişlidir.",
    },
    id: "guria",
    name: { en: "Guria", ka: "გურია", ru: "Гурия", tr: "Gurya" },
    nameIn: { en: "Guria", ka: "გურიაში", ru: "Гурии", tr: "Gurya" },
    path: georgiaRegionPaths.guria,
    speciesIds: [
      "vipera-kaznakovi",
      "natrix-tessellata",
      "natrix-natrix",
      "anguis-colchica",
      "hyla-orientalis",
      "rana-macrocnemis",
      "pelophylax-ridibundus",
      "bufotes-viridis",
      "coronella-austriaca",
      "zamenis-longissimus",
      "ommatotriton-ophryticus",
      "lissotriton-lantzi",
      "pelodytes-caucasicus",
      "lacerta-agilis",
      "anas-platyrhynchos",
      "larus-fuscus",
      "argiope-bruennichi",
    ],
  },
  {
    description: {
      en: "Humid subtropical forests, mountain valleys, and the Black Sea coast create a unique setting for many reptiles.",
      ka: "ნოტიო სუბტროპიკული ტყეები, მთიანი ხეობები და შავი ზღვის სანაპირო ქმნის უნიკალურ გარემოს მრავალი რეპტილიისთვის.",
      ru: "Влажные субтропические леса, горные долины и черноморское побережье создают особую среду для многих рептилий.",
      tr: "Nemli subtropik ormanlar, dağ vadileri ve Karadeniz kıyısı birçok sürüngen için özgün bir ortam oluşturur.",
    },
    id: "adjara",
    name: { en: "Adjara", ka: "აჭარა", ru: "Аджария", tr: "Acara" },
    nameIn: { en: "Adjara", ka: "აჭარაში", ru: "Аджарии", tr: "Acara" },
    path: georgiaRegionPaths.adjara,
    speciesIds: [
      "vipera-kaznakovi",
      "vipera-transcaucasiana",
      "natrix-tessellata",
      "natrix-natrix",
      "anguis-colchica",
      "hyla-orientalis",
      "rana-macrocnemis",
      "pelophylax-ridibundus",
      "bufotes-viridis",
      "bufo-verrucosissimus",
      "coronella-austriaca",
      "zamenis-longissimus",
      "platyceps-najadum",
      "trachemys-scripta",
      "mertensiella-caucasica",
      "darevskia-adjarica",
      "darevskia-clarkorum",
      "darevskia-derjugini",
      "ommatotriton-ophryticus",
      "lissotriton-lantzi",
      "triturus-karelinii",
      "pelodytes-caucasicus",
      "lacerta-agilis",
      "tyto-alba",
      "larus-fuscus",
      "motacilla-alba",
      "argiope-bruennichi",
      "steatoda-paykulliana",
    ],
  },
  {
    description: {
      en: "Karst mountains, wooded valleys, and the Rioni basin unite western Georgia’s habitats.",
      ka: "კარსტული მთები, ტყიანი ხეობები და რიონის აუზი აერთიანებს დასავლეთ საქართველოს ჰაბიტატებს.",
      ru: "Карстовые горы, лесистые долины и бассейн Риони объединяют местообитания западной Грузии.",
      tr: "Karst dağları, ormanlı vadiler ve Rioni havzası batı Gürcistan habitatlarını birleştirir.",
    },
    id: "imereti",
    name: { en: "Imereti", ka: "იმერეთი", ru: "Имеретия", tr: "İmereti" },
    nameIn: { en: "Imereti", ka: "იმერეთში", ru: "Имеретии", tr: "İmereti" },
    path: georgiaRegionPaths.imereti,
    speciesIds: [
      "vipera-kaznakovi",
      "coronella-austriaca",
      "natrix-tessellata",
      "natrix-natrix",
      "anguis-colchica",
      "hyla-orientalis",
      "rana-macrocnemis",
      "pelophylax-ridibundus",
      "bufotes-viridis",
      "bufo-verrucosissimus",
      "zamenis-longissimus",
      "zamenis-hohenackeri",
      "triturus-karelinii",
      "ommatotriton-ophryticus",
      "lissotriton-lantzi",
      "darevskia-mixta",
      "pelodytes-caucasicus",
      "lacerta-agilis",
      "tyto-alba",
      "argiope-bruennichi",
    ],
  },
  {
    description: {
      en: "High-mountain forests, subalpine meadows, and rocky gorges — ideal for montane species.",
      ka: "მაღალმთიანი ტყეები, სუბალპური მდელოები და კლდოვანი ხეობები — იდეალური გარემო მთის სახეობებისთვის.",
      ru: "Высокогорные леса, субальпийские луга и скалистые ущелья — среда горных видов.",
      tr: "Yüksek dağ ormanları, subalpin çayırlar ve kayalık vadiler — dağ türleri için elverişli ortam.",
    },
    id: "racha",
    name: {
      en: "Racha — Lechkhumi — Kvemo Svaneti",
      ka: "რაჭა — ლეჩხუმი — ქვემო სვანეთი",
      ru: "Рача — Лечхуми — Нижняя Сванетия",
      tr: "Raça — Leçhumi — Kvemo Svaneti",
    },
    nameIn: {
      en: "Racha — Lechkhumi — Kvemo Svaneti",
      ka: "რაჭა — ლეჩხუმი — ქვემო სვანეთში",
      ru: "Рача — Лечхуми — Нижней Сванетии",
      tr: "Raça — Leçhumi — Kvemo Svaneti",
    },
    path: georgiaRegionPaths.racha,
    speciesIds: [
      "vipera-dinniki",
      "vipera-kaznakovi",
      "coronella-austriaca",
      "natrix-tessellata",
      "natrix-natrix",
      "anguis-colchica",
      "hyla-orientalis",
      "rana-macrocnemis",
      "pelophylax-ridibundus",
      "bufotes-viridis",
      "zamenis-longissimus",
      "darevskia-derjugini",
      "ommatotriton-ophryticus",
      "pelodytes-caucasicus",
      "lacerta-agilis",
    ],
  },
  {
    description: {
      en: "Volcanic plateaus, highland lakes, and dry foothills form a harsh, open habitat.",
      ka: "ვულკანური პლატოები, მთის ტბები და მშრალი მთისწინეთი ქმნის მკაცრ, ღია ჰაბიტატს.",
      ru: "Вулканические плато, горные озёра и сухие предгорья образуют суровую открытую среду.",
      tr: "Volkanik platolar, dağ gölleri ve kuru etekler sert, açık bir habitat oluşturur.",
    },
    id: "samtskhe-javakheti",
    name: {
      en: "Samtskhe — Javakheti",
      ka: "სამცხე — ჯავახეთი",
      ru: "Самцхе — Джавахети",
      tr: "Samtshe — Cavaheti",
    },
    nameIn: {
      en: "Samtskhe — Javakheti",
      ka: "სამცხე — ჯავახეთში",
      ru: "Самцхе — Джавахети",
      tr: "Samtshe — Cavaheti",
    },
    path: georgiaRegionPaths["samtskhe-javakheti"],
    speciesIds: [
      "vipera-transcaucasiana",
      "vipera-darevskii",
      "vipera-kaznakovi",
      "coronella-austriaca",
      "natrix-tessellata",
      "natrix-natrix",
      "anguis-colchica",
      "hyla-orientalis",
      "rana-macrocnemis",
      "pelophylax-ridibundus",
      "platyceps-najadum",
      "elaphe-urartica",
      "dolichophis-schmidti",
      "ommatotriton-ophryticus",
      "lissotriton-lantzi",
      "triturus-karelinii",
      "bufotes-viridis",
      "bufo-verrucosissimus",
      "mertensiella-caucasica",
      "zamenis-longissimus",
      "zamenis-hohenackeri",
      "hemorrhois-ravergieri",
      "eirenis-modestus",
      "lacerta-media",
      "paralaudakia-caucasia",
      "darevskia-adjarica",
      "darevskia-armeniaca",
      "darevskia-obscura",
      "darevskia-raddei",
      "darevskia-valentini",
      "darevskia-derjugini",
      "darevskia-mixta",
      "pelodytes-caucasicus",
      "lacerta-agilis",
      "ciconia-ciconia",
      "anas-platyrhynchos",
      "argiope-bruennichi",
      "steatoda-paykulliana",
      "latrodectus-tredecimguttatus",
    ],
  },
  {
    description: {
      en: "The Shida Kartli plain, foothills, and Mtkvari valley bridge dry and semi-humid zones.",
      ka: "შიდა ქართლის ვაკე, მთისწინეთი და მტკვრის ხეობა აერთიანებს მშრალ და ნახევრად ნოტიო ზონებს.",
      ru: "Равнина Внутренней Картли, предгорья и долина Мтквари связывают сухие и полувлажные зоны.",
      tr: "Şida Kartli ovası, etekler ve Mtkvari vadisi kuru ve yarı nemli kuşakları birleştirir.",
    },
    id: "shida-kartli",
    name: {
      en: "Shida Kartli",
      ka: "შიდა ქართლი",
      ru: "Внутренняя Картли",
      tr: "Şida Kartli",
    },
    nameIn: {
      en: "Shida Kartli",
      ka: "შიდა ქართლში",
      ru: "Внутренней Картли",
      tr: "Şida Kartli",
    },
    path: georgiaRegionPaths["shida-kartli"],
    speciesIds: [
      "vipera-transcaucasiana",
      "vipera-kaznakovi",
      "dolichophis-schmidti",
      "natrix-tessellata",
      "natrix-natrix",
      "anguis-colchica",
      "hyla-orientalis",
      "rana-macrocnemis",
      "pelophylax-ridibundus",
      "bufotes-viridis",
      "bufo-verrucosissimus",
      "pseudopus-apodus",
      "platyceps-najadum",
      "telescopus-fallax",
      "coronella-austriaca",
      "eirenis-modestus",
      "zamenis-hohenackeri",
      "darevskia-praticola",
      "ommatotriton-ophryticus",
      "lissotriton-lantzi",
      "triturus-karelinii",
      "pelodytes-caucasicus",
      "pelobates-syriacus",
      "testudo-graeca",
      "darevskia-portschinskii",
      "argiope-bruennichi",
      "argiope-lobata",
      "latrodectus-tredecimguttatus",
    ],
  },
  {
    description: {
      en: "Greater Caucasus peaks, upper forest belt, and subalpine meadows — home to montane reptiles.",
      ka: "დიდი კავკასიონის მთები, ტყის ზედა ზონა და სუბალპური მდელოები — მთის რეპტილიების სამყოფელი.",
      ru: "Хребты Большого Кавказа, верхний лесной пояс и субальпийские луга — местообитание горных рептилий.",
      tr: "Büyük Kafkas zirveleri, üst orman kuşağı ve subalpin çayırlar — dağ sürüngenlerinin yaşam alanı.",
    },
    id: "mtskheta-mtianeti",
    name: {
      en: "Mtskheta — Mtianeti",
      ka: "მცხეთა — მთიანეთი",
      ru: "Мцхета — Мтианети",
      tr: "Mtsheta — Mtianeti",
    },
    nameIn: {
      en: "Mtskheta — Mtianeti",
      ka: "მცხეთა — მთიანეთში",
      ru: "Мцхета — Мтианети",
      tr: "Mtsheta — Mtianeti",
    },
    path: georgiaRegionPaths["mtskheta-mtianeti"],
    speciesIds: [
      "vipera-dinniki",
      "vipera-transcaucasiana",
      "coronella-austriaca",
      "natrix-tessellata",
      "natrix-natrix",
      "anguis-colchica",
      "hyla-orientalis",
      "rana-macrocnemis",
      "pelophylax-ridibundus",
      "bufotes-viridis",
      "bufo-verrucosissimus",
      "dolichophis-schmidti",
      "pseudopus-apodus",
      "platyceps-najadum",
      "telescopus-fallax",
      "eirenis-modestus",
      "darevskia-caucasica",
      "darevskia-praticola",
      "darevskia-derjugini",
      "ommatotriton-ophryticus",
      "lissotriton-lantzi",
      "triturus-karelinii",
      "pelodytes-caucasicus",
      "lacerta-agilis",
      "capra-aegagrus",
      "gyps-fulvus",
    ],
  },
  {
    description: {
      en: "Dry plains, rocky foothills, and the Mtkvari basin favor warmth-loving species.",
      ka: "მშრალი ვაკეები, კლდოვანი მთისწინეთი და მტკვრის აუზი ხელს უწყობს თბომოყვარე სახეობებს.",
      ru: "Сухие равнины, скалистые предгорья и бассейн Мтквари благоприятны для теплолюбивых видов.",
      tr: "Kuru ovalar, kayalık etekler ve Mtkvari havzası sıcağı seven türlüre elverişlidir.",
    },
    id: "kvemo-kartli",
    name: {
      en: "Kvemo Kartli",
      ka: "ქვემო ქართლი",
      ru: "Квемо Картли",
      tr: "Kvemo Kartli",
    },
    nameIn: {
      en: "Kvemo Kartli",
      ka: "ქვემო ქართლში",
      ru: "Квемо Картли",
      tr: "Kvemo Kartli",
    },
    path: georgiaRegionPaths["kvemo-kartli"],
    speciesIds: [
      "macrovipera-lebetina",
      "vipera-transcaucasiana",
      "elaphe-urartica",
      "elaphe-dione",
      "dolichophis-schmidti",
      "natrix-tessellata",
      "natrix-natrix",
      "anguis-colchica",
      "hyla-orientalis",
      "rana-macrocnemis",
      "pelophylax-ridibundus",
      "bufotes-viridis",
      "pseudopus-apodus",
      "platyceps-najadum",
      "telescopus-fallax",
      "coronella-austriaca",
      "eryx-jaculus",
      "eirenis-modestus",
      "eirenis-collaris",
      "zamenis-hohenackeri",
      "lissotriton-lantzi",
      "pelobates-syriacus",
      "testudo-graeca",
      "darevskia-dahli",
      "darevskia-portschinskii",
      "ciconia-ciconia",
      "tyto-alba",
      "argiope-bruennichi",
    ],
  },
  {
    description: {
      en: "The Alazani valley, dry foothills, and semi-arid zones shape eastern Georgia’s unique fauna.",
      ka: "ალაზნის ველი, მშრალი მთისწინეთი და ნახევრად უდაბნო ზონები ქმნის აღმოსავლეთ საქართველოს უნიკალურ ფაუნას.",
      ru: "Алазанская долина, сухие предгорья и полуаридные зоны формируют фауну восточной Грузии.",
      tr: "Alazani vadisi, kuru etekler ve yarı kurak kuşaklar doğu Gürcistan faunasını şekillendirir.",
    },
    id: "kakheti",
    name: { en: "Kakheti", ka: "კახეთი", ru: "Кахетия", tr: "Kaheti" },
    nameIn: { en: "Kakheti", ka: "კახეთში", ru: "Кахетии", tr: "Kaheti" },
    path: georgiaRegionPaths.kakheti,
    speciesIds: [
      "macrovipera-lebetina",
      "vipera-renardi",
      "elaphe-urartica",
      "elaphe-dione",
      "dolichophis-schmidti",
      "natrix-tessellata",
      "natrix-natrix",
      "anguis-colchica",
      "hyla-orientalis",
      "rana-macrocnemis",
      "pelophylax-ridibundus",
      "bufotes-viridis",
      "bufo-verrucosissimus",
      "pseudopus-apodus",
      "platyceps-najadum",
      "telescopus-fallax",
      "coronella-austriaca",
      "malpolon-insignitus",
      "pelobates-syriacus",
      "pelodytes-caucasicus",
      "hyla-savignyi",
      "tenuidactylus-caspius",
      "ablepharus-pannonicus",
      "eumeces-schneiderii",
      "eremias-velox",
      "eremias-arguta",
      "ophisops-elegans",
      "lacerta-strigata",
      "lacerta-media",
      "eirenis-collaris",
      "eirenis-modestus",
      "xerotyphlops-vermicularis",
      "eryx-jaculus",
      "paralaudakia-caucasia",
      "darevskia-daghestanica",
      "darevskia-praticola",
      "darevskia-derjugini",
      "ommatotriton-ophryticus",
      "lissotriton-lantzi",
      "triturus-karelinii",
      "testudo-graeca",
      "capra-aegagrus",
      "aegypius-monachus",
      "gyps-fulvus",
      "phasianus-colchicus",
      "coturnix-coturnix",
      "tyto-alba",
      "argiope-bruennichi",
      "argiope-lobata",
      "steatoda-paykulliana",
      "latrodectus-tredecimguttatus",
    ],
  },
  {
    description: {
      en: "Suburban valleys, parks, and riverside habitats occasionally host reptiles within the capital.",
      ka: "ქალაქის მიმდებარე ხეობები, პარკები და მდინარის პირას არსებული ჰაბიტატები იშვიათად, მაგრამ მაინც მასპინძლობს რეპტილიებს.",
      ru: "Пригородные долины, парки и приречные местообитания иногда держат рептилий в пределах столицы.",
      tr: "Kent çevresi vadileri, parklar ve nehir kenarı habitatları başkentte ara sıra sürüngen barındırır.",
    },
    id: "tbilisi",
    name: { en: "Tbilisi", ka: "თბილისი", ru: "Тбилиси", tr: "Tiflis" },
    nameIn: { en: "Tbilisi", ka: "თბილისში", ru: "Тбилиси", tr: "Tiflis" },
    path: georgiaRegionPaths.tbilisi,
    speciesIds: [
      "macrovipera-lebetina",
      "vipera-transcaucasiana",
      "vipera-renardi",
      "dolichophis-schmidti",
      "pseudopus-apodus",
      "coronella-austriaca",
      "natrix-tessellata",
      "natrix-natrix",
      "anguis-colchica",
      "hyla-orientalis",
      "rana-macrocnemis",
      "pelophylax-ridibundus",
      "bufotes-viridis",
      "telescopus-fallax",
      "elaphe-dione",
      "elaphe-urartica",
      "platyceps-najadum",
      "trachemys-scripta",
      "testudo-graeca",
      "mauremys-caspica",
      "pelobates-syriacus",
      "lissotriton-lantzi",
      "triturus-karelinii",
      "ommatotriton-ophryticus",
      "tenuidactylus-caspius",
      "eryx-jaculus",
      "xerotyphlops-vermicularis",
      "eirenis-modestus",
      "eirenis-collaris",
      "zamenis-hohenackeri",
      "darevskia-dahli",
      "darevskia-portschinskii",
      "argiope-bruennichi",
      "latrodectus-tredecimguttatus",
    ],
  },
];

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

export function getRegionVenomousSpecies(region: Region): Species[] {
  return getRegionSpecies(region).filter(
    (item) => item.danger === "High" || item.danger === "Moderate",
  );
}

export function hasLocalizedText(
  text: LocalizedText,
  locale: AppLocale,
): boolean {
  const value = text[locale];
  return typeof value === "string" && value.trim().length > 0;
}

export function localizeRegionText(
  text: LocalizedText,
  locale: string,
): string {
  return pickLocalized(text, locale);
}

export function localizeRegionTextIfPresent(
  text: LocalizedText,
  locale: AppLocale,
): null | string {
  if (!hasLocalizedText(text, locale)) return null;
  const value = text[locale];
  return value ?? null;
}
