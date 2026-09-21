import { getLocale, getTranslations } from "next-intl/server";

import type { HalyomorphaRangeMapCopy } from "@/components/map/HalyomorphaRangeMapTypes";
import type { GalleryImage, SpeciesFieldRecord } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { HalyomorphaOccurrenceSummary } from "@/lib/halyomorphaOccurrences";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { GeorgiaMapStatic } from "@/components/map/GeorgiaMapStatic";
import { HalyomorphaRangeMap } from "@/components/map/HalyomorphaRangeMap";
import { HalyomorphaRegionSelectButton } from "@/components/map/HalyomorphaRegionSelectButton";
import { HALYOMORPHA_RANGE_GEOJSON } from "@/data/halyomorphaRangeRegions";
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
  fieldRecordLabel: string;
  footerDataLabel: string;
  footerINaturalistLabel: string;
  footerMethodologyLabel: string;
  footerReptilesLabel: string;
  galleryAction: string;
  geometryCreditLabel: string;
  geometryCreditName: string;
  iNaturalistRecordLabel: string;
  intro: string;
  loadingLabel: string;
  locationRecordLabel: string;
  mapAria: string;
  mapError: string;
  noPhotoLabel: string;
  noRegionRecordsLabel: string;
  observationDisclaimer: string;
  officialRegionLabel: string;
  photoRecordLabel: string;
  rangeTitle: string;
  regionLoadingLabel: string;
  regionRecordsLabel: string;
  regionSelectActionLabel: string;
  regionsMetricLabel: string;
  regionSummaryTitle: string;
  resetMapLabel: string;
  resetToGeorgiaLabel: string;
  sourceAction: string;
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
    fieldRecordLabel: "field record",
    footerDataLabel: "Data",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "Methodology",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "View photo",
    geometryCreditLabel: "Region boundaries",
    geometryCreditName: "geoBoundaries",
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
    observationDisclaimer:
      "Record counts show observation effort in the available dataset; they are not a measure of population density or even spread across a region.",
    officialRegionLabel: "Source-confirmed region",
    photoRecordLabel: "Photo record",
    rangeTitle: "Where brown marmorated stink bug occurs in Georgia",
    regionLoadingLabel: "Loading region records",
    regionRecordsLabel: "field records",
    regionSelectActionLabel: "View records",
    regionsMetricLabel: "regions",
    regionSummaryTitle: "Records by region",
    resetMapLabel: "Reset map view",
    resetToGeorgiaLabel: "All Georgia",
    sourceAction: "Open source",
  },
  ka: {
    closeLabel: "საველე ჩანაწერის დახურვა",
    fieldRecordLabel: "საველე ჩანაწერი",
    footerDataLabel: "მონაცემები",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "მეთოდოლოგია",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "ფოტოს ნახვა",
    geometryCreditLabel: "რეგიონების საზღვრები",
    geometryCreditName: "geoBoundaries",
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
    observationDisclaimer:
      "ჩანაწერების რაოდენობა აჩვენებს ხელმისაწვდომ მონაცემებსა და დაკვირვების ინტენსივობას; ეს არ არის პოპულაციის სიმჭიდროვე და არ ნიშნავს რეგიონში თანაბარ გავრცელებას.",
    officialRegionLabel: "წყაროებით დადასტურებული რეგიონი",
    photoRecordLabel: "ფოტოჩანაწერი",
    rangeTitle: "სად გვხვდება აზიური ფაროსანა საქართველოში",
    regionLoadingLabel: "რეგიონის ჩანაწერები იტვირთება",
    regionRecordsLabel: "საველე ჩანაწერი",
    regionSelectActionLabel: "ჩანაწერების ნახვა",
    regionsMetricLabel: "რეგიონი",
    regionSummaryTitle: "ჩანაწერები რეგიონების მიხედვით",
    resetMapLabel: "რუკის საწყის ხედზე დაბრუნება",
    resetToGeorgiaLabel: "მთელი საქართველო",
    sourceAction: "წყაროს გახსნა",
  },
  ru: {
    closeLabel: "Закрыть полевую запись",
    fieldRecordLabel: "полевая запись",
    footerDataLabel: "Данные",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "Методология",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "Открыть фото",
    geometryCreditLabel: "Границы регионов",
    geometryCreditName: "geoBoundaries",
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
    observationDisclaimer:
      "Количество записей отражает доступные данные и интенсивность наблюдений; это не показатель плотности популяции или равномерного распространения.",
    officialRegionLabel: "Регион, подтверждённый источниками",
    photoRecordLabel: "Фотозапись",
    rangeTitle: "Где встречается коричнево-мраморный клоп в Грузии",
    regionLoadingLabel: "Загружаются записи региона",
    regionRecordsLabel: "полевых записей",
    regionSelectActionLabel: "Показать записи",
    regionsMetricLabel: "регионов",
    regionSummaryTitle: "Записи по регионам",
    resetMapLabel: "Вернуть начальный вид карты",
    resetToGeorgiaLabel: "Вся Грузия",
    sourceAction: "Открыть источник",
  },
  tr: {
    closeLabel: "Arazi kaydını kapat",
    fieldRecordLabel: "arazi kaydı",
    footerDataLabel: "Veri",
    footerINaturalistLabel: "iNaturalist",
    footerMethodologyLabel: "Metodoloji",
    footerReptilesLabel: "Reptiles.ge",
    galleryAction: "Fotoğrafı aç",
    geometryCreditLabel: "Bölge sınırları",
    geometryCreditName: "geoBoundaries",
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
    observationDisclaimer:
      "Kayıt sayıları mevcut veriyi ve gözlem yoğunluğunu gösterir; popülasyon yoğunluğu ya da bölge içinde eşit dağılım anlamına gelmez.",
    officialRegionLabel: "Kaynakla doğrulanmış bölge",
    photoRecordLabel: "Fotoğraf kaydı",
    rangeTitle: "Kahverengi kokarca Gürcistan'da nerede görülür?",
    regionLoadingLabel: "Bölge kayıtları yükleniyor",
    regionRecordsLabel: "arazi kaydı",
    regionSelectActionLabel: "Kayıtları göster",
    regionsMetricLabel: "bölge",
    regionSummaryTitle: "Bölgelere göre kayıtlar",
    resetMapLabel: "Haritayı başlangıç görünümüne döndür",
    resetToGeorgiaLabel: "Tüm Gürcistan",
    sourceAction: "Kaynağı aç",
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
  const halyomorphaCopy =
    speciesId === "halyomorpha-halys"
      ? HALYOMORPHA_RANGE_COPY[locale]
      : undefined;
  const halyomorphaFieldRecords = halyomorphaCopy
    ? getHalyomorphaFieldRecords({
        fieldRecords,
        gallery,
        locale,
        speciesName,
      })
    : [];
  const halyomorphaSummary = halyomorphaCopy
    ? getHalyomorphaOccurrenceSummary(halyomorphaFieldRecords, locale)
    : null;

  if (halyomorphaCopy && halyomorphaSummary) {
    return (
      <HalyomorphaRangeSection
        anchorLabel={t("anchorLink")}
        copy={halyomorphaCopy}
        locale={locale}
        occurrenceSummary={halyomorphaSummary}
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
  locale,
  occurrenceSummary,
}: {
  anchorLabel: string;
  copy: HalyomorphaRangeCopy;
  locale: AppLocale;
  occurrenceSummary: HalyomorphaOccurrenceSummary;
}) {
  const mapCopy: HalyomorphaRangeMapCopy = {
    closeLabel: copy.closeLabel,
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
    regionLoadingLabel: copy.regionLoadingLabel,
    regionRecordsLabel: copy.regionRecordsLabel,
    regionSelectActionLabel: copy.regionSelectActionLabel,
    resetMapLabel: copy.resetMapLabel,
    resetToGeorgiaLabel: copy.resetToGeorgiaLabel,
    sourceAction: copy.sourceAction,
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
        <div className="mx-auto max-w-3xl">
          <AnchoredHeading
            anchorLabel={anchorLabel}
            className="text-balance-tight font-display text-display-title font-semibold text-foreground"
            id={SPECIES_SECTION_IDS.range}
            slugSource={copy.rangeTitle}
          >
            {copy.rangeTitle}
          </AnchoredHeading>
          <p className="mt-3 text-[13px] font-semibold tracking-[0.08em] text-primary uppercase">
            {metricLine}
          </p>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {copy.intro}
          </p>
        </div>

        <div className="mt-10 lg:mt-12">
          <HalyomorphaRangeMap
            copy={mapCopy}
            locale={locale}
            occurrenceSummary={occurrenceSummary}
            officialRange={HALYOMORPHA_RANGE_GEOJSON}
            regionNames={regionNames}
          />
        </div>

        <p className="mx-auto mt-4 max-w-5xl text-[12px] leading-relaxed text-muted-foreground">
          {copy.footerDataLabel}: {copy.footerReptilesLabel} +{" "}
          <a
            className="underline decoration-border underline-offset-4 transition-colors hover:text-primary"
            href="https://www.inaturalist.org/observations?place_id=8857&taxon_id=81923"
            rel="noreferrer"
            target="_blank"
          >
            {copy.footerINaturalistLabel}
          </a>{" "}
          · {copy.geometryCreditLabel}:{" "}
          <a
            className="underline decoration-border underline-offset-4 transition-colors hover:text-primary"
            href="https://www.geoboundaries.org/"
            rel="noreferrer"
            target="_blank"
          >
            {copy.geometryCreditName}
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
          <section className="mx-auto mt-10 max-w-5xl">
            <h3 className="font-display text-[1.35rem] leading-tight font-semibold text-foreground">
              {copy.regionSummaryTitle}
            </h3>
            <div className="mt-4 overflow-hidden border-y border-border/80">
              <table className="w-full text-[14px]">
                <tbody>
                  {occurrenceSummary.recordsByRegion.map((region) => (
                    <tr
                      className="border-b border-border/60 last:border-0"
                      key={region.id}
                    >
                      <th className="py-3 pr-4 text-left font-medium text-foreground">
                        <HalyomorphaRegionSelectButton regionId={region.id}>
                          {region.name}
                        </HalyomorphaRegionSelectButton>
                      </th>
                      <td className="py-3 pl-4 text-right text-muted-foreground tabular-nums">
                        {region.count.toLocaleString(locale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 max-w-3xl text-[12px] leading-relaxed text-muted-foreground">
              {copy.observationDisclaimer}
            </p>
          </section>
        ) : null}
      </div>
    </section>
  );
}
