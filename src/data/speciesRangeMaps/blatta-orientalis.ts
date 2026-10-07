import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The Oriental cockroach map combines public iNaturalist observations from Georgia with georeferenced Reptiles.ge gallery photos. Regions come from the records-by-region table; only regions whose status is confirmed are treated as distribution, while others remain recorded-only.",
      mapAria:
        "Oriental cockroach distribution evidence and iNaturalist field records on a map of Georgia",
      officialRegionLabel: "Region with records",
      rangeTitle: "Where the Oriental cockroach is recorded in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "შავი ტარაკანის რუკა აერთიანებს საქართველოს iNaturalist-ის საჯარო დაკვირვებებსა და Reptiles.ge-ის გალერეის კოორდინატიან ფოტოებს. რეგიონები აღებულია ჩანაწერების ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსის მქონე რეგიონი; დანარჩენებში სახეობა მხოლოდ დაფიქსირებულად რჩება.",
      mapAria:
        "შავი ტარაკანის გავრცელების მტკიცებულებები და iNaturalist-ის საველე ჩანაწერები საქართველოს რუკაზე",
      officialRegionLabel: "ჩანაწერების მქონე რეგიონი",
      rangeTitle: "სად არის შავი ტარაკანა დაფიქსირებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта чёрного таракана объединяет публичные наблюдения iNaturalist из Грузии и геопривязанные фотографии из галереи Reptiles.ge. Регионы взяты из таблицы записей: распространением считаются только регионы со статусом подтверждения, в остальных вид остаётся лишь зарегистрированным.",
      mapAria:
        "Данные о распространении чёрного таракана и полевые записи iNaturalist на карте Грузии",
      officialRegionLabel: "Регион с записями",
      rangeTitle: "Где чёрный таракан отмечен в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Doğu hamam böceği haritası Gürcistan'daki herkese açık iNaturalist gözlemlerini ve Reptiles.ge galerisindeki konumlu fotoğrafları birleştirir. Bölgeler kayıt tablosundan alınır; yalnızca durumu doğrulanmış bölgeler yayılış sayılır, diğerleri yalnızca kaydedilmiş kabul edilir.",
      mapAria:
        "Doğu hamam böceğinin yayılış kanıtları ve iNaturalist arazi kayıtları Gürcistan haritasında",
      officialRegionLabel: "Kayıt bulunan bölge",
      rangeTitle: "Doğu hamam böceği Gürcistan'da nerede kaydedildi?",
    },
  },
  iNaturalistTaxonId: 154213,
  rangeSource: "record-summary",
};
