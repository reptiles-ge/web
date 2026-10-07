import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Caucasus viper map combines Reptiles.ge editorial photo records, hand-curated localities, and public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
      mapAria:
        "Caucasus viper distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where Caucasus viper is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "კავკასიური გველგესლის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებს, ხელით შერჩეულ ლოკალიტეტებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
      mapAria:
        "კავკასიური გველგესლის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის კავკასიური გველგესლა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта кавказской гадюки объединяет редакционные фотозаписи Reptiles.ge, вручную отобранные локалитеты и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
      mapAria:
        "Данные о распространении кавказской гадюки и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где кавказская гадюка отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kafkas engereği haritası Reptiles.ge editoryal fotoğraf kayıtlarını, elle seçilmiş lokaliteleri ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
      mapAria:
        "Kafkas engereğinin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kafkas engereği Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 73999,
  rangeSource: "record-summary",
};
