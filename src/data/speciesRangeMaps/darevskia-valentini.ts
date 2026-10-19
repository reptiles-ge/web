import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      confirmedStatusLabel: "Confirmed distribution",
      intro:
        "The Valentin's lizard map combines field records supplied for the atlas with public iNaturalist observations in Georgia. The records-by-region table keeps observations separate from confirmed range: only a region with a confirmed status is shaded. iNaturalist coordinates that are obscured and observations still awaiting identification do not count toward that status. Individual points show observation locations, not population density.",
      mapAria:
        "Valentin's lizard observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed region",
      rangeTitle: "Valentin's lizard: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      confirmedStatusLabel: "დადასტურებული გავრცელება",
      intro:
        "ვალენტინის ხვლიკის რუკა აერთიანებს ატლასისთვის მოწოდებულ საველე ჩანაწერებსა და საქართველოში გაკეთებულ iNaturalist-ის საჯარო დაკვირვებებს. ჩანაწერების რეგიონული ცხრილი დაკვირვებებსა და დადასტურებულ გავრცელებას განასხვავებს: რუკაზე მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი გამოიკვეთება. iNaturalist-ის მიერ დაფარული კოორდინატი და ამოუცნობი დაკვირვება ამ სტატუსში არ ითვლება. ცალკეული წერტილები დაკვირვების ადგილებს აჩვენებს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ვალენტინის ხვლიკის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული რეგიონი",
      rangeTitle: "სად არის ვალენტინის ხვლიკი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      confirmedStatusLabel: "Подтверждённое распространение",
      intro:
        "Карта ящерицы Валентина объединяет полевые записи, предоставленные для атласа, и публичные наблюдения iNaturalist в Грузии. Таблица записей по регионам отделяет наблюдения от подтверждённого ареала: на карте выделяются только регионы с подтверждённым статусом. Скрытые iNaturalist координаты и наблюдения, ожидающие определения, не учитываются для этого статуса. Отдельные точки показывают места наблюдений, а не плотность популяции.",
      mapAria:
        "Наблюдения ящерицы Валентина и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Подтверждённый регион",
      rangeTitle: "Где ящерица Валентина отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      confirmedStatusLabel: "Doğrulanmış yayılış",
      intro:
        "Valentin kertenkelesi haritası atlas için sağlanan arazi kayıtlarını ve Gürcistan'daki herkese açık iNaturalist gözlemlerini birleştirir. Bölgelere göre kayıt tablosu gözlemleri doğrulanmış yayılıştan ayırır: haritada yalnızca doğrulanmış durumundaki bölge taranır. iNaturalist'in gizlediği koordinatlar ve henüz tanımlanmamış gözlemler bu duruma sayılmaz. Tekil noktalar gözlem yerlerini gösterir, nüfus yoğunluğunu değil.",
      mapAria:
        "Valentin kertenkelesi gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Doğrulanmış bölge",
      rangeTitle: "Valentin kertenkelesi Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 35362,
  rangeSource: "record-summary",
};
