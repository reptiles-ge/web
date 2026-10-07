import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The peregrine falcon map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution; other regions remain recorded only. These observations do not establish breeding, and record counts reflect observation effort rather than population density.",
      mapAria:
        "Peregrine falcon observations and confirmed distribution regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where peregrine falcon distribution is confirmed in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "შავარდნის რუკა იყენებს საქართველოში iNaturalist-ის საჯარო ფოტოდაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი; დანარჩენში სახეობა მხოლოდ დაფიქსირებულია. ეს ჩანაწერები ბუდობას არ ადასტურებს, მათი რაოდენობა კი დაკვირვების ინტენსივობასაც ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "შავარდნის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის შავარდნის გავრცელება დადასტურებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта сапсана использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считаются только регионы со статусом «подтверждено»; остальные остаются лишь местами регистрации. Эти наблюдения не доказывают гнездование, а число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения сапсана и регионы с подтверждённым распространением на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение сапсана подтверждено в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Gökdoğan haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; diğer bölgelerde tür sadece kaydedilmiştir. Bu gözlemler üremeyi kanıtlamaz; kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını da yansıtır.",
      mapAria:
        "Gökdoğan gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Gökdoğanın Gürcistan'da yayılışı nerede doğrulandı?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 4647,
  rangeSource: "record-summary",
};
