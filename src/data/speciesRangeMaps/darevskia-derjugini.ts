import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Artvin lizard map uses public iNaturalist photo observations in Georgia. Those public coordinates are obscured by about 28 km, so a point near a regional border is approximate. Regions come from the records-by-region table: five or more records confirm distribution; fewer records leave the region recorded only. Record counts reflect observation effort, not population density.",
      mapAria:
        "Artvin lizard observations and confirmed distribution regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where Artvin lizard distribution is confirmed in Georgia",
      regionsMetricLabel: "confirmed regions",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ართვინის ხვლიკის რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. ეს საჯარო კოორდინატები დაახლოებით 28 კმ-ითაა დაფარული, ამიტომ საზღვართან მდებარე წერტილი მიახლოებითია. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: ხუთი ან მეტი ჩანაწერი გავრცელებას ადასტურებს; ნაკლები ჩანაწერის მქონე რეგიონი მხოლოდ დაფიქსირებულად რჩება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ართვინის ხვლიკის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის ართვინის ხვლიკის გავრცელება დადასტურებული საქართველოში",
      regionsMetricLabel: "დადასტურებული რეგიონი",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта артвинской ящерицы использует публичные фотонаблюдения iNaturalist в Грузии. Эти публичные координаты скрыты примерно на 28 км, поэтому точка у границы региона приблизительна. Регионы взяты из таблицы записей: пять и более записей подтверждают распространение; меньшее число оставляет регион только зафиксированным. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения артвинской ящерицы и регионы с подтверждённым распространением на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle:
        "Где распространение артвинской ящерицы подтверждено в Грузии",
      regionsMetricLabel: "подтверждённых региона",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Artvin kertenkelesi haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bu açık koordinatlar yaklaşık 28 km gizlenmiştir, bu yüzden bölge sınırına yakın bir nokta yaklaşıktır. Bölgeler, bölgelere göre kayıt tablosundan alınır: beş veya daha fazla kayıt yayılışı doğrular; daha az kayıt bölgeyi yalnızca kaydedilmiş bırakır. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Artvin kertenkelesi gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle:
        "Artvin kertenkelesinin Gürcistan'da yayılışı nerede doğrulandı?",
      regionsMetricLabel: "doğrulanmış bölge",
    },
  },
  iNaturalistTaxonId: 35387,
  rangeSource: "record-summary",
  regionMetric: "confirmed",
};
