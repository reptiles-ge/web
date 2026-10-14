import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Colchis slow worm map uses public iNaturalist observations in Georgia. Shaded regions come from the records-by-region table: only regions with enough records are shaded on the map, and any other region is not. Obscured or approximate public coordinates do not place a record in a region. Record counts reflect observation effort, not population density. Tarkhnishvili et al. 2026 still treat this taxon as a candidate; the map status does not settle species rank.",
      mapAria:
        "Colchis slow worm observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Colchis slow worm: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ბოხმეჭას რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. გამოკვეთილი რეგიონები ჩანაწერების რეგიონული ცხრილიდანაა: რუკაზე მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონებია გამოყოფილი, სხვა შემთხვევაში რეგიონი გავრცელებულად არ ჩაითვლება. დაფარული ან მიახლოებითი საჯარო კოორდინატი ჩანაწერს რეგიონს არ მიაკუთვნებს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს. Tarkhnishvili et al. 2026 ამ ტაქსონს კანდიდატად ტოვებს; რუკის სტატუსი სახეობრივ რანგს არ ადასტურებს.",
      mapAria:
        "ბოხმეჭას დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ბოხმეჭა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта колхидской веретеницы основана на публичных наблюдениях iNaturalist в Грузии. Залитые регионы взяты из таблицы записей: на карте выделены только регионы с достаточным числом записей, в остальных случаях регион распространением не считается. Скрытые или приблизительные публичные координаты не относят запись к региону. Число записей отражает активность наблюдателей, а не плотность популяции. Tarkhnishvili et al. 2026 по-прежнему считают этот таксон кандидатом; статус на карте не утверждает видовой ранг.",
      mapAria:
        "Наблюдения колхидской веретеницы и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где колхидская веретеница отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kolhis yılan kertenkele haritası Gürcistan’daki herkese açık iNaturalist gözlemlerini kullanır. Taralı bölgeler, bölgelere göre kayıt tablosundan gelir: haritada yalnızca yeterli kaydı olan bölgeler taranır, diğer durumlarda bölge yayılış sayılmaz. Gizlenmiş veya yaklaşık kamuya açık koordinatlar bir kaydı bölgeye atamaz. Kayıt sayıları gözlem çabasını gösterir, nüfus yoğunluğunu değil. Tarkhnishvili et al. 2026 bu taksonu hâlâ aday sayar; harita durumu tür rütbesini karara bağlamaz.",
      mapAria:
        "Kolhis yılan kertenkelenin gözlemleri ve kayıt bulunan bölgeler, Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Kolhis yılan kertenkele Gürcistan’da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 145895,
  rangeSource: "record-summary",
};
