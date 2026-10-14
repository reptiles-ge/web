import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The griffon vulture map uses public iNaturalist observations from Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map; other regions have too few records. Observations do not by themselves confirm nesting. Record counts reflect observation effort, not population density.",
      mapAria:
        "Griffon vulture observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Griffon vulture: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ორბის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მონიშნულია მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონები, დანარჩენში ჩანაწერები ცოტაა. დაკვირვება თავისთავად ბუდობას არ ადასტურებს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ორბის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ორბი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта белоголового сипа основана на публичных наблюдениях iNaturalist в Грузии. Регионы взяты из таблицы записей: на карте закрашены только регионы с достаточным числом записей, в остальных регионах записей мало. Наблюдения сами по себе не подтверждают гнездование. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения белоголового сипа и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где белоголовый сип отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kızıl akbaba haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan gelir: haritada yalnızca yeterli kaydı olan bölgeler gösterilir; diğerlerinde kayıt azdır. Gözlemler tek başına üremeyi doğrulamaz. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Kızıl akbaba gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kızıl akbaba Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 5366,
  rangeSource: "record-summary",
};
