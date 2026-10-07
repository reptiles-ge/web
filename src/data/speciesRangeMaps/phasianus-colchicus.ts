import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
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
      mapAria: "Sülün gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Sülün Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 981,
  rangeSource: "record-summary",
};
