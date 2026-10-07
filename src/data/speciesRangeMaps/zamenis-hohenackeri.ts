import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Transcaucasian rat snake map combines Reptiles.ge field photos with public iNaturalist observations. One field record in a region is enough for confirmed distribution status. Some iNaturalist coordinates are obscured, so points near regional borders are approximate. Record counts reflect observation effort, not population density.",
      mapAria:
        "Transcaucasian rat snake observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle:
        "Where Transcaucasian rat snake distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ამიერკავკასიური მცურავის რუკა აერთიანებს Reptiles.ge-ის საველე ფოტოებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონში ერთი საველე ჩანაწერიც საკმარისია, რომ გავრცელება დადასტურებულად ჩაითვალოს. iNaturalist-ის ზოგი კოორდინატი დაფარულია, ამიტომ რეგიონების საზღვრებთან მდებარე წერტილები მიახლოებითია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "ამიერკავკასიური მცურავის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის ამიერკავკასიური მცურავის გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта закавказского полоза объединяет полевые фотографии Reptiles.ge и публичные наблюдения iNaturalist. Одной полевой записи в регионе достаточно для статуса подтверждённого распространения. Координаты некоторых наблюдений iNaturalist скрыты, поэтому точки у границ регионов приблизительны. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения закавказского полоза и регионы с подтверждённым распространением на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle:
        "Где распространение закавказского полоза подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Transkafkas sıçan yılanı haritası Reptiles.ge arazi fotoğraflarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bir bölgedeki tek bir saha kaydı doğrulanmış yayılış durumu için yeterlidir. Bazı iNaturalist koordinatları gizlendiğinden bölge sınırlarındaki noktalar yaklaşıktır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu ölçmez.",
      mapAria:
        "Transkafkas sıçan yılanının gözlemleri ve doğrulanmış bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Doğrulanmış yayılış bölgesi",
      rangeTitle:
        "Transkafkas sıçan yılanının yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 74007,
  rangeSource: "record-summary",
};
