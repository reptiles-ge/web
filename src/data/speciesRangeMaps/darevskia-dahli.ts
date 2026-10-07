import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Dahl's rock lizard map combines precise localities with public iNaturalist photo observations in Georgia. Those public coordinates are obscured by about 28 km, so a point near a regional border does not confirm that region. Precise localities count toward confirmed status. Regions come from the records-by-region table: only confirmed status counts as distribution; otherwise a region is not treated as part of the range. Record counts reflect observation effort, not population density.",
      mapAria:
        "Dahl's rock lizard observations and confirmed distribution regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle:
        "Where Dahl's rock lizard distribution is confirmed in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "დალის ხვლიკის რუკა ზუსტ ლოკალიტეტებსა და iNaturalist-ის საჯარო ფოტოდაკვირვებებს აერთიანებს. ეს საჯარო კოორდინატები დაახლოებით 28 კმ-ითაა დაფარული, ამიტომ საზღვართან მდებარე წერტილი რეგიონს არ ადასტურებს. ზუსტი ლოკალიტეტები დადასტურებულ სტატუსში ითვლება. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "დალის ხვლიკის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის დალის ხვლიკის გავრცელება დადასტურებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта ящерицы Даля объединяет точные локалитеты и публичные фотонаблюдения iNaturalist в Грузии. Эти публичные координаты скрыты примерно на 28 км, поэтому точка у границы не подтверждает регион. Точные локалитеты учитываются в подтверждённом статусе. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус; в остальных случаях регион распространением не считается. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения ящерицы Даля и регионы с подтверждённым распространением на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение ящерицы Даля подтверждено в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Dahl kayalık kertenkelesi haritası kesin lokaliteleri Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemleriyle birleştirir. Bu açık koordinatlar yaklaşık 28 km gizlenmiştir, bu yüzden sınıra yakın bir nokta bölgeyi doğrulamaz. Kesin lokaliteler doğrulanmış duruma sayılır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; aksi halde bölge yayılış sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Dahl kayalık kertenkelesi gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle:
        "Dahl kayalık kertenkelesinin Gürcistan'da yayılışı nerede doğrulandı?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 73752,
  rangeSource: "record-summary",
};
