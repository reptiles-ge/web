import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Dahl's whip snake map combines Reptiles.ge field photos with public iNaturalist observations. The records-by-region table determines the shaded range: regions with three or more field records are shaded on the map; one or two records count as too few records. Record counts do not measure population density.",
      mapAria:
        "Dahl's whip snake observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Dahl's whip snake: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "წენგოსფერი მცურავის რუკა აერთიანებს Reptiles.ge-ის საველე ფოტოებსა და iNaturalist-ის საჯარო დაკვირვებებს. შეფერილი რეგიონები რეგიონული ცხრილის სტატუსს ეფუძნება: რუკაზე შეფერილია სულ მცირე 3 საველე ჩანაწერის მქონე რეგიონი; 1–2 ჩანაწერი ცოტად ითვლება. ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვე არ არის.",
      mapAria:
        "წენგოსფერი მცურავის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის წენგოსფერი მცურავი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта оливкового полоза объединяет полевые фотографии Reptiles.ge и публичные наблюдения iNaturalist. Закрашенные регионы определяются региональной таблицей: на карте закрашены регионы с тремя и более полевыми записями; одной или двух записей мало. Число записей не отражает плотность популяции.",
      mapAria:
        "Наблюдения оливкового полоза и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где оливковый полоз отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Dahl kırbaç yılanı haritası Reptiles.ge arazi fotoğraflarını ve herkese açık iNaturalist gözlemlerini birleştirir. Boyalı bölgeler bölgesel tabloya dayanır: üç veya daha fazla arazi kaydı olan bölgeler haritada boyanır; bir veya iki kayıt az sayılır. Kayıt sayısı popülasyon yoğunluğunu göstermez.",
      mapAria:
        "Dahl kırbaç yılanı gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Dahl kırbaç yılanı Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 73910,
  rangeSource: "record-summary",
};
