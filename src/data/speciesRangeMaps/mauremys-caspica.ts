import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Caspian turtle map shows public iNaturalist observations in Georgia. Only regions with enough records in the records table are shaded on the map. Some public coordinates are obscured or approximate, and locality text can disagree with a point's region. A shaded region does not mean the turtle occupies all of it; record counts reflect observation effort, not population density.",
      mapAria:
        "Caspian turtle field records and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where Caspian turtles are recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "კასპიური კუს რუკა აჩვენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოში. რუკაზე მხოლოდ ის რეგიონებია გამოკვეთილი, რომლებსაც ჩანაწერების ცხრილში საკმარისი ჩანაწერი აქვს. ზოგი საჯარო კოორდინატი დაფარული ან მიახლოებითია, ზოგჯერ კი ლოკალიტეტის ტექსტი წერტილის რეგიონს არ ემთხვევა. გამოკვეთილი რეგიონი არ ნიშნავს მის მთელ ტერიტორიაზე გავრცელებას; ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "კასპიური კუს საველე ჩანაწერები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის კასპიური კუ დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта каспийской черепахи показывает публичные наблюдения iNaturalist в Грузии. На карте выделены только регионы с достаточным числом записей в таблице записей. Некоторые публичные координаты скрыты или приблизительны, а текст местонахождения иногда не совпадает с регионом точки. Выделенный регион не означает присутствие на всей его территории; число записей не измеряет плотность популяции.",
      mapAria:
        "Полевые записи каспийской черепахи и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где каспийская черепаха отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Hazar kaplumbağası haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini gösterir. Haritada yalnızca kayıt tablosunda yeterli kaydı olan bölgeler vurgulanır. Bazı açık koordinatlar gizlenmiş veya yaklaşıktır; yer adı bazen noktanın bulunduğu bölgeyle uyuşmaz. Vurgulanan bölge türün her yerinde bulunduğu anlamına gelmez; kayıt sayısı popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Hazar kaplumbağasının arazi kayıtları ve kayıt bulunan bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Hazar kaplumbağası Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 39972,
  rangeSource: "record-summary",
};
