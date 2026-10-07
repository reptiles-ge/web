import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "This map uses public, photo-backed iNaturalist observations in Georgia. A region with at least one retained record is highlighted as confirmed. Points and shading show evidence of occurrence, not continuous presence across a region. Some public coordinates are approximate. Record counts reflect observation effort, not population density.",
      mapAria:
        "Common woodpigeon observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Region with confirmed records",
      rangeTitle: "Where common woodpigeon is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "რუკა საქართველოში iNaturalist-ის საჯარო, ფოტოდადასტურებულ დაკვირვებებს ეყრდნობა. რეგიონი დადასტურებულად გამოიკვეთება, თუ მასში სულ მცირე ერთი შენარჩუნებული ჩანაწერია. წერტილები და გამოკვეთილი რეგიონები არსებობის მტკიცებულებაა და არა მთელ რეგიონში უწყვეტი გავრცელება. ზოგი საჯარო კოორდინატი მიახლოებითია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ქედანის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ქედანი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта использует публичные наблюдения iNaturalist с фотографиями из Грузии. Регион выделяется как подтверждённый при наличии не менее одной сохранённой записи. Точки и выделение показывают свидетельства присутствия, а не сплошное распространение по региону. Некоторые публичные координаты приблизительны. Число записей отражает усилия наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения вяхиря и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждёнными записями",
      rangeTitle: "Где вяхирь отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Harita, Gürcistan'daki fotoğraflı halka açık iNaturalist gözlemlerini kullanır. En az bir tutulan kaydı olan bölge doğrulanmış olarak vurgulanır. Noktalar ve vurgular, bölgenin tamamında kesintisiz yayılışı değil, varlık kanıtını gösterir. Bazı açık koordinatlar yaklaşıktır. Kayıt sayısı popülasyon yoğunluğunu değil gözlem çabasını yansıtır.",
      mapAria:
        "Tahtalı gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Doğrulanmış kayıtları olan bölge",
      rangeTitle: "Tahtalı Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 3048,
  rangeSource: "record-summary",
};
