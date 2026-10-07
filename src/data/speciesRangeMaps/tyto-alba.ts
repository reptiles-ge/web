import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The western barn owl map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution; otherwise a region is not treated as part of the range. Some place names on individual observations do not match the coordinate, and a mismatched label does not confirm that named region. Record counts reflect observation effort, not population density.",
      mapAria:
        "Western barn owl observations and confirmed distribution regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where western barn owl distribution is confirmed in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ბუხრინწას რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ცალკეული დაკვირვების ადგილის წარწერა კოორდინატს რომ არ ემთხვევა, ეს წარწერა იმ რეგიონს არ ადასტურებს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ბუხრინწას დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის ბუხრინწას გავრცელება დადასტურებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта сипухи использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус; в остальных случаях регион распространением не считается. Если подпись места у отдельного наблюдения не совпадает с координатой, эта подпись не подтверждает названный регион. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения сипухи и регионы с подтверждённым распространением на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение сипухи подтверждено в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Peçeli baykuş haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; aksi halde bölge yayılış sayılmaz. Tek bir gözlemin yer adı koordinatla uyuşmuyorsa bu ad o bölgeyi doğrulamaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Peçeli baykuş gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Peçeli baykuşun Gürcistan'da yayılışı nerede doğrulandı?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 20445,
  rangeSource: "record-summary",
};
