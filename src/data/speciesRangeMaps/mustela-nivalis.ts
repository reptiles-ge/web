import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The least weasel map combines Reptiles.ge field photos with public iNaturalist photo observations. Regions come from the records-by-region table; for this species, one record is enough for a region to be shaded on the map. A highlighted region does not imply presence throughout it, and record counts do not measure population density.",
      mapAria:
        "Least weasel photo observations and regions with records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Least weasel: where it is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "დედოფალას რუკა აერთიანებს Reptiles.ge-ის საველე ფოტოებსა და iNaturalist-ის საჯარო ფოტოდაკვირვებებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან; ამ სახეობაზე ერთი ჩანაწერიც საკმარისია, რომ რეგიონი რუკაზე გამოიკვეთოს. გამოკვეთილი რეგიონი მის მთელ ტერიტორიაზე არსებობას არ ნიშნავს, ხოლო ჩანაწერების რაოდენობა პოპულაციის სიმჭიდროვე არ არის.",
      mapAria:
        "დედოფალას ფოტოდაკვირვებები და ჩანაწერების მქონე რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის დედოფალა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта ласки объединяет полевые фотографии Reptiles.ge и публичные фотонаблюдения iNaturalist. Регионы взяты из таблицы записей; для этого вида одной записи достаточно, чтобы регион был выделен на карте. Выделенный регион не означает присутствия на всей его территории, а число записей не измеряет плотность популяции.",
      mapAria: "Фотонаблюдения ласки и регионы с записями на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где ласка отмечена в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Gelincik haritası Reptiles.ge arazi fotoğraflarını ve herkese açık iNaturalist fotoğraflı gözlemlerini birleştirir. Bölgeler kayıt tablosundan alınır; bu türde bir bölgenin haritada vurgulanması için tek bir kayıt yeterlidir. Vurgulanan bölge türün her yerinde bulunduğu anlamına gelmez; kayıt sayısı popülasyon yoğunluğunu ölçmez.",
      mapAria:
        "Gelincik fotoğraflı gözlemleri ve kayıt bulunan bölgeler Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Gelincik Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 569428,
  rangeSource: "record-summary",
};
