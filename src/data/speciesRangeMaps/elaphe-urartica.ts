import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Urartian ratsnake map uses public iNaturalist photo observations in Georgia. Regions come from the records-by-region table: only regions with enough records are shaded on the map; other regions are not shaded. Some public coordinates are obscured or approximate, so a point near a border does not by itself add a new region. Record counts reflect observation effort, not population density.",
      mapAria:
        "Urartian ratsnake observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Urartian ratsnake: where it is recorded in Georgia",
      regionsMetricLabel: "regions with records",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ურარტუს მცურავის რუკა საქართველოს iNaturalist-ის საჯარო ფოტოდაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: რუკაზე მონიშნულია მხოლოდ საკმარისი ჩანაწერების მქონე რეგიონები; დანარჩენი რეგიონები მონიშნული არ არის. ზოგი საჯარო კოორდინატი დაფარული ან მიახლოებითია, ამიტომ საზღვართან მდებარე წერტილი თავისთავად ახალ რეგიონს არ ამატებს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "ურარტუს მცურავის დაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის ურარტუს მცურავი დაფიქსირებული საქართველოში",
      regionsMetricLabel: "რეგიონი ჩანაწერით",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта урартского полоза использует публичные фотонаблюдения iNaturalist в Грузии. Регионы взяты из таблицы записей: на карте закрашены только регионы с достаточным числом записей; остальные регионы не закрашены. Часть публичных координат скрыта или приблизительна, поэтому точка у границы сама по себе не добавляет новый регион. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения урартского полоза и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где урартский полоз отмечен в Грузии",
      regionsMetricLabel: "регионов с записями",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Urartu sıçanyılanı haritası Gürcistan'daki herkese açık iNaturalist fotoğraflı gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: haritada yalnızca yeterli kaydı olan bölgeler gösterilir; diğer bölgeler gösterilmez. Bazı halka açık koordinatlar gizlenmiş veya yaklaşıktır; sınırdaki bir nokta kendiliğinden yeni bir bölge eklemez. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Urartu sıçanyılanı gözlemleri ve Gürcistan'da kayıt bulunan bölgeler",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Urartu sıçanyılanı Gürcistan'da nerede kaydedildi?",
      regionsMetricLabel: "kayıt bulunan bölge",
    },
  },
  iNaturalistTaxonId: 965955,
  rangeSource: "record-summary",
};
