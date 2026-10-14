import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Chukar map uses public iNaturalist observations from Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map; other regions have too few records. Points outside the map's regional polygons remain in the total but are not assigned to a region. Counts reflect observation effort, not population density.",
      mapAria:
        "Chukar observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Chukar: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "კაკბის რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოდან. რეგიონები აღებულია ქვემოთ მოცემული ჩანაწერების ცხრილიდან: რუკაზე მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონებია გამოყოფილი, სხვა რეგიონებში ჩანაწერები ცოტაა. რეგიონული პოლიგონების გარეთ დარჩენილი წერტილები საერთო რაოდენობაში შედის, მაგრამ რეგიონს არ მიეკუთვნება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობასაც ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "კაკბის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის კაკაბი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта кеклика использует публичные наблюдения iNaturalist из Грузии. Регионы взяты из таблицы записей: на карте выделены только регионы с достаточным числом записей, в остальных записей мало. Точки вне региональных полигонов включены в общее число, но не отнесены к региону. Число записей также отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения кеклика и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где кеклик отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kınalı keklik haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Bölgeler kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler gölgelendirilir; diğerlerinde kayıt azdır. Bölge poligonlarının dışındaki noktalar genel toplama dahildir, ancak bir bölgeye atanmaz. Kayıt sayısı gözlem çabasını da yansıtır, nüfus yoğunluğunu ölçmez.",
      mapAria:
        "Kınalı keklik gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kınalı keklik Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 846,
  rangeSource: "record-summary",
};
