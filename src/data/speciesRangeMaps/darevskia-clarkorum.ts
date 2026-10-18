import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Clark's rock lizard map combines Reptiles.ge editorial photo records, Georgian Biodiversity Database localities from the Charnali area, and public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: a region with five or more records is shaded on the map; a region with fewer records is marked as having too few records. iNaturalist hides the exact position of this species, so its points show only an approximate area. Record counts reflect observation effort, not population density.",
      mapAria:
        "Clark's rock lizard observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Clark's rock lizard: where it is recorded in Georgia",
      regionsMetricLabel: "regions with enough records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "თურქული ხვლიკის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებს, Georgian Biodiversity Database-ის ლოკალიტეტებს ჭარნალის მიდამოებიდან და საქართველოში გაკეთებულ iNaturalist-ის საჯარო ფოტოდაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: ხუთი ან მეტი ჩანაწერის მქონე რეგიონი რუკაზე მონიშნულია; ნაკლები ჩანაწერის მქონე რეგიონს „ჩანაწერები ცოტაა“ სტატუსი აქვს. iNaturalist ამ სახეობის ზუსტ ადგილს მალავს, ამიტომ მისი წერტილები მხოლოდ მიახლოებით არეალს აჩვენებს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "თურქული ხვლიკის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის თურქული ხვლიკი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი საკმარისი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта ящерицы Кларка объединяет редакционные фотозаписи Reptiles.ge, локалитеты Georgian Biodiversity Database из окрестностей Чарнали и публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: регион с пятью и более записями закрашен на карте; при меньшем числе у региона статус «Мало записей». iNaturalist скрывает точное место находки этого вида, поэтому его точки показывают лишь примерный участок. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения ящерицы Кларка и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где ящерица Кларка отмечена в Грузии",
      regionsMetricLabel: "региона с достаточным числом записей",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Clark kayalık kertenkelesi haritası Reptiles.ge editoryal fotoğraf kayıtlarını, Charnali çevresinden Georgian Biodiversity Database lokalitelerini ve Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır: beş veya daha fazla kaydı olan bölge haritada gösterilir; daha az kaydı olan bölge “Kayıt az” olarak işaretlenir. iNaturalist bu türün tam konumunu gizler, bu yüzden oradaki noktalar yalnızca yaklaşık bir alanı gösterir. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Clark kayalık kertenkelesi gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Clark kayalık kertenkelesi Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "yeterli kaydı olan bölge",
    },
  },
  iNaturalistTaxonId: 35388,
  rangeSource: "record-summary",
  regionMetric: "confirmed",
};
