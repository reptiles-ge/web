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
        "The rapid racerunner map combines field photos supplied for the atlas with public iNaturalist observations in Georgia. The records-by-region table keeps observations separate from confirmed range: only a region with a confirmed status is shaded. A region with only a few records is listed but not counted as range. iNaturalist coordinates that are obscured and observations still awaiting identification do not count toward that status. Individual points show observation locations, not population density.",
      mapAria:
        "Rapid racerunner observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed region",
      rangeTitle: "Rapid racerunner: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      confirmedStatusLabel: "დადასტურებული გავრცელება",
      intro:
        "მარდი ფსვენის რუკა აერთიანებს ატლასისთვის მოწოდებულ საველე ფოტოებსა და საქართველოში გაკეთებულ iNaturalist-ის საჯარო დაკვირვებებს. ჩანაწერების რეგიონული ცხრილი დაკვირვებებსა და დადასტურებულ გავრცელებას განასხვავებს: რუკაზე მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი გამოიკვეთება. რეგიონი, სადაც მხოლოდ რამდენიმე ჩანაწერია, ცხრილში ჩანს, მაგრამ გავრცელებად არ ითვლება. iNaturalist-ის მიერ დაფარული კოორდინატი და ამოუცნობი დაკვირვება ამ სტატუსში არ ითვლება. ცალკეული წერტილები დაკვირვების ადგილებს აჩვენებს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "მარდი ფსვენის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული რეგიონი",
      rangeTitle: "სად არის მარდი ფსვენი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      confirmedStatusLabel: "Подтверждённое распространение",
      intro:
        "Карта быстрой ящурки объединяет полевые фотографии, предоставленные для атласа, и публичные наблюдения iNaturalist в Грузии. Таблица записей по регионам отделяет наблюдения от подтверждённого ареала: на карте выделяются только регионы с подтверждённым статусом. Регион, где записей всего несколько, указан в таблице, но не считается частью ареала. Скрытые iNaturalist координаты и наблюдения, ожидающие определения, не учитываются для этого статуса. Отдельные точки показывают места наблюдений, а не плотность популяции.",
      mapAria:
        "Наблюдения быстрой ящурки и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Подтверждённый регион",
      rangeTitle: "Где быстрая ящурка отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      confirmedStatusLabel: "Doğrulanmış yayılış",
      intro:
        "Hızlı koşar kertenkele haritası atlas için sağlanan arazi fotoğraflarını ve Gürcistan'daki herkese açık iNaturalist gözlemlerini birleştirir. Bölgelere göre kayıt tablosu gözlemleri doğrulanmış yayılıştan ayırır: haritada yalnızca doğrulanmış durumundaki bölge taranır. Yalnızca birkaç kaydı olan bölge tabloda görünür, ancak yayılış sayılmaz. iNaturalist'in gizlediği koordinatlar ve henüz tanımlanmamış gözlemler bu duruma sayılmaz. Tekil noktalar gözlem yerlerini gösterir, nüfus yoğunluğunu değil.",
      mapAria:
        "Hızlı koşar kertenkele gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Doğrulanmış bölge",
      rangeTitle: "Hızlı koşar kertenkele Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 36012,
  rangeSource: "record-summary",
};
