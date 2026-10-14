import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The striped lizard map uses Reptiles.ge editorial photo records and public iNaturalist observations in Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map; a region with too few records is not shaded. Record counts reflect observation effort, not population density.",
      mapAria:
        "Striped lizard observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Striped lizard: where it is recorded in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ზოლიანი ხვლიკის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს საქართველოში. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონებია გამოკვეთილი; ცოტა ჩანაწერის მქონე რეგიონი არ გამოიკვეთება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ზოლიანი ხვლიკის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ზოლიანი ხვლიკი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта полосатой ящерицы объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: на карте выделены только регионы с достаточным числом записей; регион с малым числом записей не выделяется. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения полосатой ящерицы и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где полосатая ящерица отмечена в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Çizgili kertenkele haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve Gürcistan'daki herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler vurgulanır; kaydı az olan bölge vurgulanmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Çizgili kertenkele gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Çizgili kertenkele Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 35870,
  rangeSource: "record-summary",
};
