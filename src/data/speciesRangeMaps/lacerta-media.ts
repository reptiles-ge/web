import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Caucasian green lizard map uses Reptiles.ge editorial photo records and public iNaturalist observations in Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map; a region with too few records is not shaded. Records with obscured coordinates or without a research-grade identification do not count towards a region's status. Record counts reflect observation effort, not population density.",
      mapAria:
        "Caucasian green lizard observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Caucasian green lizard: where it is recorded in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "საშუალო ხვლიკის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს საქართველოში. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონებია გამოკვეთილი; ცოტა ჩანაწერის მქონე რეგიონი არ გამოიკვეთება. დაფარული კოორდინატის ან დაუდასტურებელი სარკვევის მქონე ჩანაწერი რეგიონის სტატუსში არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "საშუალო ხვლიკის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის საშუალო ხვლიკი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта кавказской зелёной ящерицы объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: на карте выделены только регионы с достаточным числом записей; регион с малым числом записей не выделяется. Записи со скрытыми координатами или без подтверждённого определения не учитываются в статусе региона. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения кавказской зелёной ящерицы и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где кавказская зелёная ящерица отмечена в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kafkas yeşil kertenkelesi haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve Gürcistan'daki herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler vurgulanır; kaydı az olan bölge vurgulanmaz. Koordinatı gizlenmiş ya da tanımı doğrulanmamış kayıtlar bölgenin durumuna sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Kafkas yeşil kertenkelesi gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kafkas yeşil kertenkelesi Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 73839,
  rangeSource: "record-summary",
};
