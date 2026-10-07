import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The ring-headed dwarf snake map uses public iNaturalist observations in Georgia. Only regions marked confirmed in the records-by-region table are highlighted; isolated records do not establish region-wide distribution. Some public coordinates are obscured or approximate, making assignments near regional borders uncertain. Record counts reflect observation effort, not population density.",
      mapAria:
        "Ring-headed dwarf snake observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle:
        "Where ring-headed dwarf snake distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "წყნარი ეირენისის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. გამოკვეთილია მხოლოდ ის რეგიონები, რომლებსაც ჩანაწერების რეგიონულ ცხრილში დადასტურებული სტატუსი აქვთ; ცალკეული ჩანაწერი მთელი რეგიონის გავრცელებას არ ნიშნავს. ზოგი საჯარო კოორდინატი დაფარული ან მიახლოებითია, ამიტომ საზღვართან რეგიონის მიკუთვნება გაურკვეველია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "წყნარი ეირენისის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის წყნარი ეირენისის გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта скромного эйрениса основана на публичных наблюдениях iNaturalist в Грузии. Выделены только регионы со статусом подтверждения в таблице записей; отдельная запись не означает распространение по всему региону. Некоторые публичные координаты скрыты или приблизительны, поэтому привязка точек у границ регионов неопределённа. Число записей отражает активность наблюдателей, не плотность популяции.",
      mapAria:
        "Наблюдения скромного эйрениса и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle:
        "Где распространение скромного эйрениса подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Halkalı başlı cüce yılan haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Yalnızca bölgesel kayıt tablosunda doğrulanmış durumdaki bölgeler vurgulanır; tek bir kayıt tüm bölgede yayılış anlamına gelmez. Bazı halka açık koordinatlar gizlenmiş veya yaklaşıktır; bölge sınırlarına yakın noktaların atanması belirsizdir. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Halkalı başlı cüce yılan gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle:
        "Halkalı başlı cüce yılanın yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 30293,
  rangeSource: "record-summary",
};
