import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The brown bear map uses public iNaturalist photo observations from Georgia. Regions come from the records-by-region table: only confirmed status counts as distribution, while low-count or uncertain regions remain recorded only. Record counts reflect observation effort, not population density.",
      mapAria:
        "Brown bear observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where brown bear is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მურა დათვის რუკა იყენებს iNaturalist-ის საჯარო ფოტოდაკვირვებებს საქართველოდან. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი, ხოლო მცირე რაოდენობის ან გაურკვეველი ჩანაწერების რეგიონები მხოლოდ დაფიქსირებულად რჩება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "მურა დათვის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის მურა დათვი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта бурого медведя использует публичные фотонаблюдения iNaturalist из Грузии. Регионы взяты из таблицы записей: распространением считается только регион с подтверждённым статусом, а регионы с малым числом или неопределёнными записями остаются только отмеченными. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения бурого медведя и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где бурый медведь отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Boz ayı haritası Gürcistan'daki herkese açık iNaturalist fotoğraf gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durumdaki bölgeler yayılış sayılır; az sayıdaki veya belirsiz kayıtların bulunduğu bölgeler yalnızca kaydedilmiş kalır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu ölçmez.",
      mapAria:
        "Boz ayı gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Boz ayı Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 41641,
  rangeSource: "record-summary",
};
