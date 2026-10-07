import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The steppe viper map uses public iNaturalist observations of Vipera renardi. One field record in a region is enough for confirmed distribution; a region with no records is not treated as distribution. Some public coordinates are obscured, so points near regional borders are approximate. Record counts reflect observation effort, not population density.",
      mapAria:
        "Steppe viper observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle: "Where steppe viper distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ველის გველგესლას რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს Vipera renardi-ზე. რეგიონში ერთი საველე ჩანაწერიც საკმარისია, რომ გავრცელება დადასტურებულად ჩაითვალოს; ჩანაწერის არმქონე რეგიონი გავრცელებად არ ითვლება. საჯარო კოორდინატების ნაწილი დაფარულია, ამიტომ რეგიონების საზღვართან წერტილები მიახლოებითია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "ველის გველგესლას დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის ველის გველგესლას გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта степной гадюки использует публичные наблюдения iNaturalist для Vipera renardi. Одной полевой записи в регионе достаточно, чтобы распространение считалось подтверждённым; регион без записей распространением не считается. Часть публичных координат скрыта, поэтому точки у границ регионов приблизительны. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения степной гадюки и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение степной гадюки подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Bozkır engereği haritası Vipera renardi için herkese açık iNaturalist gözlemlerini kullanır. Bir bölgedeki tek bir arazi kaydı doğrulanmış yayılış için yeterlidir; kaydı olmayan bölge yayılış sayılmaz. Bazı halka açık koordinatlar gizlendiğinden bölge sınırlarına yakın noktalar yaklaşıktır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu ölçmez.",
      mapAria:
        "Bozkır engereğinin gözlemleri ve doğrulanmış bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Doğrulanmış yayılış bölgesi",
      rangeTitle: "Bozkır engereğinin yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 114991,
  rangeSource: "record-summary",
};
