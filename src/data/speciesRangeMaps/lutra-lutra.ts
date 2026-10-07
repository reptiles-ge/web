import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Eurasian otter map combines source-derived field localities curated by Reptiles.ge with public iNaturalist observations. Regions are taken from the records-by-region table, and the status column separates confirmed distribution from recorded-only regions.",
      mapAria:
        "Eurasian otter distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where Eurasian otter is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "წავის რუკა აერთიანებს Reptiles.ge-ის მიერ წყაროებიდან დამუშავებულ საველე ლოკალიტეტებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან, ხოლო სტატუსი ერთმანეთისგან გამოყოფს დადასტურებულ გავრცელებასა და მხოლოდ დაფიქსირებულ რეგიონებს.",
      mapAria:
        "წავის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის წავი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта выдры объединяет полевые локалитеты, обработанные Reptiles.ge из источников, и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам, а статус отделяет подтверждённое распространение от регионов, где вид только зафиксирован.",
      mapAria:
        "Данные о распространении выдры и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где выдра отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Su samuru haritası Reptiles.ge tarafından kaynaklardan işlenen arazi lokalitelerini ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; durum sütunu doğrulanmış yayılış ile yalnızca kaydedilen bölgeleri ayırır.",
      mapAria:
        "Su samurunun Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Su samuru Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 41850,
  rangeSource: "record-summary",
};
