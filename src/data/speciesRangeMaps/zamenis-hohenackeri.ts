import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Transcaucasian rat snake map combines Reptiles.ge field photos with public iNaturalist observations. A region with at least one field record is shaded on the map. Some iNaturalist coordinates are obscured, so points near regional borders are approximate. Record counts reflect observation effort, not population density.",
      mapAria:
        "Transcaucasian rat snake observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Transcaucasian rat snake: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ამიერკავკასიური მცურავის რუკა აერთიანებს Reptiles.ge-ის საველე ფოტოებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონი, სადაც სულ მცირე ერთი საველე ჩანაწერია, რუკაზე შეფერილია. iNaturalist-ის ზოგი კოორდინატი დაფარულია, ამიტომ რეგიონების საზღვრებთან მდებარე წერტილები მიახლოებითია. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "ამიერკავკასიური მცურავის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ამიერკავკასიური მცურავი დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта закавказского полоза объединяет полевые фотографии Reptiles.ge и публичные наблюдения iNaturalist. Регион хотя бы с одной полевой записью закрашен на карте. Координаты некоторых наблюдений iNaturalist скрыты, поэтому точки у границ регионов приблизительны. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения закавказского полоза и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где закавказский полоз отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Transkafkas sıçan yılanı haritası Reptiles.ge arazi fotoğraflarını ve herkese açık iNaturalist gözlemlerini birleştirir. En az bir saha kaydı olan bölge haritada boyanır. Bazı iNaturalist koordinatları gizlendiğinden bölge sınırlarındaki noktalar yaklaşıktır. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu ölçmez.",
      mapAria:
        "Transkafkas sıçan yılanının gözlemleri ve kayıt bulunan bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Transkafkas sıçan yılanı Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 74007,
  rangeSource: "record-summary",
};
