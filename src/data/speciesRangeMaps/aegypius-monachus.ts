import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The cinereous vulture map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates regions with enough records from regions with too few records.",
      mapAria:
        "Cinereous vulture distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Cinereous vulture: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "სვავის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს საკმარისი ჩანაწერების მქონე რეგიონებსა და რეგიონებს, სადაც ჩანაწერები ცოტაა.",
      mapAria:
        "სვავის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის სვავი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта чёрного грифа объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет регионы с достаточным числом записей от регионов, где записей мало.",
      mapAria:
        "Данные о распространении чёрного грифа и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где чёрный гриф отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kara akbaba haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu yeterli kaydı olan bölgeleri kaydı az olan bölgelerden ayırır.",
      mapAria:
        "Kara akbabanın Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kara akbaba Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 5382,
  rangeSource: "record-summary",
};
