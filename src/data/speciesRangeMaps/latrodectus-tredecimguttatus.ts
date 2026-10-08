import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Mediterranean black widow map takes regions from its records-by-region table. One record is enough to confirm distribution; a region with no records is not treated as part of the range. Record counts reflect observation effort, not population density.",
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
        "ყარაყურთის რუკის რეგიონები ჩანაწერების რეგიონული ცხრილიდანაა. ერთი ჩანაწერიც საკმარისია, რომ გავრცელება დადასტურდეს; ჩანაწერის არმქონე რეგიონი გავრცელებულად არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ყარაყურთის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის ყარაყურთის გავრცელება დადასტურებული საქართველოში",
      regionsMetricLabel: "დადასტურებული რეგიონი",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Регионы карты каракурта взяты из таблицы записей по регионам. Одной записи достаточно, чтобы распространение считалось подтверждённым; регион без записей распространением не считается. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения каракурта и регионы с подтверждённым распространением на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение каракурта подтверждено в Грузии",
      regionsMetricLabel: "подтверждённых региона",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Karakurt haritasının bölgeleri, bölgelere göre kayıt tablosundan alınır. Tek bir kayıt yayılışın doğrulanması için yeterlidir; kaydı olmayan bölge yayılış sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
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
