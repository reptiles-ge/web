import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Eastern Spadefoot map uses public iNaturalist photo observations in Georgia. iNaturalist obscures most public coordinates for this species within a cell of about 20 km, so many points are approximate. Regions come from the records-by-region table: a region with five or more records is shaded on the map; a region with fewer records is marked as having too few records. Record counts reflect observation effort, not population density.",
      mapAria:
        "Eastern Spadefoot observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Eastern Spadefoot: where it is recorded in Georgia",
      regionsMetricLabel: "regions with enough records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "სირიული მყვრის რუკა საქართველოში გაკეთებულ iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. iNaturalist ამ სახეობის საჯარო კოორდინატების უმეტესობას დაახლოებით 20 კმ-იან უჯრაში ფარავს, ამიტომ ბევრი წერტილი მიახლოებითია. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: ხუთი ან მეტი ჩანაწერის მქონე რეგიონი რუკაზე მონიშნულია; ნაკლები ჩანაწერის მქონე რეგიონს „ჩანაწერები ცოტაა“ სტატუსი აქვს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "სირიული მყვრის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის სირიული მყვარი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი საკმარისი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта восточной чесночницы основана на публичных фотонаблюдениях iNaturalist в Грузии. iNaturalist скрывает большинство публичных координат этого вида в ячейке около 20 км, поэтому многие точки приблизительны. Регионы взяты из таблицы записей: регион с пятью и более записями закрашен на карте; при меньшем числе у региона статус «Мало записей». Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения восточной чесночницы и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где восточная чесночница отмечена в Грузии",
      regionsMetricLabel: "региона с достаточным числом записей",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Doğu kazayak kurbağası haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerine dayanır. iNaturalist bu türün açık koordinatlarının çoğunu yaklaşık 20 km'lik bir hücre içinde gizler, bu yüzden birçok nokta yaklaşıktır. Bölgeler, bölgelere göre kayıt tablosundan alınır: beş veya daha fazla kaydı olan bölge haritada gösterilir; daha az kaydı olan bölge “Kayıt az” olarak işaretlenir. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Doğu kazayak kurbağası gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Doğu kazayak kurbağası Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "yeterli kaydı olan bölge",
    },
  },
  iNaturalistTaxonId: 25313,
  rangeSource: "record-summary",
  regionMetric: "confirmed",
};
