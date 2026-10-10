import type { AppLocale } from "@/i18n/routing";

export type HalyomorphaRangeCopy = {
  closeLabel: string;
  clusterLabel: string;
  confirmedStatusLabel: string;
  footerDataLabel: string;
  footerINaturalistLabel: string;
  footerMethodologyLabel: string;
  footerReptilesLabel: string;
  galleryAction: string;
  intro: string;
  latestRecordsLabel: string;
  loadingLabel: string;
  locationRecordLabel: string;
  mapAria: string;
  mapError: string;
  noRegionRecordsLabel: string;
  officialRegionLabel: string;
  photoRecordLabel: string;
  rangeTitle: string;
  recordedOnlyStatusLabel: string;
  regionPageLabel: (regionName: string) => string;
  regionRecordsLabel: string;
  regionsMetricLabel: string;
  regionSummaryTitle: string;
  resetToGeorgiaLabel: string;
  sourceAction: string;
  zoomInLabel: string;
  zoomOutLabel: string;
};

export type InteractiveRangeMapConfig = {
  copy: Record<AppLocale, HalyomorphaRangeCopy>;
  iNaturalistTaxonId: number;
  rangeSource?: "map-regions" | "record-summary";
  regionMetric?: "confirmed";
};

export const HALYOMORPHA_RANGE_COPY: Record<AppLocale, HalyomorphaRangeCopy> = {
  en: {
    closeLabel: "Close field record",
    clusterLabel: "Several records in one spot",
    confirmedStatusLabel: "Distribution confirmed",
    footerDataLabel: "Data",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "Methodology",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "View photo",
    intro:
      "The map for Halyomorpha halys combines Reptiles.ge editorial photo records with public iNaturalist observations. Region-level literature evidence and individual occurrence records are separate layers, and record counts reflect observation effort rather than population density.",
    latestRecordsLabel: "Latest records",
    loadingLabel: "Interactive map is loading.",
    locationRecordLabel: "Field observation",
    mapAria:
      "Brown marmorated stink bug distribution evidence and field records on a map of Georgia",
    mapError:
      "The interactive map could not load, but confirmed regions and record counts remain on this page.",
    noRegionRecordsLabel: "No field records",
    officialRegionLabel: "Source-confirmed region",
    photoRecordLabel: "Photo record",
    rangeTitle: "Where brown marmorated stink bug occurs in Georgia",
    recordedOnlyStatusLabel: "Recorded only",
    regionPageLabel: (regionName) => `${regionName} region page`,
    regionRecordsLabel: "field records",
    regionsMetricLabel: "regions",
    regionSummaryTitle: "Records by region",
    resetToGeorgiaLabel: "All Georgia",
    sourceAction: "Open source",
    zoomInLabel: "Zoom in",
    zoomOutLabel: "Zoom out",
  },
  ka: {
    closeLabel: "საველე ჩანაწერის დახურვა",
    clusterLabel: "რამდენიმე ჩანაწერი ერთ ადგილას",
    confirmedStatusLabel: "გავრცელება დადასტურებულია",
    footerDataLabel: "მონაცემები",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "მეთოდოლოგია",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "ფოტოს ნახვა",
    intro:
      "აზიური ფაროსანას (Halyomorpha halys) რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონული ლიტერატურული მტკიცებულება და ინდივიდუალური საველე ჩანაწერები ცალკე ფენებია; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობასაც ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
    latestRecordsLabel: "ბოლო ჩანაწერები",
    loadingLabel: "ინტერაქტიული რუკა იტვირთება.",
    locationRecordLabel: "საველე ჩანაწერი",
    mapAria:
      "აზიური ფაროსანას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
    mapError:
      "ინტერაქტიული რუკა ვერ ჩაიტვირთა, მაგრამ დადასტურებული რეგიონები და ჩანაწერების რაოდენობა ამ გვერდზე კვლავ ჩანს.",
    noRegionRecordsLabel: "ჩანაწერი არ არის",
    officialRegionLabel: "წყაროებით დადასტურებული რეგიონი",
    photoRecordLabel: "ფოტოჩანაწერი",
    rangeTitle: "სად გვხვდება აზიური ფაროსანა საქართველოში",
    recordedOnlyStatusLabel: "მხოლოდ დაფიქსირებულია",
    regionPageLabel: (regionName) => `${regionName} — რეგიონის გვერდი`,
    regionRecordsLabel: "საველე ჩანაწერი",
    regionsMetricLabel: "რეგიონი",
    regionSummaryTitle: "ჩანაწერები რეგიონების მიხედვით",
    resetToGeorgiaLabel: "მთელი საქართველო",
    sourceAction: "წყაროს გახსნა",
    zoomInLabel: "მასშტაბის გადიდება",
    zoomOutLabel: "მასშტაბის შემცირება",
  },
  ru: {
    closeLabel: "Закрыть полевую запись",
    clusterLabel: "Несколько записей в одном месте",
    confirmedStatusLabel: "Распространение подтверждено",
    footerDataLabel: "Данные",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "Методология",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "Открыть фото",
    intro:
      "Карта Halyomorpha halys объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Региональные литературные данные и отдельные полевые записи показаны разными слоями; количество записей отражает также интенсивность наблюдений, а не плотность популяции.",
    latestRecordsLabel: "Последние записи",
    loadingLabel: "Интерактивная карта загружается.",
    locationRecordLabel: "Полевое наблюдение",
    mapAria: "Полевые записи коричнево-мраморного клопа на карте Грузии",
    mapError:
      "Интерактивная карта не загрузилась, но подтверждённые регионы и число записей остаются на странице.",
    noRegionRecordsLabel: "Записей нет",
    officialRegionLabel: "Регион, подтверждённый источниками",
    photoRecordLabel: "Фотозапись",
    rangeTitle: "Где встречается коричнево-мраморный клоп в Грузии",
    recordedOnlyStatusLabel: "Только зафиксировано",
    regionPageLabel: (regionName) => `Страница региона: ${regionName}`,
    regionRecordsLabel: "полевых записей",
    regionsMetricLabel: "регионов",
    regionSummaryTitle: "Записи по регионам",
    resetToGeorgiaLabel: "Вся Грузия",
    sourceAction: "Открыть источник",
    zoomInLabel: "Приблизить",
    zoomOutLabel: "Отдалить",
  },
  tr: {
    closeLabel: "Arazi kaydını kapat",
    clusterLabel: "Aynı yerde birkaç kayıt",
    confirmedStatusLabel: "Yayılış doğrulandı",
    footerDataLabel: "Veri",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "Metodoloji",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "Fotoğrafı aç",
    intro:
      "Halyomorpha halys haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölge düzeyindeki literatür kanıtı ile tekil arazi kayıtları ayrı katmanlardır; kayıt sayısı gözlem yoğunluğunu da yansıtır, popülasyon yoğunluğu değildir.",
    latestRecordsLabel: "Son kayıtlar",
    loadingLabel: "Etkileşimli harita yükleniyor.",
    locationRecordLabel: "Arazi gözlemi",
    mapAria:
      "Kahverengi kokarcanın yayılış kanıtları ve arazi kayıtları Gürcistan haritasında",
    mapError:
      "Etkileşimli harita yüklenemedi, ancak doğrulanmış bölgeler ve kayıt sayıları bu sayfada görülebilir.",
    noRegionRecordsLabel: "Kayıt yok",
    officialRegionLabel: "Kaynakla doğrulanmış bölge",
    photoRecordLabel: "Fotoğraf kaydı",
    rangeTitle: "Kahverengi kokarca Gürcistan'da nerede görülür?",
    recordedOnlyStatusLabel: "Yalnızca kaydedildi",
    regionPageLabel: (regionName) => `${regionName} bölge sayfası`,
    regionRecordsLabel: "arazi kaydı",
    regionsMetricLabel: "bölge",
    regionSummaryTitle: "Bölgelere göre kayıtlar",
    resetToGeorgiaLabel: "Tüm Gürcistan",
    sourceAction: "Kaynağı aç",
    zoomInLabel: "Yakınlaştır",
    zoomOutLabel: "Uzaklaştır",
  },
};
