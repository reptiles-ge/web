import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Italian scorpion map combines Reptiles.ge editorial photo records, Georgian Biodiversity Database localities, and public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
      mapAria:
        "Italian scorpion distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where Italian scorpion is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "იტალიური მორიელის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებს, Georgian Biodiversity Database-ის ლოკალიტეტებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
      mapAria:
        "იტალიური მორიელის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის იტალიური მორიელი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта итальянского скорпиона объединяет редакционные фотозаписи Reptiles.ge, локалитеты Georgian Biodiversity Database и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
      mapAria:
        "Данные о распространении итальянского скорпиона и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где итальянский скорпион отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "İtalyan akrebi haritası Reptiles.ge editoryal fotoğraf kayıtlarını, Georgian Biodiversity Database lokalitelerini ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
      mapAria:
        "İtalyan akrebinin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "İtalyan akrebi Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 56528,
  rangeSource: "record-summary",
};
