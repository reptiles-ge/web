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
        "The Meadow Lizard map uses public iNaturalist observations in Georgia. The records-by-region table keeps observations separate from confirmed range: only a region with a confirmed status is shaded. iNaturalist obscures every public coordinate for this species by about 28 km, and obscured coordinates do not count toward that status, so no region is shaded yet. iNaturalist treats the Pontic Meadow Lizard (D. pontica) as a subspecies of the Meadow Lizard, so records from western Georgia may belong to it. Individual points show approximate observation locations, not population density.",
      mapAria:
        "Meadow Lizard observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed region",
      rangeTitle: "Meadow Lizard: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      confirmedStatusLabel: "დადასტურებული გავრცელება",
      intro:
        "მდელოს ხვლიკის რუკა საქართველოში გაკეთებულ iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. ჩანაწერების რეგიონული ცხრილი დაკვირვებებსა და დადასტურებულ გავრცელებას განასხვავებს: რუკაზე მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი გამოიკვეთება. iNaturalist ამ სახეობის ყველა საჯარო კოორდინატს დაახლოებით 28 კმ-ით ფარავს, დაფარული კოორდინატი კი ამ სტატუსში არ ითვლება, ამიტომ რუკაზე ჯერ არცერთი რეგიონი არ არის გამოკვეთილი. iNaturalist კოლხურ მდელოს ხვლიკს (D. pontica) მდელოს ხვლიკის ქვესახეობად განიხილავს, ამიტომ დასავლეთ საქართველოს ჩანაწერები შესაძლოა მას ეკუთვნოდეს. ცალკეული წერტილები დაკვირვების მიახლოებით ადგილებს აჩვენებს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "მდელოს ხვლიკის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული რეგიონი",
      rangeTitle: "სად არის მდელოს ხვლიკი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      confirmedStatusLabel: "Подтверждённое распространение",
      intro:
        "Карта луговой ящерицы основана на публичных наблюдениях iNaturalist в Грузии. Таблица записей по регионам отделяет наблюдения от подтверждённого ареала: на карте выделяются только регионы с подтверждённым статусом. iNaturalist скрывает все публичные координаты этого вида примерно на 28 км, а скрытые координаты для этого статуса не учитываются, поэтому пока ни один регион не выделен. iNaturalist рассматривает понтийскую луговую ящерицу (D. pontica) как подвид луговой ящерицы, поэтому записи из западной Грузии могут относиться к ней. Отдельные точки показывают приблизительные места наблюдений, а не плотность популяции.",
      mapAria:
        "Наблюдения луговой ящерицы и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Подтверждённый регион",
      rangeTitle: "Где луговая ящерица отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      confirmedStatusLabel: "Doğrulanmış yayılış",
      intro:
        "Çayır kertenkelesi haritası Gürcistan'daki herkese açık iNaturalist gözlemlerine dayanır. Bölgelere göre kayıt tablosu gözlemleri doğrulanmış yayılıştan ayırır: haritada yalnızca doğrulanmış durumundaki bölge taranır. iNaturalist bu türün tüm açık koordinatlarını yaklaşık 28 km gizler ve gizli koordinatlar bu duruma sayılmaz; bu yüzden henüz hiçbir bölge taranmamıştır. iNaturalist Pontik çayır kertenkelesini (D. pontica) çayır kertenkelesinin alt türü olarak ele alır; bu nedenle batı Gürcistan'dan gelen kayıtlar ona ait olabilir. Tekil noktalar yaklaşık gözlem yerlerini gösterir, nüfus yoğunluğunu değil.",
      mapAria:
        "Çayır kertenkelesi gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Doğrulanmış bölge",
      rangeTitle: "Çayır kertenkelesi Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 35383,
  rangeSource: "record-summary",
};
