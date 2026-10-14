import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The European turtle dove map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map; other regions are not shaded. Record counts reflect observation effort, not population density.",
      mapAria:
        "European turtle dove observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "European turtle dove: where it is recorded in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "გვრიტის რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე შეფერილია მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონები; დანარჩენი რეგიონები შეფერილი არ არის. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "გვრიტის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის გვრიტი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта обыкновенной горлицы использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: на карте закрашены только регионы с достаточным числом записей; остальные регионы не закрашены. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения обыкновенной горлицы и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где обыкновенная горлица отмечена в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Üveyik haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler boyanır; diğer bölgeler boyanmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria: "Üveyik gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Üveyik Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 2938,
  rangeSource: "record-summary",
};
