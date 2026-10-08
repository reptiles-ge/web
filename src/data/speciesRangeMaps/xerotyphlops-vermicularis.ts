import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The European blind snake map uses public iNaturalist observations in Georgia. Only regions marked confirmed in the records-by-region table are highlighted; isolated records do not establish region-wide distribution. Some public coordinates are obscured and do not count toward confirming a region. Record counts reflect observation effort, not population density.",
      mapAria:
        "European blind snake observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle:
        "Where European blind snake distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "გველბრუცას რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. გამოკვეთილია მხოლოდ ის რეგიონები, რომლებსაც ჩანაწერების რეგიონულ ცხრილში დადასტურებული სტატუსი აქვთ; ცალკეული ჩანაწერი მთელი რეგიონის გავრცელებას არ ნიშნავს. ზოგი საჯარო კოორდინატი დაფარულია და რეგიონის დადასტურებაში არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "გველბრუცას დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის გველბრუცას გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта червеобразной слепозмейки основана на публичных наблюдениях iNaturalist в Грузии. Выделены только регионы со статусом подтверждения в таблице записей; отдельная запись не означает распространение по всему региону. Некоторые публичные координаты скрыты и не учитываются при подтверждении региона. Число записей отражает активность наблюдателей, не плотность популяции.",
      mapAria:
        "Наблюдения червеобразной слепозмейки и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle:
        "Где распространение червеобразной слепозмейки подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kör yılan haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Yalnızca bölgesel kayıt tablosunda doğrulanmış durumdaki bölgeler vurgulanır; tek bir kayıt tüm bölgede yayılış anlamına gelmez. Bazı halka açık koordinatlar gizlenmiştir ve bölge doğrulamasına katılmaz. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Kör yılan gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Kör yılanın yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 514727,
  rangeSource: "record-summary",
};
