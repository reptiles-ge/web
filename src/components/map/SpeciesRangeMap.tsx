import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { HalyomorphaRangeMapCopy } from "@/components/map/HalyomorphaRangeMapTypes";
import type { GalleryImage, SpeciesFieldRecord } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { HalyomorphaOccurrenceSummary } from "@/lib/halyomorphaOccurrences";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { GeorgiaMapStatic } from "@/components/map/GeorgiaMapStatic";
import { HalyomorphaRangeMap } from "@/components/map/HalyomorphaRangeMap";
import { HalyomorphaRegionSelectButton } from "@/components/map/HalyomorphaRegionSelectButton";
import {
  HALYOMORPHA_RANGE_GEOJSON,
  type HalyomorphaRangeRegionFeatureCollection,
} from "@/data/halyomorphaRangeRegions";
import {
  getRegionsForSpecies,
  localizeRegionText,
  regions,
} from "@/data/mapRegions";
import { Link } from "@/i18n/navigation";
import {
  getHalyomorphaFieldRecords,
  getHalyomorphaOccurrenceSummary,
} from "@/lib/halyomorphaOccurrences";
import { regionHref } from "@/lib/regionHref";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type HalyomorphaRangeCopy = {
  closeLabel: string;
  confirmedStatusLabel: string;
  fieldRecordLabel: string;
  footerDataLabel: string;
  footerINaturalistLabel: string;
  footerMethodologyLabel: string;
  footerReptilesLabel: string;
  galleryAction: string;
  iNaturalistRecordLabel: string;
  intro: string;
  loadingLabel: string;
  locationRecordLabel: string;
  mapAria: string;
  mapError: string;
  noPhotoLabel: string;
  noRegionRecordsLabel: string;
  officialRegionLabel: string;
  photoRecordLabel: string;
  rangeTitle: string;
  recordedOnlyStatusLabel: string;
  regionLoadingLabel: string;
  regionPageLabel: (regionName: string) => string;
  regionRecordsLabel: string;
  regionSelectActionLabel: string;
  regionsMetricLabel: string;
  regionSummaryTitle: string;
  resetMapLabel: string;
  resetToGeorgiaLabel: string;
  sourceAction: string;
  statusColumnLabel: string;
};

type InteractiveRangeMapConfig = {
  copy: Record<AppLocale, HalyomorphaRangeCopy>;
  iNaturalistTaxonId: number;
};

type SpeciesRangeMapProps = {
  fieldRecords?: SpeciesFieldRecord[];
  gallery?: GalleryImage[];
  speciesId: string;
  speciesName: string;
};

const HALYOMORPHA_RANGE_COPY: Record<AppLocale, HalyomorphaRangeCopy> = {
  en: {
    closeLabel: "Close field record",
    confirmedStatusLabel: "Distribution confirmed",
    fieldRecordLabel: "field record",
    footerDataLabel: "Data",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "Methodology",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "View photo",
    iNaturalistRecordLabel: "iNaturalist observations",
    intro:
      "The map for Halyomorpha halys combines Reptiles.ge editorial photo records with public iNaturalist observations. Region-level literature evidence and individual occurrence records are separate layers, and record counts reflect observation effort rather than population density.",
    loadingLabel: "Interactive map is loading.",
    locationRecordLabel: "Field observation",
    mapAria:
      "Brown marmorated stink bug distribution evidence and field records on a map of Georgia",
    mapError:
      "The interactive map could not load, but the confirmed regions and field records are still listed below.",
    noPhotoLabel: "No public photo for this record",
    noRegionRecordsLabel: "No field records",
    officialRegionLabel: "Source-confirmed region",
    photoRecordLabel: "Photo record",
    rangeTitle: "Where brown marmorated stink bug occurs in Georgia",
    recordedOnlyStatusLabel: "Recorded only",
    regionLoadingLabel: "Loading region records",
    regionPageLabel: (regionName) => `${regionName} region page`,
    regionRecordsLabel: "field records",
    regionSelectActionLabel: "View records",
    regionsMetricLabel: "regions",
    regionSummaryTitle: "Records by region",
    resetMapLabel: "Reset map view",
    resetToGeorgiaLabel: "All Georgia",
    sourceAction: "Open source",
    statusColumnLabel: "Status",
  },
  ka: {
    closeLabel: "საველე ჩანაწერის დახურვა",
    confirmedStatusLabel: "გავრცელება დადასტურებულია",
    fieldRecordLabel: "საველე ჩანაწერი",
    footerDataLabel: "მონაცემები",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "მეთოდოლოგია",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "ფოტოს ნახვა",
    iNaturalistRecordLabel: "iNaturalist-ის დაკვირვება",
    intro:
      "აზიური ფაროსანას (Halyomorpha halys) რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. რეგიონული ლიტერატურული მტკიცებულება და ინდივიდუალური საველე ჩანაწერები ცალკე ფენებია; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობასაც ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
    loadingLabel: "ინტერაქტიული რუკა იტვირთება.",
    locationRecordLabel: "საველე ჩანაწერი",
    mapAria:
      "აზიური ფაროსანას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
    mapError:
      "ინტერაქტიული რუკა ვერ ჩაიტვირთა, მაგრამ დადასტურებული რეგიონები და საველე ჩანაწერები ქვემოთ ტექსტურად ჩანს.",
    noPhotoLabel: "ამ ჩანაწერს საჯაროდ გამოსაქვეყნებელი ფოტო არ აქვს",
    noRegionRecordsLabel: "ჩანაწერი არ არის",
    officialRegionLabel: "წყაროებით დადასტურებული რეგიონი",
    photoRecordLabel: "ფოტოჩანაწერი",
    rangeTitle: "სად გვხვდება აზიური ფაროსანა საქართველოში",
    recordedOnlyStatusLabel: "მხოლოდ დაფიქსირებულია",
    regionLoadingLabel: "რეგიონის ჩანაწერები იტვირთება",
    regionPageLabel: (regionName) => `${regionName} — რეგიონის გვერდი`,
    regionRecordsLabel: "საველე ჩანაწერი",
    regionSelectActionLabel: "ჩანაწერების ნახვა",
    regionsMetricLabel: "რეგიონი",
    regionSummaryTitle: "ჩანაწერები რეგიონების მიხედვით",
    resetMapLabel: "რუკის საწყის ხედზე დაბრუნება",
    resetToGeorgiaLabel: "მთელი საქართველო",
    sourceAction: "წყაროს გახსნა",
    statusColumnLabel: "სტატუსი",
  },
  ru: {
    closeLabel: "Закрыть полевую запись",
    confirmedStatusLabel: "Распространение подтверждено",
    fieldRecordLabel: "полевая запись",
    footerDataLabel: "Данные",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "Методология",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "Открыть фото",
    iNaturalistRecordLabel: "наблюдений iNaturalist",
    intro:
      "Карта Halyomorpha halys объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Региональные литературные данные и отдельные полевые записи показаны разными слоями; количество записей отражает также интенсивность наблюдений, а не плотность популяции.",
    loadingLabel: "Интерактивная карта загружается.",
    locationRecordLabel: "Полевое наблюдение",
    mapAria: "Полевые записи коричнево-мраморного клопа на карте Грузии",
    mapError:
      "Интерактивная карта не загрузилась, но подтверждённые регионы и полевые записи остаются доступными ниже.",
    noPhotoLabel: "У этой записи нет публичного фото",
    noRegionRecordsLabel: "Записей нет",
    officialRegionLabel: "Регион, подтверждённый источниками",
    photoRecordLabel: "Фотозапись",
    rangeTitle: "Где встречается коричнево-мраморный клоп в Грузии",
    recordedOnlyStatusLabel: "Только зафиксировано",
    regionLoadingLabel: "Загружаются записи региона",
    regionPageLabel: (regionName) => `Страница региона: ${regionName}`,
    regionRecordsLabel: "полевых записей",
    regionSelectActionLabel: "Показать записи",
    regionsMetricLabel: "регионов",
    regionSummaryTitle: "Записи по регионам",
    resetMapLabel: "Вернуть начальный вид карты",
    resetToGeorgiaLabel: "Вся Грузия",
    sourceAction: "Открыть источник",
    statusColumnLabel: "Статус",
  },
  tr: {
    closeLabel: "Arazi kaydını kapat",
    confirmedStatusLabel: "Yayılış doğrulandı",
    fieldRecordLabel: "arazi kaydı",
    footerDataLabel: "Veri",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "Metodoloji",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "Fotoğrafı aç",
    iNaturalistRecordLabel: "iNaturalist gözlemi",
    intro:
      "Halyomorpha halys haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Bölge düzeyindeki literatür kanıtı ile tekil arazi kayıtları ayrı katmanlardır; kayıt sayısı gözlem yoğunluğunu da yansıtır, popülasyon yoğunluğu değildir.",
    loadingLabel: "Etkileşimli harita yükleniyor.",
    locationRecordLabel: "Arazi gözlemi",
    mapAria:
      "Kahverengi kokarcanın yayılış kanıtları ve arazi kayıtları Gürcistan haritasında",
    mapError:
      "Etkileşimli harita yüklenemedi, ancak doğrulanmış bölgeler ve arazi kayıtları aşağıda metin olarak duruyor.",
    noPhotoLabel: "Bu kayıt için herkese açık fotoğraf yok",
    noRegionRecordsLabel: "Kayıt yok",
    officialRegionLabel: "Kaynakla doğrulanmış bölge",
    photoRecordLabel: "Fotoğraf kaydı",
    rangeTitle: "Kahverengi kokarca Gürcistan'da nerede görülür?",
    recordedOnlyStatusLabel: "Yalnızca kaydedildi",
    regionLoadingLabel: "Bölge kayıtları yükleniyor",
    regionPageLabel: (regionName) => `${regionName} bölge sayfası`,
    regionRecordsLabel: "arazi kaydı",
    regionSelectActionLabel: "Kayıtları göster",
    regionsMetricLabel: "bölge",
    regionSummaryTitle: "Bölgelere göre kayıtlar",
    resetMapLabel: "Haritayı başlangıç görünümüne döndür",
    resetToGeorgiaLabel: "Tüm Gürcistan",
    sourceAction: "Kaynağı aç",
    statusColumnLabel: "Durum",
  },
};

const INTERACTIVE_RANGE_MAPS: Partial<
  Record<string, InteractiveRangeMapConfig>
> = {
  "euscorpius-mingrelicus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Mingrelian scorpion map combines Reptiles.ge editorial photo records with public iNaturalist observations. Source-confirmed regions and individual field records are separate layers, and record counts reflect observation effort rather than population density.",
        mapAria:
          "Mingrelian scorpion distribution evidence and field records on a map of Georgia",
        rangeTitle: "Where Mingrelian scorpion is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "მეგრული მორიელის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. წყაროებით დადასტურებული რეგიონები და ინდივიდუალური საველე ჩანაწერები ცალკე ფენებია; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
        mapAria:
          "მეგრული მორიელის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        rangeTitle: "სად არის მეგრული მორიელი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта мингрельского скорпиона объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы, подтверждённые источниками, и отдельные полевые записи показаны разными слоями; количество записей отражает интенсивность наблюдений, а не плотность популяции.",
        mapAria:
          "Данные о распространении мингрельского скорпиона и полевые записи на карте Грузии",
        rangeTitle: "Где мингрельский скорпион отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Karadeniz akrebi haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Kaynakla doğrulanmış bölgeler ile tekil arazi kayıtları ayrı katmanlardır; kayıt sayısı gözlem yoğunluğunu yansıtır, popülasyon yoğunluğu değildir.",
        mapAria:
          "Karadeniz akrebinin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        rangeTitle: "Karadeniz akrebi Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 1654809,
  },
  "halyomorpha-halys": {
    copy: HALYOMORPHA_RANGE_COPY,
    iNaturalistTaxonId: 81923,
  },
  "macrovipera-lebetina": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The Levantine viper map combines Reptiles.ge editorial photo records with public iNaturalist observations. Source-confirmed regions and individual field records are separate layers, and record counts reflect observation effort rather than population density.",
        mapAria:
          "Levantine viper distribution evidence and field records on a map of Georgia",
        rangeTitle: "Where Levantine viper occurs in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "გიურზას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. წყაროებით დადასტურებული რეგიონები და ინდივიდუალური საველე ჩანაწერები ცალკე ფენებია; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
        mapAria:
          "გიურზას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        rangeTitle: "სად გვხვდება გიურზა საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта гюрзы объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы, подтверждённые источниками, и отдельные полевые записи показаны разными слоями; количество записей отражает интенсивность наблюдений, а не плотность популяции.",
        mapAria:
          "Данные о распространении гюрзы и полевые записи на карте Грузии",
        rangeTitle: "Где встречается гюрза в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Koca engerek haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Kaynakla doğrulanmış bölgeler ile tekil arazi kayıtları ayrı katmanlardır; kayıt sayısı gözlem yoğunluğunu yansıtır, popülasyon yoğunluğu değildir.",
        mapAria:
          "Koca engereğin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        rangeTitle: "Koca engerek Gürcistan'da nerede görülür?",
      },
    },
    iNaturalistTaxonId: 105083,
  },
  "mantis-religiosa": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The European mantis map combines Reptiles.ge editorial photo records with public iNaturalist observations. Individual field records are shown as point data, and record counts reflect observation effort rather than population density.",
        mapAria: "European mantis field records on a map of Georgia",
        rangeTitle: "Where European mantis is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ჩოქელას რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. ინდივიდუალური საველე ჩანაწერები წერტილებადაა ნაჩვენები; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
        mapAria: "ჩოქელას საველე ჩანაწერები საქართველოს რუკაზე",
        rangeTitle: "სად არის ჩოქელა დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта богомола объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Отдельные полевые записи показаны точками; количество записей отражает интенсивность наблюдений, а не плотность популяции.",
        mapAria: "Полевые записи богомола на карте Грузии",
        rangeTitle: "Где богомол отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Peygamberdevesi haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Tekil arazi kayıtları nokta verisi olarak gösterilir; kayıt sayısı gözlem yoğunluğunu yansıtır, popülasyon yoğunluğu değildir.",
        mapAria: "Peygamberdevesi arazi kayıtları Gürcistan haritasında",
        rangeTitle: "Peygamberdevesi Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 53905,
  },
  "mesobuthus-eupeus": {
    copy: {
      en: {
        ...HALYOMORPHA_RANGE_COPY.en,
        intro:
          "The mottled scorpion map combines Reptiles.ge editorial photo records with public iNaturalist observations. Source-confirmed regions and individual field records are separate layers, and record counts reflect observation effort rather than population density.",
        mapAria:
          "Mottled scorpion distribution evidence and field records on a map of Georgia",
        rangeTitle: "Where mottled scorpion is recorded in Georgia",
      },
      ka: {
        ...HALYOMORPHA_RANGE_COPY.ka,
        intro:
          "ჭრელი მორიელის რუკა აერთიანებს Reptiles.ge-ის სარედაქციო ფოტოჩანაწერებსა და iNaturalist-ის საჯარო დაკვირვებებს. წყაროებით დადასტურებული რეგიონები და ინდივიდუალური საველე ჩანაწერები ცალკე ფენებია; ჩანაწერების რაოდენობა დაკვირვების ინტენსივობას ასახავს და პოპულაციის სიმჭიდროვედ არ უნდა განვიხილოთ.",
        mapAria:
          "ჭრელი მორიელის გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
        rangeTitle: "სად არის ჭრელი მორიელი დაფიქსირებული საქართველოში",
      },
      ru: {
        ...HALYOMORPHA_RANGE_COPY.ru,
        intro:
          "Карта пёстрого скорпиона объединяет редакционные фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Регионы, подтверждённые источниками, и отдельные полевые записи показаны разными слоями; количество записей отражает интенсивность наблюдений, а не плотность популяции.",
        mapAria:
          "Данные о распространении пёстрого скорпиона и полевые записи на карте Грузии",
        rangeTitle: "Где пёстрый скорпион отмечен в Грузии",
      },
      tr: {
        ...HALYOMORPHA_RANGE_COPY.tr,
        intro:
          "Alacalı akrep haritası Reptiles.ge editoryal fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Kaynakla doğrulanmış bölgeler ile tekil arazi kayıtları ayrı katmanlardır; kayıt sayısı gözlem yoğunluğunu yansıtır, popülasyon yoğunluğu değildir.",
        mapAria:
          "Alacalı akrebin Gürcistan'daki yayılış kanıtları ve arazi kayıtları",
        rangeTitle: "Alacalı akrep Gürcistan'da nerede kaydedildi?",
      },
    },
    iNaturalistTaxonId: 709915,
  },
};

export async function SpeciesRangeMap({
  fieldRecords = [],
  gallery = [],
  speciesId,
  speciesName,
}: SpeciesRangeMapProps) {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("profile");
  const rangeRegions = getRegionsForSpecies(speciesId);
  const highlightedIds = rangeRegions.map((region) => region.id);
  const interactiveRangeConfig = INTERACTIVE_RANGE_MAPS[speciesId];
  const interactiveRangeCopy = interactiveRangeConfig?.copy[locale];
  const allInteractiveRangeFieldRecords = interactiveRangeCopy
    ? getHalyomorphaFieldRecords({
        fieldRecords,
        gallery,
        locale,
        speciesName,
      })
    : [];
  const interactiveRangeSummary = interactiveRangeCopy
    ? getHalyomorphaOccurrenceSummary(allInteractiveRangeFieldRecords, locale)
    : null;

  if (
    interactiveRangeConfig &&
    interactiveRangeCopy &&
    interactiveRangeSummary
  ) {
    return (
      <HalyomorphaRangeSection
        anchorLabel={t("anchorLink")}
        copy={interactiveRangeCopy}
        iNaturalistTaxonId={interactiveRangeConfig.iNaturalistTaxonId}
        locale={locale}
        occurrenceSummary={interactiveRangeSummary}
        officialRange={officialRangeForRegions(highlightedIds)}
        speciesId={speciesId}
      />
    );
  }

  if (highlightedIds.length === 0) return null;

  return (
    <section className="map-explorer relative overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="map-explorer-texture pointer-events-none absolute inset-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {t("range")}
          </p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className="text-balance-tight mt-5 font-display text-display-title font-semibold text-foreground"
            id={SPECIES_SECTION_IDS.range}
            slugSource={t("rangeTitle", { name: speciesName })}
          >
            {t("rangeTitle", { name: speciesName })}
          </AnchoredHeading>
          <p className="text-balance-tight mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            {t("rangeSubtitle")}
          </p>
        </div>

        <div className="mt-14 lg:mt-16">
          <GeorgiaMapStatic highlightedIds={highlightedIds} />
        </div>

        <nav
          aria-label={t("rangeRegionsLabel")}
          className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-1 gap-y-2"
        >
          {rangeRegions.map((region, index) => (
            <span className="inline-flex items-center" key={region.id}>
              {index > 0 ? (
                <span aria-hidden className="mr-1 text-muted-foreground/50">
                  ·
                </span>
              ) : null}
              <Link
                className="text-[13px] leading-relaxed tracking-wide text-muted-foreground transition-colors hover:text-primary"
                href={regionHref(region.id)}
              >
                {localizeRegionText(region.name, locale)}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}

function formatYearRange(summary: HalyomorphaOccurrenceSummary) {
  if (!summary.firstYear || !summary.lastYear) return "—";
  if (summary.firstYear === summary.lastYear) return String(summary.firstYear);
  return `${summary.firstYear}–${summary.lastYear}`;
}

function HalyomorphaRangeSection({
  anchorLabel,
  copy,
  iNaturalistTaxonId,
  locale,
  occurrenceSummary,
  officialRange,
  speciesId,
}: {
  anchorLabel: string;
  copy: HalyomorphaRangeCopy;
  iNaturalistTaxonId: number;
  locale: AppLocale;
  occurrenceSummary: HalyomorphaOccurrenceSummary;
  officialRange: HalyomorphaRangeRegionFeatureCollection;
  speciesId: string;
}) {
  const mapCopy: HalyomorphaRangeMapCopy = {
    closeLabel: copy.closeLabel,
    confirmedStatusLabel: copy.confirmedStatusLabel,
    fieldRecordLabel: copy.fieldRecordLabel,
    galleryAction: copy.galleryAction,
    iNaturalistRecordLabel: copy.iNaturalistRecordLabel,
    loadingLabel: copy.loadingLabel,
    locationRecordLabel: copy.locationRecordLabel,
    mapAria: copy.mapAria,
    mapError: copy.mapError,
    noPhotoLabel: copy.noPhotoLabel,
    noRegionRecordsLabel: copy.noRegionRecordsLabel,
    officialRegionLabel: copy.officialRegionLabel,
    photoRecordLabel: copy.photoRecordLabel,
    recordedOnlyStatusLabel: copy.recordedOnlyStatusLabel,
    regionLoadingLabel: copy.regionLoadingLabel,
    regionRecordsLabel: copy.regionRecordsLabel,
    regionSelectActionLabel: copy.regionSelectActionLabel,
    resetMapLabel: copy.resetMapLabel,
    resetToGeorgiaLabel: copy.resetToGeorgiaLabel,
    sourceAction: copy.sourceAction,
    statusColumnLabel: copy.statusColumnLabel,
  };
  const metricLine = [
    `${occurrenceSummary.totalRecords.toLocaleString(locale)} ${copy.regionRecordsLabel}`,
    formatYearRange(occurrenceSummary),
    `${occurrenceSummary.regionsWithRecords.toLocaleString(locale)} ${copy.regionsMetricLabel}`,
  ].join(" · ");
  const regionNames = regions.map((region) => ({
    id: region.id,
    name: localizeRegionText(region.name, locale),
  }));

  return (
    <section className="map-explorer relative overflow-hidden py-16 lg:py-22">
      <div
        aria-hidden="true"
        className="map-explorer-texture pointer-events-none absolute inset-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <AnchoredHeading
            anchorLabel={anchorLabel}
            className="mt-5 font-display text-display-title font-bold text-foreground"
            id={SPECIES_SECTION_IDS.range}
            slugSource={copy.rangeTitle}
          >
            {copy.rangeTitle}
          </AnchoredHeading>
          <p className="mt-3 text-[13px] font-semibold tracking-[0.08em] text-primary uppercase">
            {metricLine}
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            {copy.intro}
          </p>
        </div>

        <div className="mt-10 lg:mt-12">
          <HalyomorphaRangeMap
            copy={mapCopy}
            locale={locale}
            occurrenceSummary={occurrenceSummary}
            officialRange={officialRange}
            regionNames={regionNames}
            speciesId={speciesId}
          />
        </div>

        <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
          {copy.footerDataLabel}: {copy.footerReptilesLabel} +{" "}
          <a
            className="underline decoration-border underline-offset-4 transition-colors hover:text-primary"
            href={`https://www.inaturalist.org/observations?place_id=8857&taxon_id=${iNaturalistTaxonId}`}
            rel="noreferrer"
            target="_blank"
          >
            {copy.footerINaturalistLabel}
          </a>{" "}
          ·{" "}
          <Link
            className="underline decoration-border underline-offset-4 transition-colors hover:text-primary"
            href={{ hash: "methodology", pathname: "/about" }}
          >
            {copy.footerMethodologyLabel}
          </Link>
        </p>

        {occurrenceSummary.totalRecords > 0 ? (
          <section className="mt-10">
            <h3 className="font-display text-[1.35rem] leading-tight font-semibold text-foreground">
              {copy.regionSummaryTitle}
            </h3>
            <div className="mt-4 overflow-hidden border-y border-border/80">
              <table className="w-full text-[14px]">
                <thead className="border-b border-border/60 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2.5 pr-3 text-left font-semibold">
                      {copy.regionsMetricLabel}
                    </th>
                    <th className="w-19 px-3 py-2.5 text-right font-semibold">
                      {copy.regionRecordsLabel}
                    </th>
                    <th className="py-2.5 pl-3 text-right font-semibold">
                      {copy.statusColumnLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {occurrenceSummary.recordsByRegion.map((region) => (
                    <tr
                      className="border-b border-border/60 last:border-0"
                      key={region.id}
                    >
                      <th className="py-3 pr-3 text-left font-medium text-foreground">
                        <span className="flex items-center gap-2">
                          <HalyomorphaRegionSelectButton regionId={region.id}>
                            {region.name}
                          </HalyomorphaRegionSelectButton>
                          <Link
                            aria-label={copy.regionPageLabel(region.name)}
                            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-border/70 text-[12px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            href={regionHref(region.id)}
                            title={copy.regionPageLabel(region.name)}
                          >
                            <ArrowUpRight
                              aria-hidden="true"
                              className="size-3 shrink-0"
                            />
                          </Link>
                        </span>
                      </th>
                      <td className="p-3 text-right text-muted-foreground tabular-nums">
                        {region.count.toLocaleString(locale)}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <RegionStatusBadge copy={copy} status={region.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

function officialRangeForRegions(
  highlightedIds: string[],
): HalyomorphaRangeRegionFeatureCollection {
  const officialIds = new Set(highlightedIds);
  return {
    ...HALYOMORPHA_RANGE_GEOJSON,
    features: HALYOMORPHA_RANGE_GEOJSON.features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        isOfficialRange: officialIds.has(feature.properties.id),
      },
    })),
  };
}

function RegionStatusBadge({
  copy,
  status,
}: {
  copy: HalyomorphaRangeCopy;
  status: HalyomorphaOccurrenceSummary["recordsByRegion"][number]["status"];
}) {
  const confirmed = status === "confirmed";

  return (
    <span
      className={[
        "inline-flex max-w-[9.75rem] items-center justify-center rounded-full px-2.5 py-1 text-center text-[11px] leading-tight font-semibold sm:max-w-none",
        confirmed
          ? "bg-primary/10 text-primary"
          : "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100",
      ].join(" ")}
    >
      {regionStatusLabel(status, copy)}
    </span>
  );
}

function regionStatusLabel(
  status: HalyomorphaOccurrenceSummary["recordsByRegion"][number]["status"],
  copy: HalyomorphaRangeCopy,
) {
  return status === "confirmed"
    ? copy.confirmedStatusLabel
    : copy.recordedOnlyStatusLabel;
}
