import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Caucasian toad map combines Reptiles.ge editorial photo records with public iNaturalist photo observations in Georgia. Regions are taken from the records-by-region table, and the status column separates regions with enough records from regions with too few records. Record counts reflect observation effort, not population density.",
      mapAria:
        "Caucasian toad field records and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where the Caucasian toad is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "კავკასიური გომბეშოს რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და საქართველოში გაკეთებულ iNaturalist-ის საჯარო ფოტოდაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს საკმარისი ჩანაწერების მქონე რეგიონებსა და რეგიონებს, სადაც ჩანაწერები ცოტაა. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "კავკასიური გომბეშოს საველე ჩანაწერები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის კავკასიური გომბეშო დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта кавказской жабы объединяет редакционные фотозаписи Reptiles.ge и публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей по регионам, а статус отделяет регионы с достаточным числом записей от регионов, где записей мало. Число записей отражает интенсивность наблюдений, а не плотность популяции.",
      mapAria:
        "Полевые записи кавказской жабы и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где кавказская жаба отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kafkasya karakurbağası haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu yeterli kaydı olan bölgeleri kaydı az olan bölgelerden ayırır. Kayıt sayısı popülasyon yoğunluğunu değil, gözlem yoğunluğunu yansıtır.",
      mapAria:
        "Kafkasya karakurbağasının Gürcistan haritasında arazi kayıtları ve kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kafkasya karakurbağası Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 21505,
  rangeSource: "record-summary",
};
