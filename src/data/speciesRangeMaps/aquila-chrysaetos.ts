import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The golden eagle map uses public iNaturalist observations from Georgia. A region counts as confirmed distribution with at least four records in the table; regions with fewer records remain recorded only. Record counts reflect observation effort, not population density or breeding status.",
      mapAria:
        "Golden eagle observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where golden eagle is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მთის არწივის რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოდან. ცხრილში რეგიონს გავრცელება უდასტურდება მინიმუმ ოთხი ჩანაწერით; ნაკლები ჩანაწერის მქონე რეგიონში სახეობა მხოლოდ დაფიქსირებულია. ჩანაწერების რაოდენობა ასახავს დაკვირვების ინტენსივობას და არა პოპულაციის სიმჭიდროვეს ან ბუდობის სტატუსს.",
      mapAria:
        "მთის არწივის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის მთის არწივი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта беркута использует публичные наблюдения iNaturalist из Грузии. В таблице распространение региона подтверждается минимум четырьмя записями; при меньшем числе вид лишь отмечен. Число записей отражает активность наблюдателей, а не плотность популяции или статус гнездования.",
      mapAria: "Наблюдения беркута и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где беркут отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kaya kartalı haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Tabloda en az dört kayıt bulunan bölgelerde yayılış doğrulanır; daha az kayıt bulunan bölgelerde tür yalnızca kaydedilmiş sayılır. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu veya üreme durumunu değil.",
      mapAria:
        "Kaya kartalı gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Kaya kartalı Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 5074,
  rangeSource: "record-summary",
};
