import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The false black widow map uses public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with enough records are shaded on the map.",
      mapAria:
        "False black widow distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "False black widow: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ცრუ ყარაყურთის რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და რუკაზე შეფერილია მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონები.",
      mapAria:
        "ცრუ ყარაყურთის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ცრუ ყარაყურთი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта ложного каракурта использует публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; на карте закрашены только регионы с достаточным числом записей.",
      mapAria:
        "Данные о распространении ложного каракурта и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где ложный каракурт отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Yalancı karakurt haritası herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır; haritada yalnızca yeterli kaydı olan bölgeler boyanır.",
      mapAria:
        "Yalancı karakurtun Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Yalancı karakurt Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 343356,
  rangeSource: "record-summary",
};
