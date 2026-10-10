import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Colchis slow worm map uses public iNaturalist observations in Georgia. Shaded regions come from the records-by-region table: only confirmed status counts as distribution, and any other region does not. Obscured or approximate public coordinates do not confirm a region. Record counts reflect observation effort, not population density. Tarkhnishvili et al. 2026 still treat this taxon as a candidate; the map status does not settle species rank.",
      mapAria:
        "Colchis slow worm observations and confirmed distribution regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle:
        "Where Colchis slow worm distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ბოხმეჭას რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. გამოკვეთილი რეგიონები ჩანაწერების რეგიონული ცხრილიდანაა: გავრცელებად მხოლოდ დადასტურებული სტატუსი ითვლება, სხვა შემთხვევაში რეგიონი გავრცელებულად არ ჩაითვლება. დაფარული ან მიახლოებითი საჯარო კოორდინატი რეგიონს არ ადასტურებს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს. Tarkhnishvili et al. 2026 ამ ტაქსონს კანდიდატად ტოვებს; რუკის სტატუსი სახეობრივ რანგს არ ადასტურებს.",
      mapAria:
        "ბოხმეჭას დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის ბოხმეჭას გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта колхидской веретеницы основана на публичных наблюдениях iNaturalist в Грузии. Залитые регионы взяты из таблицы записей: распространением считается только подтверждённый статус, в остальных случаях регион распространением не считается. Скрытые или приблизительные публичные координаты регион не подтверждают. Число записей отражает активность наблюдателей, а не плотность популяции. Tarkhnishvili et al. 2026 по-прежнему считают этот таксон кандидатом; статус на карте не утверждает видовой ранг.",
      mapAria:
        "Наблюдения колхидской веретеницы и регионы подтверждённого распространения на карте Грузии",
      officialRegionLabel: "Регион подтверждённого распространения",
      rangeTitle:
        "Где распространение колхидской веретеницы подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kolhis yılan kertenkele haritası Gürcistan’daki herkese açık iNaturalist gözlemlerini kullanır. Taralı bölgeler, bölgelere göre kayıt tablosundan gelir: yayılış yalnızca doğrulanmış durumdur, diğer durumlarda bölge yayılış sayılmaz. Gizlenmiş veya yaklaşık kamuya açık koordinatlar bir bölgeyi doğrulamaz. Kayıt sayıları gözlem çabasını gösterir, nüfus yoğunluğunu değil. Tarkhnishvili et al. 2026 bu taksonu hâlâ aday sayar; harita durumu tür rütbesini karara bağlamaz.",
      mapAria:
        "Kolhis yılan kertenkelenin gözlemleri ve doğrulanmış yayılış bölgeleri, Gürcistan haritasında",
      officialRegionLabel: "Doğrulanmış yayılış bölgesi",
      rangeTitle:
        "Kolhis yılan kertenkele yayılışı Gürcistan’da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 145895,
  rangeSource: "record-summary",
};
