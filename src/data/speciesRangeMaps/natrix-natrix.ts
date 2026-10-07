import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The grass snake map combines Reptiles.ge editorial photo records with public iNaturalist observations. Regions are taken from the records-by-region table; for this species, a region with at least one record is treated as confirmed distribution.",
      mapAria:
        "Grass snake distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where grass snake distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ჩვეულებრივი ანკარის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან; ამ სახეობაზე ერთი ჩანაწერიც საკმარისია, რომ რეგიონი დადასტურებულ გავრცელებად ჩაითვალოს.",
      mapAria:
        "ჩვეულებრივი ანკარის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის ჩვეულებრივი ანკარის გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта обыкновенного ужа объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; для этого вида одного наблюдения достаточно, чтобы регион считался подтверждённым распространением.",
      mapAria:
        "Данные о распространении обыкновенного ужа и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение обыкновенного ужа подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Çim yılanı haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; bu tür için en az bir kayıt bulunan bölge doğrulanmış yayılış kabul edilir.",
      mapAria:
        "Çim yılanının Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Doğrulanmış yayılış bölgesi",
      rangeTitle: "Çim yılanının yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 966787,
  rangeSource: "record-summary",
};
