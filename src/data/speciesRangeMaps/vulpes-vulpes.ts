import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The red fox map uses public iNaturalist photo observations from Georgia. Only regions marked confirmed in the records-by-region table are shaded as distribution; other points are individual records. Record counts reflect observation effort, not population density.",
      mapAria:
        "Red fox field records and confirmed distribution on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where red fox is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მელას რუკა იყენებს საქართველოში გაკეთებულ iNaturalist-ის საჯარო ფოტოდაკვირვებებს. გავრცელებად შეფერილია მხოლოდ რეგიონი, რომელსაც ქვემოთ მოცემულ ცხრილში დადასტურებული სტატუსი აქვს; სხვა წერტილები ცალკეული ჩანაწერებია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "მელას საველე ჩანაწერები და დადასტურებული გავრცელება საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის მელა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта лисицы использует публичные фотонаблюдения iNaturalist из Грузии. Как распространение окрашены только регионы с подтверждённым статусом в таблице записей; остальные точки — отдельные находки. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Полевые записи лисицы и подтверждённое распространение на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где лисица отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kızıl tilki haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Yalnızca kayıt tablosunda doğrulanmış durumdaki bölgeler yayılış olarak boyanır; diğer noktalar tekil kayıtlardır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu değil.",
      mapAria:
        "Kızıl tilkinin Gürcistan'daki arazi kayıtları ve doğrulanmış yayılışı",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Kızıl tilki Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 42069,
  rangeSource: "record-summary",
};
