import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Levantine viper map combines Reptiles.ge editorial photo records with public iNaturalist observations. Source-confirmed regions and individual field records are separate layers, and record counts reflect observation effort rather than population density.",
      mapAria:
        "Levantine viper distribution evidence and field records on a map of Georgia",
      rangeTitle: "Where Levantine viper occurs in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "გიურზას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. წყაროებით დადასტურებული რეგიონები და ინდივიდუალური საველე ჩანაწერები ცალკე ფენებია; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
      mapAria:
        "გიურზას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
      rangeTitle: "სად გვხვდება გიურზა საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта гюрзы объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы, подтверждённые источниками, и отдельные полевые записи показаны разными слоями; количество записей отражает интенсивность наблюдений, а не плотность популяции.",
      mapAria:
        "Данные о распространении гюрзы и полевые записи на карте Грузии",
      rangeTitle: "Где встречается гюрза в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Koca engerek haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Kaynakla doğrulanmış bölgeler ile tekil arazi kayıtları ayrı katmanlardır; kayıt sayısı gözlem yoğunluğunu yansıtır, popülasyon yoğunluğu değildir.",
      mapAria:
        "Koca engereğin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
      rangeTitle: "Koca engerek Gürcistan'da nerede görülür?",
    },
  },
  iNaturalistTaxonId: 105083,
};
