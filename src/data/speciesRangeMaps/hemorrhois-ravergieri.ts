import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Spotted Whip Snake map combines Reptiles.ge editorial photo records, field localities from Georgia and public iNaturalist photo observations. Regions come from the records-by-region table: a region with five or more records is shaded on the map; a region with fewer records is marked as having too few records. iNaturalist observations that still need an ID are shown but not counted. Record counts reflect observation effort, not population density.",
      mapAria:
        "Spotted Whip Snake observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Spotted Whip Snake: where it is recorded in Georgia",
      regionsMetricLabel: "regions with enough records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ნაირფერი მცურავის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებს, საქართველოს საველე ლოკალიტეტებსა და iNaturalist-ის საჯარო ფოტოდაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: ხუთი ან მეტი ჩანაწერის მქონე რეგიონი რუკაზე მონიშნულია; ნაკლები ჩანაწერის მქონე რეგიონს „ჩანაწერები ცოტაა“ სტატუსი აქვს. iNaturalist-ის დაკვირვებები, რომელთა ამოცნობა ჯერ დადასტურებული არ არის, რუკაზე ჩანს, მაგრამ არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ნაირფერი მცურავის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ნაირფერი მცურავი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი საკმარისი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта пятнистого полоза объединяет редакционные фотозаписи Reptiles.ge, полевые локалитеты из Грузии и публичные фотонаблюдения iNaturalist. Регионы взяты из таблицы записей: регион с пятью и более записями закрашен на карте; при меньшем числе у региона статус «Мало записей». Наблюдения iNaturalist, которым ещё нужно подтверждение определения, показаны, но не учитываются. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения пятнистого полоза и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где пятнистый полоз отмечен в Грузии",
      regionsMetricLabel: "региона с достаточным числом записей",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Benekli kamçı yılanı haritası Reptiles.ge editoryal fotoğraf kayıtlarını, Gürcistan'daki arazi lokalitelerini ve herkese açık iNaturalist fotoğraflı gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır: beş veya daha fazla kaydı olan bölge haritada gösterilir; daha az kaydı olan bölge “Kayıt az” olarak işaretlenir. Tür teşhisi henüz doğrulanmamış iNaturalist gözlemleri gösterilir ama sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Benekli kamçı yılanı gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Benekli kamçı yılanı Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "yeterli kaydı olan bölge",
    },
  },
  iNaturalistTaxonId: 102628,
  rangeSource: "record-summary",
  regionMetric: "confirmed",
};
