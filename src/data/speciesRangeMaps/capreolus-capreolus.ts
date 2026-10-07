import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The European roe deer map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
      mapAria:
        "European roe deer distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where European roe deer is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ევროპული შვლის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
      mapAria:
        "ევროპული შვლის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ევროპული შველი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта европейской косули объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
      mapAria:
        "Данные о распространении европейской косули и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где европейская косуля отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Avrupa karacası haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
      mapAria:
        "Avrupa karacasının Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Avrupa karacası Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 42184,
  rangeSource: "record-summary",
};
