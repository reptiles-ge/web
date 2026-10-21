import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The European pond turtle map shows public iNaturalist observations in Georgia. Only regions with enough records in the records table are shaded on the map. iNaturalist obscures the public coordinates of this species, so points are approximate, some fall offshore or across a border, and those outside the region outlines are not counted. A shaded region does not mean the turtle occupies all of it; record counts reflect observation effort, not population density.",
      mapAria:
        "European pond turtle field records and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where European pond turtles are recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ჭაობის კუს რუკა აჩვენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოში. რუკაზე მხოლოდ ის რეგიონებია გამოკვეთილი, რომლებსაც ჩანაწერების ცხრილში საკმარისი ჩანაწერი აქვს. iNaturalist ამ სახეობის საჯარო კოორდინატებს ფარავს, ამიტომ წერტილები მიახლოებითია: ზოგი ზღვაში ან მეზობელ რეგიონში ხვდება, ხოლო რეგიონების საზღვრებს გარეთ მოხვედრილი წერტილები ცხრილში არ ითვლება. გამოკვეთილი რეგიონი არ ნიშნავს მის მთელ ტერიტორიაზე გავრცელებას; ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "ჭაობის კუს საველე ჩანაწერები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ჭაობის კუ დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта европейской болотной черепахи показывает публичные наблюдения iNaturalist в Грузии. На карте выделены только регионы с достаточным числом записей в таблице записей. iNaturalist скрывает публичные координаты этого вида, поэтому точки приблизительны: некоторые попадают в море или в соседний регион, а точки за границами регионов в таблице не учитываются. Выделенный регион не означает присутствие на всей его территории; число записей не измеряет плотность популяции.",
      mapAria:
        "Полевые записи европейской болотной черепахи и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где европейская болотная черепаха отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Avrupa bataklık kaplumbağası haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini gösterir. Haritada yalnızca kayıt tablosunda yeterli kaydı olan bölgeler vurgulanır. iNaturalist bu türün açık koordinatlarını gizler; bu yüzden noktalar yaklaşıktır, bazıları denize veya komşu bölgeye düşer ve bölge sınırları dışında kalan noktalar tabloda sayılmaz. Vurgulanan bölge türün her yerinde bulunduğu anlamına gelmez; kayıt sayısı popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Avrupa bataklık kaplumbağasının arazi kayıtları ve kayıt bulunan bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle:
        "Avrupa bataklık kaplumbağası Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 39867,
  rangeSource: "record-summary",
};
