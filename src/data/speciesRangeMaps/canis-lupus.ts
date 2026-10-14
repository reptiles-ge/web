import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The wolf map uses public iNaturalist photo observations from Georgia. Only regions with enough records in the records-by-region table are shaded on the map; other points are individual records. Record counts reflect observation effort, not population density.",
      mapAria:
        "Wolf field records and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where the wolf is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მგლის რუკა იყენებს საქართველოში გაკეთებულ iNaturalist-ის საჯარო ფოტოდაკვირვებებს. რუკაზე შეფერილია მხოლოდ რეგიონი, რომელსაც ქვემოთ მოცემულ ცხრილში საკმარისი ჩანაწერი აქვს; სხვა წერტილები ცალკეული ჩანაწერებია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "მგლის საველე ჩანაწერები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის მგელი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта волка использует публичные фотонаблюдения iNaturalist из Грузии. На карте окрашены только регионы с достаточным числом записей в таблице; остальные точки — отдельные находки. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Полевые записи волка и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где волк отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kurt haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Haritada yalnızca kayıt tablosunda yeterli kaydı olan bölgeler boyanır; diğer noktalar tekil kayıtlardır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu değil.",
      mapAria:
        "Kurdun Gürcistan'daki arazi kayıtları ve kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kurt Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 42048,
  rangeSource: "record-summary",
};
