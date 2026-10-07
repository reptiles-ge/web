import {
  HALYOMORPHA_RANGE_COPY,
  type InteractiveRangeMapConfig,
} from "@/data/speciesRangeMaps/base";

export const rangeMap: InteractiveRangeMapConfig = {
  copy: {
    en: {
      ...HALYOMORPHA_RANGE_COPY.en,
      intro:
        "The obscure rock lizard map combines public iNaturalist observations in Georgia filed as Darevskia rudis obscura with localities that have no observer. Regions come from the records-by-region table: only confirmed status counts as distribution; otherwise a region is not treated as part of the range. Record counts reflect observation effort, not population density.",
      mapAria:
        "Obscure rock lizard observations and confirmed distribution regions on a map of Georgia",
      officialRegionLabel: "Confirmed distribution region",
      rangeTitle:
        "Where obscure rock lizard distribution is confirmed in Georgia",
    },
    ka: {
      ...HALYOMORPHA_RANGE_COPY.ka,
      intro:
        "მესხური კლდის ხვლიკის რუკა აერთიანებს საქართველოს iNaturalist-ის საჯარო დაკვირვებებს, რომლებიც Darevskia rudis obscura-ს სახელითაა შეტანილი, და აღმწერის გარეშე დამატებულ ლოკალიტეტებს. რეგიონები აღებულია ჩანაწერების რეგიონული ცხრილიდან: გავრცელებად ითვლება მხოლოდ დადასტურებული სტატუსი; სხვა შემთხვევაში რეგიონი გავრცელებულად არ ითვლება. ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და არა პოპულაციის სიმჭიდროვეს.",
      mapAria:
        "მესხური კლდის ხვლიკის დაკვირვებები და დადასტურებული გავრცელების რეგიონები საქართველოს რუკაზე",
      officialRegionLabel: "დადასტურებული გავრცელების რეგიონი",
      rangeTitle:
        "სად არის მესხური კლდის ხვლიკის გავრცელება დადასტურებული საქართველოში",
    },
    ru: {
      ...HALYOMORPHA_RANGE_COPY.ru,
      intro:
        "Карта тёмной скальной ящерицы объединяет публичные наблюдения iNaturalist в Грузии, внесённые как Darevskia rudis obscura, и локалитеты без наблюдателя. Регионы взяты из таблицы записей: распространением считается только подтверждённый статус; в остальных случаях регион распространением не считается. Число записей отражает активность наблюдателей, а не плотность популяции.",
      mapAria:
        "Наблюдения тёмной скальной ящерицы и регионы с подтверждённым распространением на карте Грузии",
      officialRegionLabel: "Регион с подтверждённым распространением",
      rangeTitle:
        "Где распространение тёмной скальной ящерицы подтверждено в Грузии",
    },
    tr: {
      ...HALYOMORPHA_RANGE_COPY.tr,
      intro:
        "Koyu kayalık kertenkele haritası, Gürcistan'da Darevskia rudis obscura adıyla girilmiş herkese açık iNaturalist gözlemlerini ve gözlemcisi olmayan lokaliteleri birleştirir. Bölgeler, bölgelere göre kayıt tablosundan alınır: yalnızca doğrulanmış durum yayılış sayılır; aksi halde bölge yayılış sayılmaz. Kayıt sayısı nüfus yoğunluğunu değil, gözlem çabasını yansıtır.",
      mapAria:
        "Koyu kayalık kertenkele gözlemleri ve Gürcistan'da yayılışı doğrulanmış bölgeler",
      officialRegionLabel: "Yayılışı doğrulanmış bölge",
      rangeTitle:
        "Koyu kayalık kertenkelenin yayılışı Gürcistan'da nerede doğrulandı?",
    },
  },
  iNaturalistTaxonId: 35376,
  rangeSource: "record-summary",
};
