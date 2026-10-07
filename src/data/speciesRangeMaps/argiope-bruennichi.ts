import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The wasp spider map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with confirmed status are treated as distribution.",
      mapAria:
        "Wasp spider distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where wasp spider is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "არგიოპას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და გავრცელებად ითვლება მხოლოდ ის რეგიონი, სადაც სტატუსი დადასტურებულია.",
      mapAria:
        "არგიოპას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის არგიოპას გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта Argiope bruennichi объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы со статусом подтверждения.",
      mapAria:
        "Данные о распространении Argiope bruennichi и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle:
        "Где распространение Argiope bruennichi подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Argiope bruennichi haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış kabul edilir.",
      mapAria:
        "Argiope bruennichi için Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Doğrulanmış yayılış bölgesi",
      rangeTitle: "Argiope bruennichi Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 50867,
  rangeSource: "record-summary",
};
