import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "This map uses public iNaturalist observations of the European glass lizard in Georgia. Its shaded distribution comes from regions marked confirmed in the records-by-region table; other regions have records only. The 2026 checklist describes an eastern range, while the observation table also confirms Abkhazia by this map's record threshold. Counts reflect observation effort, not population density.",
      mapAria:
        "European glass lizard observations and confirmed distribution regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where the European glass lizard is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "რუკა იყენებს საქართველოში გველხოკერას შესახებ iNaturalist-ის საჯარო დაკვირვებებს. გავრცელებად შეფერილია მხოლოდ რეგიონული ცხრილის დადასტურებული სტატუსის მქონე რეგიონები; დანარჩენებში სახეობა მხოლოდ დაფიქსირებულია. 2026 წლის ჩამონათვალი აღმოსავლეთ საქართველოს ასახელებს, დაკვირვებების ცხრილში კი რუკის ჩანაწერთა ზღვარს აფხაზეთიც აღწევს. ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "გველხოკერას დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის გველხოკერა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта использует публичные наблюдения желтопузика в Грузии на iNaturalist. Распространением отмечены только регионы со статусом подтверждения в таблице записей; в остальных вид лишь зафиксирован. Перечень 2026 года указывает восточную Грузию, а Абхазия также достигает порога подтверждения по записям на этой карте. Число записей не отражает плотность популяции.",
      mapAria:
        "Наблюдения желтопузика и регионы подтверждённого распространения на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где желтопузик отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Bu harita, Gürcistan'daki yılan kertenkeleye ait herkese açık iNaturalist gözlemlerini kullanır. Yalnızca bölgesel kayıt tablosunda durumu doğrulanmış bölgeler yayılış olarak renklendirilir; diğerlerinde tür sadece kaydedilmiştir. 2026 listesi Doğu Gürcistan'ı belirtirken Abhazya da bu haritadaki kayıt eşiğine ulaşır. Kayıt sayısı nüfus yoğunluğunu göstermez.",
      mapAria:
        "Yılan kertenkele gözlemleri ve doğrulanmış yayılış bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Yılan kertenkele Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 31975,
  rangeSource: "record-summary",
};
