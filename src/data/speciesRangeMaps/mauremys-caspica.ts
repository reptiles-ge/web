import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Caspian turtle map shows public iNaturalist observations in Georgia. Only regions marked confirmed in the records table are shaded as distribution. Some public coordinates are obscured or approximate, and locality text can disagree with a point's region. A shaded region does not mean the turtle occupies all of it; record counts reflect observation effort, not population density.",
      mapAria:
        "Caspian turtle field records and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where Caspian turtles are recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "კასპიური კუს რუკა აჩვენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოში. გავრცელებად მხოლოდ ჩანაწერების ცხრილში დადასტურებული სტატუსის მქონე რეგიონებია გამოკვეთილი. ზოგი საჯარო კოორდინატი დაფარული ან მიახლოებითია, ზოგჯერ კი ლოკალიტეტის ტექსტი წერტილის რეგიონს არ ემთხვევა. გამოკვეთილი რეგიონი არ ნიშნავს მის მთელ ტერიტორიაზე გავრცელებას; ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "კასპიური კუს საველე ჩანაწერები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის კასპიური კუ დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта каспийской черепахи показывает публичные наблюдения iNaturalist в Грузии. Как распространение выделены только регионы со статусом подтверждения в таблице записей. Некоторые публичные координаты скрыты или приблизительны, а текст местонахождения иногда не совпадает с регионом точки. Выделенный регион не означает присутствие на всей его территории; число записей не измеряет плотность популяции.",
      mapAria:
        "Полевые записи каспийской черепахи и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где каспийская черепаха отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Hazar kaplumbağası haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini gösterir. Yalnızca kayıt tablosunda doğrulanmış durumdaki bölgeler yayılış olarak vurgulanır. Bazı açık koordinatlar gizlenmiş veya yaklaşıktır; yer adı bazen noktanın bulunduğu bölgeyle uyuşmaz. Vurgulanan bölge türün her yerinde bulunduğu anlamına gelmez; kayıt sayısı popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Hazar kaplumbağasının arazi kayıtları ve doğrulanmış bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Doğrulanmış yayılış bölgesi",
      rangeTitle: "Hazar kaplumbağası Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 39972,
  rangeSource: "record-summary",
};
