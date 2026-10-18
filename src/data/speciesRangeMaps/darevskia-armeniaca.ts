import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Armenian rock lizard map shows public iNaturalist photo observations in Georgia. Some observers obscure their coordinates by about 28 km; those points are approximate and do not count toward a region's status. Regions come from the records-by-region table: only regions with enough records are shaded on the map; other regions are not shaded. Darevskia species look alike, so a single observation is not a confirmed identification. Record counts reflect observation effort, not population density.",
      mapAria:
        "Armenian rock lizard observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Armenian rock lizard: where it is recorded in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "სომხური კლდის ხვლიკის რუკაზე ნაჩვენებია iNaturalist-ის საჯარო ფოტოდაკვირვებები საქართველოში. ზოგი დამკვირვებელი კოორდინატს დაახლოებით 28 კმ-ით ფარავს; ასეთი წერტილი მიახლოებითია და რეგიონის სტატუსში არ ითვლება. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მონიშნულია მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონები; დანარჩენი რეგიონები მონიშნული არ არის. Darevskia-ს სახეობები ერთმანეთს ჰგვანან, ამიტომ ცალკეული დაკვირვება დადასტურებული ამოცნობა არ არის. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "სომხური კლდის ხვლიკის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის სომხური კლდის ხვლიკი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "На карте армянской скальной ящерицы показаны публичные фотонаблюдения iNaturalist в Грузии. Некоторые наблюдатели скрывают координаты примерно на 28 км; такие точки приблизительны и не учитываются в статусе региона. Регионы взяты из таблицы записей: на карте закрашены только регионы с достаточным числом записей; остальные регионы не закрашены. Виды Darevskia похожи друг на друга, поэтому отдельное наблюдение не является подтверждённым определением. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения армянской скальной ящерицы и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где армянская скальная ящерица отмечена в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Ermeni kayalık kertenkelesi haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini gösterir. Bazı gözlemciler koordinatlarını yaklaşık 28 km gizler; bu noktalar yaklaşıktır ve bölgenin durumuna sayılmaz. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler gösterilir; diğer bölgeler gösterilmez. Darevskia türleri birbirine benzer, bu yüzden tek bir gözlem doğrulanmış bir teşhis değildir. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Ermeni kayalık kertenkelesi gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Ermeni kayalık kertenkelesi Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 35390,
  rangeSource: "record-summary",
};
