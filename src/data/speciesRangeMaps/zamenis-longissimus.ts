import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Aesculapian snake map uses public iNaturalist observations of Zamenis longissimus. One field record in a region is enough for confirmed distribution; a region with no records is not treated as distribution. Some public coordinates are obscured, so points near regional borders are approximate. Record counts reflect observation effort, not population density.",
      mapAria:
        "Aesculapian snake observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle:
        "Where Aesculapian snake distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ესკულაპის მცურავის რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს Zamenis longissimus-ზე. რეგიონში ერთი საველე ჩანაწერიც საკმარისია, რომ გავრცელება დადასტურებულად ჩაითვალოს; ჩანაწერის არმქონე რეგიონი გავრცელებად არ ითვლება. საჯარო კოორდინატების ნაწილი დაფარულია, ამიტომ რეგიონების საზღვართან წერტილები მიახლოებითია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "ესკულაპის მცურავის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის ესკულაპის მცურავის გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта эскулапова полоза использует публичные наблюдения iNaturalist для Zamenis longissimus. Одной полевой записи в регионе достаточно, чтобы распространение считалось подтверждённым; регион без записей распространением не считается. Часть публичных координат скрыта, поэтому точки у границ регионов приблизительны. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения эскулапова полоза и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение эскулапова полоза подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Eskülap yılanı haritası Zamenis longissimus için herkese açık iNaturalist gözlemlerini kullanır. Bir bölgedeki tek bir arazi kaydı doğrulanmış yayılış için yeterlidir; kaydı olmayan bölge yayılış sayılmaz. Bazı halka açık koordinatlar gizlendiğinden bölge sınırlarına yakın noktalar yaklaşıktır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu ölçmez.",
      mapAria:
        "Eskülap yılanının gözlemleri ve doğrulanmış bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Doğrulanmış yayılış bölgesi",
      rangeTitle: "Eskülap yılanının yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 74009,
  rangeSource: "record-summary",
};
