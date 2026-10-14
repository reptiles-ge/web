import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The obscure rock lizard map combines public iNaturalist observations in Georgia filed as Darevskia rudis obscura with localities that have no observer. Regions come from the records-by-region table: only regions with enough records are shaded on the map; other regions are not shaded. Record counts reflect observation effort, not population density.",
      mapAria:
        "Obscure rock lizard observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Obscure rock lizard: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მესხური კლდის ხვლიკის რუკა აერთიანებს საქართველოს iNaturalist-ის საჯარო დაკვირვებებს, რომლებიც Darevskia rudis obscura-ს სახელითაა შეტანილი, და აღმწერის გარეშე დამატებულ ლოკალიტეტებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მონიშნულია მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონები; დანარჩენი რეგიონები მონიშნული არ არის. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "მესხური კლდის ხვლიკის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის მესხური კლდის ხვლიკი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта тёмной скальной ящерицы объединяет публичные наблюдения iNaturalist в Грузии, внесённые как Darevskia rudis obscura, и локалитеты без наблюдателя. Регионы взяты из таблицы записей: на карте закрашены только регионы с достаточным числом записей; остальные регионы не закрашены. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения тёмной скальной ящерицы и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где тёмная скальная ящерица отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Koyu kayalık kertenkele haritası, Gürcistan'da Darevskia rudis obscura adıyla girilmiş herkese açık iNaturalist gözlemlerini ve gözlemcisi olmayan lokaliteleri birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler gösterilir; diğer bölgeler gösterilmez. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Koyu kayalık kertenkele gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Koyu kayalık kertenkele Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 35376,
  rangeSource: "record-summary",
};
