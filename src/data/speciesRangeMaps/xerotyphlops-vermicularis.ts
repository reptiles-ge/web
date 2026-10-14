import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The European blind snake map uses public iNaturalist observations in Georgia. Only regions with enough records in the records-by-region table are highlighted; isolated records do not establish region-wide distribution. Some public coordinates are obscured and do not count toward a region's records. Record counts reflect observation effort, not population density.",
      mapAria:
        "European blind snake observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "European blind snake: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "გველბრუცას რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. გამოკვეთილია მხოლოდ ის რეგიონები, რომლებსაც ჩანაწერების რეგიონულ ცხრილში საკმარისი ჩანაწერები აქვთ; ცალკეული ჩანაწერი მთელი რეგიონის გავრცელებას არ ნიშნავს. ზოგი საჯარო კოორდინატი დაფარულია და რეგიონის ჩანაწერებში არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "გველბრუცას დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის გველბრუცა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта червеобразной слепозмейки основана на публичных наблюдениях iNaturalist в Грузии. Выделены только регионы с достаточным числом записей в таблице; отдельная запись не означает распространение по всему региону. Некоторые публичные координаты скрыты и не учитываются в записях региона. Число записей отражает активность наблюдателей, не плотность популяции.",
      mapAria:
        "Наблюдения червеобразной слепозмейки и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где червеобразная слепозмейка отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kör yılan haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Yalnızca bölgesel kayıt tablosunda yeterli kaydı olan bölgeler vurgulanır; tek bir kayıt tüm bölgede yayılış anlamına gelmez. Bazı halka açık koordinatlar gizlenmiştir ve bölgenin kayıtlarına sayılmaz. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Kör yılan gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kör yılan Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 514727,
  rangeSource: "record-summary",
};
