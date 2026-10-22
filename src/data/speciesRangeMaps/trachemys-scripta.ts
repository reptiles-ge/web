import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The pond slider map shows public iNaturalist observations in Georgia. Only regions with enough records in the records table are shaded on the map: Tbilisi, Adjara, and Abkhazia. Imereti, Kvemo Kartli, and Guria have single records and are not shaded. The pond slider is an introduced species, so a record can be a released or escaped pet and does not by itself show a reproducing population. A shaded region does not mean the turtle lives everywhere in it; record counts reflect observation effort, not population density.",
      mapAria:
        "Pond slider field records and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where pond sliders are recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "წითელყურა კუს რუკა აჩვენებს iNaturalist-ის საჯარო დაკვირვებებს საქართველოში. რუკაზე მხოლოდ ის რეგიონებია გამოკვეთილი, რომლებსაც ჩანაწერების ცხრილში საკმარისი ჩანაწერი აქვს: თბილისი, აჭარა და აფხაზეთი. იმერეთი, ქვემო ქართლი და გურია, სადაც მხოლოდ ცალკეული ჩანაწერია, გამოკვეთილი არ არის. წითელყურა კუ შემოტანილი სახეობაა, ამიტომ ჩანაწერი შეიძლება გაშვებულ ან გაქცეულ შინაურ კუს ეკუთვნოდეს და თავისთავად გამრავლებად პოპულაციას არ ადასტურებს. გამოკვეთილი რეგიონი არ ნიშნავს მის მთელ ტერიტორიაზე გავრცელებას; ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "წითელყურა კუს საველე ჩანაწერები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის წითელყურა კუ დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта красноухой черепахи показывает публичные наблюдения iNaturalist в Грузии. На карте выделены только регионы с достаточным числом записей в таблице записей: Тбилиси, Аджария и Абхазия. Имеретия, Квемо Картли и Гурия, где есть лишь единичные записи, не выделены. Красноухая черепаха — интродуцированный вид, поэтому запись может относиться к выпущенной или сбежавшей домашней черепахе и сама по себе не подтверждает размножающуюся популяцию. Выделенный регион не означает присутствие на всей его территории; число записей не измеряет плотность популяции.",
      mapAria:
        "Полевые записи красноухой черепахи и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где красноухая черепаха отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Kırmızı yanaklı su kaplumbağası haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini gösterir. Haritada yalnızca kayıt tablosunda yeterli kaydı olan bölgeler vurgulanır: Tiflis, Acara ve Abhazya. Yalnızca tekil kaydı olan İmereti, Kvemo Kartli ve Gurya vurgulanmaz. Kırmızı yanaklı su kaplumbağası sokulmuş bir türdür; bu yüzden bir kayıt doğaya bırakılmış veya kaçmış bir evcil hayvana ait olabilir ve tek başına üreyen bir popülasyonu göstermez. Vurgulanan bölge, türün o bölgenin her yerinde bulunduğu anlamına gelmez; kayıt sayısı popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Kırmızı yanaklı su kaplumbağasının arazi kayıtları ve kayıt bulunan bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle:
        "Kırmızı yanaklı su kaplumbağası Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 39782,
  rangeSource: "record-summary",
};
