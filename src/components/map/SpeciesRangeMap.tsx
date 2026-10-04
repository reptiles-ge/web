import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import type { HalyomorphaOccurrenceSummary } from "@/lib/halyomorphaOccurrences";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { GeorgiaMapStatic } from "@/components/map/GeorgiaMapStatic";
import { HalyomorphaRangeMap } from "@/components/map/HalyomorphaRangeMap";
import { HalyomorphaRegionSelectButton } from "@/components/map/HalyomorphaRegionSelectButton";
import {
  getRegionsForSpecies,
  localizeRegionText,
  regions,
} from "@/data/mapRegions";
import { Link } from "@/i18n/navigation";
import { getOccurrenceSummary } from "@/lib/occurrenceSummaries";
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
  locale: AppLocale;
  speciesId: string;
  speciesName: string;
  updatedAt: string;
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
  "accipiter-nisus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Eurasian sparrowhawk map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution; otherwise a region is not treated as part of the range. Record counts reflect observation effort, not population density.",
        mapAria:
          "Eurasian sparrowhawk observations and confirmed distribution regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle:
          "Where Eurasian sparrowhawk distribution is confirmed in Georgia",
        regionsMetricLabel: "regions with records",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "მიმინოს რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "მიმინოს დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის მიმინოს გავრცელება დადასტურებული საქართველოში",
        regionsMetricLabel: "რეგიონი ჩანაწერით",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта ястреба-перепелятника использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус; в остальных случаях регион распространением не считается. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Наблюдения ястреба-перепелятника и регионы с подтверждённым распространением на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle:
          "Где распространение ястреба-перепелятника подтверждено в Грузии",
        regionsMetricLabel: "регионов с записями",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Atmaca haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; aksi halde bölge yayılış sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
        mapAria:
          "Atmaca gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Atmacanın Gürcistan'da yayılışı nerede doğrulandı?",
        regionsMetricLabel: "kayıt bulunan bölge",
      },
    },
    iNaturalistTaxonId: 5106,
    rangeSource: "record-summary",
  },
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
  "canis-aureus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The golden jackal map uses reviewed public iNaturalist photo observations from Georgia. Only regions marked confirmed in the records-by-region table are shaded as distribution; other points are individual records. Record counts reflect observation effort, not population density.",
        mapAria:
          "Golden jackal field records and confirmed distribution on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where golden jackal is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ტურას რუკა იყენებს საქართველოში გადამოწმებულ iNaturalist-ის საჯარო ფოტოდაკვირვებებს. გავრცელებად შეფერილია მხოლოდ რეგიონი, რომელსაც ქვემოთ მოცემულ ცხრილში დადასტურებული სტატუსი აქვს; სხვა წერტილები ცალკეული ჩანაწერებია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "ტურას საველე ჩანაწერები და დადასტურებული გავრცელება საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის ტურა დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта шакала использует проверенные публичные фотонаблюдения iNaturalist из Грузии. Как распространение окрашены только регионы с подтверждённым статусом в таблице записей; остальные точки — отдельные находки. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Полевые записи шакала и подтверждённое распространение на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где шакал отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Çakal haritası Gürcistan'daki incelenmiş herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Yalnızca kayıt tablosunda doğrulanmış durumdaki bölgeler yayılış olarak boyanır; diğer noktalar tekil kayıtlardır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu değil.",
        mapAria:
          "Çakalın Gürcistan'daki arazi kayıtları ve doğrulanmış yayılışı",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Çakal Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 851014,
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
  "ciconia-ciconia": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The white stork map uses public iNaturalist observations from Georgia. Regions come from the records-by-region table: only a confirmed status counts as distribution; other regions have records only. These observations do not by themselves establish breeding. Record counts reflect observation effort, not population density.",
        mapAria:
          "White stork observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Region with confirmed distribution",
        rangeTitle: "Where white stork distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "თეთრი ყარყატის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებულად ითვლება მხოლოდ დადასტურებული სტატუსი, დანარჩენში მხოლოდ ჩანაწერია. ეს ჩანაწერები თავისთავად ბუდობას არ ადასტურებს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "თეთრი ყარყატის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის თეთრი ყარყატის გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта белого аиста основана на публичных наблюдениях iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус, в остальных регионах есть лишь записи. Эти наблюдения сами по себе не доказывают гнездование. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Наблюдения белого аиста и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где распространение белого аиста подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Leylek haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan gelir: yalnızca doğrulanmış durum yayılış sayılır; diğerlerinde yalnızca kayıt vardır. Bu gözlemler tek başına üremeyi kanıtlamaz. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
        mapAria:
          "Leylek gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Leyleğin yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 4733,
    rangeSource: "record-summary",
  },
  "columba-palumbus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "This map uses public, photo-backed iNaturalist observations in Georgia. A region with at least one retained record is highlighted as confirmed. Points and shading show evidence of occurrence, not continuous presence across a region. Some public coordinates are approximate. Record counts reflect observation effort, not population density.",
        mapAria:
          "Common woodpigeon observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Region with confirmed records",
        rangeTitle: "Where common woodpigeon is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "რუკა საქართველოში iNaturalist-ის საჯარო, ფოტოდადასტურებულ დაკვირვებებს ეყრდნობა. რეგიონი დადასტურებულად გამოიკვეთება, თუ მასში სულ მცირე ერთი შენარჩუნებული ჩანაწერია. წერტილები და გამოკვეთილი რეგიონები არსებობის მტკიცებულებაა და არა მთელ რეგიონში უწყვეტი გავრცელება. ზოგი საჯარო კოორდინატი მიახლოებითია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "ქედანის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული ჩანაწერების მქონე რეგიონი",
        rangeTitle: "სად არის ქედანი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта использует публичные наблюдения iNaturalist с фотографиями из Грузии. Регион выделяется как подтверждённый при наличии не менее одной сохранённой записи. Точки и выделение показывают свидетельства присутствия, а не сплошное распространение по региону. Некоторые публичные координаты приблизительны. Число записей отражает усилия наблюдателей, а не плотность популяции.",
        mapAria: "Наблюдения вяхиря и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждёнными записями",
        rangeTitle: "Где вяхирь отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Harita, Gürcistan'daki fotoğraflı halka açık iNaturalist gözlemlerini kullanır. En az bir tutulan kaydı olan bölge doğrulanmış olarak vurgulanır. Noktalar ve vurgular, bölgenin tamamında kesintisiz yayılışı değil, varlık kanıtını gösterir. Bazı açık koordinatlar yaklaşıktır. Kayıt sayısı popülasyon yoğunluğunu değil gözlem çabasını yansıtır.",
        mapAria:
          "Tahtalı gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Doğrulanmış kayıtları olan bölge",
        rangeTitle: "Tahtalı Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 3048,
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
  "coturnix-coturnix": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Common Quail map uses public iNaturalist observations from Georgia. Regions come from the records-by-region table; one record is enough to confirm distribution for this species. Points outside the regional polygons remain in the total without being assigned to a region. Record counts reflect observation effort, not population density.",
        mapAria:
          "Common Quail observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where Common Quail is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "მწყრის რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოდან. რეგიონები აღებულია ქვემოთ მოცემული ჩანაწერების ცხრილიდან; ამ სახეობისთვის ერთი ჩანაწერიც საკმარისია რეგიონში გავრცელების დასადასტურებლად. რეგიონული პოლიგონების გარეთ დარჩენილი წერტილები საერთო რაოდენობაში შედის, მაგრამ რეგიონს არ მიეკუთვნება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობასაც ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
        mapAria:
          "მწყრის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის მწყერი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта перепела использует публичные наблюдения iNaturalist из Грузии. Регионы взяты из таблицы записей; для этого вида одной записи достаточно, чтобы подтвердить распространение в регионе. Точки вне региональных полигонов включены в общее число, но не отнесены к региону. Число записей отражает также активность наблюдателей, а не плотность популяции.",
        mapAria: "Наблюдения перепела и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где перепел отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Bıldırcın haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Bölgeler kayıt tablosundan alınır; bu tür için tek bir kayıt bölgedeki yayılışı doğrulamak için yeterlidir. Bölge poligonlarının dışındaki noktalar genel toplama dahildir, ancak bir bölgeye atanmaz. Kayıt sayısı gözlem çabasını da yansıtır, nüfus yoğunluğunu ölçmez.",
        mapAria:
          "Bıldırcın gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Bıldırcın Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 804,
    rangeSource: "record-summary",
  },
  "darevskia-obscura": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The obscure rock lizard map combines public iNaturalist observations in Georgia filed as Darevskia rudis obscura with localities that have no observer. Regions come from the records-by-region table: only confirmed status counts as distribution; otherwise a region is not treated as part of the range. Record counts reflect observation effort, not population density.",
        mapAria:
          "Obscure rock lizard observations and confirmed distribution regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle:
          "Where obscure rock lizard distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "მესხური კლდის ხვლიკის რუკა აერთიანებს საქართველოს iNaturalist-ის საჯარო დაკვირვებებს, რომლებიც Darevskia rudis obscura-ს სახელითაა შეტანილი, და აღმწერის გარეშე დამატებულ ლოკალიტეტებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "მესხური კლდის ხვლიკის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის მესხური კლდის ხვლიკის გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта тёмной скальной ящерицы объединяет публичные наблюдения iNaturalist в Грузии, внесённые как Darevskia rudis obscura, и локалитеты без наблюдателя. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус; в остальных случаях регион распространением не считается. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Наблюдения тёмной скальной ящерицы и регионы с подтверждённым распространением на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle:
          "Где распространение тёмной скальной ящерицы подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Koyu kayalık kertenkele haritası, Gürcistan'da Darevskia rudis obscura adıyla girilmiş herkese açık iNaturalist gözlemlerini ve gözlemcisi olmayan lokaliteleri birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; aksi halde bölge yayılış sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
        mapAria:
          "Koyu kayalık kertenkele gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle:
          "Koyu kayalık kertenkelenin yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 35376,
    rangeSource: "record-summary",
  },
  "dendrocopos-major": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The great spotted woodpecker map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution; otherwise a region is not treated as part of the range. Record counts reflect observation effort, not population density.",
        mapAria:
          "Great spotted woodpecker observations and confirmed distribution regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle:
          "Where great spotted woodpecker distribution is confirmed in Georgia",
        regionsMetricLabel: "regions with records",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "დიდი ჭრელი კოდალას რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "დიდი ჭრელი კოდალას დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის დიდი ჭრელი კოდალას გავრცელება დადასტურებული საქართველოში",
        regionsMetricLabel: "რეგიონი ჩანაწერით",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта большого пёстрого дятла использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус; в остальных случаях регион распространением не считается. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Наблюдения большого пёстрого дятла и регионы с подтверждённым распространением на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle:
          "Где распространение большого пёстрого дятла подтверждено в Грузии",
        regionsMetricLabel: "регионов с записями",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Orman alaca ağaçkakanı haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; aksi halde bölge yayılış sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
        mapAria:
          "Orman alaca ağaçkakanı gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle:
          "Orman alaca ağaçkakanının Gürcistan'da yayılışı nerede doğrulandı?",
        regionsMetricLabel: "kayıt bulunan bölge",
      },
    },
    iNaturalistTaxonId: 17871,
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
  "eirenis-modestus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The ring-headed dwarf snake map uses public iNaturalist observations in Georgia. Only regions marked confirmed in the records-by-region table are highlighted; isolated records do not establish region-wide distribution. Some public coordinates are obscured or approximate, making assignments near regional borders uncertain. Record counts reflect observation effort, not population density.",
        mapAria:
          "Ring-headed dwarf snake observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle:
          "Where ring-headed dwarf snake distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "წყნარი ეირენისის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. გამოკვეთილია მხოლოდ ის რეგიონები, რომლებსაც ჩანაწერების რეგიონულ ცხრილში დადასტურებული სტატუსი აქვთ; ცალკეული ჩანაწერი მთელი რეგიონის გავრცელებას არ ნიშნავს. ზოგი საჯარო კოორდინატი დაფარული ან მიახლოებითია, ამიტომ საზღვართან რეგიონის მიკუთვნება გაურკვეველია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "წყნარი ეირენისის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის წყნარი ეირენისის გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта скромного эйрениса основана на публичных наблюдениях iNaturalist в Грузии. Выделены только регионы со статусом подтверждения в таблице записей; отдельная запись не означает распространение по всему региону. Некоторые публичные координаты скрыты или приблизительны, поэтому привязка точек у границ регионов неопределённа. Число записей отражает активность наблюдателей, не плотность популяции.",
        mapAria:
          "Наблюдения скромного эйрениса и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle:
          "Где распространение скромного эйрениса подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Halkalı başlı cüce yılan haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Yalnızca bölgesel kayıt tablosunda doğrulanmış durumdaki bölgeler vurgulanır; tek bir kayıt tüm bölgede yayılış anlamına gelmez. Bazı halka açık koordinatlar gizlenmiş veya yaklaşıktır; bölge sınırlarına yakın noktaların atanması belirsizdir. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
        mapAria:
          "Halkalı başlı cüce yılan gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle:
          "Halkalı başlı cüce yılanın yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 30293,
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
  "garrulus-glandarius": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Eurasian jay map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution; otherwise a region is not treated as part of the range. Record counts reflect observation effort, not population density.",
        mapAria:
          "Eurasian jay observations and confirmed distribution regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where Eurasian jay distribution is confirmed in Georgia",
        regionsMetricLabel: "regions with records",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ჩხიკვის რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "ჩხიკვის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის ჩხიკვის გავრცელება დადასტურებული საქართველოში",
        regionsMetricLabel: "რეგიონი ჩანაწერით",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта сойки использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус; в остальных случаях регион распространением не считается. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Наблюдения сойки и регионы с подтверждённым распространением на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где распространение сойки подтверждено в Грузии",
        regionsMetricLabel: "регионов с записями",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Alakarga haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; aksi halde bölge yayılış sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
        mapAria:
          "Alakarga gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Alakarganın Gürcistan'da yayılışı nerede doğrulandı?",
        regionsMetricLabel: "kayıt bulunan bölge",
      },
    },
    iNaturalistTaxonId: 8088,
    rangeSource: "record-summary",
  },
  "gypaetus-barbatus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The bearded vulture map uses public iNaturalist observations from Georgia. Regions come from the records-by-region table: only a confirmed status counts as distribution; other regions have records only. Record counts reflect observation effort, not population density.",
        mapAria:
          "Bearded vulture observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Region with confirmed distribution",
        rangeTitle:
          "Where bearded vulture distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ბატკანძერის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებულად ითვლება მხოლოდ დადასტურებული სტატუსი, დანარჩენში მხოლოდ ჩანაწერია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "ბატკანძერის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის ბატკანძერის გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта бородача основана на публичных наблюдениях iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус, в остальных регионах есть лишь записи. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria: "Наблюдения бородача и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где распространение бородача подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Sakallı akbaba haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan gelir: yalnızca doğrulanmış durum yayılış sayılır; diğerlerinde yalnızca kayıt vardır. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
        mapAria:
          "Sakallı akbaba gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle:
          "Sakallı akbabanın yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 5379,
    rangeSource: "record-summary",
  },
  "gyps-fulvus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The griffon vulture map uses public iNaturalist observations from Georgia. Regions come from the records-by-region table: only a confirmed status counts as distribution; other regions have records only. Observations do not by themselves confirm nesting. Record counts reflect observation effort, not population density.",
        mapAria:
          "Griffon vulture observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Region with confirmed distribution",
        rangeTitle:
          "Where griffon vulture distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ორბის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებულად ითვლება მხოლოდ დადასტურებული სტატუსი, დანარჩენში მხოლოდ ჩანაწერია. დაკვირვება თავისთავად ბუდობას არ ადასტურებს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "ორბის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის ორბის გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта белоголового сипа основана на публичных наблюдениях iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус, в остальных регионах есть лишь записи. Наблюдения сами по себе не подтверждают гнездование. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Наблюдения белоголового сипа и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle:
          "Где распространение белоголового сипа подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Kızıl akbaba haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan gelir: yalnızca doğrulanmış durum yayılış sayılır; diğerlerinde yalnızca kayıt vardır. Gözlemler tek başına üremeyi doğrulamaz. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
        mapAria:
          "Kızıl akbaba gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Kızıl akbabanın yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 5366,
    rangeSource: "record-summary",
  },
  "halyomorpha-halys": {
    copy: HALYOMORPHA_RANGE_COPY,
    iNaturalistTaxonId: 81923,
  },
  "lacerta-strigata": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The striped lizard map uses Reptiles.ge editorial photo records and public iNaturalist observations in Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution; otherwise a region is not treated as part of the range. Record counts reflect observation effort, not population density.",
        mapAria:
          "Striped lizard observations and confirmed distribution regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where striped lizard distribution is confirmed in Georgia",
        regionsMetricLabel: "regions with records",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ზოლიანი ხვლიკის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს საქართველოში. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "ზოლიანი ხვლიკის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის ზოლიანი ხვლიკის გავრცელება დადასტურებული საქართველოში",
        regionsMetricLabel: "რეგიონი ჩანაწერით",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта полосатой ящерицы объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус; в остальных случаях регион распространением не считается. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Наблюдения полосатой ящерицы и регионы с подтверждённым распространением на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle:
          "Где распространение полосатой ящерицы подтверждено в Грузии",
        regionsMetricLabel: "регионов с записями",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Çizgili kertenkele haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve Gürcistan'daki herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; aksi halde bölge yayılış sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
        mapAria:
          "Çizgili kertenkele gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle:
          "Çizgili kertenkelenin Gürcistan'da yayılışı nerede doğrulandı?",
        regionsMetricLabel: "kayıt bulunan bölge",
      },
    },
    iNaturalistTaxonId: 35870,
    rangeSource: "record-summary",
  },
  "lanius-collurio": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The map uses public, photo-backed iNaturalist observations of the Red-backed Shrike in Georgia. One retained record is enough for confirmed regional status, but does not imply occurrence throughout that region. Obscured, imprecise and contradictory locations were excluded; record counts do not measure population density.",
        mapAria:
          "Red-backed Shrike observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where the Red-backed Shrike is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "რუკა ჩვეულებრივი ღაჟოს საქართველოში გამოქვეყნებულ ფოტოიან iNaturalist დაკვირვებებს ეყრდნობა. ერთი შენარჩუნებული ჩანაწერი რეგიონის დადასტურებული სტატუსისთვის საკმარისია, თუმცა ეს მთელ რეგიონში თანაბარ გავრცელებას არ ნიშნავს. დაფარული, მეტისმეტად მიახლოებითი და ლოკალიტეტთან შეუსაბამო წერტილები გამოტოვებულია; ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
        mapAria:
          "ჩვეულებრივი ღაჟოს დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის ჩვეულებრივი ღაჟო დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта основана на публичных наблюдениях обыкновенного жулана с фотографиями в iNaturalist из Грузии. Одной сохранённой записи достаточно для подтверждённого статуса региона, но это не означает распространения по всей его территории. Скрытые, слишком неточные и противоречащие указанному месту точки исключены; число записей не показывает плотность популяции.",
        mapAria:
          "Наблюдения обыкновенного жулана и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где обыкновенный жулан отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Harita, kızılsırtlı örümcekkuşunun Gürcistan'daki fotoğraflı ve herkese açık iNaturalist gözlemlerine dayanır. Korunan tek bir kayıt bölgenin doğrulanmış durumu için yeterlidir; bu, türün bölgenin her yerinde bulunduğu anlamına gelmez. Gizlenmiş, çok belirsiz ve yer adıyla çelişen noktalar çıkarılmıştır; kayıt sayısı nüfus yoğunluğunu göstermez.",
        mapAria:
          "Kızılsırtlı örümcekkuşu gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Kızılsırtlı örümcekkuşu Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 12038,
    rangeSource: "record-summary",
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
  "mauremys-caspica": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Caspian turtle map shows public iNaturalist observations in Georgia. Only regions marked confirmed in the records table are shaded as distribution. Some public coordinates are obscured or approximate, and locality text can disagree with a point's region. A shaded region does not mean the turtle occupies all of it; record counts reflect observation effort, not population density.",
        mapAria:
          "Caspian turtle field records and confirmed regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where Caspian turtles are recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "კასპიური კუს რუკა აჩვენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოში. გავრცელებად მხოლოდ ჩანაწერების ცხრილში დადასტურებული სტატუსის მქონე რეგიონებია გამოკვეთილი. ზოგი საჯარო კოორდინატი დაფარული ან მიახლოებითია, ზოგჯერ კი ლოკალიტეტის ტექსტი წერტილის რეგიონს არ ემთხვევა. გამოკვეთილი რეგიონი არ ნიშნავს მის მთელ ტერიტორიაზე გავრცელებას; ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
        mapAria:
          "კასპიური კუს საველე ჩანაწერები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის კასპიური კუ დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта каспийской черепахи показывает публичные наблюдения iNaturalist в Грузии. Как распространение выделены только регионы со статусом подтверждения в таблице записей. Некоторые публичные координаты скрыты или приблизительны, а текст местонахождения иногда не совпадает с регионом точки. Выделенный регион не означает присутствие на всей его территории; число записей не измеряет плотность популяции.",
        mapAria:
          "Полевые записи каспийской черепахи и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где каспийская черепаха отмечена в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Hazar kaplumbağası haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini gösterir. Yalnızca kayıt tablosunda doğrulanmış durumdaki bölgeler yayılış olarak vurgulanır. Bazı açık koordinatlar gizlenmiş veya yaklaşıktır; yer adı bazen noktanın bulunduğu bölgeyle uyuşmaz. Vurgulanan bölge türün her yerinde bulunduğu anlamına gelmez; kayıt sayısı popülasyon yoğunluğunu ölçmez.",
        mapAria:
          "Hazar kaplumbağasının arazi kayıtları ve doğrulanmış bölgeleri Gürcistan haritasında",
        officialRegionLabel: "Doğrulanmış yayılış bölgesi",
        rangeTitle: "Hazar kaplumbağası Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 39972,
    rangeSource: "record-summary",
  },
  "mertensiella-caucasica": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The 2026 checklist names sites in Adjara, Guria, Samtskhe–Javakheti and Shida Kartli. These named localities, not observation counts, support the confirmed regions. iNaturalist lists M. djanaschvilii separately, so these records cover only iNaturalist's M. caucasica taxon. Public coordinates are obscured by roughly 27 km; plotted points and their region counts are approximate and may cross borders. Counts reflect observations, not population density or a range across each whole region.",
        mapAria:
          "Caucasian salamander source-confirmed regions and approximate observations on a map of Georgia",
        officialRegionLabel: "Source-confirmed distribution region",
        rangeTitle: "Where Caucasian salamander is documented in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "2026 წლის ჩამონათვალში დასახელებული ლოკალიტეტები ადასტურებს ჩანაწერებს აჭარაში, გურიაში, სამცხე–ჯავახეთსა და შიდა ქართლში. დადასტურებული სტატუსის საფუძველი ეს წყაროა და არა დაკვირვებების რაოდენობა. iNaturalist M. djanaschvilii-ს ცალკე ტაქსონად აჩვენებს, ამიტომ აქ მხოლოდ iNaturalist-ის M. caucasica ტაქსონის ჩანაწერებია. საჯარო კოორდინატები დაახლოებით 27 კმ-ითაა დაფარული; წერტილები და მათი რეგიონული დათვლა მიახლოებითია და საზღვარს შეიძლება გადასცდეს. რაოდენობა არც პოპულაციის სიმჭიდროვეს ზომავს და არც მთელი რეგიონის უწყვეტ გავრცელებას ნიშნავს.",
        mapAria:
          "კავკასიური სალამანდრას წყაროთი დადასტურებული რეგიონები და მიახლოებითი დაკვირვებები საქართველოს რუკაზე",
        officialRegionLabel: "წყაროთი დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის კავკასიური სალამანდრა დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "В чек-листе 2026 года названы местонахождения в Аджарии, Гурии, Самцхе–Джавахети и Шида-Картли. Статус подтверждённых регионов основан на этих местонахождениях, а не на числе наблюдений. iNaturalist учитывает M. djanaschvilii отдельно, поэтому здесь показаны записи только таксона M. caucasica по iNaturalist. Публичные координаты скрыты примерно на 27 км; точки и их распределение по регионам приблизительны и могут пересекать границы. Число записей не измеряет плотность популяции и не означает сплошное распространение по всему региону.",
        mapAria:
          "Подтверждённые источником регионы и приблизительные наблюдения кавказской саламандры на карте Грузии",
        officialRegionLabel:
          "Регион распространения, подтверждённый источником",
        rangeTitle: "Где кавказская саламандра отмечена в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "2026 kontrol listesi Acara, Guria, Samtshe–Cavaheti ve Şida Kartli'de belirli lokaliteler bildirir. Doğrulanmış bölge durumu gözlem sayısına değil, bu lokalitelere dayanır. iNaturalist M. djanaschvilii'yi ayrı listeler; burada yalnızca M. caucasica taksonunun kayıtları vardır. Herkese açık koordinatlar yaklaşık 27 km gizlenmiştir; noktalar ve bölgesel sayımları yaklaşıktır ve sınırları aşabilir. Kayıt sayısı popülasyon yoğunluğunu ya da bütün bölgeye yayılışı göstermez.",
        mapAria:
          "Kafkas semenderinin kaynakla doğrulanmış bölgeleri ve yaklaşık gözlemleri Gürcistan haritasında",
        officialRegionLabel: "Kaynakla doğrulanmış yayılış bölgesi",
        rangeTitle: "Kafkas semenderi Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 27853,
    rangeSource: "record-summary",
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
  "mustela-nivalis": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The least weasel map combines Reptiles.ge field photos with public iNaturalist photo observations. Regions come from the records-by-region table; for this species, one record is enough to confirm distribution. A highlighted region does not imply presence throughout it, and record counts do not measure population density.",
        mapAria:
          "Least weasel photo observations and confirmed distribution on a map of Georgia",
        officialRegionLabel: "Region with confirmed distribution",
        rangeTitle: "Where least weasel distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "დედოფალას რუკა აერთიანებს Reptiles.ge-ის საველე ფოტოებსა და iNaturalist-ის საჯარო ფოტოდაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან; ამ სახეობაზე ერთი ჩანაწერიც საკმარისია, რომ რეგიონი დადასტურებულ გავრცელებად ჩაითვალოს. გამოკვეთილი რეგიონი მის მთელ ტერიტორიაზე არსებობას არ ნიშნავს, ხოლო ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვე არ არის.",
        mapAria:
          "დედოფალას ფოტოდაკვირვებები და დადასტურებული გავრცელება საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის დედოფალას გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта ласки объединяет полевые фотографии Reptiles.ge и публичные фотонаблюдения iNaturalist. Регионы взяты из таблицы записей; для этого вида одной записи достаточно, чтобы считать распространение подтверждённым. Выделенный регион не означает присутствия на всей его территории, а число записей не измеряет плотность популяции.",
        mapAria:
          "Фотонаблюдения ласки и подтверждённое распространение на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где распространение ласки подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Gelincik haritası Reptiles.ge arazi fotoğraflarını ve herkese açık iNaturalist fotoğraflı gözlemlerini birleştirir. Bölgeler kayıt tablosundan alınır; bu türde tek bir kayıt yayılışın doğrulanması için yeterlidir. Vurgulanan bölge türün her yerinde bulunduğu anlamına gelmez; kayıt sayısı popülasyon yoğunluğunu ölçmez.",
        mapAria:
          "Gelincik fotoğraflı gözlemleri ve doğrulanmış yayılışı Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Gelincik yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 569428,
    rangeSource: "record-summary",
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
  "neophron-percnopterus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Egyptian vulture map uses public iNaturalist observations from Georgia together with editorial photo records. Regions come from the records-by-region table: only a confirmed status counts as distribution; other regions have records only. Record counts reflect observation effort, not population density.",
        mapAria:
          "Egyptian vulture observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Region with confirmed distribution",
        rangeTitle:
          "Where Egyptian vulture distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ფასკუნჯის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებსა და სარედაქციო ფოტოჩანაწერებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებულად ითვლება მხოლოდ დადასტურებული სტატუსი, დანარჩენში მხოლოდ ჩანაწერია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "ფასკუნჯის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის ფასკუნჯის გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта стервятника основана на публичных наблюдениях iNaturalist в Грузии и редакционных фотозаписях. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус, в остальных регионах есть лишь записи. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Наблюдения стервятника и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где распространение стервятника подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Küçük akbaba haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini ve editoryal fotoğraf kayıtlarını kullanır. Bölgeler, bölgelere göre kayıt tablosundan gelir: yalnızca doğrulanmış durum yayılış sayılır; diğerlerinde yalnızca kayıt vardır. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
        mapAria:
          "Küçük akbaba gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Küçük akbabanın yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 5361,
    rangeSource: "record-summary",
  },
  "paralaudakia-caucasia": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Caucasian agama map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with confirmed status are treated as distribution.",
        mapAria:
          "Caucasian agama distribution evidence and field records on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle:
          "Where Caucasian agama distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ჯოჯოს რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და გავრცელებად ითვლება მხოლოდ ის რეგიონი, სადაც სტატუსი დადასტურებულია.",
        mapAria:
          "ჯოჯოს გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის ჯოჯოს გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта кавказской агамы объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы со статусом подтверждения.",
        mapAria:
          "Данные о распространении кавказской агамы и полевые записи на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle:
          "Где распространение кавказской агамы подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Kafkas keleri haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış kabul edilir.",
        mapAria:
          "Kafkas kelerinin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        officialRegionLabel: "Doğrulanmış yayılış bölgesi",
        rangeTitle: "Kafkas kelerinin yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 318730,
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
  "picus-viridis": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The European green woodpecker map uses Reptiles.ge editorial photo records and public iNaturalist observations in Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution; otherwise a region is not treated as part of the range. Record counts reflect observation effort, not population density.",
        mapAria:
          "European green woodpecker observations and confirmed distribution regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle:
          "Where European green woodpecker distribution is confirmed in Georgia",
        regionsMetricLabel: "regions with records",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "მწვანე კოდალას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს საქართველოში. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
        mapAria:
          "მწვანე კოდალას დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის მწვანე კოდალას გავრცელება დადასტურებული საქართველოში",
        regionsMetricLabel: "რეგიონი ჩანაწერით",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта зелёного дятла объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус; в остальных случаях регион распространением не считается. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Наблюдения зелёного дятла и регионы с подтверждённым распространением на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где распространение зелёного дятла подтверждено в Грузии",
        regionsMetricLabel: "регионов с записями",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Yeşil ağaçkakan haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve Gürcistan'daki herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; aksi halde bölge yayılış sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
        mapAria:
          "Yeşil ağaçkakan gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle:
          "Yeşil ağaçkakanın Gürcistan'da yayılışı nerede doğrulandı?",
        regionsMetricLabel: "kayıt bulunan bölge",
      },
    },
    iNaturalistTaxonId: 144243,
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
  "pseudopus-apodus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "This map uses public iNaturalist observations of the European glass lizard in Georgia. Its shaded distribution comes from regions marked confirmed in the records-by-region table; other regions have records only. The 2026 checklist describes an eastern range, while the observation table also confirms Abkhazia by this map's record threshold. Counts reflect observation effort, not population density.",
        mapAria:
          "European glass lizard observations and confirmed distribution regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where the European glass lizard is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "რუკა იყენებს საქართველოში გველხოკერას შესახებ iNaturalist-ის საჯარო დაკვირვებებს. გავრცელებად შეფერილია მხოლოდ რეგიონული ცხრილის დადასტურებული სტატუსის მქონე რეგიონები; დანარჩენებში სახეობა მხოლოდ დაფიქსირებულია. 2026 წლის ჩამონათვალი აღმოსავლეთ საქართველოს ასახელებს, დაკვირვებების ცხრილში კი რუკის ჩანაწერთა ზღვარს აფხაზეთიც აღწევს. ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
        mapAria:
          "გველხოკერას დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის გველხოკერა დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта использует публичные наблюдения желтопузика в Грузии на iNaturalist. Распространением отмечены только регионы со статусом подтверждения в таблице записей; в остальных вид лишь зафиксирован. Перечень 2026 года указывает восточную Грузию, а Абхазия также достигает порога подтверждения по записям на этой карте. Число записей не отражает плотность популяции.",
        mapAria:
          "Наблюдения желтопузика и регионы подтверждённого распространения на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где желтопузик отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Bu harita, Gürcistan'daki yılan kertenkeleye ait herkese açık iNaturalist gözlemlerini kullanır. Yalnızca bölgesel kayıt tablosunda durumu doğrulanmış bölgeler yayılış olarak renklendirilir; diğerlerinde tür sadece kaydedilmiştir. 2026 listesi Doğu Gürcistan'ı belirtirken Abhazya da bu haritadaki kayıt eşiğine ulaşır. Kayıt sayısı nüfus yoğunluğunu göstermez.",
        mapAria:
          "Yılan kertenkele gözlemleri ve doğrulanmış yayılış bölgeleri Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Yılan kertenkele Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 31975,
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
  "ursus-arctos": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The brown bear map uses public iNaturalist photo observations from Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution, while low-count or uncertain regions remain recorded only. Record counts reflect observation effort, not population density.",
        mapAria:
          "Brown bear observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle: "Where brown bear is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "მურა დათვის რუკა იყენებს iNaturalist-ის საჯარო ფოტოდაკვირვებებს საქართველოდან. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი, ხოლო მცირე რაოდენობის ან გაურკვეველი ჩანაწერების რეგიონები მხოლოდ დაფიქსირებულად რჩება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
        mapAria:
          "მურა დათვის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle: "სად არის მურა დათვი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта бурого медведя использует публичные фотонаблюдения iNaturalist из Грузии. Регионы взяты из таблицы записей: распространением считается только регион с подтверждённым статусом, а регионы с малым числом или неопределёнными записями остаются только отмеченными. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Наблюдения бурого медведя и подтверждённые регионы на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle: "Где бурый медведь отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Boz ayı haritası Gürcistan'daki herkese açık iNaturalist fotoğraf gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durumdaki bölgeler yayılış sayılır; az sayıdaki veya belirsiz kayıtların bulunduğu bölgeler yalnızca kaydedilmiş kalır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu ölçmez.",
        mapAria:
          "Boz ayı gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
        officialRegionLabel: "Yayılışı doğrulanmış bölge",
        rangeTitle: "Boz ayı Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 41641,
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
  "zamenis-hohenackeri": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Transcaucasian rat snake map combines Reptiles.ge field photos with public iNaturalist observations. One field record in a region is enough for confirmed distribution status. Some iNaturalist coordinates are obscured, so points near regional borders are approximate. Record counts reflect observation effort, not population density.",
        mapAria:
          "Transcaucasian rat snake observations and confirmed regions on a map of Georgia",
        officialRegionLabel: "Confirmed distribution region",
        rangeTitle:
          "Where Transcaucasian rat snake distribution is confirmed in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ამიერკავკასიური მცურავის რუკა აერთიანებს Reptiles.ge-ის საველე ფოტოებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონში ერთი საველე ჩანაწერიც საკმარისია, რომ გავრცელება დადასტურებულად ჩაითვალოს. iNaturalist-ის ზოგი კოორდინატი დაფარულია, ამიტომ რეგიონების საზღვრებთან მდებარე წერტილები მიახლოებითია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
        mapAria:
          "ამიერკავკასიური მცურავის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
        officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
        rangeTitle:
          "სად არის ამიერკავკასიური მცურავის გავრცელება დადასტურებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта закавказского полоза объединяет полевые фотографии Reptiles.ge и публичные наблюдения iNaturalist. Одной полевой записи в регионе достаточно для статуса подтверждённого распространения. Координаты некоторых наблюдений iNaturalist скрыты, поэтому точки у границ регионов приблизительны. Число записей отражает активность наблюдателей, а не плотность популяции.",
        mapAria:
          "Наблюдения закавказского полоза и регионы с подтверждённым распространением на карте Грузии",
        officialRegionLabel: "Регион с подтверждённым распространением",
        rangeTitle:
          "Где распространение закавказского полоза подтверждено в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Transkafkas sıçan yılanı haritası Reptiles.ge arazi fotoğraflarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bir bölgedeki tek bir saha kaydı doğrulanmış yayılış durumu için yeterlidir. Bazı iNaturalist koordinatları gizlendiğinden bölge sınırlarındaki noktalar yaklaşıktır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu ölçmez.",
        mapAria:
          "Transkafkas sıçan yılanının gözlemleri ve doğrulanmış bölgeleri Gürcistan haritasında",
        officialRegionLabel: "Doğrulanmış yayılış bölgesi",
        rangeTitle:
          "Transkafkas sıçan yılanının yayılışı Gürcistan'da nerede doğrulandı?",
      },
    },
    iNaturalistTaxonId: 74007,
    rangeSource: "record-summary",
  },
};

export async function SpeciesRangeMap({
  locale,
  speciesId,
  speciesName,
  updatedAt,
}: SpeciesRangeMapProps) {
  const t = await getTranslations({ locale, namespace: "profile" });
  const rangeRegions = getRegionsForSpecies(speciesId);
  const highlightedIds = rangeRegions.map((region) => region.id);
  const interactiveRangeConfig = INTERACTIVE_RANGE_MAPS[speciesId];
  const interactiveRangeCopy = interactiveRangeConfig?.copy[locale];
  const interactiveRangeSummary = interactiveRangeCopy
    ? getOccurrenceSummary(speciesId, locale)
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
        updatedAt={updatedAt}
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
  updatedAt,
}: {
  anchorLabel: string;
  copy: HalyomorphaRangeCopy;
  iNaturalistTaxonId: number;
  locale: AppLocale;
  occurrenceSummary: HalyomorphaOccurrenceSummary;
  officialRegionIds: string[];
  speciesId: string;
  updatedAt: string;
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
            dataRevision={updatedAt}
            locale={locale}
            occurrenceSummary={occurrenceSummary}
            officialRegionIds={officialRegionIds}
            regionNames={regions.map((region) => ({
              id: region.id,
              name: localizeRegionText(region.name, locale),
            }))}
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
            <div className="mt-4 border-y border-border/80">
              <table className="w-full table-fixed text-[14px]">
                <thead className="border-b border-border/60 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 pr-3 text-left font-semibold">
                      {copy.regionsMetricLabel}
                    </th>
                    <th className="w-24 px-3 py-2.5 text-right font-semibold sm:w-28">
                      {copy.regionRecordsLabel}
                    </th>
                    <th className="hidden w-52 py-2.5 pl-3 text-right font-semibold sm:table-cell">
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
                      <th className="py-3 pr-3 text-left align-top font-medium text-foreground sm:align-middle">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="min-w-0 [&_button]:min-w-0">
                            <HalyomorphaRegionSelectButton regionId={region.id}>
                              {region.name}
                            </HalyomorphaRegionSelectButton>
                          </span>
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
                        <span className="mt-2 flex sm:hidden">
                          <RegionStatusBadge
                            copy={copy}
                            status={region.status}
                          />
                        </span>
                      </th>
                      <td className="p-3 text-right align-top text-muted-foreground tabular-nums sm:align-middle">
                        {region.count.toLocaleString(locale)}
                      </td>
                      <td className="hidden py-3 pl-3 text-right sm:table-cell">
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
        "inline-flex max-w-full items-center justify-center rounded-full px-2.5 py-1 text-center text-[11px] leading-tight font-semibold",
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
