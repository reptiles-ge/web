import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { GalleryImage, SpeciesFieldRecord } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { HalyomorphaOccurrenceSummary } from "@/lib/halyomorphaOccurrences";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { GeorgiaMapStatic } from "@/components/map/GeorgiaMapStatic";
import { HalyomorphaRangeMap } from "@/components/map/HalyomorphaRangeMap";
import { HalyomorphaRegionSelectButton } from "@/components/map/HalyomorphaRegionSelectButton";
import { getRegionsForSpecies, localizeRegionText } from "@/data/mapRegions";
import { Link } from "@/i18n/navigation";
import {
  confirmedRecordThresholdForSpecies,
  getHalyomorphaFieldRecords,
  getHalyomorphaOccurrenceSummary,
} from "@/lib/halyomorphaOccurrences";
import { regionHref } from "@/lib/regionHref";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type HalyomorphaRangeCopy = {
  closeLabel: string;
  confirmedStatusLabel: string;
  fieldRecordLabel: string;
  footerDataLabel: string;
  footerINaturalistLabel: string;
  footerMethodologyLabel: string;
  footerReptilesLabel: string;
  galleryAction: string;
  iNaturalistRecordLabel: string;
  intro: string;
  loadingLabel: string;
  loadingText: string;
  locationRecordLabel: string;
  mapAria: string;
  mapError: string;
  noPhotoLabel: string;
  noRegionRecordsLabel: string;
  officialRegionLabel: string;
  photoRecordLabel: string;
  rangeTitle: string;
  recordedOnlyStatusLabel: string;
  regionLoadingLabel: string;
  regionPageLabel: (regionName: string) => string;
  regionRecordsLabel: string;
  regionSelectActionLabel: string;
  regionsMetricLabel: string;
  regionSummaryTitle: string;
  resetMapLabel: string;
  resetToGeorgiaLabel: string;
  sourceAction: string;
  statusColumnLabel: string;
};

type InteractiveRangeMapConfig = {
  copy: Record<AppLocale, HalyomorphaRangeCopy>;
  iNaturalistTaxonId: number;
  rangeSource?: "map-regions" | "record-summary";
};

type SpeciesRangeMapProps = {
  fieldRecords?: SpeciesFieldRecord[];
  gallery?: GalleryImage[];
  speciesId: string;
  speciesName: string;
};

const HALYOMORPHA_RANGE_COPY: Record<AppLocale, HalyomorphaRangeCopy> = {
  en: {
    closeLabel: "Close field record",
    confirmedStatusLabel: "Distribution confirmed",
    fieldRecordLabel: "field record",
    footerDataLabel: "Data",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "Methodology",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "View photo",
    iNaturalistRecordLabel: "iNaturalist observations",
    intro:
      "The map for Halyomorpha halys combines Reptiles.ge editorial photo records with public iNaturalist observations. Region-level literature evidence and individual occurrence records are separate layers, and record counts reflect observation effort rather than population density.",
    loadingLabel: "Interactive map is loading.",
    loadingText: "Loading...",
    locationRecordLabel: "Field observation",
    mapAria:
      "Brown marmorated stink bug distribution evidence and field records on a map of Georgia",
    mapError:
      "The interactive map could not load, but the confirmed regions and field records are still listed below.",
    noPhotoLabel: "No public photo for this record",
    noRegionRecordsLabel: "No field records",
    officialRegionLabel: "Source-confirmed region",
    photoRecordLabel: "Photo record",
    rangeTitle: "Where brown marmorated stink bug occurs in Georgia",
    recordedOnlyStatusLabel: "Recorded only",
    regionLoadingLabel: "Loading region records",
    regionPageLabel: (regionName) => `${regionName} region page`,
    regionRecordsLabel: "field records",
    regionSelectActionLabel: "View records",
    regionsMetricLabel: "regions",
    regionSummaryTitle: "Records by region",
    resetMapLabel: "Reset map view",
    resetToGeorgiaLabel: "All Georgia",
    sourceAction: "Open source",
    statusColumnLabel: "Status",
  },
  ka: {
    closeLabel: "საველე ჩანაწერის დახურვა",
    confirmedStatusLabel: "გავრცელება დადასტურებულია",
    fieldRecordLabel: "საველე ჩანაწერი",
    footerDataLabel: "მონაცემები",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "მეთოდოლოგია",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "ფოტოს ნახვა",
    iNaturalistRecordLabel: "iNaturalist-ის დაკვირვება",
    intro:
      "აზიური ფაროსანას (Halyomorpha halys) რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონული ლიტერატურული მტკიცებულება და ინდივიდუალური საველე ჩანაწერები ცალკე ფენებია; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობასაც ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
    loadingLabel: "ინტერაქტიული რუკა იტვირთება.",
    loadingText: "იტვირთება...",
    locationRecordLabel: "საველე ჩანაწერი",
    mapAria:
      "აზიური ფაროსანას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
    mapError:
      "ინტერაქტიული რუკა ვერ ჩაიტვირთა, მაგრამ დადასტურებული რეგიონები და საველე ჩანაწერები ქვემოთ ტექსტურად ჩანს.",
    noPhotoLabel: "ამ ჩანაწერს საჯაროდ გამოსაქვეყნებელი ფოტო არ აქვს",
    noRegionRecordsLabel: "ჩანაწერი არ არის",
    officialRegionLabel: "წყაროებით დადასტურებული რეგიონი",
    photoRecordLabel: "ფოტოჩანაწერი",
    rangeTitle: "სად გვხვდება აზიური ფაროსანა საქართველოში",
    recordedOnlyStatusLabel: "მხოლოდ დაფიქსირებულია",
    regionLoadingLabel: "რეგიონის ჩანაწერები იტვირთება",
    regionPageLabel: (regionName) => `${regionName} — რეგიონის გვერდი`,
    regionRecordsLabel: "საველე ჩანაწერი",
    regionSelectActionLabel: "ჩანაწერების ნახვა",
    regionsMetricLabel: "რეგიონი",
    regionSummaryTitle: "ჩანაწერები რეგიონების მიხედვით",
    resetMapLabel: "რუკის საწყის ხედზე დაბრუნება",
    resetToGeorgiaLabel: "მთელი საქართველო",
    sourceAction: "წყაროს გახსნა",
    statusColumnLabel: "სტატუსი",
  },
  ru: {
    closeLabel: "Закрыть полевую запись",
    confirmedStatusLabel: "Распространение подтверждено",
    fieldRecordLabel: "полевая запись",
    footerDataLabel: "Данные",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "Методология",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "Открыть фото",
    iNaturalistRecordLabel: "наблюдений iNaturalist",
    intro:
      "Карта Halyomorpha halys объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Региональные литературные данные и отдельные полевые записи показаны разными слоями; количество записей отражает также интенсивность наблюдений, а не плотность популяции.",
    loadingLabel: "Интерактивная карта загружается.",
    loadingText: "Загрузка...",
    locationRecordLabel: "Полевое наблюдение",
    mapAria: "Полевые записи коричнево-мраморного клопа на карте Грузии",
    mapError:
      "Интерактивная карта не загрузилась, но подтверждённые регионы и полевые записи остаются доступными ниже.",
    noPhotoLabel: "У этой записи нет публичного фото",
    noRegionRecordsLabel: "Записей нет",
    officialRegionLabel: "Регион, подтверждённый источниками",
    photoRecordLabel: "Фотозапись",
    rangeTitle: "Где встречается коричнево-мраморный клоп в Грузии",
    recordedOnlyStatusLabel: "Только зафиксировано",
    regionLoadingLabel: "Загружаются записи региона",
    regionPageLabel: (regionName) => `Страница региона: ${regionName}`,
    regionRecordsLabel: "полевых записей",
    regionSelectActionLabel: "Показать записи",
    regionsMetricLabel: "регионов",
    regionSummaryTitle: "Записи по регионам",
    resetMapLabel: "Вернуть начальный вид карты",
    resetToGeorgiaLabel: "Вся Грузия",
    sourceAction: "Открыть источник",
    statusColumnLabel: "Статус",
  },
  tr: {
    closeLabel: "Arazi kaydını kapat",
    confirmedStatusLabel: "Yayılış doğrulandı",
    fieldRecordLabel: "arazi kaydı",
    footerDataLabel: "Veri",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "Metodoloji",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "Fotoğrafı aç",
    iNaturalistRecordLabel: "iNaturalist gözlemi",
    intro:
      "Halyomorpha halys haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölge düzeyindeki literatür kanıtı ile tekil arazi kayıtları ayrı katmanlardır; kayıt sayısı gözlem yoğunluğunu da yansıtır, popülasyon yoğunluğu değildir.",
    loadingLabel: "Etkileşimli harita yükleniyor.",
    loadingText: "Yükleniyor...",
    locationRecordLabel: "Arazi gözlemi",
    mapAria:
      "Kahverengi kokarcanın yayılış kanıtları ve arazi kayıtları Gürcistan haritasında",
    mapError:
      "Etkileşimli harita yüklenemedi, ancak doğrulanmış bölgeler ve arazi kayıtları aşağıda metin olarak duruyor.",
    noPhotoLabel: "Bu kayıt için herkese açık fotoğraf yok",
    noRegionRecordsLabel: "Kayıt yok",
    officialRegionLabel: "Kaynakla doğrulanmış bölge",
    photoRecordLabel: "Fotoğraf kaydı",
    rangeTitle: "Kahverengi kokarca Gürcistan'da nerede görülür?",
    recordedOnlyStatusLabel: "Yalnızca kaydedildi",
    regionLoadingLabel: "Bölge kayıtları yükleniyor",
    regionPageLabel: (regionName) => `${regionName} bölge sayfası`,
    regionRecordsLabel: "arazi kaydı",
    regionSelectActionLabel: "Kayıtları göster",
    regionsMetricLabel: "bölge",
    regionSummaryTitle: "Bölgelere göre kayıtlar",
    resetMapLabel: "Haritayı başlangıç görünümüne döndür",
    resetToGeorgiaLabel: "Tüm Gürcistan",
    sourceAction: "Kaynağı aç",
    statusColumnLabel: "Durum",
  },
};

const INTERACTIVE_RANGE_MAPS: Partial<
  Record<string, InteractiveRangeMapConfig>
> = {
  "aegypius-monachus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The cinereous vulture map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
        mapAria:
          "Cinereous vulture distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Region with records",
        rangeTitle: "Where cinereous vulture is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "სვავის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
        mapAria:
          "სვავის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
        rangeTitle: "სად არის სვავი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта чёрного грифа объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
        mapAria:
          "Данные о распространении чёрного грифа и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с записями",
        rangeTitle: "Где чёрный гриф отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Kara akbaba haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
        mapAria:
          "Kara akbabanın Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Kayıt bulunan bölge",
        rangeTitle: "Kara akbaba Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 5382,
    rangeSource: "record-summary",
  },
  "alectoris-chukar": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Chukar map uses public iNaturalist observations from Georgia. Regions come from the records-by-region table: only a confirmed status counts as distribution; other regions have records only. Points outside the map's regional polygons remain in the total but are not assigned to a region. Counts reflect observation effort, not population density.",
        mapAria:
          "Chukar observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where Chukar is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "კაკბის რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოდან. რეგიონები აღებულია ქვემოთ მოცემული ჩანაწერების ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი, სხვა რეგიონში კი სახეობა მხოლოდ დაფიქსირებულია. რეგიონული პოლიგონების გარეთ დარჩენილი წერტილები საერთო რაოდენობაში შედის, მაგრამ რეგიონს არ მიეკუთვნება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობასაც ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
        mapAria:
          "კაკბის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის კაკაბი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта кеклика использует публичные наблюдения iNaturalist из Грузии. Регионы взяты из таблицы записей: распространением считается только регион с подтверждённым статусом, в остальных вид лишь отмечен. Точки вне региональных полигонов включены в общее число, но не отнесены к региону. Число записей также отражает активность наблюдателей, а не плотность популяции.",
        mapAria: "Наблюдения кеклика и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где кеклик отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Kınalı keklik haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Bölgeler kayıt tablosundan alınır: yalnızca durumu doğrulanmış bölgeler yayılış sayılır; diğerlerinde tür sadece kaydedilmiştir. Bölge poligonlarının dışındaki noktalar genel toplama dahildir, ancak bir bölgeye atanmaz. Kayıt sayısı gözlem çabasını da yansıtır, nüfus yoğunluğunu ölçmez.",
        mapAria:
          "Kınalı keklik gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Kınalı keklik Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 846,
    rangeSource: "record-summary",
  },
  "anas-platyrhynchos": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The mallard map combines Reptiles.ge editorial photo records with public iNaturalist observations. Source-confirmed regions and individual field records are separate layers, and record counts reflect observation effort rather than population density.",
        mapAria:
          "Mallard distribution evidence and field records on a map of Georgia",
        rangeTitle: "Where mallard occurs in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "გარეული იხვის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. წყაროებით დადასტურებული რეგიონები და ინდივიდუალური საველე ჩანაწერები ცალკე ფენებია; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
        mapAria:
          "გარეული იხვის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        rangeTitle: "სად გვხვდება გარეული იხვი საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта кряквы объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы, подтверждённые источниками, и отдельные полевые записи показаны разными слоями; количество записей отражает интенсивность наблюдений, а не плотность популяции.",
        mapAria:
          "Данные о распространении кряквы и полевые записи на карте Грузии",
        rangeTitle: "Где встречается кряква в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Yeşilbaş haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Kaynakla doğrulanmış bölgeler ile tekil arazi kayıtları ayrı katmanlardır; kayıt sayısı gözlem yoğunluğunu yansıtır, popülasyon yoğunluğu değildir.",
        mapAria:
          "Yeşilbaşın Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        rangeTitle: "Yeşilbaş Gürcistan'da nerede görülür?",
      },
    },
    iNaturalistTaxonId: 6930,
  },
  "aquila-chrysaetos": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The golden eagle map uses public iNaturalist observations from Georgia. A region counts as confirmed distribution with at least four records in the table; regions with fewer records remain recorded only. Record counts reflect observation effort, not population density or breeding status.",
        mapAria:
          "Golden eagle observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where golden eagle is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "მთის არწივის რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოდან. ცხრილში რეგიონს გავრცელება უდასტურდება მინიმუმ ოთხი ჩანაწერით; ნაკლები ჩანაწერის მქონე რეგიონში სახეობა მხოლოდ დაფიქსირებულია. ჩანაწერების რაოდენობა ასახავს დაკვირვების ინტენსივობას და არა პოპულაციის სიმჭიდროვეს ან ბუდობის სტატუსს.",
        mapAria:
          "მთის არწივის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის მთის არწივი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта беркута использует публичные наблюдения iNaturalist из Грузии. В таблице распространение региона подтверждается минимум четырьмя записями; при меньшем числе вид лишь отмечен. Число записей отражает активность наблюдателей, а не плотность популяции или статус гнездования.",
        mapAria: "Наблюдения беркута и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где беркут отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Kaya kartalı haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Tabloda en az dört kayıt bulunan bölgelerde yayılış doğrulanır; daha az kayıt bulunan bölgelerde tür yalnızca kaydedilmiş sayılır. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu veya üreme durumunu değil.",
        mapAria:
          "Kaya kartalı gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Kaya kartalı Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 5074,
    rangeSource: "record-summary",
  },
  "araneus-diadematus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The European garden spider map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with confirmed status are treated as distribution.",
        mapAria:
          "European garden spider distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Region with records",
        rangeTitle: "Where European garden spider is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ჩვეულებრივი ჯვრიანას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და გავრცელებად ითვლება მხოლოდ ის რეგიონი, სადაც სტატუსი დადასტურებულია.",
        mapAria:
          "ჩვეულებრივი ჯვრიანას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
        rangeTitle: "სად არის ჩვეულებრივი ჯვრიანა დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта обыкновенного крестовика объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы со статусом подтверждения.",
        mapAria:
          "Данные о распространении обыкновенного крестовика и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с записями",
        rangeTitle: "Где обыкновенный крестовик отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Avrupa bahçe örümceği haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış kabul edilir.",
        mapAria:
          "Avrupa bahçe örümceğinin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Kayıt bulunan bölge",
        rangeTitle: "Avrupa bahçe örümceği Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 52628,
    rangeSource: "record-summary",
  },
  "argiope-bruennichi": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The wasp spider map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with confirmed status are treated as distribution.",
        mapAria:
          "Wasp spider distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where wasp spider is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "არგიოპას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და გავრცელებად ითვლება მხოლოდ ის რეგიონი, სადაც სტატუსი დადასტურებულია.",
        mapAria:
          "არგიოპას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის არგიოპას გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта Argiope bruennichi объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы со статусом подтверждения.",
        mapAria:
          "Данные о распространении Argiope bruennichi и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle:
          "Где распространение Argiope bruennichi подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Argiope bruennichi haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış kabul edilir.",
        mapAria:
          "Argiope bruennichi için Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Doğrulanmış yayılış bölgesi",
        rangeTitle: "Argiope bruennichi Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 50867,
    rangeSource: "record-summary",
  },
  "blatta-orientalis": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Oriental cockroach map combines public iNaturalist observations from Georgia with georeferenced Reptiles.ge gallery photos. Regions come from the records-by-region table; only regions whose status is confirmed are treated as distribution, while others remain recorded-only.",
        mapAria:
          "Oriental cockroach distribution evidence and iNaturalist field records on a map of Georgia",
        officialRegionLabel: "Region with records",
        rangeTitle: "Where the Oriental cockroach is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "შავი ტარაკანის რუკა აერთიანებს საქართველოს iNaturalist-ის საჯარო დაკვირვებებსა და Reptiles.ge-ის გალერეის კოორდინატიან ფოტოებს. რეგიონები აღებულია ჩანაწერების ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი; დანარჩენებში სახეობა მხოლოდ დაფიქსირებულად რჩება.",
        mapAria:
          "შავი ტარაკანის გავრცელების მტკიცებულებები და iNaturalist-ის საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
        rangeTitle: "სად არის შავი ტარაკანა დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта чёрного таракана объединяет публичные наблюдения iNaturalist из Грузии и геопривязанные фотографии из галереи Reptiles.ge. Регионы взяты из таблицы записей: распространением считаются только регионы со статусом подтверждения, в остальных вид остаётся лишь зарегистрированным.",
        mapAria:
          "Данные о распространении чёрного таракана и полевые записи iNaturalist на карте Грузии",
        officialRegionLabel: "Регион с записями",
        rangeTitle: "Где чёрный таракан отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Doğu hamam böceği haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini ve Reptiles.ge galerisindeki konumlu fotoğrafları birleştirir. Bölgeler kayıt tablosundan alınır; yalnızca durumu doğrulanmış bölgeler yayılış sayılır, diğerleri yalnızca kaydedilmiş kabul edilir.",
        mapAria:
          "Doğu hamam böceğinin yayılış kanıtları ve iNaturalist arazi kayıtları Gürcistan haritasında",
        officialRegionLabel: "Kayıt bulunan bölge",
        rangeTitle: "Doğu hamam böceği Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 154213,
    rangeSource: "record-summary",
  },
  "capreolus-capreolus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The European roe deer map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
        mapAria:
          "European roe deer distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Region with records",
        rangeTitle: "Where European roe deer is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ევროპული შვლის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
        mapAria:
          "ევროპული შვლის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
        rangeTitle: "სად არის ევროპული შველი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта европейской косули объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
        mapAria:
          "Данные о распространении европейской косули и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с записями",
        rangeTitle: "Где европейская косуля отмечена в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Avrupa karacası haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
        mapAria:
          "Avrupa karacasının Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Kayıt bulunan bölge",
        rangeTitle: "Avrupa karacası Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 42184,
    rangeSource: "record-summary",
  },
  "cheiracanthium-punctorium": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The European yellow sac spider map combines Reptiles.ge source records with public iNaturalist observations. Regions are taken from the records-by-region table; for this species, a region with at least one record is treated as confirmed distribution.",
        mapAria:
          "European yellow sac spider distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where European yellow sac spider is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "Cheiracanthium punctorium-ის რუკა აერთიანებს Reptiles.ge-ის წყაროებზე დაყრდნობილ ჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან; ამ სახეობაზე ერთი ჩანაწერიც საკმარისია, რომ რეგიონი დადასტურებულ გავრცელებად ჩაითვალოს.",
        mapAria:
          "Cheiracanthium punctorium-ის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის Cheiracanthium punctorium დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта Cheiracanthium punctorium объединяет записи из источников Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; для этого вида одного наблюдения достаточно, чтобы регион считался подтверждённым распространением.",
        mapAria:
          "Данные о распространении Cheiracanthium punctorium и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где Cheiracanthium punctorium отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Cheiracanthium punctorium haritası Reptiles.ge kaynak kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; bu tür için en az bir kayıt bulunan bölge doğrulanmış yayılış kabul edilir.",
        mapAria:
          "Cheiracanthium punctorium için Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Doğrulanmış yayılış bölgesi",
        rangeTitle: "Cheiracanthium punctorium Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 61866,
    rangeSource: "record-summary",
  },
  "coronella-austriaca": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The smooth snake map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with confirmed status are treated as distribution.",
        mapAria:
          "Smooth snake distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where smooth snake distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "სპილენძას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და გავრცელებად ითვლება მხოლოდ ის რეგიონი, სადაც სტატუსი დადასტურებულია.",
        mapAria:
          "სპილენძას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის სპილენძას გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта медянки объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы со статусом подтверждения.",
        mapAria:
          "Данные о распространении медянки и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где распространение медянки подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Avusturya yılanı haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış kabul edilir.",
        mapAria:
          "Avusturya yılanının Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Doğrulanmış yayılış bölgesi",
        rangeTitle:
          "Avusturya yılanının yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 26904,
    rangeSource: "record-summary",
  },
  "dolichophis-schmidti": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The red-bellied racer map combines Reptiles.ge editorial photo records, hand-curated localities, and public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with confirmed status are treated as distribution.",
        mapAria:
          "Red-bellied racer distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where red-bellied racer is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "წითელმუცელა მცურავის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებს, ხელით დამუშავებულ ლოკალიტეტებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და გავრცელებად ითვლება მხოლოდ ის რეგიონი, სადაც სტატუსი დადასტურებულია.",
        mapAria:
          "წითელმუცელა მცურავის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის წითელმუცელა მცურავის გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта краснобрюхого полоза объединяет редакционные фотозаписи Reptiles.ge, вручную обработанные локалитеты и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы со статусом подтверждения.",
        mapAria:
          "Данные о распространении краснобрюхого полоза и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где краснобрюхий полоз подтверждён в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Kırmızı karınlı yılan haritası Reptiles.ge editoryal fotoğraf kayıtlarını, elle düzenlenmiş lokaliteleri ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış kabul edilir.",
        mapAria:
          "Kırmızı karınlı yılanın Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Doğrulanmış yayılış bölgesi",
        rangeTitle: "Kırmızı karınlı yılan Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 73760,
    rangeSource: "record-summary",
  },
  "euscorpius-italicus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Italian scorpion map combines Reptiles.ge editorial photo records, Georgian Biodiversity Database localities, and public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
        mapAria:
          "Italian scorpion distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Region with records",
        rangeTitle: "Where Italian scorpion is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "იტალიური მორიელის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებს, Georgian Biodiversity Database-ის ლოკალიტეტებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
        mapAria:
          "იტალიური მორიელის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
        rangeTitle: "სად არის იტალიური მორიელი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта итальянского скорпиона объединяет редакционные фотозаписи Reptiles.ge, локалитеты Georgian Biodiversity Database и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
        mapAria:
          "Данные о распространении итальянского скорпиона и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с записями",
        rangeTitle: "Где итальянский скорпион отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "İtalyan akrebi haritası Reptiles.ge editoryal fotoğraf kayıtlarını, Georgian Biodiversity Database lokalitelerini ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
        mapAria:
          "İtalyan akrebinin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Kayıt bulunan bölge",
        rangeTitle: "İtalyan akrebi Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 56528,
    rangeSource: "record-summary",
  },
  "euscorpius-mingrelicus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Mingrelian scorpion map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
        mapAria:
          "Mingrelian scorpion distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Region with records",
        rangeTitle: "Where Mingrelian scorpion is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "მეგრული მორიელის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
        mapAria:
          "მეგრული მორიელის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
        rangeTitle: "სად არის მეგრული მორიელი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта мингрельского скорпиона объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
        mapAria:
          "Данные о распространении мингрельского скорпиона и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с записями",
        rangeTitle: "Где мингрельский скорпион отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Karadeniz akrebi haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
        mapAria:
          "Karadeniz akrebinin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Kayıt bulunan bölge",
        rangeTitle: "Karadeniz akrebi Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 1654809,
    rangeSource: "record-summary",
  },
  "falco-peregrinus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The peregrine falcon map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution; other regions remain recorded only. These observations do not establish breeding, and record counts reflect observation effort rather than population density.",
        mapAria:
          "Peregrine falcon observations and confirmed distribution regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle:
          "Where peregrine falcon distribution is confirmed in Georgia",
        regionsMetricLabel: "regions with records",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "შავარდნის რუკა იყენებს საქართველოში iNaturalist-ის საჯარო ფოტოდაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი; დანარჩენში სახეობა მხოლოდ დაფიქსირებულია. ეს ჩანაწერები ბუდობას არ ადასტურებს, მათი რაოდენობა კი დაკვირვების ინტენსივობასაც ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "შავარდნის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის შავარდნის გავრცელება დადასტურებული საქართველოში",
        regionsMetricLabel: "რეგიონი ჩანაწერით",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта сапсана использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считаются только регионы со статусом «подтверждено»; остальные остаются лишь местами регистрации. Эти наблюдения не доказывают гнездование, а число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Наблюдения сапсана и регионы с подтверждённым распространением на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где распространение сапсана подтверждено в Грузии",
        regionsMetricLabel: "регионов с записями",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Gökdoğan haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; diğer bölgelerde tür sadece kaydedilmiştir. Bu gözlemler üremeyi kanıtlamaz; kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını da yansıtır.",
        mapAria:
          "Gökdoğan gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Gökdoğanın Gürcistan'da yayılışı nerede doğrulandı?",
        regionsMetricLabel: "kayıt bulunan bölge",
      },
    },
    iNaturalistTaxonId: 4647,
    rangeSource: "record-summary",
  },
  "falco-tinnunculus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The common kestrel map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
        mapAria:
          "Common kestrel distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Region with records",
        rangeTitle: "Where common kestrel is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "კირკიტას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
        mapAria:
          "კირკიტას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
        rangeTitle: "სად არის კირკიტა დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта обыкновенной пустельги объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
        mapAria:
          "Данные о распространении обыкновенной пустельги и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с записями",
        rangeTitle: "Где обыкновенная пустельга отмечена в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Kerkenez haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
        mapAria:
          "Kerkenezin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Kayıt bulunan bölge",
        rangeTitle: "Kerkenez Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 472766,
    rangeSource: "record-summary",
  },
  "halyomorpha-halys": {
    copy: HALYOMORPHA_RANGE_COPY,
    iNaturalistTaxonId: 81923,
  },
  "lutra-lutra": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Eurasian otter map combines source-derived field localities curated by Reptiles.ge with public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
        mapAria:
          "Eurasian otter distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Region with records",
        rangeTitle: "Where Eurasian otter is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "წავის რუკა აერთიანებს Reptiles.ge-ის მიერ წყაროებიდან დამუშავებულ საველე ლოკალიტეტებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
        mapAria:
          "წავის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
        rangeTitle: "სად არის წავი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта выдры объединяет полевые локалитеты, обработанные Reptiles.ge из источников, и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
        mapAria:
          "Данные о распространении выдры и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с записями",
        rangeTitle: "Где выдра отмечена в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Su samuru haritası Reptiles.ge tarafından kaynaklardan işlenen arazi lokalitelerini ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
        mapAria:
          "Su samurunun Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Kayıt bulunan bölge",
        rangeTitle: "Su samuru Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 41850,
    rangeSource: "record-summary",
  },
  "macrovipera-lebetina": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Levantine viper map combines Reptiles.ge editorial photo records with public iNaturalist observations. Source-confirmed regions and individual field records are separate layers, and record counts reflect observation effort rather than population density.",
        mapAria:
          "Levantine viper distribution evidence and field records on a map of Georgia",
        rangeTitle: "Where Levantine viper occurs in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "გიურზას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. წყაროებით დადასტურებული რეგიონები და ინდივიდუალური საველე ჩანაწერები ცალკე ფენებია; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
        mapAria:
          "გიურზას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        rangeTitle: "სად გვხვდება გიურზა საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта гюрзы объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы, подтверждённые источниками, и отдельные полевые записи показаны разными слоями; количество записей отражает интенсивность наблюдений, а не плотность популяции.",
        mapAria:
          "Данные о распространении гюрзы и полевые записи на карте Грузии",
        rangeTitle: "Где встречается гюрза в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Koca engerek haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Kaynakla doğrulanmış bölgeler ile tekil arazi kayıtları ayrı katmanlardır; kayıt sayısı gözlem yoğunluğunu yansıtır, popülasyon yoğunluğu değildir.",
        mapAria:
          "Koca engereğin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        rangeTitle: "Koca engerek Gürcistan'da nerede görülür?",
      },
    },
    iNaturalistTaxonId: 105083,
  },
  "mantis-religiosa": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The European mantis map combines Reptiles.ge editorial photo records with public iNaturalist observations. Individual field records are shown as point data, and record counts reflect observation effort rather than population density.",
        mapAria: "European mantis field records on a map of Georgia",
        rangeTitle: "Where European mantis is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ჩოქელას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. ინდივიდუალური საველე ჩანაწერები წერტილებადაა ნაჩვენები; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
        mapAria: "ჩოქელას საველე ჩანაწერები საქართველოს რუკაზე",
        rangeTitle: "სად არის ჩოქელა დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта богомола объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Отдельные полевые записи показаны точками; количество записей отражает интенсивность наблюдений, а не плотность популяции.",
        mapAria: "Полевые записи богомола на карте Грузии",
        rangeTitle: "Где богомол отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Peygamberdevesi haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Tekil arazi kayıtları nokta verisi olarak gösterilir; kayıt sayısı gözlem yoğunluğunu yansıtır, popülasyon yoğunluğu değildir.",
        mapAria: "Peygamberdevesi arazi kayıtları Gürcistan haritasında",
        rangeTitle: "Peygamberdevesi Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 53905,
  },
  "mesobuthus-eupeus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The mottled scorpion map combines Reptiles.ge editorial photo records with public iNaturalist observations. Source-confirmed regions and individual field records are separate layers, and record counts reflect observation effort rather than population density.",
        mapAria:
          "Mottled scorpion distribution evidence and field records on a map of Georgia",
        rangeTitle: "Where mottled scorpion is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ჭრელი მორიელის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. წყაროებით დადასტურებული რეგიონები და ინდივიდუალური საველე ჩანაწერები ცალკე ფენებია; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
        mapAria:
          "ჭრელი მორიელის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        rangeTitle: "სად არის ჭრელი მორიელი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта пёстрого скорпиона объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы, подтверждённые источниками, и отдельные полевые записи показаны разными слоями; количество записей отражает интенсивность наблюдений, а не плотность популяции.",
        mapAria:
          "Данные о распространении пёстрого скорпиона и полевые записи на карте Грузии",
        rangeTitle: "Где пёстрый скорпион отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Alacalı akrep haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Kaynakla doğrulanmış bölgeler ile tekil arazi kayıtları ayrı katmanlardır; kayıt sayısı gözlem yoğunluğunu yansıtır, popülasyon yoğunluğu değildir.",
        mapAria:
          "Alacalı akrebin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        rangeTitle: "Alacalı akrep Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 709915,
  },
  "natrix-natrix": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The grass snake map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table; for this species, a region with at least one record is treated as confirmed distribution.",
        mapAria:
          "Grass snake distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where grass snake distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ჩვეულებრივი ანკარის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან; ამ სახეობაზე ერთი ჩანაწერიც საკმარისია, რომ რეგიონი დადასტურებულ გავრცელებად ჩაითვალოს.",
        mapAria:
          "ჩვეულებრივი ანკარის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის ჩვეულებრივი ანკარის გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта обыкновенного ужа объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; для этого вида одного наблюдения достаточно, чтобы регион считался подтверждённым распространением.",
        mapAria:
          "Данные о распространении обыкновенного ужа и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle:
          "Где распространение обыкновенного ужа подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Çim yılanı haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; bu tür için en az bir kayıt bulunan bölge doğrulanmış yayılış kabul edilir.",
        mapAria:
          "Çim yılanının Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Doğrulanmış yayılış bölgesi",
        rangeTitle: "Çim yılanının yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 966787,
    rangeSource: "record-summary",
  },
  "natrix-tessellata": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The dice snake map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with confirmed status are treated as distribution.",
        mapAria:
          "Dice snake distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where dice snake distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "წყლის ანკარის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და გავრცელებად ითვლება მხოლოდ ის რეგიონი, სადაც სტატუსი დადასტურებულია.",
        mapAria:
          "წყლის ანკარის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის წყლის ანკარის გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта водяного ужа объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы со статусом подтверждения.",
        mapAria:
          "Данные о распространении водяного ужа и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где распространение водяного ужа подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Kareli yılan haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış kabul edilir.",
        mapAria:
          "Kareli yılanın Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Doğrulanmış yayılış bölgesi",
        rangeTitle: "Kareli yılanın yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 64346,
    rangeSource: "record-summary",
  },
  "phasianus-colchicus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The common pheasant map uses public iNaturalist observations from Georgia that are not marked captive. Regions come from the records-by-region table; only confirmed status counts as distribution. Record counts reflect observation effort, not population density.",
        mapAria:
          "Common pheasant observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Region with confirmed distribution",
        rangeTitle: "Where common pheasant is recorded in Georgia",
        regionsMetricLabel: "regions with records",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ხოხბის რუკა იყენებს საქართველოში iNaturalist-ის საჯარო დაკვირვებებს, რომლებიც ტყვეობაში მყოფად არ არის მონიშნული. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან; გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი. ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ნიშნავს.",
        mapAria:
          "ხოხბის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის ხოხობი დაფიქსირებული საქართველოში",
        regionsMetricLabel: "რეგიონი ჩანაწერებით",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта фазана использует публичные наблюдения из Грузии на iNaturalist, не отмеченные как содержащиеся в неволе. Регионы взяты из таблицы записей; распространением считаются только регионы с подтверждённым статусом. Число записей не означает плотность популяции.",
        mapAria: "Наблюдения фазана и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где фазан отмечен в Грузии",
        regionsMetricLabel: "регионы с записями",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Sülün haritası Gürcistan'daki esir olarak işaretlenmemiş halka açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgesel kayıt tablosundan alınır; yalnızca durumu doğrulanmış bölgeler yayılış sayılır. Kayıt sayısı nüfus yoğunluğunu göstermez.",
        mapAria:
          "Sülün gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Sülün Gürcistan'da nerede kaydedildi?",
        regionsMetricLabel: "kayıt bulunan bölge",
      },
    },
    iNaturalistTaxonId: 981,
    rangeSource: "record-summary",
  },
  "platyceps-najadum": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Dahl's whip snake map combines Reptiles.ge field photos with public iNaturalist observations. The records-by-region table determines the shaded range: three or more field records confirm regional distribution; one or two remain recorded-only. Record counts do not measure population density.",
        mapAria:
          "Dahl's whip snake observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Region with confirmed distribution",
        rangeTitle: "Where Dahl's whip snake is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "წენგოსფერი მცურავის რუკა აერთიანებს Reptiles.ge-ის საველე ფოტოებსა და iNaturalist-ის საჯარო დაკვირვებებს. შეფერილი გავრცელება რეგიონული ცხრილის სტატუსს ეფუძნება: სულ მცირე 3 საველე ჩანაწერი რეგიონს დადასტურებულ სტატუსს ანიჭებს; 1–2 ჩანაწერი მხოლოდ დაფიქსირებულად ითვლება. ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვე არ არის.",
        mapAria:
          "წენგოსფერი მცურავის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის წენგოსფერი მცურავი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта оливкового полоза объединяет полевые фотографии Reptiles.ge и публичные наблюдения iNaturalist. Закрашенный ареал определяется региональной таблицей: три и более полевых записи подтверждают распространение в регионе; одна или две означают лишь наличие записей. Число записей не отражает плотность популяции.",
        mapAria:
          "Наблюдения оливкового полоза и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где оливковый полоз отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Dahl kırbaç yılanı haritası Reptiles.ge arazi fotoğraflarını ve herkese açık iNaturalist gözlemlerini birleştirir. Boyalı yayılış bölgesel tabloya dayanır: üç veya daha fazla arazi kaydı bölgesel yayılışı doğrular; bir veya iki kayıt yalnızca kaydedilmiş sayılır. Kayıt sayısı popülasyon yoğunluğunu göstermez.",
        mapAria:
          "Dahl kırbaç yılanı gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Dahl kırbaç yılanı Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 73910,
    rangeSource: "record-summary",
  },
  "steatoda-paykulliana": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The false black widow map uses public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with confirmed status are treated as distribution.",
        mapAria:
          "False black widow distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Region with records",
        rangeTitle: "Where false black widow is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ცრუ ყარაყურთის რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და გავრცელებად ითვლება მხოლოდ ის რეგიონი, სადაც სტატუსი დადასტურებულია.",
        mapAria:
          "ცრუ ყარაყურთის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
        rangeTitle: "სად არის ცრუ ყარაყურთი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта ложного каракурта использует публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы со статусом подтверждения.",
        mapAria:
          "Данные о распространении ложного каракурта и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с записями",
        rangeTitle: "Где ложный каракурт отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Yalancı karakurt haritası herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış kabul edilir.",
        mapAria:
          "Yalancı karakurtun Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Kayıt bulunan bölge",
        rangeTitle: "Yalancı karakurt Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 343356,
    rangeSource: "record-summary",
  },
  "telescopus-fallax": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The European cat snake map combines Reptiles.ge editorial photo records, hand-curated localities, and public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
        mapAria:
          "European cat snake distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Region with records",
        rangeTitle: "Where European cat snake is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "კატისთვალას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებს, ხელით შერჩეულ ლოკალიტეტებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
        mapAria:
          "კატისთვალას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
        rangeTitle: "სად არის კატისთვალა დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта европейского кошачьего ужа объединяет редакционные фотозаписи Reptiles.ge, вручную отобранные локалитеты и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
        mapAria:
          "Данные о распространении европейского кошачьего ужа и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с записями",
        rangeTitle: "Где европейский кошачий уж отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Avrupa kedi yılanı haritası Reptiles.ge editoryal fotoğraf kayıtlarını, elle seçilmiş lokaliteleri ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
        mapAria:
          "Avrupa kedi yılanının Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Kayıt bulunan bölge",
        rangeTitle: "Avrupa kedi yılanı Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 64078,
    rangeSource: "record-summary",
  },
  "vipera-darevskii": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Darevsky's viper map uses public iNaturalist observations. Regions are taken from the records-by-region table; only regions with confirmed status count as distribution, while recorded-only regions do not.",
        mapAria:
          "Darevsky's viper observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle:
          "Where Darevsky's viper distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "დარევსკის გველგესლას რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან; გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი, ხოლო მხოლოდ დაფიქსირებული რეგიონები გავრცელებად არ ითვლება.",
        mapAria:
          "დარევსკის გველგესლას დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის დარევსკის გველგესლას გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта гадюки Даревского использует публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы с подтверждённым статусом, а регионы только с находками не считаются распространением.",
        mapAria:
          "Наблюдения гадюки Даревского и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle:
          "Где распространение гадюки Даревского подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Darevsky engereği haritası herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış sayılır, yalnızca kayıt bulunan bölgeler sayılmaz.",
        mapAria:
          "Darevsky engereğinin gözlemleri ve doğrulanmış bölgeleri Gürcistan haritasında",
        officialRegionLabel: "Doğrulanmış yayılış bölgesi",
        rangeTitle:
          "Darevsky engereğinin yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 73995,
    rangeSource: "record-summary",
  },
  "vipera-dinniki": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Dinnik's viper map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and only confirmed status counts as distribution; record counts do not measure population density.",
        mapAria:
          "Dinnik's viper distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where Dinnik's viper is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "დინიკის გველგესლას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი; ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
        mapAria:
          "დინიკის გველგესლას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის დინიკის გველგესლა დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта гадюки Динника объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы с подтверждённым статусом, а число записей не измеряет плотность популяции.",
        mapAria:
          "Данные о распространении гадюки Динника и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где гадюка Динника отмечена в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Dinnik engereği haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış sayılır ve kayıt sayısı popülasyon yoğunluğunu ölçmez.",
        mapAria:
          "Dinnik engereğinin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Dinnik engereği Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 73996,
    rangeSource: "record-summary",
  },
  "vipera-kaznakovi": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Caucasus viper map combines Reptiles.ge editorial photo records, hand-curated localities, and public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
        mapAria:
          "Caucasus viper distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Region with records",
        rangeTitle: "Where Caucasus viper is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "კავკასიური გველგესლის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებს, ხელით შერჩეულ ლოკალიტეტებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
        mapAria:
          "კავკასიური გველგესლის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
        rangeTitle: "სად არის კავკასიური გველგესლა დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта кавказской гадюки объединяет редакционные фотозаписи Reptiles.ge, вручную отобранные локалитеты и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
        mapAria:
          "Данные о распространении кавказской гадюки и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с записями",
        rangeTitle: "Где кавказская гадюка отмечена в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Kafkas engereği haritası Reptiles.ge editoryal fotoğraf kayıtlarını, elle seçilmiş lokaliteleri ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
        mapAria:
          "Kafkas engereğinin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Kayıt bulunan bölge",
        rangeTitle: "Kafkas engereği Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 73999,
    rangeSource: "record-summary",
  },
  "vipera-transcaucasiana": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The nose-horned viper map uses public iNaturalist observations filed as Vipera meridionalis transcaucasiana. Only regions marked confirmed in the records table count as distribution. Public coordinates are obscured, so points near regional borders are approximate; record counts do not measure population density.",
        mapAria:
          "Nose-horned viper observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where the nose-horned viper is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ცხვირრქოსანი გველგესლას რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს, რომლებიც Vipera meridionalis transcaucasiana-ს სახელითაა შეტანილი. გავრცელებად ითვლება მხოლოდ ცხრილში დადასტურებული სტატუსის მქონე რეგიონი. საჯარო კოორდინატები დაფარულია, ამიტომ რეგიონების საზღვართან წერტილები მიახლოებითია; ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
        mapAria:
          "ცხვირრქოსანი გველგესლას დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის ცხვირრქოსანი გველგესლა დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта носатой гадюки использует публичные наблюдения iNaturalist под названием Vipera meridionalis transcaucasiana. Распространением считаются только регионы со статусом подтверждения в таблице. Публичные координаты скрыты, поэтому точки у границ регионов приблизительны; число записей не измеряет плотность популяции.",
        mapAria:
          "Наблюдения носатой гадюки и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где носатая гадюка отмечена в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Boynuzlu engerek haritası, iNaturalist'te Vipera meridionalis transcaucasiana adıyla kayıtlı halka açık gözlemleri kullanır. Yalnızca tablodaki durumu doğrulanmış bölgeler yayılış sayılır. Halka açık koordinatlar gizlendiğinden bölge sınırlarına yakın noktalar yaklaşıktır; kayıt sayısı popülasyon yoğunluğunu ölçmez.",
        mapAria:
          "Boynuzlu engerek gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Boynuzlu engerek Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 1701183,
    rangeSource: "record-summary",
  },
};

export async function SpeciesRangeMap({
  fieldRecords = [],
  gallery = [],
  speciesId,
  speciesName,
}: SpeciesRangeMapProps) {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("profile");
  const rangeRegions = getRegionsForSpecies(speciesId);
  const highlightedIds = rangeRegions.map((region) => region.id);
  const interactiveRangeConfig = INTERACTIVE_RANGE_MAPS[speciesId];
  const interactiveRangeCopy = interactiveRangeConfig?.copy[locale];
  const allInteractiveRangeFieldRecords = interactiveRangeCopy
    ? getHalyomorphaFieldRecords({
        fieldRecords,
        gallery,
        locale,
        speciesName,
      })
    : [];
  const interactiveRangeSummary = interactiveRangeCopy
    ? getHalyomorphaOccurrenceSummary(
        allInteractiveRangeFieldRecords,
        locale,
        confirmedRecordThresholdForSpecies(speciesId),
      )
    : null;

  if (
    interactiveRangeConfig &&
    interactiveRangeCopy &&
    interactiveRangeSummary
  ) {
    return (
      <HalyomorphaRangeSection
        anchorLabel={t("anchorLink")}
        copy={interactiveRangeCopy}
        iNaturalistTaxonId={interactiveRangeConfig.iNaturalistTaxonId}
        locale={locale}
        occurrenceSummary={interactiveRangeSummary}
        officialRegionIds={
          interactiveRangeConfig.rangeSource === "record-summary"
            ? interactiveRangeSummary.recordsByRegion.reduce<string[]>(
                (ids, region) => {
                  if (region.status === "confirmed") ids.push(region.id);
                  return ids;
                },
                [],
              )
            : highlightedIds
        }
        speciesId={speciesId}
      />
    );
  }

  if (highlightedIds.length === 0) return null;

  return (
    <section className="map-explorer relative overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="map-explorer-texture pointer-events-none absolute inset-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {t("range")}
          </p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className="text-balance-tight mt-5 font-display text-display-title font-semibold text-foreground"
            id={SPECIES_SECTION_IDS.range}
            slugSource={t("rangeTitle", { name: speciesName })}
          >
            {t("rangeTitle", { name: speciesName })}
          </AnchoredHeading>
          <p className="text-balance-tight mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            {t("rangeSubtitle")}
          </p>
        </div>

        <div className="mt-14 lg:mt-16">
          <GeorgiaMapStatic highlightedIds={highlightedIds} />
        </div>

        <nav
          aria-label={t("rangeRegionsLabel")}
          className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-1 gap-y-2"
        >
          {rangeRegions.map((region, index) => (
            <span className="inline-flex items-center" key={region.id}>
              {index > 0 ? (
                <span aria-hidden className="mr-1 text-muted-foreground/50">
                  ·
                </span>
              ) : null}
              <Link
                className="text-[13px] leading-relaxed tracking-wide text-muted-foreground transition-colors hover:text-primary"
                href={regionHref(region.id)}
              >
                {localizeRegionText(region.name, locale)}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}

function formatYearRange(summary: HalyomorphaOccurrenceSummary) {
  if (!summary.firstYear || !summary.lastYear) return "—";
  if (summary.firstYear === summary.lastYear) return String(summary.firstYear);
  return `${summary.firstYear}–${summary.lastYear}`;
}

function HalyomorphaRangeSection({
  anchorLabel,
  copy,
  iNaturalistTaxonId,
  locale,
  occurrenceSummary,
  officialRegionIds,
  speciesId,
}: {
  anchorLabel: string;
  copy: HalyomorphaRangeCopy;
  iNaturalistTaxonId: number;
  locale: AppLocale;
  occurrenceSummary: HalyomorphaOccurrenceSummary;
  officialRegionIds: string[];
  speciesId: string;
}) {
  const mapCopy = {
    closeLabel: copy.closeLabel,
    confirmedStatusLabel: copy.confirmedStatusLabel,
    fieldRecordLabel: copy.fieldRecordLabel,
    galleryAction: copy.galleryAction,
    iNaturalistRecordLabel: copy.iNaturalistRecordLabel,
    loadingLabel: copy.loadingLabel,
    loadingText: copy.loadingText,
    locationRecordLabel: copy.locationRecordLabel,
    mapAria: copy.mapAria,
    mapError: copy.mapError,
    noPhotoLabel: copy.noPhotoLabel,
    noRegionRecordsLabel: copy.noRegionRecordsLabel,
    officialRegionLabel: copy.officialRegionLabel,
    photoRecordLabel: copy.photoRecordLabel,
    recordedOnlyStatusLabel: copy.recordedOnlyStatusLabel,
    regionLoadingLabel: copy.regionLoadingLabel,
    regionRecordsLabel: copy.regionRecordsLabel,
    regionSelectActionLabel: copy.regionSelectActionLabel,
    resetMapLabel: copy.resetMapLabel,
    resetToGeorgiaLabel: copy.resetToGeorgiaLabel,
    sourceAction: copy.sourceAction,
    statusColumnLabel: copy.statusColumnLabel,
  };
  const metricLine = [
    `${occurrenceSummary.totalRecords.toLocaleString(locale)} ${copy.regionRecordsLabel}`,
    formatYearRange(occurrenceSummary),
    `${occurrenceSummary.regionsWithRecords.toLocaleString(locale)} ${copy.regionsMetricLabel}`,
  ].join(" · ");
  return (
    <section className="map-explorer relative overflow-hidden py-16 lg:py-22">
      <div
        aria-hidden="true"
        className="map-explorer-texture pointer-events-none absolute inset-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <AnchoredHeading
            anchorLabel={anchorLabel}
            className="mt-5 font-display text-display-title font-bold text-foreground"
            id={SPECIES_SECTION_IDS.range}
            slugSource={copy.rangeTitle}
          >
            {copy.rangeTitle}
          </AnchoredHeading>
          <p className="mt-3 text-[13px] font-semibold tracking-[0.08em] text-primary uppercase">
            {metricLine}
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            {copy.intro}
          </p>
        </div>

        <div className="mt-10 lg:mt-12">
          <HalyomorphaRangeMap
            copy={mapCopy}
            locale={locale}
            officialRegionIds={officialRegionIds}
            speciesId={speciesId}
          />
        </div>

        <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
          {copy.footerDataLabel}: {copy.footerReptilesLabel} +{" "}
          <a
            className="underline decoration-border underline-offset-4 transition-colors hover:text-primary"
            href={`https://www.inaturalist.org/observations?place_id=8857&taxon_id=${iNaturalistTaxonId}`}
            rel="noreferrer"
            target="_blank"
          >
            {copy.footerINaturalistLabel}
          </a>{" "}
          ·{" "}
          <Link
            className="underline decoration-border underline-offset-4 transition-colors hover:text-primary"
            href={{ hash: "methodology", pathname: "/about" }}
          >
            {copy.footerMethodologyLabel}
          </Link>
        </p>

        {occurrenceSummary.totalRecords > 0 ? (
          <section className="mt-10">
            <h3 className="font-display text-[1.35rem] leading-tight font-semibold text-foreground">
              {copy.regionSummaryTitle}
            </h3>
            <div className="mt-4 overflow-hidden border-y border-border/80">
              <table className="w-full text-[14px]">
                <thead className="border-b border-border/60 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 pr-3 text-left font-semibold">
                      {copy.regionsMetricLabel}
                    </th>
                    <th className="w-19 px-3 py-2.5 text-right font-semibold">
                      {copy.regionRecordsLabel}
                    </th>
                    <th className="py-2.5 pl-3 text-right font-semibold">
                      {copy.statusColumnLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {occurrenceSummary.recordsByRegion.map((region) => (
                    <tr
                      className="border-b border-border/60 last:border-0"
                      key={region.id}
                    >
                      <th className="py-3 pr-3 text-left font-medium text-foreground">
                        <span className="flex items-center gap-2">
                          <HalyomorphaRegionSelectButton regionId={region.id}>
                            {region.name}
                          </HalyomorphaRegionSelectButton>
                          <Link
                            aria-label={copy.regionPageLabel(region.name)}
                            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-border/70 text-[12px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            href={regionHref(region.id)}
                            title={copy.regionPageLabel(region.name)}
                          >
                            <ArrowUpRight
                              aria-hidden="true"
                              className="size-3 shrink-0"
                            />
                          </Link>
                        </span>
                      </th>
                      <td className="p-3 text-right text-muted-foreground tabular-nums">
                        {region.count.toLocaleString(locale)}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <RegionStatusBadge copy={copy} status={region.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

function RegionStatusBadge({
  copy,
  status,
}: {
  copy: HalyomorphaRangeCopy;
  status: HalyomorphaOccurrenceSummary["recordsByRegion"][number]["status"];
}) {
  const confirmed = status === "confirmed";

  return (
    <span
      className={[
        "inline-flex max-w-[9.75rem] items-center justify-center rounded-full px-2.5 py-1 text-center text-[11px] leading-tight font-semibold sm:max-w-none",
        confirmed
          ? "bg-primary/10 text-primary"
          : "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100",
      ].join(" ")}
    >
      {regionStatusLabel(status, copy)}
    </span>
  );
}

function regionStatusLabel(
  status: HalyomorphaOccurrenceSummary["recordsByRegion"][number]["status"],
  copy: HalyomorphaRangeCopy,
) {
  return status === "confirmed"
    ? copy.confirmedStatusLabel
    : copy.recordedOnlyStatusLabel;
}
