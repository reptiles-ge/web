import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The cuckoo map uses public iNaturalist photo observations from Georgia. Only regions marked confirmed in the records-by-region table are shaded as distribution; other points are individual records. Record counts reflect observation effort, not population density.",
      mapAria:
        "Common cuckoo field records and confirmed distribution on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where the common cuckoo is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "გუგულის რუკა ეყრდნობა iNaturalist-ის საჯარო ფოტოდაკვირვებებს საქართველოდან. გავრცელებად მონიშნულია მხოლოდ ის რეგიონები, რომლებსაც ჩანაწერების რეგიონულ ცხრილში დადასტურებული სტატუსი აქვს; დანარჩენი წერტილები ცალკეული ჩანაწერებია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "გუგულის საველე ჩანაწერები და დადასტურებული გავრცელება საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის გუგული დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта кукушки основана на публичных фотонаблюдениях iNaturalist из Грузии. Распространением закрашены только регионы со статусом «подтверждено» в таблице записей по регионам; остальные точки — отдельные записи. Число записей отражает интенсивность наблюдений, а не плотность популяции.",
      mapAria:
        "Полевые записи и подтверждённое распространение обыкновенной кукушки на карте Грузии",
      officialRegionLabel: "Регион подтверждённого распространения",
      rangeTitle: "Где обыкновенная кукушка отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Guguk kuşu haritası Gürcistan'dan herkese açık iNaturalist fotoğraflı gözlemlerine dayanır. Yalnızca bölgelere göre kayıt tablosunda doğrulanmış olarak işaretlenen bölgeler yayılış olarak gösterilir; diğer noktalar tekil kayıtlardır. Kayıt sayısı popülasyon yoğunluğunu değil, gözlem yoğunluğunu yansıtır.",
      mapAria:
        "Guguk kuşunun Gürcistan haritasında arazi kayıtları ve doğrulanmış yayılışı",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Guguk kuşu Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 1907,
  rangeSource: "record-summary",
};
