import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Egyptian vulture map uses public iNaturalist observations from Georgia together with editorial photo records. Regions come from the records-by-region table: only regions with enough records are shaded on the map; other regions have too few records. Record counts reflect observation effort, not population density.",
      mapAria:
        "Egyptian vulture observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Egyptian vulture: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ფასკუნჯის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებსა და სარედაქციო ფოტოჩანაწერებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონებია გამოკვეთილი, დანარჩენში ჩანაწერები ცოტაა. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ფასკუნჯის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ფასკუნჯი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта стервятника основана на публичных наблюдениях iNaturalist в Грузии и редакционных фотозаписях. Регионы взяты из таблицы записей: на карте выделены только регионы с достаточным числом записей, в остальных записей мало. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения стервятника и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где стервятник отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Küçük akbaba haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini ve editoryal fotoğraf kayıtlarını kullanır. Bölgeler, bölgelere göre kayıt tablosundan gelir: haritada yalnızca yeterli kaydı olan bölgeler vurgulanır; diğerlerinde kayıt azdır. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Küçük akbaba gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Küçük akbaba Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 5361,
  rangeSource: "record-summary",
};
