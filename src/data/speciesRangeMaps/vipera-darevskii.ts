import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Darevsky's viper map uses public iNaturalist observations. Regions are taken from the records-by-region table; only regions with enough records are shaded on the map, while regions with too few records are not.",
      mapAria:
        "Darevsky's viper observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Darevsky's viper: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "დარევსკის გველგესლას რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან; რუკაზე შეფერილია მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონები, ხოლო რეგიონები, სადაც ჩანაწერები ცოტაა, შეფერილი არ არის.",
      mapAria:
        "დარევსკის გველგესლას დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის დარევსკის გველგესლა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта гадюки Даревского использует публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; на карте закрашены только регионы с достаточным числом записей, а регионы, где записей мало, не закрашены.",
      mapAria:
        "Наблюдения гадюки Даревского и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где гадюка Даревского отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Darevsky engereği haritası herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır; haritada yalnızca yeterli kaydı olan bölgeler boyanır, kaydı az olan bölgeler boyanmaz.",
      mapAria:
        "Darevsky engereğinin gözlemleri ve kayıt bulunan bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Darevsky engereği Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 73995,
  rangeSource: "record-summary",
};
