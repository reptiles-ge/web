import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Darevsky's viper map uses public iNaturalist observations. Regions are taken from the records-by-region table; only regions with confirmed status count as distribution, while recorded-only regions do not.",
      mapAria:
        "Darevsky's viper observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where Darevsky's viper distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "დარევსკის გველგესლას რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან; გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი, ხოლო მხოლოდ დაფიქსირებული რეგიონები გავრცელებად არ ითვლება.",
      mapAria:
        "დარევსკის გველგესლას დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის დარევსკის გველგესლას გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта гадюки Даревского использует публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы с подтверждённым статусом, а регионы только с находками не считаются распространением.",
      mapAria:
        "Наблюдения гадюки Даревского и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение гадюки Даревского подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Darevsky engereği haritası herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış sayılır, yalnızca kayıt bulunan bölgeler sayılmaz.",
      mapAria:
        "Darevsky engereğinin gözlemleri ve doğrulanmış bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Doğrulanmış yayılış bölgesi",
      rangeTitle:
        "Darevsky engereğinin yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 73995,
  rangeSource: "record-summary",
};
