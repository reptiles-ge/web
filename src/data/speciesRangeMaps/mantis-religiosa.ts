import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The European mantis map combines Reptiles.ge editorial photo records with public iNaturalist observations. Individual field records are shown as point data, and record counts reflect observation effort rather than population density.",
      mapAria: "European mantis field records on a map of Georgia",
      rangeTitle: "Where European mantis is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ჩოქელას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. ინდივიდუალური საველე ჩანაწერები წერტილებადაა ნაჩვენები; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
      mapAria: "ჩოქელას საველე ჩანაწერები საქართველოს რუკაზე",
      rangeTitle: "სად არის ჩოქელა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта богомола объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Отдельные полевые записи показаны точками; количество записей отражает интенсивность наблюдений, а не плотность популяции.",
      mapAria: "Полевые записи богомола на карте Грузии",
      rangeTitle: "Где богомол отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Peygamberdevesi haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Tekil arazi kayıtları nokta verisi olarak gösterilir; kayıt sayısı gözlem yoğunluğunu yansıtır, popülasyon yoğunluğu değildir.",
      mapAria: "Peygamberdevesi arazi kayıtları Gürcistan haritasında",
      rangeTitle: "Peygamberdevesi Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 53905,
};
