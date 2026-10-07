import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The white stork map uses public iNaturalist observations from Georgia. Regions come from the records-by-region table: only a confirmed status counts as distribution; other regions have records only. These observations do not by themselves establish breeding. Record counts reflect observation effort, not population density.",
      mapAria:
        "White stork observations and confirmed regions on a map of Georgia",
      officialRegionLabel: "Region with confirmed distribution",
      rangeTitle: "Where white stork distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "თეთრი ყარყატის რუკა საქართველოს iNaturalist-ის საჯარო დაკვირვებებს ეყრდნობა. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებულად ითვლება მხოლოდ დადასტურებული სტატუსი, დანარჩენში მხოლოდ ჩანაწერია. ეს ჩანაწერები თავისთავად ბუდობას არ ადასტურებს. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "თეთრი ყარყატის დაკვირვებები და დადასტურებული რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის თეთრი ყარყატის გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта белого аиста основана на публичных наблюдениях iNaturalist в Грузии. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус, в остальных регионах есть лишь записи. Эти наблюдения сами по себе не доказывают гнездование. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения белого аиста и подтверждённые регионы на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение белого аиста подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Leylek haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini kullanır. Bölgeler, bölgelere göre kayıt tablosundan gelir: yalnızca doğrulanmış durum yayılış sayılır; diğerlerinde yalnızca kayıt vardır. Bu gözlemler tek başına üremeyi kanıtlamaz. Kayıt sayısı gözlem çabasını yansıtır, popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Leylek gözlemleri ve doğrulanmış bölgeler Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Leyleğin yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 4733,
  rangeSource: "record-summary",
};
