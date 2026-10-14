import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The cuckoo map uses public iNaturalist photo observations from Georgia. Only regions with enough records in the records-by-region table are shaded on the map; other points are individual records. Record counts reflect observation effort, not population density.",
      mapAria:
        "Common cuckoo field records and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where the common cuckoo is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "გუგულის რუკა ეყრდნობა iNaturalist-ის საჯარო ფოტოდაკვირვებებს საქართველოდან. რუკაზე მონიშნულია მხოლოდ ის რეგიონები, რომლებსაც ჩანაწერების რეგიონულ ცხრილში საკმარისი ჩანაწერი აქვს; დანარჩენი წერტილები ცალკეული ჩანაწერებია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "გუგულის საველე ჩანაწერები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის გუგული დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта кукушки основана на публичных фотонаблюдениях iNaturalist из Грузии. На карте закрашены только регионы с достаточным числом записей в таблице записей по регионам; остальные точки — отдельные записи. Число записей отражает интенсивность наблюдений, а не плотность популяции.",
      mapAria:
        "Полевые записи обыкновенной кукушки и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где обыкновенная кукушка отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Guguk kuşu haritası Gürcistan'dan herkese açık iNaturalist fotoğraflı gözlemlerine dayanır. Haritada yalnızca bölgelere göre kayıt tablosunda yeterli kaydı olan bölgeler gösterilir; diğer noktalar tekil kayıtlardır. Kayıt sayısı popülasyon yoğunluğunu değil, gözlem yoğunluğunu yansıtır.",
      mapAria:
        "Guguk kuşunun Gürcistan haritasında arazi kayıtları ve kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Guguk kuşu Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 1907,
  rangeSource: "record-summary",
};
