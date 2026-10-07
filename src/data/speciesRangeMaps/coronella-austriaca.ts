import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The smooth snake map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with confirmed status are treated as distribution.",
      mapAria:
        "Smooth snake distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where smooth snake distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "სპილენძას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და გავრცელებად ითვლება მხოლოდ ის რეგიონი, სადაც სტატუსი დადასტურებულია.",
      mapAria:
        "სპილენძას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის სპილენძას გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта медянки объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы со статусом подтверждения.",
      mapAria:
        "Данные о распространении медянки и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение медянки подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Avusturya yılanı haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış kabul edilir.",
      mapAria:
        "Avusturya yılanının Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Doğrulanmış yayılış bölgesi",
      rangeTitle:
        "Avusturya yılanının yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 26904,
  rangeSource: "record-summary",
};
