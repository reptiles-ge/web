import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Rock Dove map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution; otherwise a region is not treated as part of the range. These records do not separate genetically wild birds from free-living city pigeons. Record counts reflect observation effort, not population density.",
      mapAria:
        "Rock Dove observations and confirmed distribution regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where Rock Dove distribution is confirmed in Georgia",
      regionsMetricLabel: "confirmed regions",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "გარეული მტრედის რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ეს ჩანაწერები გენეტიკურად ველურ ფრინველსა და ქალაქში თავისუფლად მცხოვრებ მტრედს ერთმანეთისგან არ ჰყოფს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "გარეული მტრედის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის გარეული მტრედის გავრცელება დადასტურებული საქართველოში",
      regionsMetricLabel: "დადასტურებული რეგიონი",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта сизого голубя использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус; в остальных случаях регион распространением не считается. Эти записи не отделяют генетически диких птиц от свободно живущих городских голубей. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения сизого голубя и регионы с подтверждённым распространением на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение сизого голубя подтверждено в Грузии",
      regionsMetricLabel: "подтверждённых региона",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kaya güvercini haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; aksi halde bölge yayılış sayılmaz. Bu kayıtlar genetik olarak yabani kuşları şehirde serbest yaşayan güvercinlerden ayırmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Kaya güvercini gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Kaya güvercininin Gürcistan'da yayılışı nerede doğrulandı?",
      regionsMetricLabel: "doğrulanmış bölge",
    },
  },
  iNaturalistTaxonId: 3017,
  rangeSource: "record-summary",
  regionMetric: "confirmed",
};
