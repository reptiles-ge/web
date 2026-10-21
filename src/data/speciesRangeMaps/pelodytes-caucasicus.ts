import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Caucasian Parsley Frog map uses public iNaturalist photo observations in Georgia. iNaturalist obscures all public coordinates for this species within a cell of about 20 km, so the points are approximate. Regions come from the records-by-region table: a region with five or more records is shaded on the map; a region with fewer records is marked as having too few records. Record counts reflect observation effort, not population density.",
      mapAria:
        "Caucasian Parsley Frog observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Caucasian Parsley Frog: where it is recorded in Georgia",
      regionsMetricLabel: "regions with enough records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "კავკასიური ჯვრიანას რუკა საქართველოში გაკეთებულ iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. iNaturalist ამ სახეობის ყველა საჯარო კოორდინატს დაახლოებით 20 კმ-იან უჯრაში ფარავს, ამიტომ წერტილები მიახლოებითია. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: ხუთი ან მეტი ჩანაწერის მქონე რეგიონი რუკაზე მონიშნულია; ნაკლები ჩანაწერის მქონე რეგიონს „ჩანაწერები ცოტაა“ სტატუსი აქვს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "კავკასიური ჯვრიანას დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის კავკასიური ჯვრიანა დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი საკმარისი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта кавказской крестовки основана на публичных фотонаблюдениях iNaturalist в Грузии. iNaturalist скрывает все публичные координаты этого вида в ячейке около 20 км, поэтому точки приблизительны. Регионы взяты из таблицы записей: регион с пятью и более записями закрашен на карте; при меньшем числе у региона статус «Мало записей». Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения кавказской крестовки и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где кавказская крестовка отмечена в Грузии",
      regionsMetricLabel: "региона с достаточным числом записей",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kafkas maydanoz kurbağası haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerine dayanır. iNaturalist bu türün tüm açık koordinatlarını yaklaşık 20 km'lik bir hücre içinde gizler, bu yüzden noktalar yaklaşıktır. Bölgeler, bölgelere göre kayıt tablosundan alınır: beş veya daha fazla kaydı olan bölge haritada gösterilir; daha az kaydı olan bölge “Kayıt az” olarak işaretlenir. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Kafkas maydanoz kurbağası gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kafkas maydanoz kurbağası Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "yeterli kaydı olan bölge",
    },
  },
  iNaturalistTaxonId: 25317,
  rangeSource: "record-summary",
  regionMetric: "confirmed",
};
