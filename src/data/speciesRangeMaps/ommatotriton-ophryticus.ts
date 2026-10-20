import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Northern Banded Newt map uses public iNaturalist photo observations in Georgia. iNaturalist obscures every public coordinate for this species within a cell of about 20 km, so a point is approximate. Regions come from the records-by-region table: a region with five or more records is shaded on the map; a region with fewer records is marked as having too few records. A record whose obscured cell crosses a regional border, and an observation that still needs an ID, is shown but not counted. Record counts reflect observation effort, not population density.",
      mapAria:
        "Northern Banded Newt observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Northern Banded Newt: where it is recorded in Georgia",
      regionsMetricLabel: "regions with enough records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "კავკასიური ტრიტონის რუკა საქართველოში გაკეთებულ iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. iNaturalist ამ სახეობის ყველა საჯარო კოორდინატს დაახლოებით 20 კმ-იან უჯრაში ფარავს, ამიტომ წერტილი მიახლოებითია. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: ხუთი ან მეტი ჩანაწერის მქონე რეგიონი რუკაზე მონიშნულია; ნაკლები ჩანაწერის მქონე რეგიონს „ჩანაწერები ცოტაა“ სტატუსი აქვს. ჩანაწერი, რომლის დაფარული უჯრა რეგიონის საზღვარს კვეთს, და დაკვირვება, რომლის ამოცნობა ჯერ დადასტურებული არ არის, რუკაზე ჩანს, მაგრამ არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "კავკასიური ტრიტონის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის კავკასიური ტრიტონი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი საკმარისი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта северного полосатого тритона основана на публичных фотонаблюдениях iNaturalist в Грузии. iNaturalist скрывает все публичные координаты этого вида в ячейке около 20 км, поэтому точка приблизительна. Регионы взяты из таблицы записей: регион с пятью и более записями закрашен на карте; при меньшем числе у региона статус «Мало записей». Запись, скрытая ячейка которой пересекает границу региона, и наблюдение, которому ещё нужно подтверждение определения, показаны, но не учитываются. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения северного полосатого тритона и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где северный полосатый тритон отмечен в Грузии",
      regionsMetricLabel: "региона с достаточным числом записей",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kuzey şeritli semender haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerine dayanır. iNaturalist bu türün tüm açık koordinatlarını yaklaşık 20 km'lik bir hücre içinde gizler, bu yüzden nokta yaklaşıktır. Bölgeler, bölgelere göre kayıt tablosundan alınır: beş veya daha fazla kaydı olan bölge haritada gösterilir; daha az kaydı olan bölge “Kayıt az” olarak işaretlenir. Gizli hücresi bölge sınırını kesen kayıt ve tür teşhisi henüz doğrulanmamış gözlem gösterilir ama sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Kuzey şeritli semender gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kuzey şeritli semender Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "yeterli kaydı olan bölge",
    },
  },
  iNaturalistTaxonId: 64364,
  rangeSource: "record-summary",
  regionMetric: "confirmed",
};
