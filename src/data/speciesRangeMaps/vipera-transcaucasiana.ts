import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The nose-horned viper map uses public iNaturalist observations filed as Vipera meridionalis transcaucasiana. Only regions with enough records in the records table are shaded on the map. Public coordinates are obscured, so points near regional borders are approximate; record counts do not measure population density.",
      mapAria:
        "Nose-horned viper observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where the nose-horned viper is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ცხვირრქოსანი გველგესლას რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს, რომლებიც Vipera meridionalis transcaucasiana-ს სახელითაა შეტანილი. რუკაზე შეფერილია მხოლოდ ცხრილის მიხედვით საკმარისი ჩანაწერების მქონე რეგიონები. საჯარო კოორდინატები დაფარულია, ამიტომ რეგიონების საზღვართან წერტილები მიახლოებითია; ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "ცხვირრქოსანი გველგესლას დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ცხვირრქოსანი გველგესლა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта носатой гадюки использует публичные наблюдения iNaturalist под названием Vipera meridionalis transcaucasiana. На карте закрашены только регионы с достаточным числом записей в таблице. Публичные координаты скрыты, поэтому точки у границ регионов приблизительны; число записей не измеряет плотность популяции.",
      mapAria: "Наблюдения носатой гадюки и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где носатая гадюка отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Boynuzlu engerek haritası, iNaturalist'te Vipera meridionalis transcaucasiana adıyla kayıtlı halka açık gözlemleri kullanır. Haritada yalnızca tabloda yeterli kaydı olan bölgeler boyanır. Halka açık koordinatlar gizlendiğinden bölge sınırlarına yakın noktalar yaklaşıktır; kayıt sayısı popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Boynuzlu engerek gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Boynuzlu engerek Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 1701183,
  rangeSource: "record-summary",
};
