import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Caucasian badger map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map; a region with too few records is not shaded. Points outside the regional polygons stay in the total but are not assigned to a region. Record counts reflect observation effort, not population density.",
      mapAria:
        "Caucasian badger observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where the Caucasian badger is recorded in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მაჩვის რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონებია გამოკვეთილი; ცოტა ჩანაწერის მქონე რეგიონი არ გამოიკვეთება. რეგიონული პოლიგონების გარეთ დარჩენილი წერტილები საერთო რაოდენობაში შედის, მაგრამ რეგიონს არ მიეკუთვნება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "მაჩვის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის მაჩვი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта кавказского барсука использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: на карте выделены только регионы с достаточным числом записей; регион с малым числом записей не выделяется. Точки вне региональных полигонов входят в общее число, но к региону не относятся. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения кавказского барсука и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где кавказский барсук отмечен в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kafkas porsuğu haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler vurgulanır; kaydı az olan bölge vurgulanmaz. Bölge poligonlarının dışında kalan noktalar toplama girer ama bir bölgeye yazılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Kafkas porsuğu gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kafkas porsuğu Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 855298,
  rangeSource: "record-summary",
};
