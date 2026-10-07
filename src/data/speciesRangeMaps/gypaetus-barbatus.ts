import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The bearded vulture map uses public iNaturalist observations from Georgia. Regions come from the records-by-region table: only a confirmed status counts as distribution; other regions have records only. Record counts reflect observation effort, not population density.",
      mapAria:
        "Bearded vulture observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Region with confirmed distribution",
      rangeTitle: "Where bearded vulture distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ბატკანძერის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებულად ითვლება მხოლოდ დადასტურებული სტატუსი, დანარჩენში მხოლოდ ჩანაწერია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ბატკანძერის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის ბატკანძერის გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта бородача основана на публичных наблюдениях iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус, в остальных регионах есть лишь записи. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения бородача и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение бородача подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Sakallı akbaba haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan gelir: yalnızca doğrulanmış durum yayılış sayılır; diğerlerinde yalnızca kayıt vardır. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Sakallı akbaba gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Sakallı akbabanın yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 5379,
  rangeSource: "record-summary",
};
