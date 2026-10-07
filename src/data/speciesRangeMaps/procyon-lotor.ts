import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The raccoon map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution; otherwise a region is not treated as part of the range. Points outside the regional polygons stay in the total but are not assigned to a region. Record counts reflect observation effort, not population density.",
      mapAria:
        "Raccoon observations and confirmed distribution regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where raccoon distribution is confirmed in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ენოტის რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. რეგიონული პოლიგონების გარეთ დარჩენილი წერტილები საერთო რაოდენობაში შედის, მაგრამ რეგიონს არ მიეკუთვნება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ენოტის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის ენოტის გავრცელება დადასტურებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта енота-полоскуна использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус; в остальных случаях регион распространением не считается. Точки вне региональных полигонов входят в общее число, но к региону не относятся. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения енота-полоскуна и регионы с подтверждённым распространением на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение енота-полоскуна подтверждено в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Rakun haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; aksi halde bölge yayılış sayılmaz. Bölge poligonlarının dışında kalan noktalar toplama girer ama bir bölgeye yazılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria: "Rakun gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Rakunun Gürcistan'da yayılışı nerede doğrulandı?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 41663,
  rangeSource: "record-summary",
};
