import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Eurasian wryneck map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map; a region with too few records is not shaded. Record counts reflect observation effort, not population density.",
      mapAria:
        "Eurasian wryneck observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Eurasian wryneck: where it is recorded in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მაქციის რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონებია გამოკვეთილი; ცოტა ჩანაწერის მქონე რეგიონი არ გამოიკვეთება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "მაქციის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის მაქცია დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта вертишейки использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: на карте выделены только регионы с достаточным числом записей; регион с малым числом записей не выделяется. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения вертишейки и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где вертишейка отмечена в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Boyunçeviren haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler vurgulanır; kaydı az olan bölge vurgulanmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria: "Boyunçeviren gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Boyunçeviren Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 18448,
  rangeSource: "record-summary",
};
