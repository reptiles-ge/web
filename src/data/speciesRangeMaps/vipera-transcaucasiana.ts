import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The nose-horned viper map uses public iNaturalist observations filed as Vipera meridionalis transcaucasiana. Only regions marked confirmed in the records table count as distribution. Public coordinates are obscured, so points near regional borders are approximate; record counts do not measure population density.",
      mapAria:
        "Nose-horned viper observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where the nose-horned viper is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ცხვირრქოსანი გველგესლას რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს, რომლებიც Vipera meridionalis transcaucasiana-ს სახელითაა შეტანილი. გავრცელებად ითვლება მხოლოდ ცხრილში დადასტურებული სტატუსის მქონე რეგიონი. საჯარო კოორდინატები დაფარულია, ამიტომ რეგიონების საზღვართან წერტილები მიახლოებითია; ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "ცხვირრქოსანი გველგესლას დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის ცხვირრქოსანი გველგესლა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта носатой гадюки использует публичные наблюдения iNaturalist под названием Vipera meridionalis transcaucasiana. Распространением считаются только регионы со статусом подтверждения в таблице. Публичные координаты скрыты, поэтому точки у границ регионов приблизительны; число записей не измеряет плотность популяции.",
      mapAria:
        "Наблюдения носатой гадюки и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где носатая гадюка отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Boynuzlu engerek haritası, iNaturalist'te Vipera meridionalis transcaucasiana adıyla kayıtlı halka açık gözlemleri kullanır. Yalnızca tablodaki durumu doğrulanmış bölgeler yayılış sayılır. Halka açık koordinatlar gizlendiğinden bölge sınırlarına yakın noktalar yaklaşıktır; kayıt sayısı popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Boynuzlu engerek gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Boynuzlu engerek Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 1701183,
  rangeSource: "record-summary",
};
