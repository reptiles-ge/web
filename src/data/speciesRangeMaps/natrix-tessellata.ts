import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The dice snake map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table, and only regions with confirmed status are treated as distribution.",
      mapAria:
        "Dice snake distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where dice snake distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "წყლის ანკარის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან და გავრცელებად ითვლება მხოლოდ ის რეგიონი, სადაც სტატუსი დადასტურებულია.",
      mapAria:
        "წყლის ანკარის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის წყლის ანკარის გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта водяного ужа объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; распространением считаются только регионы со статусом подтверждения.",
      mapAria:
        "Данные о распространении водяного ужа и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение водяного ужа подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kareli yılan haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; yalnızca doğrulanmış durumdaki bölgeler yayılış kabul edilir.",
      mapAria:
        "Kareli yılanın Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Doğrulanmış yayılış bölgesi",
      rangeTitle: "Kareli yılanın yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 64346,
  rangeSource: "record-summary",
};
