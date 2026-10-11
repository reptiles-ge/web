import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The wolf map uses public iNaturalist photo observations from Georgia. Only regions marked confirmed in the records-by-region table are shaded as distribution; other points are individual records. Record counts reflect observation effort, not population density.",
      mapAria:
        "Wolf field records and confirmed distribution on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where the wolf is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მგლის რუკა იყენებს საქართველოში გაკეთებულ iNaturalist-ის საჯარო ფოტოდაკვირვებებს. გავრცელებად შეფერილია მხოლოდ რეგიონი, რომელსაც ქვემოთ მოცემულ ცხრილში დადასტურებული სტატუსი აქვს; სხვა წერტილები ცალკეული ჩანაწერებია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "მგლის საველე ჩანაწერები და დადასტურებული გავრცელება საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის მგელი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта волка использует публичные фотонаблюдения iNaturalist из Грузии. Как распространение окрашены только регионы с подтверждённым статусом в таблице записей; остальные точки — отдельные находки. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Полевые записи волка и подтверждённое распространение на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где волк отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kurt haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Yalnızca kayıt tablosunda doğrulanmış durumdaki bölgeler yayılış olarak boyanır; diğer noktalar tekil kayıtlardır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu değil.",
      mapAria: "Kurdun Gürcistan'daki arazi kayıtları ve doğrulanmış yayılışı",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Kurt Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 42048,
  rangeSource: "record-summary",
};
