import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Mediterranean black widow map takes regions from its records-by-region table. One record is enough for a region to be shaded on the map; a region with no records is not shaded. Record counts reflect observation effort, not population density.",
      mapAria:
        "Mediterranean black widow observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Mediterranean black widow: where it is recorded in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ყარაყურთის რუკის რეგიონები ჩანაწერების რეგიონული ცხრილიდანაა. ერთი ჩანაწერიც საკმარისია, რომ რეგიონი რუკაზე გამოიკვეთოს; ჩანაწერის არმქონე რეგიონი არ გამოიკვეთება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ყარაყურთის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ყარაყურთი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Регионы карты каракурта взяты из таблицы записей по регионам. Одной записи достаточно, чтобы регион был выделен на карте; регион без записей не выделяется. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения каракурта и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где каракурт отмечен в Грузии",
      regionsMetricLabel: "региона с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Karakurt haritasının bölgeleri, bölgelere göre kayıt tablosundan alınır. Bir bölgenin haritada vurgulanması için tek bir kayıt yeterlidir; kaydı olmayan bölge vurgulanmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria: "Karakurt gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Karakurt Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 151791,
  rangeSource: "record-summary",
  regionMetric: "confirmed",
};
