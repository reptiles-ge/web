import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The green toad map uses public iNaturalist photo observations from Georgia. Only regions with enough records in the records-by-region table are shaded on the map; other points are individual records. Record counts reflect observation effort, not population density.",
      mapAria:
        "Green toad field records and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where the green toad is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მწვანე გომბეშოს რუკა ეყრდნობა iNaturalist-ის საჯარო ფოტოდაკვირვებებს საქართველოდან. რუკაზე მონიშნულია მხოლოდ ის რეგიონები, რომლებსაც ჩანაწერების რეგიონულ ცხრილში საკმარისი ჩანაწერი აქვს; დანარჩენი წერტილები ცალკეული ჩანაწერებია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "მწვანე გომბეშოს საველე ჩანაწერები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის მწვანე გომბეშო დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта зелёной жабы основана на публичных фотонаблюдениях iNaturalist из Грузии. На карте закрашены только регионы с достаточным числом записей в таблице записей по регионам; остальные точки — отдельные записи. Число записей отражает интенсивность наблюдений, а не плотность популяции.",
      mapAria:
        "Полевые записи зелёной жабы и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где зелёная жаба отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Yeşil karakurbağa haritası Gürcistan'dan herkese açık iNaturalist fotoğraflı gözlemlerine dayanır. Haritada yalnızca bölgelere göre kayıt tablosunda yeterli kaydı olan bölgeler gösterilir; diğer noktalar tekil kayıtlardır. Kayıt sayısı popülasyon yoğunluğunu değil, gözlem yoğunluğunu yansıtır.",
      mapAria:
        "Yeşil karakurbağanın Gürcistan haritasında arazi kayıtları ve kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Yeşil karakurbağa Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 1453013,
  rangeSource: "record-summary",
};
