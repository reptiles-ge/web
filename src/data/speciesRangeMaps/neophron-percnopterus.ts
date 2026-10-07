import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Egyptian vulture map uses public iNaturalist observations from Georgia together with editorial photo records. Regions come from the records-by-region table: only a confirmed status counts as distribution; other regions have records only. Record counts reflect observation effort, not population density.",
      mapAria:
        "Egyptian vulture observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Region with confirmed distribution",
      rangeTitle: "Where Egyptian vulture distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ფასკუნჯის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებსა და სარედაქციო ფოტოჩანაწერებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებულად ითვლება მხოლოდ დადასტურებული სტატუსი, დანარჩენში მხოლოდ ჩანაწერია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ფასკუნჯის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის ფასკუნჯის გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта стервятника основана на публичных наблюдениях iNaturalist в Грузии и редакционных фотозаписях. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус, в остальных регионах есть лишь записи. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения стервятника и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение стервятника подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Küçük akbaba haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini ve editoryal fotoğraf kayıtlarını kullanır. Bölgeler, bölgelere göre kayıt tablosundan gelir: yalnızca doğrulanmış durum yayılış sayılır; diğerlerinde yalnızca kayıt vardır. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Küçük akbaba gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Küçük akbabanın yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 5361,
  rangeSource: "record-summary",
};
