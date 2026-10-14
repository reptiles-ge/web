import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The peregrine falcon map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map; other regions have too few records. These observations do not establish breeding, and record counts reflect observation effort rather than population density.",
      mapAria:
        "Peregrine falcon observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Peregrine falcon: where it is recorded in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "შავარდნის რუკა იყენებს საქართველოში iNaturalist-ის საჯარო ფოტოდაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მონიშნულია მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონები; დანარჩენში ჩანაწერები ცოტაა. ეს ჩანაწერები ბუდობას არ ადასტურებს, მათი რაოდენობა კი დაკვირვების ინტენსივობასაც ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "შავარდნის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის შავარდენი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта сапсана использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: на карте закрашены только регионы с достаточным числом записей; в остальных записей мало. Эти наблюдения не доказывают гнездование, а число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения сапсана и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где сапсан отмечен в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Gökdoğan haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler gösterilir; diğer bölgelerde kayıt azdır. Bu gözlemler üremeyi kanıtlamaz; kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını da yansıtır.",
      mapAria: "Gökdoğan gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Gökdoğan Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 4647,
  rangeSource: "record-summary",
};
