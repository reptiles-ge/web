import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Common Quail map uses public iNaturalist observations from Georgia. Regions come from the records-by-region table; one record is enough to confirm distribution for this species. Points outside the regional polygons remain in the total without being assigned to a region. Record counts reflect observation effort, not population density.",
      mapAria:
        "Common Quail observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where Common Quail is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მწყრის რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოდან. რეგიონები აღებულია ქვემოთ მოცემული ჩანაწერების ცხრილიდან; ამ სახეობისთვის ერთი ჩანაწერიც საკმარისია რეგიონში გავრცელების დასადასტურებლად. რეგიონული პოლიგონების გარეთ დარჩენილი წერტილები საერთო რაოდენობაში შედის, მაგრამ რეგიონს არ მიეკუთვნება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობასაც ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "მწყრის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის მწყერი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта перепела использует публичные наблюдения iNaturalist из Грузии. Регионы взяты из таблицы записей; для этого вида одной записи достаточно, чтобы подтвердить распространение в регионе. Точки вне региональных полигонов включены в общее число, но не отнесены к региону. Число записей отражает также активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения перепела и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где перепел отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Bıldırcın haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Bölgeler kayıt tablosundan alınır; bu tür için tek bir kayıt bölgedeki yayılışı doğrulamak için yeterlidir. Bölge poligonlarının dışındaki noktalar genel toplama dahildir, ancak bir bölgeye atanmaz. Kayıt sayısı gözlem çabasını da yansıtır, nüfus yoğunluğunu ölçmez.",
      mapAria:
        "Bıldırcın gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Bıldırcın Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 804,
  rangeSource: "record-summary",
};
