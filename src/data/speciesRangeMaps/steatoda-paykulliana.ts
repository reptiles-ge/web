import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The false black widow map uses public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with confirmed status are treated as distribution.",
      mapAria:
        "False black widow distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where false black widow is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ცრუ ყარაყურთის რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და გავრცელებად ითვლება მხოლოდ ის რეგიონი, სადაც სტატუსი დადასტურებულია.",
      mapAria:
        "ცრუ ყარაყურთის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ცრუ ყარაყურთი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта ложного каракурта использует публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы со статусом подтверждения.",
      mapAria:
        "Данные о распространении ложного каракурта и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где ложный каракурт отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Yalancı karakurt haritası herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış kabul edilir.",
      mapAria:
        "Yalancı karakurtun Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Yalancı karakurt Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 343356,
  rangeSource: "record-summary",
};
