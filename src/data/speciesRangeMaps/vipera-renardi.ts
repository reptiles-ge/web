import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The steppe viper map uses public iNaturalist observations of Vipera renardi. A region with at least one field record is shaded on the map; a region with no records is not shaded. Some public coordinates are obscured, so points near regional borders are approximate. Record counts reflect observation effort, not population density.",
      mapAria:
        "Steppe viper observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Steppe viper: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ველის გველგესლას რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს Vipera renardi-ზე. რეგიონი, სადაც სულ მცირე ერთი საველე ჩანაწერია, რუკაზე შეფერილია; ჩანაწერის არმქონე რეგიონი შეფერილი არ არის. საჯარო კოორდინატების ნაწილი დაფარულია, ამიტომ რეგიონების საზღვართან წერტილები მიახლოებითია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "ველის გველგესლას დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ველის გველგესლა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта степной гадюки использует публичные наблюдения iNaturalist для Vipera renardi. Регион хотя бы с одной полевой записью закрашен на карте; регион без записей не закрашен. Часть публичных координат скрыта, поэтому точки у границ регионов приблизительны. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria: "Наблюдения степной гадюки и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где степная гадюка отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Bozkır engereği haritası Vipera renardi için herkese açık iNaturalist gözlemlerini kullanır. En az bir arazi kaydı olan bölge haritada boyanır; kaydı olmayan bölge boyanmaz. Bazı halka açık koordinatlar gizlendiğinden bölge sınırlarına yakın noktalar yaklaşıktır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu ölçmez.",
      mapAria:
        "Bozkır engereğinin gözlemleri ve kayıt bulunan bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Bozkır engereği Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 114991,
  rangeSource: "record-summary",
};
