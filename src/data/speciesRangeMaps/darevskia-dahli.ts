import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Dahl's rock lizard map combines precise localities with public iNaturalist photo observations in Georgia. Those public coordinates are obscured by about 28 km, so a point near a regional border is approximate. Precise localities count toward a region's records. Regions come from the records-by-region table: only regions with enough records are shaded on the map; other regions are not shaded. Record counts reflect observation effort, not population density.",
      mapAria:
        "Dahl's rock lizard observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Dahl's rock lizard: where it is recorded in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "დალის ხვლიკის რუკა ზუსტ ლოკალიტეტებსა და iNaturalist-ის საჯარო ფოტოდაკვირვებებს აერთიანებს. ეს საჯარო კოორდინატები დაახლოებით 28 კმ-ითაა დაფარული, ამიტომ საზღვართან მდებარე წერტილი მიახლოებითია. ზუსტი ლოკალიტეტები რეგიონის ჩანაწერებში ითვლება. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მონიშნულია მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონები; დანარჩენი რეგიონები მონიშნული არ არის. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "დალის ხვლიკის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის დალის ხვლიკი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта ящерицы Даля объединяет точные локалитеты и публичные фотонаблюдения iNaturalist в Грузии. Эти публичные координаты скрыты примерно на 28 км, поэтому точка у границы региона приблизительна. Точные локалитеты учитываются в записях региона. Регионы взяты из таблицы записей: на карте закрашены только регионы с достаточным числом записей; остальные регионы не закрашены. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения ящерицы Даля и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где ящерица Даля отмечена в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Dahl kayalık kertenkelesi haritası kesin lokaliteleri Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemleriyle birleştirir. Bu açık koordinatlar yaklaşık 28 km gizlenmiştir, bu yüzden sınıra yakın bir nokta yaklaşıktır. Kesin lokaliteler bölgenin kayıtlarına sayılır. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler gösterilir; diğer bölgeler gösterilmez. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Dahl kayalık kertenkelesi gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Dahl kayalık kertenkelesi Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 73752,
  rangeSource: "record-summary",
};
