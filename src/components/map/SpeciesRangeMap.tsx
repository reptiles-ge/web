import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import type { GalleryImage, PhotoCredit } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { GeorgiaMapStatic } from "@/components/map/GeorgiaMapStatic";
import { getRegionsForSpecies, localizeRegionText } from "@/data/mapRegions";
import { Link } from "@/i18n/navigation";
import { formatPhotoDate } from "@/lib/formatDate";
import { regionHref } from "@/lib/regionHref";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type FieldPhotoRecord = {
  credit: PhotoCredit;
  src: string;
  x: number;
  y: number;
};

type HalyomorphaRangeCopy = {
  fieldBody: string;
  fieldRecordLabel: string;
  fieldTitle: string;
  mapAria: string;
  rangeSubtitle: string;
};

type SpeciesRangeMapProps = {
  gallery?: GalleryImage[];
  speciesId: string;
  speciesName: string;
};

const HALYOMORPHA_RANGE_COPY: Record<AppLocale, HalyomorphaRangeCopy> = {
  en: {
    fieldBody:
      "These points are individual field photo records published in the gallery: place, date, author, and photograph. They are a separate evidence layer and do not automatically imply even regional distribution.",
    fieldRecordLabel: "Field record",
    fieldTitle: "Reptiles.ge records",
    mapAria:
      "Brown marmorated stink bug field photo records on the map of Georgia",
    rangeSubtitle:
      "Highlighted regions show regional records supported by the official and peer-reviewed sources used on this page. Individual Reptiles.ge field photo records are shown separately and do not automatically mean even distribution across a region.",
  },
  ka: {
    fieldBody:
      "ეს წერტილები არის გალერეაში გამოქვეყნებული ინდივიდუალური საველე ფოტოჩანაწერები: ადგილი, თარიღი, ავტორი და ფოტო. ისინი ცალკე მტკიცებულების ფენაა და ავტომატურად არ ნიშნავს რეგიონის ერთნაირ დაფარვას.",
    fieldRecordLabel: "საველე ჩანაწერი",
    fieldTitle: "Reptiles.ge-ის ჩანაწერები",
    mapAria: "აზიური ფაროსანას საველე ფოტოჩანაწერები საქართველოს რუკაზე",
    rangeSubtitle:
      "გამოკვეთილი რეგიონები აჩვენებს ამ გვერდზე გამოყენებული ოფიციალური და რეცენზირებული წყაროებით რეგიონულ დონეზე დადასტურებულ ჩანაწერებს. Reptiles.ge-ის ინდივიდუალური საველე ფოტოჩანაწერები ცალკე არის ნაჩვენები და ავტომატურად არ ნიშნავს რეგიონში ერთნაირ გავრცელებას.",
  },
  ru: {
    fieldBody:
      "Эти точки — отдельные полевые фотозаписи из галереи: место, дата, автор и фотография. Это отдельный слой данных, который не означает равномерное распространение по региону.",
    fieldRecordLabel: "Полевая фотозапись",
    fieldTitle: "Записи Reptiles.ge",
    mapAria: "Полевые фотозаписи коричнево-мраморного клопа на карте Грузии",
    rangeSubtitle:
      "Подсвеченные регионы показывают региональные записи, подтверждённые официальными и рецензируемыми источниками, использованными на этой странице. Отдельные полевые фотозаписи Reptiles.ge показаны отдельно и не означают равномерное распространение по региону.",
  },
  tr: {
    fieldBody:
      "Bu noktalar galeride yayımlanan tekil arazi fotoğraf kayıtlarıdır: yer, tarih, fotoğrafçı ve fotoğraf. Ayrı bir kanıt katmanıdır ve bölge genelinde eşit yayılış anlamına gelmez.",
    fieldRecordLabel: "Arazi kaydı",
    fieldTitle: "Reptiles.ge kayıtları",
    mapAria:
      "Kahverengi kokarca arazi fotoğraf kayıtları Gürcistan haritasında",
    rangeSubtitle:
      "Vurgulanan bölgeler, bu sayfada kullanılan resmî ve hakemli kaynaklarla bölgesel düzeyde doğrulanan kayıtları gösterir. Reptiles.ge'nin tekil arazi fotoğraf kayıtları ayrı gösterilir ve bir bölgede eşit yayılış anlamına gelmez.",
  },
};

const GEORGIA_POINT_BOUNDS = {
  maxLat: 43.6,
  maxLng: 46.75,
  minLat: 40.95,
  minLng: 39.85,
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
    ? getFieldPhotoRecords(gallery)
    : [];

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
            {halyomorphaCopy?.rangeSubtitle ?? t("rangeSubtitle")}
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

        {halyomorphaCopy && fieldPhotoRecords.length > 0 ? (
          <FieldPhotoRecords
            copy={halyomorphaCopy}
            locale={locale}
            records={fieldPhotoRecords}
          />
        ) : null}
      </div>
    </section>
  );
}

function FieldPhotoPointMap({
  copy,
  records,
}: {
  copy: HalyomorphaRangeCopy;
  records: FieldPhotoRecord[];
}) {
  return (
    <div aria-label={copy.mapAria} className="relative" role="img">
      <GeorgiaMapStatic className="max-w-none" highlightedIds={[]} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {records.map((record) => (
          <span
            className="absolute size-3 -translate-1/2 rounded-full border-2 border-white bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_22%,transparent),0_8px_18px_-8px_rgba(0,0,0,0.75)]"
            key={`${record.src}:marker`}
            style={{ left: `${record.x}%`, top: `${record.y}%` }}
            title={record.credit.location}
          />
        ))}
      </div>
    </div>
  );
}

function FieldPhotoRecords({
  copy,
  locale,
  records,
}: {
  copy: HalyomorphaRangeCopy;
  locale: AppLocale;
  records: FieldPhotoRecord[];
}) {
  return (
    <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
      <div>
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          {copy.fieldTitle}
        </p>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
          {copy.fieldBody}
        </p>
        <div className="mt-6">
          <FieldPhotoPointMap copy={copy} records={records} />
        </div>
      </div>

      <div className="divide-y divide-border/70 border-y border-border/70">
        {records.map((record) => (
          <article
            className="flex gap-3 py-4"
            key={`${record.src}:${record.credit.location ?? ""}`}
          >
            <span className="relative block size-16 shrink-0 overflow-hidden rounded-media bg-ink">
              <Image
                alt=""
                className="object-cover"
                fill
                sizes="64px"
                src={record.src}
              />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] leading-relaxed font-medium text-foreground">
                {fieldRecordLine(record.credit, copy.fieldRecordLabel, locale)}
              </span>
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}

function fieldRecordLine(
  credit: PhotoCredit,
  label: string,
  locale: AppLocale,
) {
  const location = credit.location?.trim();
  const date = credit.date ? formatPhotoDate(credit.date, locale) : null;
  const photographer = credit.photographer?.trim();
  const placeDate = [location, date].filter(Boolean).join(", ");

  return `${label}${placeDate ? ` — ${placeDate}` : ""}${
    photographer ? ` · ${photographer}` : ""
  }`;
}

function getFieldPhotoRecords(gallery: GalleryImage[]): FieldPhotoRecord[] {
  return gallery
    .flatMap((item) => {
      const credit = item.credit;
      if (!credit || credit.lat === undefined || credit.lng === undefined) {
        return [];
      }

      const photoConfidence = item.photoConfidence ?? credit.photoConfidence;
      if (photoConfidence !== "georgia-field") {
        return [];
      }

      const position = getPointPosition(credit);
      if (!position) return [];

      return [{ credit, src: item.src, ...position }];
    })
    .sort((a, b) => (b.credit.date ?? "").localeCompare(a.credit.date ?? ""));
}

function getPointPosition(credit: PhotoCredit) {
  if (credit.lat === undefined || credit.lng === undefined) return null;

  const x =
    ((credit.lng - GEORGIA_POINT_BOUNDS.minLng) /
      (GEORGIA_POINT_BOUNDS.maxLng - GEORGIA_POINT_BOUNDS.minLng)) *
    100;
  const y =
    ((GEORGIA_POINT_BOUNDS.maxLat - credit.lat) /
      (GEORGIA_POINT_BOUNDS.maxLat - GEORGIA_POINT_BOUNDS.minLat)) *
    100;

  if (x < 0 || x > 100 || y < 0 || y > 100) return null;

  return { x, y };
}
