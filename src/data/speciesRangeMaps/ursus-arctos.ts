import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The brown bear map uses public iNaturalist photo observations from Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map, while low-count or uncertain regions are not shaded. Record counts reflect observation effort, not population density.",
      mapAria:
        "Brown bear observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Brown bear: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მურა დათვის რუკა იყენებს iNaturalist-ის საჯარო ფოტოდაკვირვებებს საქართველოდან. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე შეფერილია მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონები, ხოლო მცირე რაოდენობის ან გაურკვეველი ჩანაწერების რეგიონები შეფერილი არ არის. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "მურა დათვის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის მურა დათვი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта бурого медведя использует публичные фотонаблюдения iNaturalist из Грузии. Регионы взяты из таблицы записей: на карте закрашены только регионы с достаточным числом записей, а регионы с малым числом или неопределёнными записями не закрашены. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения бурого медведя и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где бурый медведь отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Boz ayı haritası Gürcistan'daki herkese açık iNaturalist fotoğraf gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler boyanır; az sayıdaki veya belirsiz kayıtların bulunduğu bölgeler boyanmaz. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu ölçmez.",
      mapAria:
        "Boz ayı gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Boz ayı Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 41641,
  rangeSource: "record-summary",
};
