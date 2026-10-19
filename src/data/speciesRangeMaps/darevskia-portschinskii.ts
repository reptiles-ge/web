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
        "The Portschinsky's lizard map combines atlas field photos with public iNaturalist observations in Georgia. The records-by-region table keeps observations separate from confirmed range: only a region with a confirmed status is shaded. A region with only a few records is listed but not counted as range. iNaturalist coordinates that are obscured and observations still awaiting identification do not count toward that status. Individual points show observation locations, not population density.",
      mapAria:
        "Portschinsky's lizard observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed region",
      rangeTitle: "Portschinsky's lizard: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      confirmedStatusLabel: "დადასტურებული გავრცელება",
      intro:
        "მტკვრის ხვლიკის რუკა ატლასის საველე ფოტოებსა და საქართველოში გაკეთებულ iNaturalist-ის საჯარო დაკვირვებებს აერთიანებს. ჩანაწერების რეგიონული ცხრილი დაკვირვებებსა და დადასტურებულ გავრცელებას განასხვავებს: რუკაზე მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი გამოიკვეთება. რეგიონი, სადაც მხოლოდ რამდენიმე ჩანაწერია, ცხრილში ჩანს, მაგრამ გავრცელებად არ ითვლება. iNaturalist-ის მიერ დაფარული კოორდინატი და ამოუცნობი დაკვირვება ამ სტატუსში არ ითვლება. ცალკეული წერტილები დაკვირვების ადგილებს აჩვენებს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "მტკვრის ხვლიკის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული რეგიონი",
      rangeTitle: "სად არის მტკვრის ხვლიკი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      confirmedStatusLabel: "Подтверждённое распространение",
      intro:
        "Карта куринской ящерицы объединяет полевые фото атласа и публичные наблюдения iNaturalist в Грузии. Таблица записей по регионам отделяет наблюдения от подтверждённого ареала: на карте выделяются только регионы с подтверждённым статусом. Регион, где записей всего несколько, указан в таблице, но не считается частью ареала. Скрытые iNaturalist координаты и наблюдения, ожидающие определения, не учитываются для этого статуса. Отдельные точки показывают места наблюдений, а не плотность популяции.",
      mapAria:
        "Наблюдения куринской ящерицы и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Подтверждённый регион",
      rangeTitle: "Где куринская ящерица отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      confirmedStatusLabel: "Doğrulanmış yayılış",
      intro:
        "Kura kertenkelesi haritası atlasın arazi fotoğraflarını ve Gürcistan'daki herkese açık iNaturalist gözlemlerini birleştirir. Bölgelere göre kayıt tablosu gözlemleri doğrulanmış yayılıştan ayırır: haritada yalnızca doğrulanmış durumundaki bölge taranır. Yalnızca birkaç kaydı olan bölge tabloda görünür, ancak yayılış sayılmaz. iNaturalist'in gizlediği koordinatlar ve henüz tanımlanmamış gözlemler bu duruma sayılmaz. Tekil noktalar gözlem yerlerini gösterir, nüfus yoğunluğunu değil.",
      mapAria:
        "Kura kertenkelesi gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Doğrulanmış bölge",
      rangeTitle: "Kura kertenkelesi Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 35384,
  rangeSource: "record-summary",
};
