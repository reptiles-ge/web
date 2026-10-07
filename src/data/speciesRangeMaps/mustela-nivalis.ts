import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The least weasel map combines Reptiles.ge field photos with public iNaturalist photo observations. Regions come from the records-by-region table; for this species, one record is enough to confirm distribution. A highlighted region does not imply presence throughout it, and record counts do not measure population density.",
      mapAria:
        "Least weasel photo observations and confirmed distribution on a map of Georgia",
      officialRegionLabel: "Region with confirmed distribution",
      rangeTitle: "Where least weasel distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "დედოფალას რუკა აერთიანებს Reptiles.ge-ის საველე ფოტოებსა და iNaturalist-ის საჯარო ფოტოდაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან; ამ სახეობაზე ერთი ჩანაწერიც საკმარისია, რომ რეგიონი დადასტურებულ გავრცელებად ჩაითვალოს. გამოკვეთილი რეგიონი მის მთელ ტერიტორიაზე არსებობას არ ნიშნავს, ხოლო ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვე არ არის.",
      mapAria:
        "დედოფალას ფოტოდაკვირვებები და დადასტურებული გავრცელება საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle: "სად არის დედოფალას გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта ласки объединяет полевые фотографии Reptiles.ge и публичные фотонаблюдения iNaturalist. Регионы взяты из таблицы записей; для этого вида одной записи достаточно, чтобы считать распространение подтверждённым. Выделенный регион не означает присутствия на всей его территории, а число записей не измеряет плотность популяции.",
      mapAria:
        "Фотонаблюдения ласки и подтверждённое распространение на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle: "Где распространение ласки подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Gelincik haritası Reptiles.ge arazi fotoğraflarını ve herkese açık iNaturalist fotoğraflı gözlemlerini birleştirir. Bölgeler kayıt tablosundan alınır; bu türde tek bir kayıt yayılışın doğrulanması için yeterlidir. Vurgulanan bölge türün her yerinde bulunduğu anlamına gelmez; kayıt sayısı popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Gelincik fotoğraflı gözlemleri ve doğrulanmış yayılışı Gürcistan haritasında",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle: "Gelincik yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 569428,
  rangeSource: "record-summary",
};
