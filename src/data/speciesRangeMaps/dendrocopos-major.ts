import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The great spotted woodpecker map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map; other regions are not shaded. Record counts reflect observation effort, not population density.",
      mapAria:
        "Great spotted woodpecker observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Great spotted woodpecker: where it is recorded in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "დიდი ჭრელი კოდალას რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მონიშნულია მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონები; დანარჩენი რეგიონები მონიშნული არ არის. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "დიდი ჭრელი კოდალას დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის დიდი ჭრელი კოდალა დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта большого пёстрого дятла использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: на карте закрашены только регионы с достаточным числом записей; остальные регионы не закрашены. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения большого пёстрого дятла и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где большой пёстрый дятел отмечен в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Orman alaca ağaçkakanı haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler gösterilir; diğer bölgeler gösterilmez. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Orman alaca ağaçkakanı gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Orman alaca ağaçkakanı Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 17871,
  rangeSource: "record-summary",
};
