import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Mediterranean tortoise map shows public iNaturalist observations in Georgia. Only regions with enough records in the records table are shaded on the map. iNaturalist obscures the public coordinates of this species, so points are approximate, some fall across a border or a regional boundary, and those outside the region outlines are not counted. Regions in the west with single records are not shaded. A shaded region does not mean the tortoise occupies all of it; record counts reflect observation effort, not population density.",
      mapAria:
        "Mediterranean tortoise field records and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where Mediterranean tortoises are recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ხმელთაშუაზღვეთის კუს რუკა აჩვენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოში. რუკაზე მხოლოდ ის რეგიონებია გამოკვეთილი, რომლებსაც ჩანაწერების ცხრილში საკმარისი ჩანაწერი აქვს. iNaturalist ამ სახეობის საჯარო კოორდინატებს ფარავს, ამიტომ წერტილები მიახლოებითია: ზოგი საზღვარს გადაღმა ან მეზობელ რეგიონში ხვდება, ხოლო რეგიონების საზღვრებს გარეთ მოხვედრილი წერტილები ცხრილში არ ითვლება. დასავლეთ საქართველოს რეგიონები, სადაც მხოლოდ ცალკეული ჩანაწერია, გამოკვეთილი არ არის. გამოკვეთილი რეგიონი არ ნიშნავს მის მთელ ტერიტორიაზე გავრცელებას; ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "ხმელთაშუაზღვეთის კუს საველე ჩანაწერები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ხმელთაშუაზღვეთის კუ დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта средиземноморской черепахи показывает публичные наблюдения iNaturalist в Грузии. На карте выделены только регионы с достаточным числом записей в таблице записей. iNaturalist скрывает публичные координаты этого вида, поэтому точки приблизительны: некоторые попадают за границу или в соседний регион, а точки за границами регионов в таблице не учитываются. Регионы запада Грузии с единичными записями не выделены. Выделенный регион не означает присутствие на всей его территории; число записей не измеряет плотность популяции.",
      mapAria:
        "Полевые записи средиземноморской черепахи и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где средиземноморская черепаха отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Akdeniz tosbağası haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini gösterir. Haritada yalnızca kayıt tablosunda yeterli kaydı olan bölgeler vurgulanır. iNaturalist bu türün açık koordinatlarını gizler; bu yüzden noktalar yaklaşıktır, bazıları sınırın ötesine veya komşu bölgeye düşer ve bölge sınırları dışında kalan noktalar tabloda sayılmaz. Batı Gürcistan'da yalnızca tekil kaydı olan bölgeler vurgulanmaz. Vurgulanan bölge, türün o bölgenin her yerinde bulunduğu anlamına gelmez; kayıt sayısı popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Akdeniz tosbağasının arazi kayıtları ve kayıt bulunan bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Akdeniz tosbağası Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 40023,
  rangeSource: "record-summary",
};
