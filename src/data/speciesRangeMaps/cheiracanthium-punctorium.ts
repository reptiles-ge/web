import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The European yellow sac spider map combines Reptiles.ge source records with public iNaturalist observations. Regions are taken from the records-by-region table; for this species, a region with at least one record is treated as confirmed distribution.",
      mapAria:
        "European yellow sac spider distribution evidence and field records on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where European yellow sac spider is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "Cheiracanthium punctorium-ის რუკა აერთიანებს Reptiles.ge-ის წყაროებზე დაყრდნობილ ჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან; ამ სახეობაზე ერთი ჩანაწერიც საკმარისია, რომ რეგიონი დადასტურებულ გავრცელებად ჩაითვალოს.",
      mapAria:
        "Cheiracanthium punctorium-ის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის Cheiracanthium punctorium დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта Cheiracanthium punctorium объединяет записи из источников Reptiles.ge и публичные наблюдения iNaturalist. Регионы взяты из таблицы записей по регионам; для этого вида одного наблюдения достаточно, чтобы регион считался подтверждённым распространением.",
      mapAria:
        "Данные о распространении Cheiracanthium punctorium и полевые записи на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где Cheiracanthium punctorium отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Cheiracanthium punctorium haritası Reptiles.ge kaynak kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır; bu tür için en az bir kayıt bulunan bölge doğrulanmış yayılış kabul edilir.",
      mapAria:
        "Cheiracanthium punctorium için Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      officialRegionLabel: "Doğrulanmış yayılış bölgesi",
      rangeTitle: "Cheiracanthium punctorium Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 61866,
  rangeSource: "record-summary",
};
