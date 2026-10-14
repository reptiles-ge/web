import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The common pheasant map uses public iNaturalist observations from Georgia that are not marked captive. Regions come from the records-by-region table; only regions with enough records are shaded on the map. Record counts reflect observation effort, not population density.",
      mapAria:
        "Common pheasant observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Common pheasant: where it is recorded in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ხოხბის რუკა იყენებს საქართველოში iNaturalist-ის საჯარო დაკვირვებებს, რომლებიც ტყვეობაში მყოფად არ არის მონიშნული. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან; რუკაზე მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონებია გამოკვეთილი. ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ნიშნავს.",
      mapAria:
        "ხოხბის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ხოხობი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერებით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта фазана использует публичные наблюдения из Грузии на iNaturalist, не отмеченные как содержащиеся в неволе. Регионы взяты из таблицы записей; на карте выделены только регионы с достаточным числом записей. Число записей не означает плотность популяции.",
      mapAria: "Наблюдения фазана и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где фазан отмечен в Грузии",
      regionsMetricLabel: "регионы с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Sülün haritası Gürcistan'daki esir olarak işaretlenmemiş halka açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgesel kayıt tablosundan alınır; haritada yalnızca yeterli kaydı olan bölgeler vurgulanır. Kayıt sayısı nüfus yoğunluğunu göstermez.",
      mapAria:
        "Sülün gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Sülün Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 981,
  rangeSource: "record-summary",
};
