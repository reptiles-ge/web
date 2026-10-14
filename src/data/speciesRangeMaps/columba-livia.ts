import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Rock Dove map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map; otherwise a region is not treated as part of the range. These records do not separate genetically wild birds from free-living city pigeons. Record counts reflect observation effort, not population density.",
      mapAria:
        "Rock Dove observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Rock Dove: where it is recorded in Georgia",
      regionsMetricLabel: "regions with enough records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "გარეული მტრედის რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონებია გამოყოფილი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ეს ჩანაწერები გენეტიკურად ველურ ფრინველსა და ქალაქში თავისუფლად მცხოვრებ მტრედს ერთმანეთისგან არ ჰყოფს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "გარეული მტრედის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის გარეული მტრედი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "საკმარისი ჩანაწერების მქონე რეგიონი",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта сизого голубя использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: на карте выделены только регионы с достаточным числом записей; в остальных случаях регион распространением не считается. Эти записи не отделяют генетически диких птиц от свободно живущих городских голубей. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения сизого голубя и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где сизый голубь отмечен в Грузии",
      regionsMetricLabel: "региона с достаточным числом записей",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kaya güvercini haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler gölgelendirilir; aksi halde bölge yayılış sayılmaz. Bu kayıtlar genetik olarak yabani kuşları şehirde serbest yaşayan güvercinlerden ayırmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Kaya güvercini gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kaya güvercini Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "yeterli kaydı olan bölge",
    },
  },
  iNaturalistTaxonId: 3017,
  rangeSource: "record-summary",
  regionMetric: "confirmed",
};
