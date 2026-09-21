import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import type {
  HalyomorphaFieldRecord,
  HalyomorphaRangeMapCopy,
} from "@/components/map/HalyomorphaRangeMapTypes";
import type { GalleryImage, SpeciesFieldRecord } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { GeorgiaMapStatic } from "@/components/map/GeorgiaMapStatic";
import { HalyomorphaRangeMap } from "@/components/map/HalyomorphaRangeMap";
import {
  HALYOMORPHA_OFFICIAL_RANGE_REGION_IDS,
  HALYOMORPHA_RANGE_GEOJSON,
} from "@/data/halyomorphaRangeRegions";
import { getRegionsForSpecies, localizeRegionText } from "@/data/mapRegions";
import { optimizedImgSrc } from "@/data/optimizedImages";
import { Link } from "@/i18n/navigation";
import { formatPhotoDate } from "@/lib/formatDate";
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
  officialRegionLabel: string;
  officialRegionsLabel: string;
  officialRegionsPrefix: string;
  photoRecordLabel: string;
  rangeTitle: string;
  resetMapLabel: string;
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
    fieldRecordLabel: "Reptiles.ge record",
    fieldRecordsIntro:
      "The list below keeps the same field data available as ordinary page content: locality, date, observer or photographer, evidence type, and the photo or source link when available.",
    fieldRecordsTitle: "Reptiles.ge field records",
    fieldRecordsToggle: "View field records",
    galleryAction: "View photo",
    geometryCreditLabel: "Region boundaries",
    geometryCreditName: "geoBoundaries",
    intro: [
      "The regional layer shows only areas supported at regional level by the official and peer-reviewed sources used on this page. These records describe the first Georgian evidence and the strongest documented western Georgian outbreak areas.",
      "The points are individual Reptiles.ge records with coordinates, date, and observer or photographer. Photo records and confirmed locations without a publishable photo are shown separately; neither is used to colour a whole region or imply even distribution across it.",
    ],
    loadingLabel: "Interactive map is loading.",
    locationRecordLabel: "Observed location",
    mapAria:
      "Brown marmorated stink bug distribution evidence and field records on a map of Georgia",
    mapError:
      "The interactive map could not load, but the confirmed regions and field records are still listed below.",
    noPhotoLabel: "No public photo for this record",
    officialRegionLabel: "Source-confirmed region",
    officialRegionsLabel:
      "Source-confirmed regions for brown marmorated stink bug in Georgia",
    officialRegionsPrefix: "Source-confirmed regions:",
    photoRecordLabel: "Photo record",
    rangeTitle: "Where brown marmorated stink bug occurs in Georgia",
    resetMapLabel: "Reset map view",
    sourceAction: "Open source",
  },
  ka: {
    closeLabel: "საველე ჩანაწერის დახურვა",
    fieldRecordLabel: "Reptiles.ge-ის ჩანაწერი",
    fieldRecordsIntro:
      "ქვემოთ იგივე მონაცემები ჩვეულებრივ HTML-ად რჩება: ადგილი, თარიღი, დამკვირვებელი ან ფოტოს ავტორი, მტკიცებულების ტიპი და, როცა არის, ფოტო ან წყაროს ბმული.",
    fieldRecordsTitle: "Reptiles.ge-ის საველე ჩანაწერები",
    fieldRecordsToggle: "საველე ჩანაწერების ნახვა",
    galleryAction: "ფოტოს ნახვა",
    geometryCreditLabel: "რეგიონების საზღვრები",
    geometryCreditName: "geoBoundaries",
    intro: [
      "რეგიონული ფენა აჩვენებს მხოლოდ იმ ტერიტორიებს, რომლებიც ამ გვერდზე გამოყენებული ოფიციალური და რეცენზირებული წყაროებით რეგიონულ დონეზეა დადასტურებული. ეს ჩანაწერები აღწერს პირველ ქართულ მონაცემებს და დასავლეთ საქართველოს ყველაზე მკაფიოდ დოკუმენტირებულ კერებს.",
      "წერტილები არის Reptiles.ge-ის ინდივიდუალური ჩანაწერები კოორდინატით, თარიღითა და დამკვირვებლით ან ფოტოს ავტორით. ფოტოიანი ჩანაწერები და დადასტურებული ლოკაციები გამოქვეყნებადი ფოტოს გარეშე ცალ-ცალკე ჩანს; არცერთი არ გამოიყენება მთელი რეგიონის შესაღებად და არ ნიშნავს რეგიონში ერთნაირ გავრცელებას.",
    ],
    loadingLabel: "ინტერაქტიული რუკა იტვირთება.",
    locationRecordLabel: "დადასტურებული ლოკაცია",
    mapAria:
      "აზიური ფაროსანას გავრცელების მტკიცებულებები და საველე ჩანაწერები საქართველოს რუკაზე",
    mapError:
      "ინტერაქტიული რუკა ვერ ჩაიტვირთა, მაგრამ დადასტურებული რეგიონები და საველე ჩანაწერები ქვემოთ ტექსტურად ჩანს.",
    noPhotoLabel: "ამ ჩანაწერს საჯაროდ გამოსაქვეყნებელი ფოტო არ აქვს",
    officialRegionLabel: "წყაროებით დადასტურებული რეგიონი",
    officialRegionsLabel:
      "აზიური ფაროსანას წყაროებით დადასტურებული რეგიონები საქართველოში",
    officialRegionsPrefix: "წყაროებით დადასტურებული რეგიონები:",
    photoRecordLabel: "ფოტოჩანაწერი",
    rangeTitle: "სად გვხვდება აზიური ფაროსანა საქართველოში",
    resetMapLabel: "რუკის საწყის ხედზე დაბრუნება",
    sourceAction: "წყაროს გახსნა",
  },
  ru: {
    closeLabel: "Закрыть полевую запись",
    fieldRecordLabel: "Запись Reptiles.ge",
    fieldRecordsIntro:
      "Ниже те же данные доступны как обычное содержимое страницы: место, дата, наблюдатель или автор фото, тип подтверждения и ссылка на фото или источник, если она есть.",
    fieldRecordsTitle: "Полевые записи Reptiles.ge",
    fieldRecordsToggle: "Показать полевые записи",
    galleryAction: "Открыть фото",
    geometryCreditLabel: "Границы регионов",
    geometryCreditName: "geoBoundaries",
    intro: [
      "Региональный слой показывает только территории, подтверждённые на региональном уровне официальными и рецензируемыми источниками, использованными на этой странице. Эти данные отражают первые грузинские находки и наиболее документированные очаги в западной Грузии.",
      "Точки — отдельные записи Reptiles.ge с координатами, датой и наблюдателем или автором фото. Фотозаписи и подтверждённые места без пригодного к публикации фото показаны отдельно; они не используются для окраски всего региона и не означают равномерного распространения.",
    ],
    loadingLabel: "Интерактивная карта загружается.",
    locationRecordLabel: "Подтверждённое место",
    mapAria: "Полевые записи коричнево-мраморного клопа на карте Грузии",
    mapError:
      "Интерактивная карта не загрузилась, но подтверждённые регионы и полевые записи остаются доступными ниже.",
    noPhotoLabel: "У этой записи нет публичного фото",
    officialRegionLabel: "Регион, подтверждённый источниками",
    officialRegionsLabel:
      "Подтверждённые источниками регионы для коричнево-мраморного клопа в Грузии",
    officialRegionsPrefix: "Подтверждённые источниками регионы:",
    photoRecordLabel: "Фотозапись",
    rangeTitle: "Где встречается коричнево-мраморный клоп в Грузии",
    resetMapLabel: "Вернуть начальный вид карты",
    sourceAction: "Открыть источник",
  },
  tr: {
    closeLabel: "Arazi kaydını kapat",
    fieldRecordLabel: "Reptiles.ge kaydı",
    fieldRecordsIntro:
      "Aşağıda aynı veriler normal sayfa içeriği olarak kalır: yer, tarih, gözlemci veya fotoğrafçı, kanıt tipi ve varsa fotoğraf ya da kaynak bağlantısı.",
    fieldRecordsTitle: "Reptiles.ge arazi kayıtları",
    fieldRecordsToggle: "Arazi kayıtlarını göster",
    galleryAction: "Fotoğrafı aç",
    geometryCreditLabel: "Bölge sınırları",
    geometryCreditName: "geoBoundaries",
    intro: [
      "Bölgesel katman yalnızca bu sayfada kullanılan resmî ve hakemli kaynaklarla bölge düzeyinde doğrulanan alanları gösterir. Bu kayıtlar Gürcistan'daki ilk kanıtları ve batı Gürcistan'daki en iyi belgelenmiş odakları anlatır.",
      "Noktalar, koordinat, tarih ve gözlemci veya fotoğrafçı bilgisi olan tekil Reptiles.ge kayıtlarıdır. Fotoğraf kayıtları ve yayımlanabilir fotoğrafı olmayan doğrulanmış yerler ayrı gösterilir; hiçbiri bütün bölgeyi boyamak için kullanılmaz veya eşit yayılış anlamına gelmez.",
    ],
    loadingLabel: "Etkileşimli harita yükleniyor.",
    locationRecordLabel: "Doğrulanmış yer",
    mapAria:
      "Kahverengi kokarcanın yayılış kanıtları ve arazi kayıtları Gürcistan haritasında",
    mapError:
      "Etkileşimli harita yüklenemedi, ancak doğrulanmış bölgeler ve arazi kayıtları aşağıda metin olarak duruyor.",
    noPhotoLabel: "Bu kayıt için herkese açık fotoğraf yok",
    officialRegionLabel: "Kaynakla doğrulanmış bölge",
    officialRegionsLabel:
      "Gürcistan'da kahverengi kokarca için kaynakla doğrulanmış bölgeler",
    officialRegionsPrefix: "Kaynakla doğrulanmış bölgeler:",
    photoRecordLabel: "Fotoğraf kaydı",
    rangeTitle: "Kahverengi kokarca Gürcistan'da nerede görülür?",
    resetMapLabel: "Haritayı başlangıç görünümüne döndür",
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
    ? getHalyomorphaFieldRecords(gallery, fieldRecords, locale, speciesName)
    : [];

  if (halyomorphaCopy) {
    return (
      <HalyomorphaRangeSection
        anchorLabel={t("anchorLink")}
        copy={halyomorphaCopy}
        fieldRecords={halyomorphaFieldRecords}
        locale={locale}
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

function fieldRecordId(value: string, index: number) {
  const filename = value
    .split("/")
    .pop()
    ?.replace(/\.[^.]+$/, "");
  const slug = filename?.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
  return `${slug || "field-record"}-${index}`;
}

function getFieldPhotoRecords(
  gallery: GalleryImage[],
  locale: AppLocale,
  speciesName: string,
): HalyomorphaFieldRecord[] {
  return gallery.flatMap((item, index) => {
    const credit = item.credit;
    if (
      !credit ||
      typeof credit.lat !== "number" ||
      typeof credit.lng !== "number" ||
      !Number.isFinite(credit.lat) ||
      !Number.isFinite(credit.lng)
    ) {
      return [];
    }

    const photoConfidence = item.photoConfidence ?? credit.photoConfidence;
    const locality = credit.location?.trim();
    if (photoConfidence !== "georgia-field" || !locality) return [];

    const formattedDate = credit.date
      ? formatPhotoDate(credit.date, locale)
      : undefined;
    const author = credit.photographer?.trim();
    const id = fieldRecordId(item.src, index);

    return [
      {
        accessibleLabel: [`${speciesName} — ${locality}`, formattedDate, author]
          .filter(Boolean)
          .join(", "),
        author,
        date: credit.date,
        formattedDate,
        galleryHref: `#${SPECIES_SECTION_IDS.gallery}`,
        gallerySrc: optimizedImgSrc(item.src, 1200),
        id,
        imageAlt: `${speciesName} — ${locality}`,
        kind: "photo",
        lat: credit.lat,
        lng: credit.lng,
        locality,
        thumbSrc: optimizedImgSrc(item.src, 320),
      },
    ];
  });
}

function getHalyomorphaFieldRecords(
  gallery: GalleryImage[],
  fieldRecords: SpeciesFieldRecord[],
  locale: AppLocale,
  speciesName: string,
): HalyomorphaFieldRecord[] {
  return [
    ...getFieldPhotoRecords(gallery, locale, speciesName),
    ...getManualFieldRecords(fieldRecords, locale, speciesName),
  ].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

function getManualFieldRecords(
  records: SpeciesFieldRecord[],
  locale: AppLocale,
  speciesName: string,
): HalyomorphaFieldRecord[] {
  return records.map((record, index) => {
    const formattedDate = record.date
      ? formatPhotoDate(record.date, locale)
      : undefined;
    const author = record.observer?.trim() || record.source?.trim();
    const id = fieldRecordId(
      `${record.locality}-${record.lat}-${record.lng}-${record.date ?? ""}`,
      index,
    );

    return {
      accessibleLabel: [`${speciesName} — ${record.locality}`, formattedDate]
        .filter(Boolean)
        .join(", "),
      author,
      date: record.date,
      formattedDate,
      id,
      imageAlt: `${speciesName} — ${record.locality}`,
      kind: "location",
      lat: record.lat,
      lng: record.lng,
      locality: record.locality,
      note: record.note,
      source: record.source,
      url: record.url,
    };
  });
}

function HalyomorphaRangeSection({
  anchorLabel,
  copy,
  fieldRecords,
  locale,
  rangeLabel,
  rangeRegions,
}: {
  anchorLabel: string;
  copy: HalyomorphaRangeCopy;
  fieldRecords: HalyomorphaFieldRecord[];
  locale: AppLocale;
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
            fieldRecords={fieldRecords}
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

        {fieldRecords.length > 0 ? (
          <section className="mx-auto mt-10 max-w-4xl">
            <h3 className="font-display text-[1.35rem] leading-tight font-semibold text-foreground">
              {copy.fieldRecordsTitle}
            </h3>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              {copy.fieldRecordsIntro}
            </p>
            <details className="group mt-5 rounded-card border border-border/70 bg-card/55 shadow-[0_18px_50px_-38px_rgba(0,0,0,0.7)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[14px] font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                <span>
                  {copy.fieldRecordsToggle} ({fieldRecords.length})
                </span>
                <span
                  aria-hidden="true"
                  className="inline-flex size-8 items-center justify-center rounded-full border border-border text-[20px] leading-none text-muted-foreground transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <ul className="grid gap-3 border-t border-border/70 p-3 sm:grid-cols-2">
                {fieldRecords.map((record) => (
                  <li key={record.id}>
                    <article className="flex h-full gap-3 rounded-2xl bg-background/70 p-3">
                      <span className="relative block size-16 shrink-0 overflow-hidden rounded-[0.95rem] bg-ink">
                        {record.thumbSrc ? (
                          <Image
                            alt=""
                            className="object-cover"
                            fill
                            sizes="64px"
                            src={record.thumbSrc}
                          />
                        ) : (
                          <span
                            aria-label={copy.noPhotoLabel}
                            className="grid size-full place-items-center bg-primary/10"
                            role="img"
                          >
                            <span
                              aria-hidden="true"
                              className="size-3 rounded-full border border-primary"
                            />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">
                          {record.kind === "photo"
                            ? copy.photoRecordLabel
                            : copy.locationRecordLabel}
                        </span>
                        <span className="block text-[14px] leading-tight font-semibold text-foreground">
                          {record.locality}
                        </span>
                        <span className="mt-1 block text-[12px] leading-relaxed text-muted-foreground">
                          {[record.formattedDate, record.author]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                        {record.note ? (
                          <span className="mt-1 line-clamp-2 block text-[12px] leading-relaxed text-muted-foreground">
                            {record.note}
                          </span>
                        ) : null}
                        {record.galleryHref && record.gallerySrc ? (
                          <a
                            className="mt-2 inline-flex text-[12px] font-semibold text-primary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            data-species-gallery-src={record.gallerySrc}
                            href={record.galleryHref}
                          >
                            {copy.galleryAction}
                          </a>
                        ) : record.url ? (
                          <a
                            className="mt-2 inline-flex text-[12px] font-semibold text-primary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            href={record.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {copy.sourceAction}
                          </a>
                        ) : null}
                      </span>
                    </article>
                  </li>
                ))}
              </ul>
            </details>
          </section>
        ) : null}
      </div>
    </section>
  );
}
