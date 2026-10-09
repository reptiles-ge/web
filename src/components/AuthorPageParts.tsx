import type { ComponentType } from "react";

import { ArrowUpRight, CalendarDays, Images, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { CreditAuthor } from "@/data/creditAuthors";
import type { AppLocale } from "@/i18n/routing";
import type { CreditAuthorGroupStat } from "@/lib/creditAuthors";
import type { GroupHubId } from "@/lib/groupHubs";

import { CoverImage } from "@/components/CoverImage";
import { getSpeciesById } from "@/data/species";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { AUTHOR_PORTRAIT_SIZES } from "@/lib/imageSizes";
import { quizHref } from "@/lib/quizzes";
import { speciesHref } from "@/lib/speciesRoutes";

const EYEBROW =
  "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase";
const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(14,20,17,0.04),0_16px_40px_rgba(14,20,17,0.06)]";
const SECTION_TITLE =
  "mt-3 font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] text-foreground lg:mt-3.5 lg:text-[40px] lg:leading-[1.1]";
const BAR_TONES = [
  "bg-primary",
  "bg-primary/75",
  "bg-foreground",
  "bg-primary/50",
  "bg-muted-foreground/70",
  "bg-muted-foreground/40",
  "bg-border",
];
const NEXT_CHIP =
  "inline-flex min-h-11 items-center rounded-full border border-transparent px-[18px] text-[14px] font-medium transition-colors";

export type AuthorSocial = {
  href: string;
  Icon: ComponentType<{ className?: string }>;
  key: string;
  label: string;
};

export async function AuthorIdentity({
  author,
  bio,
  locale,
  name,
  photos,
  socials,
}: {
  author: CreditAuthor;
  bio?: string;
  locale: AppLocale;
  name: string;
  photos: number;
  socials: AuthorSocial[];
}) {
  const t = await getTranslations({ locale, namespace: "author" });

  return (
    <div className="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 lg:items-start lg:gap-x-10">
      <span className="relative block size-24 shrink-0 overflow-hidden rounded-full bg-ink shadow-[0_0_0_6px_var(--card),0_18px_40px_rgba(14,20,17,0.14)] lg:row-span-3 lg:size-[184px] lg:shadow-[0_0_0_8px_var(--card),0_24px_50px_rgba(14,20,17,0.14)]">
        <CoverImage
          alt={t("portraitAlt", { name })}
          className={`object-cover ${author.portraitClass ?? "object-[50%_18%]"}`}
          priority
          sizes={AUTHOR_PORTRAIT_SIZES}
          src={author.portraitSrc}
        />
      </span>
      <div className="min-w-0 lg:pt-2">
        <AuthorRole label={t(`roles.${author.role}`)} />
        <h1 className="mt-2 font-display text-[32px] leading-[1.08] font-bold tracking-[-0.02em] text-foreground lg:mt-4 lg:text-[64px] lg:leading-[1.04]">
          {name}
        </h1>
      </div>
      <p className="col-span-2 mt-5 max-w-[620px] text-[16px] leading-[1.65] text-foreground/80 lg:col-span-1 lg:col-start-2 lg:text-[18px]">
        {bio ?? t("subtitle")}
      </p>
      <div className="col-span-2 mt-6 flex flex-wrap items-center gap-2.5 lg:col-span-1 lg:col-start-2">
        {photos > 0 ? (
          <a
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#2f6b4f] px-[22px] text-[14.5px] font-medium text-white transition-[filter] hover:brightness-110"
            href="#gallery"
          >
            <Images aria-hidden="true" className="size-4" />
            {t("gallery")}
          </a>
        ) : null}
        {socials.map((item) => (
          <a
            className="inline-flex h-12 items-center gap-2 rounded-full bg-card pr-5 pl-4 text-[14.5px] font-medium text-foreground shadow-[0_1px_2px_rgba(14,20,17,0.05)] transition-colors hover:text-primary"
            href={item.href}
            key={item.key}
            rel="noopener noreferrer"
            target="_blank"
          >
            <item.Icon className="size-4" />
            {item.label}
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 text-muted-foreground"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export async function AuthorNext({
  hubs,
  locale,
}: {
  hubs: GroupHubId[];
  locale: AppLocale;
}) {
  const [t, tNav, tProfile] = await Promise.all([
    getTranslations({ locale, namespace: "author" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "profile" }),
  ]);

  return (
    <section className="pb-16 lg:pb-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <div className="border-t border-border pt-9 lg:pt-11">
          <p className={EYEBROW}>{t("next")}</p>
          <ul className="mt-4 flex flex-wrap gap-2.5 lg:mt-[18px]">
            <li>
              <Link
                className={cn(
                  NEXT_CHIP,
                  "bg-card text-foreground shadow-[0_1px_2px_rgba(14,20,17,0.05)] hover:border-primary hover:text-primary",
                )}
                href="/species"
              >
                {tProfile("allSpecies")}
              </Link>
            </li>
            {hubs.map((hub) => (
              <li key={hub}>
                <Link
                  className={cn(
                    NEXT_CHIP,
                    "bg-card text-foreground shadow-[0_1px_2px_rgba(14,20,17,0.05)] hover:border-primary hover:text-primary",
                  )}
                  href={GROUP_HUBS[hub].path}
                >
                  {tNav(hub)}
                </Link>
              </li>
            ))}
            {hubs.includes("snakes") ? (
              <li>
                <Link
                  className={cn(
                    NEXT_CHIP,
                    "bg-ink text-white hover:brightness-125",
                  )}
                  href={quizHref("snake", locale)}
                >
                  {t("nextQuizSnake")}
                </Link>
              </li>
            ) : null}
            {hubs.includes("lizards") ? (
              <li>
                <Link
                  className={cn(
                    NEXT_CHIP,
                    "bg-ink text-white hover:brightness-125",
                  )}
                  href={quizHref("lizard", locale)}
                >
                  {t("nextQuizLizard")}
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </section>
  );
}

export async function AuthorSpeciesGroups({
  groups,
  locale,
  species,
}: {
  groups: CreditAuthorGroupStat[];
  locale: AppLocale;
  species: number;
}) {
  if (groups.length === 0) return null;
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "author" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <section className="py-12 lg:py-[88px]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div>
            <p className={EYEBROW}>{t("speciesList")}</p>
            <h2 className={SECTION_TITLE}>
              {t("speciesTitle", {
                groups: groups.length,
                species,
              })}
            </h2>
          </div>
          <p className="mt-3 text-[15px] leading-[1.6] text-muted-foreground lg:mt-0 lg:max-w-[460px] lg:pb-1.5 lg:text-[16px] lg:leading-[1.65]">
            {t("speciesLead")}
          </p>
        </div>
        <div className="mt-7 grid items-start gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-5">
          {groups.map((group) => (
            <div
              className="rounded-[24px] bg-card px-5 pt-5 pb-2 shadow-[0_1px_2px_rgba(14,20,17,0.04),0_14px_36px_rgba(14,20,17,0.05)] lg:rounded-[28px] lg:px-6 lg:pt-[22px] lg:pb-3"
              key={group.hub}
            >
              <div className="flex items-baseline justify-between gap-3 pb-3">
                <Link
                  className="font-display text-[18px] font-semibold text-foreground transition-colors hover:text-primary"
                  href={GROUP_HUBS[group.hub].path}
                >
                  {tNav(group.hub)}
                </Link>
                <span className="text-[12.5px] text-muted-foreground tabular-nums">
                  {t("groupSummary", {
                    photos: group.photos,
                    species: group.species.length,
                  })}
                </span>
              </div>
              <ul>
                {group.species.map((item) => {
                  const species = getSpeciesById(item.id);
                  if (!species) return null;
                  const localized = localizeSpecies(species, locale);
                  return (
                    <li className="border-t border-border/70" key={item.id}>
                      <Link
                        className="group flex min-h-[52px] items-center gap-3 py-2"
                        href={speciesHref(item.id, locale)}
                        prefetch={false}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] leading-[1.3] font-medium text-foreground transition-colors group-hover:text-primary">
                            {localized.commonName}
                          </span>
                          <span className="mt-0.5 block text-[12.5px] text-muted-foreground italic">
                            {localized.scientificName}
                          </span>
                        </span>
                        <span className="inline-flex h-6 min-w-7 shrink-0 items-center justify-center rounded-full bg-surface px-2 text-[12px] font-semibold text-primary tabular-nums">
                          {item.photos}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function AuthorSummary({
  field,
  groups,
  locale,
  photos,
  species,
}: {
  field: {
    place?: { count: number; name: string };
    years?: { from: number; to: number };
  };
  groups: CreditAuthorGroupStat[];
  locale: AppLocale;
  photos: number;
  species: number;
}) {
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "author" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <aside
      aria-label={t("summaryLabel")}
      className={`mt-7 rounded-[28px] bg-card p-6 lg:mt-0 lg:w-[420px] lg:shrink-0 lg:rounded-[32px] lg:p-[30px] ${CARD_SHADOW}`}
    >
      <dl className="grid grid-cols-3">
        {[
          { label: t("statPhotos"), value: photos },
          { label: t("statSpecies"), value: species },
          { label: t("statGroups"), value: groups.length },
        ].map((stat, index) => (
          <div
            className={cn(
              "flex flex-col-reverse justify-end",
              index > 0 && "border-l border-border/70 pl-5 lg:pl-[22px]",
            )}
            key={stat.label}
          >
            <dt className="mt-2 text-[12.5px] text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="font-display text-[32px] leading-none font-semibold tracking-[-0.02em] text-foreground tabular-nums lg:text-[40px]">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      {groups.length > 0 ? (
        <>
          <div
            aria-hidden="true"
            className="mt-6 flex h-2.5 gap-[3px] overflow-hidden rounded-full lg:mt-[26px]"
          >
            {groups.map((group, index) => (
              <span
                className={BAR_TONES[index % BAR_TONES.length]}
                key={group.hub}
                style={{ flex: `${group.photos} 1 0` }}
              />
            ))}
          </div>
          <p className="mt-2.5 text-[12.5px] leading-[1.6] text-muted-foreground">
            {groups
              .map((group) => `${tNav(group.hub)} ${group.photos}`)
              .join(" · ")}
          </p>
        </>
      ) : null}
      {(locale === "ka" && field.place) || field.years ? (
        <div className="mt-5 flex flex-col gap-3 border-t border-border/70 pt-[18px] lg:mt-[22px]">
          {locale === "ka" && field.place ? (
            <p className="flex items-start gap-3 text-[14px] leading-normal text-foreground">
              <MapPin
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <span>
                {field.place.name}{" "}
                <span className="text-muted-foreground">
                  · {field.place.count} {t("statPhotos")}
                </span>
              </span>
            </p>
          ) : null}
          {field.years ? (
            <p className="flex items-start gap-3 text-[14px] leading-normal text-foreground">
              <CalendarDays
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <span>
                {t("fieldYears")}{" "}
                <span className="text-muted-foreground tabular-nums">
                  ·{" "}
                  {field.years.from === field.years.to
                    ? field.years.from
                    : `${field.years.from}–${field.years.to}`}
                </span>
              </span>
            </p>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}

function AuthorRole({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2.5">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
      <span className={EYEBROW}>{label}</span>
    </p>
  );
}
