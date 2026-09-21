import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import type {
  HalyomorphaFieldRecord,
  HalyomorphaRangeMapCopy,
} from "@/components/map/HalyomorphaRangeMapTypes";
import type { GalleryImage } from "@/data/species";
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
  mapAria: string;
  mapError: string;
  officialRegionLabel: string;
  officialRegionsLabel: string;
  officialRegionsPrefix: string;
  rangeTitle: string;
};

type SpeciesRangeMapProps = {
  gallery?: GalleryImage[];
  speciesId: string;
  speciesName: string;
};

const HALYOMORPHA_RANGE_COPY: Record<AppLocale, HalyomorphaRangeCopy> = {
  en: {
    closeLabel: "Close field record",
    fieldRecordLabel: "Field record",
    fieldRecordsIntro:
      "The list below keeps the same field data available as ordinary page content: locality, date, author, and a link to the gallery photograph.",
    fieldRecordsTitle: "Reptiles.ge field records",
    fieldRecordsToggle: "View field records",
    galleryAction: "View photo",
    geometryCreditLabel: "Region boundaries",
    geometryCreditName: "geoBoundaries",
    intro: [
      "The regional layer shows only areas supported at regional level by the official and peer-reviewed sources used on this page. These records describe the first Georgian evidence and the strongest documented western Georgian outbreak areas.",
      "The points are individual Reptiles.ge field photo records with coordinates, date, and author. A point confirms a photographed record at that locality; it is not used to colour a whole region and does not imply even distribution across it.",
    ],
    loadingLabel: "Interactive map is loading.",
    mapAria:
      "Brown marmorated stink bug distribution evidence and field photo records on a map of Georgia",
    mapError:
      "The interactive map could not load, but the confirmed regions and field records are still listed below.",
    officialRegionLabel: "Source-confirmed region",
    officialRegionsLabel:
      "Source-confirmed regions for brown marmorated stink bug in Georgia",
    officialRegionsPrefix: "Source-confirmed regions:",
    rangeTitle: "Where brown marmorated stink bug occurs in Georgia",
  },
  ka: {
    closeLabel: "საველე ჩანაწერის დახურვა",
    fieldRecordLabel: "საველე ჩანაწერი",
    fieldRecordsIntro:
      "ქვემოთ იგივე მონაცემები ჩვეულებრივ HTML-ად რჩება: ადგილი, თარიღი, ავტორი და გალერეის ფოტოზე გადასვლა.",
    fieldRecordsTitle: "Reptiles.ge-ის საველე ჩანაწერები",
    fieldRecordsToggle: "საველე ჩანაწერების ნახვა",
    galleryAction: "ფოტოს ნახვა",
    geometryCreditLabel: "რეგიონების საზღვრები",
    geometryCreditName: "geoBoundaries",
    intro: [
      "რეგიონული ფენა აჩვენებს მხოლოდ იმ ტერიტორიებს, რომლებიც ამ გვერდზე გამოყენებული ოფიციალური და რეცენზირებული წყაროებით რეგიონულ დონეზეა დადასტურებული. ეს ჩანაწერები აღწერს პირველ ქართულ მონაცემებს და დასავლეთ საქართველოს ყველაზე მკაფიოდ დოკუმენტირებულ კერებს.",
      "წერტილები არის Reptiles.ge-ის ინდივიდუალური საველე ფოტოჩანაწერები კოორდინატით, თარიღითა და ავტორით. წერტილი კონკრეტულ ადგილას გადაღებულ ჩანაწერს ადასტურებს; ის არ გამოიყენება მთელი რეგიონის შესაღებად და არ ნიშნავს რეგიონში ერთნაირ გავრცელებას.",
    ],
    loadingLabel: "ინტერაქტიული რუკა იტვირთება.",
    mapAria:
      "აზიური ფაროსანას გავრცელების მტკიცებულებები და საველე ფოტოჩანაწერები საქართველოს რუკაზე",
    mapError:
      "ინტერაქტიული რუკა ვერ ჩაიტვირთა, მაგრამ დადასტურებული რეგიონები და საველე ჩანაწერები ქვემოთ ტექსტურად ჩანს.",
    officialRegionLabel: "წყაროებით დადასტურებული რეგიონი",
    officialRegionsLabel:
      "აზიური ფაროსანას წყაროებით დადასტურებული რეგიონები საქართველოში",
    officialRegionsPrefix: "წყაროებით დადასტურებული რეგიონები:",
    rangeTitle: "სად გვხვდება აზიური ფაროსანა საქართველოში",
  },
  ru: {
    closeLabel: "Закрыть полевую запись",
    fieldRecordLabel: "Полевая фотозапись",
    fieldRecordsIntro:
      "Ниже те же данные доступны как обычное содержимое страницы: место, дата, автор и ссылка на фотографию в галерее.",
    fieldRecordsTitle: "Полевые записи Reptiles.ge",
    fieldRecordsToggle: "Показать полевые записи",
    galleryAction: "Открыть фото",
    geometryCreditLabel: "Границы регионов",
    geometryCreditName: "geoBoundaries",
    intro: [
      "Региональный слой показывает только территории, подтверждённые на региональном уровне официальными и рецензируемыми источниками, использованными на этой странице. Эти данные отражают первые грузинские находки и наиболее документированные очаги в западной Грузии.",
      "Точки — отдельные полевые фотозаписи Reptiles.ge с координатами, датой и автором. Точка подтверждает фотографическую запись в конкретном месте; она не используется для окраски всего региона и не означает равномерного распространения.",
    ],
    loadingLabel: "Интерактивная карта загружается.",
    mapAria: "Полевые фотозаписи коричнево-мраморного клопа на карте Грузии",
    mapError:
      "Интерактивная карта не загрузилась, но подтверждённые регионы и полевые записи остаются доступными ниже.",
    officialRegionLabel: "Регион, подтверждённый источниками",
    officialRegionsLabel:
      "Подтверждённые источниками регионы для коричнево-мраморного клопа в Грузии",
    officialRegionsPrefix: "Подтверждённые источниками регионы:",
    rangeTitle: "Где встречается коричнево-мраморный клоп в Грузии",
  },
  tr: {
    closeLabel: "Arazi kaydını kapat",
    fieldRecordLabel: "Arazi kaydı",
    fieldRecordsIntro:
      "Aşağıda aynı veriler normal sayfa içeriği olarak kalır: yer, tarih, fotoğrafçı ve galerideki fotoğrafa bağlantı.",
    fieldRecordsTitle: "Reptiles.ge arazi kayıtları",
    fieldRecordsToggle: "Arazi kayıtlarını göster",
    galleryAction: "Fotoğrafı aç",
    geometryCreditLabel: "Bölge sınırları",
    geometryCreditName: "geoBoundaries",
    intro: [
      "Bölgesel katman yalnızca bu sayfada kullanılan resmî ve hakemli kaynaklarla bölge düzeyinde doğrulanan alanları gösterir. Bu kayıtlar Gürcistan'daki ilk kanıtları ve batı Gürcistan'daki en iyi belgelenmiş odakları anlatır.",
      "Noktalar, koordinat, tarih ve fotoğrafçı bilgisi olan tekil Reptiles.ge arazi fotoğraf kayıtlarıdır. Bir nokta o yerde fotoğraflı kaydı doğrular; bütün bölgeyi boyamak için kullanılmaz ve bölge genelinde eşit yayılış anlamına gelmez.",
    ],
    loadingLabel: "Etkileşimli harita yükleniyor.",
    mapAria:
      "Kahverengi kokarcanın yayılış kanıtları ve arazi fotoğraf kayıtları Gürcistan haritasında",
    mapError:
      "Etkileşimli harita yüklenemedi, ancak doğrulanmış bölgeler ve arazi kayıtları aşağıda metin olarak duruyor.",
    officialRegionLabel: "Kaynakla doğrulanmış bölge",
    officialRegionsLabel:
      "Gürcistan'da kahverengi kokarca için kaynakla doğrulanmış bölgeler",
    officialRegionsPrefix: "Kaynakla doğrulanmış bölgeler:",
    rangeTitle: "Kahverengi kokarca Gürcistan'da nerede görülür?",
  },
};

export async function SpeciesRangeMap({
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
  const fieldPhotoRecords = halyomorphaCopy
    ? getFieldPhotoRecords(gallery, locale, speciesName)
    : [];

  if (halyomorphaCopy) {
    return (
      <HalyomorphaRangeSection
        anchorLabel={t("anchorLink")}
        copy={halyomorphaCopy}
        fieldRecords={fieldPhotoRecords}
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

function fieldRecordId(src: string, index: number) {
  const filename = src
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
  return gallery
    .flatMap((item, index) => {
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
          accessibleLabel: [
            `${speciesName} — ${locality}`,
            formattedDate,
            author,
          ]
            .filter(Boolean)
            .join(", "),
          author,
          date: credit.date,
          formattedDate,
          galleryHref: `#${SPECIES_SECTION_IDS.gallery}`,
          id,
          imageAlt: `${speciesName} — ${locality}`,
          lat: credit.lat,
          lng: credit.lng,
          locality,
          thumbSrc: optimizedImgSrc(item.src, 320),
        },
      ];
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
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
    mapAria: copy.mapAria,
    mapError: copy.mapError,
    officialRegionLabel: copy.officialRegionLabel,
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
                        <Image
                          alt=""
                          className="object-cover"
                          fill
                          sizes="64px"
                          src={record.thumbSrc}
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] leading-tight font-semibold text-foreground">
                          {record.locality}
                        </span>
                        <span className="mt-1 block text-[12px] leading-relaxed text-muted-foreground">
                          {[record.formattedDate, record.author]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                        <a
                          className="mt-2 inline-flex text-[12px] font-semibold text-primary transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          href={record.galleryHref}
                        >
                          {copy.galleryAction}
                        </a>
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
