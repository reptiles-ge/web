import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Aesculapian snake map uses public iNaturalist observations of Zamenis longissimus. Regions come from the records-by-region table: only confirmed status counts as distribution, and recorded-only regions do not. Some public coordinates are obscured or the place text disagrees with the point, so those records do not confirm a new region. Record counts reflect observation effort, not population density.",
      mapAria:
        "Aesculapian snake observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle:
        "Where Aesculapian snake distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "ესკულაპის მცურავის რუკა იყენებს iNaturalist-ის საჯარო დაკვირვებებს Zamenis longissimus-ზე. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი, მხოლოდ დაფიქსირებული რეგიონი კი არა. ზოგი საჯარო კოორდინატი დაფარულია ან ადგილის ტექსტი წერტილს არ ემთხვევა, ამიტომ ასეთი ჩანაწერი ახალ რეგიონს არ ადასტურებს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვეს არ ზომავს.",
      mapAria:
        "ესკულაპის მცურავის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის ესკულაპის მცურავის გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта эскулапова полоза использует публичные наблюдения iNaturalist для Zamenis longissimus. Регионы взяты из таблицы записей по регионам: распространением считается только подтверждённый статус, регионы только с находками не считаются. Часть публичных координат скрыта или подпись места не совпадает с точкой, поэтому такая запись не подтверждает новый регион. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения эскулапова полоза и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение эскулапова полоза подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Eskülap yılanı haritası Zamenis longissimus için herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır, yalnızca kayıt bulunan bölgeler sayılmaz. Bazı halka açık koordinatlar gizlidir veya yer yazısı noktayla uyuşmaz; bu kayıtlar yeni bir bölgeyi doğrulamaz. Kayıt sayısı gözlem çabasını yansıtır, nüfus yoğunluğunu ölçmez.",
      mapAria:
        "Eskülap yılanının gözlemleri ve doğrulanmış bölgeleri Gürcistan haritasında",
      officialRegionLabel: "Doğrulanmış yayılış bölgesi",
      rangeTitle: "Eskülap yılanının yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 74009,
  rangeSource: "record-summary",
};
