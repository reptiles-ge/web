import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Caucasian rock lizard map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution; otherwise a region is not treated as part of the range. Record counts reflect observation effort, not population density.",
      mapAria:
        "Caucasian rock lizard observations and confirmed distribution regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle:
        "Where Caucasian rock lizard distribution is confirmed in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "კავკასიონის ხვლიკის რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "კავკასიონის ხვლიკის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის კავკასიონის ხვლიკის გავრცელება დადასტურებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта кавказской скальной ящерицы использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус; в остальных случаях регион распространением не считается. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения кавказской скальной ящерицы и регионы с подтверждённым распространением на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle:
        "Где распространение кавказской скальной ящерицы подтверждено в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kafkas kayalık kertenkelesi haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; aksi halde bölge yayılış sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Kafkas kayalık kertenkelesi gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle:
        "Kafkas kayalık kertenkelesinin Gürcistan'da yayılışı nerede doğrulandı?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 73750,
  rangeSource: "record-summary",
};
