import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Dahl's whip snake map combines Reptiles.ge field photos with public iNaturalist observations. The records-by-region table determines the shaded range: three or more field records confirm regional distribution; one or two remain recorded-only. Record counts do not measure population density.",
      mapAria:
        "Dahl's whip snake observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Region with confirmed distribution",
      rangeTitle: "Where Dahl's whip snake is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "წენგოსფერი მცურავის რუკა აერთიანებს Reptiles.ge-ის საველე ფოტოებსა და iNaturalist-ის საჯარო დაკვირვებებს. შეფერილი გავრცელება რეგიონული ცხრილის სტატუსს ეფუძნება: სულ მცირე 3 საველე ჩანაწერი რეგიონს დადასტურებულ სტატუსს ანიჭებს; 1–2 ჩანაწერი მხოლოდ დაფიქსირებულად ითვლება. ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვე არ არის.",
      mapAria:
        "წენგოსფერი მცურავის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის წენგოსფერი მცურავი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта оливкового полоза объединяет полевые фотографии Reptiles.ge и публичные наблюдения iNaturalist. Закрашенный ареал определяется региональной таблицей: три и более полевых записи подтверждают распространение в регионе; одна или две означают лишь наличие записей. Число записей не отражает плотность популяции.",
      mapAria:
        "Наблюдения оливкового полоза и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где оливковый полоз отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Dahl kırbaç yılanı haritası Reptiles.ge arazi fotoğraflarını ve herkese açık iNaturalist gözlemlerini birleştirir. Boyalı yayılış bölgesel tabloya dayanır: üç veya daha fazla arazi kaydı bölgesel yayılışı doğrular; bir veya iki kayıt yalnızca kaydedilmiş sayılır. Kayıt sayısı popülasyon yoğunluğunu göstermez.",
      mapAria:
        "Dahl kırbaç yılanı gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Dahl kırbaç yılanı Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 73910,
  rangeSource: "record-summary",
};
