import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Marsh Frog map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: a region with five or more records is shaded on the map; a region with fewer records is marked as having too few records. Record counts reflect observation effort, not population density.",
      mapAria:
        "Marsh Frog observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Marsh Frog: where it is recorded in Georgia",
      regionsMetricLabel: "regions with enough records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ტბორის ბაყაყის რუკა საქართველოში გაკეთებულ iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: ხუთი ან მეტი ჩანაწერის მქონე რეგიონი რუკაზე მონიშნულია; ნაკლები ჩანაწერის მქონე რეგიონს „ჩანაწერები ცოტაა“ სტატუსი აქვს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ტბორის ბაყაყის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ტბორის ბაყაყი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი საკმარისი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта озёрной лягушки основана на публичных фотонаблюдениях iNaturalist в Грузии. Регионы взяты из таблицы записей: регион с пятью и более записями закрашен на карте; при меньшем числе у региона статус «Мало записей». Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения озёрной лягушки и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где озёрная лягушка отмечена в Грузии",
      regionsMetricLabel: "региона с достаточным числом записей",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Göl kurbağası haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerine dayanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: beş veya daha fazla kaydı olan bölge haritada gösterilir; daha az kaydı olan bölge “Kayıt az” olarak işaretlenir. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Göl kurbağası gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Göl kurbağası Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "yeterli kaydı olan bölge",
    },
  },
  iNaturalistTaxonId: 1319807,
  rangeSource: "record-summary",
  regionMetric: "confirmed",
};
