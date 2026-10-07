import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Mingrelian scorpion map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
      mapAria:
        "Mingrelian scorpion distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where Mingrelian scorpion is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მეგრული მორიელის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
      mapAria:
        "მეგრული მორიელის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის მეგრული მორიელი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта мингрельского скорпиона объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
      mapAria:
        "Данные о распространении мингрельского скорпиона и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где мингрельский скорпион отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Karadeniz akrebi haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
      mapAria:
        "Karadeniz akrebinin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Karadeniz akrebi Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 1654809,
  rangeSource: "record-summary",
};
