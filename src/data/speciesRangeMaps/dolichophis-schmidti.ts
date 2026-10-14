import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The red-bellied racer map combines Reptiles.ge editorial photo records, hand-curated localities, and public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with enough records are shaded on the map.",
      mapAria:
        "Red-bellied racer distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Red-bellied racer: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "წითელმუცელა მცურავის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებს, ხელით დამუშავებულ ლოკალიტეტებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და რუკაზე მონიშნულია მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონები.",
      mapAria:
        "წითელმუცელა მცურავის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის წითელმუცელა მცურავი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта краснобрюхого полоза объединяет редакционные фотозаписи Reptiles.ge, вручную обработанные локалитеты и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; на карте закрашены только регионы с достаточным числом записей.",
      mapAria:
        "Данные о распространении краснобрюхого полоза и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где краснобрюхий полоз отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kırmızı karınlı yılan haritası Reptiles.ge editoryal fotoğraf kayıtlarını, elle düzenlenmiş lokaliteleri ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; haritada yalnızca yeterli kaydı olan bölgeler gösterilir.",
      mapAria:
        "Kırmızı karınlı yılanın Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kırmızı karınlı yılan Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 73760,
  rangeSource: "record-summary",
};
