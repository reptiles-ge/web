import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "This map uses public iNaturalist observations of the European glass lizard in Georgia. Its shaded regions are those with enough records in the records-by-region table; other regions have too few records. The 2026 checklist describes an eastern range, while Abkhazia also reaches this map's record threshold in the observation table. Counts reflect observation effort, not population density.",
      mapAria:
        "European glass lizard observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where the European glass lizard is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "რუკა იყენებს საქართველოში გველხოკერას შესახებ iNaturalist-ის საჯარო დაკვირვებებს. რუკაზე შეფერილია მხოლოდ რეგიონული ცხრილის მიხედვით საკმარისი ჩანაწერების მქონე რეგიონები; დანარჩენებში ჩანაწერები ცოტაა. 2026 წლის ჩამონათვალი აღმოსავლეთ საქართველოს ასახელებს, დაკვირვებების ცხრილში კი რუკის ჩანაწერთა ზღვარს აფხაზეთიც აღწევს. ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "გველხოკერას დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის გველხოკერა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта использует публичные наблюдения желтопузика в Грузии на iNaturalist. На карте закрашены только регионы с достаточным числом записей в таблице; в остальных записей мало. Перечень 2026 года указывает восточную Грузию, а Абхазия также достигает порога записей на этой карте. Число записей не отражает плотность популяции.",
      mapAria: "Наблюдения желтопузика и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где желтопузик отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Bu harita, Gürcistan'daki yılan kertenkeleye ait herkese açık iNaturalist gözlemlerini kullanır. Haritada yalnızca bölgesel kayıt tablosunda yeterli kaydı olan bölgeler renklendirilir; diğerlerinde kayıt azdır. 2026 listesi Doğu Gürcistan'ı belirtirken Abhazya da bu haritadaki kayıt eşiğine ulaşır. Kayıt sayısı nüfus yoğunluğunu göstermez.",
      mapAria:
        "Yılan kertenkele gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Yılan kertenkele Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 31975,
  rangeSource: "record-summary",
};
