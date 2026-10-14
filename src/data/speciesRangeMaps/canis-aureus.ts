import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The golden jackal map uses reviewed public iNaturalist photo observations from Georgia. Only regions with enough records in the records-by-region table are shaded on the map; other points are individual records. Record counts reflect observation effort, not population density.",
      mapAria:
        "Golden jackal field records and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Golden jackal: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ტურას რუკა იყენებს საქართველოში გადამოწმებულ iNaturalist-ის საჯარო ფოტოდაკვირვებებს. რუკაზე შეფერილია მხოლოდ რეგიონი, რომელსაც ქვემოთ მოცემულ ცხრილში საკმარისი ჩანაწერი აქვს; სხვა წერტილები ცალკეული ჩანაწერებია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ტურას საველე ჩანაწერები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ტურა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта шакала использует проверенные публичные фотонаблюдения iNaturalist из Грузии. На карте окрашены только регионы с достаточным числом записей в таблице; остальные точки — отдельные находки. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Полевые записи шакала и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где шакал отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Çakal haritası Gürcistan'daki incelenmiş herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Haritada yalnızca kayıt tablosunda yeterli kaydı olan bölgeler boyanır; diğer noktalar tekil kayıtlardır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu değil.",
      mapAria:
        "Çakalın Gürcistan'daki arazi kayıtları ve kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Çakal Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 851014,
  rangeSource: "record-summary",
};
