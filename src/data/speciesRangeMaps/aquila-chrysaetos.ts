import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The golden eagle map uses public iNaturalist observations from Georgia. A region is shaded on the map with at least four records in the table; regions with fewer records are marked “Too few records”. Record counts reflect observation effort, not population density or breeding status.",
      mapAria:
        "Golden eagle observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Golden eagle: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მთის არწივის რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოდან. ცხრილში რეგიონი რუკაზე გამოიყოფა მინიმუმ ოთხი ჩანაწერით; ნაკლები ჩანაწერის მქონე რეგიონი მონიშნულია როგორც „ჩანაწერები ცოტაა“. ჩანაწერების რაოდენობა ასახავს დაკვირვების ინტენსივობას და არა პოპულაციის სიმჭიდროვეს ან ბუდობის სტატუსს.",
      mapAria:
        "მთის არწივის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის მთის არწივი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта беркута использует публичные наблюдения iNaturalist из Грузии. Регион выделяется на карте при наличии в таблице минимум четырёх записей; регионы с меньшим числом записей отмечены как «Мало записей». Число записей отражает активность наблюдателей, а не плотность популяции или статус гнездования.",
      mapAria: "Наблюдения беркута и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где беркут отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kaya kartalı haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Tabloda en az dört kayıt bulunan bölgeler haritada gölgelendirilir; daha az kayıt bulunan bölgeler “Kayıt az” olarak işaretlenir. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu veya üreme durumunu değil.",
      mapAria:
        "Kaya kartalı gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kaya kartalı Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 5074,
  rangeSource: "record-summary",
};
