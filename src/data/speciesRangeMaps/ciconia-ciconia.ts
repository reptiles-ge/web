import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The white stork map uses public iNaturalist observations from Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map; other regions have too few records. These observations do not by themselves establish breeding. Record counts reflect observation effort, not population density.",
      mapAria:
        "White stork observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "White stork: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "თეთრი ყარყატის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონებია გამოყოფილი, დანარჩენში ჩანაწერები ცოტაა. ეს ჩანაწერები თავისთავად ბუდობას არ ადასტურებს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "თეთრი ყარყატის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის თეთრი ყარყატი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта белого аиста основана на публичных наблюдениях iNaturalist в Грузии. Регионы взяты из таблицы записей: на карте выделены только регионы с достаточным числом записей, в остальных записей мало. Эти наблюдения сами по себе не доказывают гнездование. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения белого аиста и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где белый аист отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Leylek haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan gelir: haritada yalnızca yeterli kaydı olan bölgeler gölgelendirilir; diğerlerinde kayıt azdır. Bu gözlemler tek başına üremeyi kanıtlamaz. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Leylek gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Leylek Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 4733,
  rangeSource: "record-summary",
};
