import { getLocale, getTranslations } from "next-intl/server";

import type { HalyomorphaRangeMapCopy } from "@/components/map/HalyomorphaRangeMapTypes";
import type { GalleryImage, SpeciesFieldRecord } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { HalyomorphaOccurrenceSummary } from "@/lib/halyomorphaOccurrences";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { GeorgiaMapStatic } from "@/components/map/GeorgiaMapStatic";
import { HalyomorphaRangeMap } from "@/components/map/HalyomorphaRangeMap";
import {
  HALYOMORPHA_OFFICIAL_RANGE_REGION_IDS,
  HALYOMORPHA_RANGE_GEOJSON,
} from "@/data/halyomorphaRangeRegions";
import { getRegionsForSpecies, localizeRegionText } from "@/data/mapRegions";
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
  fieldRecordsIntro: string;
  fieldRecordsTitle: string;
  fieldRecordsToggle: string;
  galleryAction: string;
  geometryCreditLabel: string;
  geometryCreditName: string;
  intro: [string, string];
  loadingLabel: string;
  locationRecordLabel: string;
  mapAria: string;
  mapError: string;
  noPhotoLabel: string;
  observationDisclaimer: string;
  officialRegionLabel: string;
  officialRegionsLabel: string;
  officialRegionsPrefix: string;
  photoRecordLabel: string;
  rangeTitle: string;
  regionLoadingLabel: string;
  regionRecordsLabel: string;
  regionSummaryTitle: string;
  resetMapLabel: string;
  sourceAction: string;
  summaryINaturalistLabel: string;
  summaryPeriodLabel: string;
  summaryPhotoLabel: string;
  summaryRegionsLabel: string;
  summaryTotalLabel: string;
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
    fieldRecordLabel: "Reptiles.ge record",
    fieldRecordsIntro:
      "The atlas combines Reptiles.ge photo records with public iNaturalist observations. The full occurrence dataset is loaded by region on the interactive map instead of being rendered into the initial page HTML.",
    fieldRecordsTitle: "Georgia field-record summary",
    fieldRecordsToggle: "View field records",
    galleryAction: "View photo",
    geometryCreditLabel: "Region boundaries",
    geometryCreditName: "geoBoundaries",
    intro: [
      "The regional layer shows only areas supported at regional level by the official and peer-reviewed sources used on this page. These records describe the first Georgian evidence and the strongest documented western Georgian outbreak areas.",
      "The points are individual Reptiles.ge records with coordinates, date, and observer or photographer. Photo records and confirmed locations without a publishable photo are shown separately; neither is used to colour a whole region or imply even distribution across it.",
    ],
    loadingLabel: "Interactive map is loading.",
    locationRecordLabel: "Field observation",
    mapAria:
      "Brown marmorated stink bug distribution evidence and field records on a map of Georgia",
    mapError:
      "The interactive map could not load, but the confirmed regions and field records are still listed below.",
    noPhotoLabel: "No public photo for this record",
    observationDisclaimer:
      "Record counts show observation effort in the available dataset; they are not a measure of population density or even spread across a region.",
    officialRegionLabel: "Source-confirmed region",
    officialRegionsLabel:
      "Source-confirmed regions for brown marmorated stink bug in Georgia",
    officialRegionsPrefix: "Source-confirmed regions:",
    photoRecordLabel: "Photo record",
    rangeTitle: "Where brown marmorated stink bug occurs in Georgia",
    regionLoadingLabel: "Loading region records",
    regionRecordsLabel: "field records",
    regionSummaryTitle: "Records by region",
    resetMapLabel: "Reset map view",
    sourceAction: "Open source",
    summaryINaturalistLabel: "iNaturalist observations",
    summaryPeriodLabel: "Observation years",
    summaryPhotoLabel: "Photo records",
    summaryRegionsLabel: "Regions with records",
    summaryTotalLabel: "Total records",
  },
  ka: {
    closeLabel: "საველე ჩანაწერის დახურვა",
    fieldRecordLabel: "Reptiles.ge-ის ჩანაწერი",
    fieldRecordsIntro:
      "ატლასში გაერთიანებულია Reptiles.ge-ის ფოტოჩანაწერები და iNaturalist-ის საჯარო დაკვირვებები. სრული occurrence dataset რუკაზე რეგიონების მიხედვით იტვირთება და აღარ ხვდება საწყის HTML-ში ასობით ერთნაირი ბარათის სახით.",
    fieldRecordsTitle: "საქართველოს საველე ჩანაწერების შეჯამება",
    fieldRecordsToggle: "საველე ჩანაწერების ნახვა",
    galleryAction: "ფოტოს ნახვა",
    geometryCreditLabel: "რეგიონების საზღვრები",
    geometryCreditName: "geoBoundaries",
    intro: [
      "რეგიონული ფენა აჩვენებს მხოლოდ იმ ტერიტორიებს, რომლებიც ამ გვერდზე გამოყენებული ოფიციალური და რეცენზირებული წყაროებით რეგიონულ დონეზეა დადასტურებული. ეს ჩანაწერები აღწერს პირველ ქართულ მონაცემებს და დასავლეთ საქართველოს ყველაზე მკაფიოდ დოკუმენტირებულ კერებს.",
      "წერტილები არის Reptiles.ge-ის ინდივიდუალური ჩანაწერები კოორდინატით, თარიღითა და დამკვირვებლით ან ფოტოს ავტორით. ფოტოიანი ჩანაწერები და დადასტურებული ლოკაციები გამოქვეყნებადი ფოტოს გარეშე ცალ-ცალკე ჩანს; არცერთი არ გამოიყენება მთელი რეგიონის შესაღებად და არ ნიშნავს რეგიონში ერთნაირ გავრცელებას.",
    ],
    loadingLabel: "ინტერაქტიული რუკა იტვირთება.",
    locationRecordLabel: "საველე ჩანაწერი",
    mapAria:
      "აზიური ფაროსანას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
    mapError:
      "ინტერაქტიული რუკა ვერ ჩაიტვირთა, მაგრამ დადასტურებული რეგიონები და საველე ჩანაწერები ქვემოთ ტექსტურად ჩანს.",
    noPhotoLabel: "ამ ჩანაწერს საჯაროდ გამოსაქვეყნებელი ფოტო არ აქვს",
    observationDisclaimer:
      "ჩანაწერების რაოდენობა აჩვენებს ხელმისაწვდომ მონაცემებსა და დაკვირვების ინტენსივობას; ეს არ არის პოპულაციის სიმჭიდროვე და არ ნიშნავს რეგიონში თანაბარ გავრცელებას.",
    officialRegionLabel: "წყაროებით დადასტურებული რეგიონი",
    officialRegionsLabel:
      "აზიური ფაროსანას წყაროებით დადასტურებული რეგიონები საქართველოში",
    officialRegionsPrefix: "წყაროებით დადასტურებული რეგიონები:",
    photoRecordLabel: "ფოტოჩანაწერი",
    rangeTitle: "სად გვხვდება აზიური ფაროსანა საქართველოში",
    regionLoadingLabel: "რეგიონის ჩანაწერები იტვირთება",
    regionRecordsLabel: "საველე ჩანაწერი",
    regionSummaryTitle: "ჩანაწერები რეგიონების მიხედვით",
    resetMapLabel: "რუკის საწყის ხედზე დაბრუნება",
    sourceAction: "წყაროს გახსნა",
    summaryINaturalistLabel: "iNaturalist-ის დაკვირვებები",
    summaryPeriodLabel: "დაკვირვების წლები",
    summaryPhotoLabel: "ფოტოჩანაწერები",
    summaryRegionsLabel: "რეგიონი ჩანაწერებით",
    summaryTotalLabel: "სულ ჩანაწერი",
  },
  ru: {
    closeLabel: "Закрыть полевую запись",
    fieldRecordLabel: "Запись Reptiles.ge",
    fieldRecordsIntro:
      "Атлас объединяет фотозаписи Reptiles.ge и публичные наблюдения iNaturalist. Полный набор записей загружается на карте по регионам и не выводится сотнями карточек в исходном HTML.",
    fieldRecordsTitle: "Сводка полевых записей по Грузии",
    fieldRecordsToggle: "Показать полевые записи",
    galleryAction: "Открыть фото",
    geometryCreditLabel: "Границы регионов",
    geometryCreditName: "geoBoundaries",
    intro: [
      "Региональный слой показывает только территории, подтверждённые на региональном уровне официальными и рецензируемыми источниками, использованными на этой странице. Эти данные отражают первые грузинские находки и наиболее документированные очаги в западной Грузии.",
      "Точки — отдельные записи Reptiles.ge с координатами, датой и наблюдателем или автором фото. Фотозаписи и подтверждённые места без пригодного к публикации фото показаны отдельно; они не используются для окраски всего региона и не означают равномерного распространения.",
    ],
    loadingLabel: "Интерактивная карта загружается.",
    locationRecordLabel: "Полевое наблюдение",
    mapAria: "Полевые записи коричнево-мраморного клопа на карте Грузии",
    mapError:
      "Интерактивная карта не загрузилась, но подтверждённые регионы и полевые записи остаются доступными ниже.",
    noPhotoLabel: "У этой записи нет публичного фото",
    observationDisclaimer:
      "Количество записей отражает доступные данные и интенсивность наблюдений; это не показатель плотности популяции или равномерного распространения.",
    officialRegionLabel: "Регион, подтверждённый источниками",
    officialRegionsLabel:
      "Подтверждённые источниками регионы для коричнево-мраморного клопа в Грузии",
    officialRegionsPrefix: "Подтверждённые источниками регионы:",
    photoRecordLabel: "Фотозапись",
    rangeTitle: "Где встречается коричнево-мраморный клоп в Грузии",
    regionLoadingLabel: "Загружаются записи региона",
    regionRecordsLabel: "полевых записей",
    regionSummaryTitle: "Записи по регионам",
    resetMapLabel: "Вернуть начальный вид карты",
    sourceAction: "Открыть источник",
    summaryINaturalistLabel: "Наблюдения iNaturalist",
    summaryPeriodLabel: "Годы наблюдений",
    summaryPhotoLabel: "Фотозаписи",
    summaryRegionsLabel: "Регионы с записями",
    summaryTotalLabel: "Всего записей",
  },
  tr: {
    closeLabel: "Arazi kaydını kapat",
    fieldRecordLabel: "Reptiles.ge kaydı",
    fieldRecordsIntro:
      "Atlas, Reptiles.ge fotoğraf kayıtlarını ve herkese açık iNaturalist gözlemlerini birleştirir. Tam kayıt verisi ilk HTML'e yüzlerce kart olarak basılmak yerine haritada bölge seçilince yüklenir.",
    fieldRecordsTitle: "Gürcistan arazi kayıtları özeti",
    fieldRecordsToggle: "Arazi kayıtlarını göster",
    galleryAction: "Fotoğrafı aç",
    geometryCreditLabel: "Bölge sınırları",
    geometryCreditName: "geoBoundaries",
    intro: [
      "Bölgesel katman yalnızca bu sayfada kullanılan resmî ve hakemli kaynaklarla bölge düzeyinde doğrulanan alanları gösterir. Bu kayıtlar Gürcistan'daki ilk kanıtları ve batı Gürcistan'daki en iyi belgelenmiş odakları anlatır.",
      "Noktalar, koordinat, tarih ve gözlemci veya fotoğrafçı bilgisi olan tekil Reptiles.ge kayıtlarıdır. Fotoğraf kayıtları ve yayımlanabilir fotoğrafı olmayan doğrulanmış yerler ayrı gösterilir; hiçbiri bütün bölgeyi boyamak için kullanılmaz veya eşit yayılış anlamına gelmez.",
    ],
    loadingLabel: "Etkileşimli harita yükleniyor.",
    locationRecordLabel: "Arazi gözlemi",
    mapAria:
      "Kahverengi kokarcanın yayılış kanıtları ve arazi kayıtları Gürcistan haritasında",
    mapError:
      "Etkileşimli harita yüklenemedi, ancak doğrulanmış bölgeler ve arazi kayıtları aşağıda metin olarak duruyor.",
    noPhotoLabel: "Bu kayıt için herkese açık fotoğraf yok",
    observationDisclaimer:
      "Kayıt sayıları mevcut veriyi ve gözlem yoğunluğunu gösterir; popülasyon yoğunluğu ya da bölge içinde eşit dağılım anlamına gelmez.",
    officialRegionLabel: "Kaynakla doğrulanmış bölge",
    officialRegionsLabel:
      "Gürcistan'da kahverengi kokarca için kaynakla doğrulanmış bölgeler",
    officialRegionsPrefix: "Kaynakla doğrulanmış bölgeler:",
    photoRecordLabel: "Fotoğraf kaydı",
    rangeTitle: "Kahverengi kokarca Gürcistan'da nerede görülür?",
    regionLoadingLabel: "Bölge kayıtları yükleniyor",
    regionRecordsLabel: "arazi kaydı",
    regionSummaryTitle: "Bölgelere göre kayıtlar",
    resetMapLabel: "Haritayı başlangıç görünümüne döndür",
    sourceAction: "Kaynağı aç",
    summaryINaturalistLabel: "iNaturalist gözlemleri",
    summaryPeriodLabel: "Gözlem yılları",
    summaryPhotoLabel: "Fotoğraf kayıtları",
    summaryRegionsLabel: "Kayıtlı bölgeler",
    summaryTotalLabel: "Toplam kayıt",
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
        rangeLabel={t("range")}
        rangeRegions={rangeRegions}
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
  rangeLabel,
  rangeRegions,
}: {
  anchorLabel: string;
  copy: HalyomorphaRangeCopy;
  locale: AppLocale;
  occurrenceSummary: HalyomorphaOccurrenceSummary;
  rangeLabel: string;
  rangeRegions: ReturnType<typeof getRegionsForSpecies>;
}) {
  const officialRegionSet: ReadonlySet<string> = new Set(
    HALYOMORPHA_OFFICIAL_RANGE_REGION_IDS,
  );
  const officialRegions = rangeRegions.filter((region) =>
    officialRegionSet.has(region.id),
  );
  const mapCopy: HalyomorphaRangeMapCopy = {
    closeLabel: copy.closeLabel,
    fieldRecordLabel: copy.fieldRecordLabel,
    galleryAction: copy.galleryAction,
    loadingLabel: copy.loadingLabel,
    locationRecordLabel: copy.locationRecordLabel,
    mapAria: copy.mapAria,
    mapError: copy.mapError,
    noPhotoLabel: copy.noPhotoLabel,
    officialRegionLabel: copy.officialRegionLabel,
    photoRecordLabel: copy.photoRecordLabel,
    regionLoadingLabel: copy.regionLoadingLabel,
    regionRecordsLabel: copy.regionRecordsLabel,
    resetMapLabel: copy.resetMapLabel,
    sourceAction: copy.sourceAction,
  };

  return (
    <section className="map-explorer relative overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="map-explorer-texture pointer-events-none absolute inset-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {rangeLabel}
          </p>
          <AnchoredHeading
            anchorLabel={anchorLabel}
            className="text-balance-tight mt-5 font-display text-display-title font-semibold text-foreground"
            id={SPECIES_SECTION_IDS.range}
            slugSource={copy.rangeTitle}
          >
            {copy.rangeTitle}
          </AnchoredHeading>
          <div className="mx-auto mt-5 grid max-w-2xl gap-3 text-[15px] leading-relaxed text-muted-foreground">
            {copy.intro.map((paragraph) => (
              <p className="text-balance-tight" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-10 lg:mt-12">
          <HalyomorphaRangeMap
            copy={mapCopy}
            locale={locale}
            occurrenceSummary={occurrenceSummary}
            officialRange={HALYOMORPHA_RANGE_GEOJSON}
          />
        </div>

        <div className="mx-auto mt-5 flex max-w-5xl flex-col gap-3 text-[12px] leading-relaxed text-muted-foreground md:flex-row md:items-center md:justify-between">
          <nav
            aria-label={copy.officialRegionsLabel}
            className="flex flex-wrap items-center gap-x-1 gap-y-2"
          >
            <span>{copy.officialRegionsPrefix}</span>
            {officialRegions.map((region, index) => (
              <span className="inline-flex items-center" key={region.id}>
                {index > 0 ? (
                  <span aria-hidden className="mr-1 text-muted-foreground/50">
                    ·
                  </span>
                ) : null}
                <Link
                  className="tracking-wide text-muted-foreground transition-colors hover:text-primary"
                  href={regionHref(region.id)}
                >
                  {localizeRegionText(region.name, locale)}
                </Link>
              </span>
            ))}
          </nav>
          <p>
            {copy.geometryCreditLabel}:{" "}
            <a
              className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
              href="https://www.geoboundaries.org/"
              rel="noreferrer"
              target="_blank"
            >
              {copy.geometryCreditName}
            </a>
          </p>
        </div>

        {occurrenceSummary.totalRecords > 0 ? (
          <section className="mx-auto mt-10 max-w-5xl">
            <h3 className="font-display text-[1.35rem] leading-tight font-semibold text-foreground">
              {copy.fieldRecordsTitle}
            </h3>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              {copy.fieldRecordsIntro}
            </p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <SummaryStat
                label={copy.summaryTotalLabel}
                value={occurrenceSummary.totalRecords.toLocaleString(locale)}
              />
              <SummaryStat
                label={copy.summaryPeriodLabel}
                value={formatYearRange(occurrenceSummary)}
              />
              <SummaryStat
                label={copy.summaryRegionsLabel}
                value={occurrenceSummary.regionsWithRecords.toLocaleString(
                  locale,
                )}
              />
              <SummaryStat
                label={copy.summaryPhotoLabel}
                value={occurrenceSummary.photoRecordCount.toLocaleString(
                  locale,
                )}
              />
              <SummaryStat
                label={copy.summaryINaturalistLabel}
                value={occurrenceSummary.iNaturalistRecordCount.toLocaleString(
                  locale,
                )}
              />
            </dl>
            <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
              {copy.observationDisclaimer}
            </p>
            <div className="mt-6 rounded-card border border-border/70 bg-card/55 p-4 shadow-[0_18px_50px_-38px_rgba(0,0,0,0.7)]">
              <h4 className="text-[14px] font-semibold text-foreground">
                {copy.regionSummaryTitle}
              </h4>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {occurrenceSummary.recordsByRegion.map((region) => (
                  <li
                    className="flex items-center justify-between gap-3 rounded-2xl bg-background/70 px-3 py-2 text-[13px]"
                    key={region.id}
                  >
                    <span className="font-medium text-foreground">
                      {region.name}
                    </span>
                    <span className="text-muted-foreground">
                      {region.count.toLocaleString(locale)}{" "}
                      {copy.regionRecordsLabel}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/55 p-4">
      <dt className="text-[11px] leading-tight font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-2 text-[1.35rem] leading-none font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}
