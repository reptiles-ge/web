import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Mediterranean black widow map uses public iNaturalist observations in Georgia. Regions come from the records-by-region table on this map. A region counts as distribution only when its status is confirmed; otherwise it is not treated as part of the range. Record counts reflect observation effort, not population density.",
      mapAria:
        "Mediterranean black widow observations and confirmed distribution regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle:
        "Where Mediterranean black widow distribution is confirmed in Georgia",
      regionsMetricLabel: "confirmed regions",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ყარაყურთის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. რეგიონები აღებულია ამ რუკის ჩანაწერების რეგიონული ცხრილიდან. გავრცელებად ითვლება მხოლოდ ის რეგიონი, რომლის სტატუსიც დადასტურებულია; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ყარაყურთის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის ყარაყურთის გავრცელება დადასტურებული საქართველოში",
      regionsMetricLabel: "დადასტურებული რეგიონი",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта каракурта использует публичные наблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей по регионам на этой карте. Распространением считается только регион со статусом подтверждения; в остальных случаях регион распространением не считается. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения каракурта и регионы с подтверждённым распространением на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение каракурта подтверждено в Грузии",
      regionsMetricLabel: "подтверждённых региона",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Karakurt haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bu haritadaki bölgelere göre kayıt tablosundan alınır. Bir bölge yalnızca durumu doğrulanmışsa yayılış sayılır; aksi halde yayılış sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Karakurt gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Karakurtun Gürcistan'da yayılışı nerede doğrulandı?",
      regionsMetricLabel: "doğrulanmış bölge",
    },
  },
  iNaturalistTaxonId: 151791,
  rangeSource: "record-summary",
  regionMetric: "confirmed",
};
