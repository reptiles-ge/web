import type { AppLocale } from "@/i18n/routing";

import { absoluteUrl } from "@/lib/site";

const MAX_SECONDS = 24 * 60 * 60;
const MAX_PAGES = 999;
const MAX_REFERRER_LENGTH = 100;
const REFERRER_HOST =
  /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;
const LANGUAGE_TAG = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8}){0,2}$/;

const SYSTEMS = [
  [/iPhone|iPod/, "iPhone"],
  [/iPad/, "iPad"],
  [/Android/, "Android"],
  [/Windows/, "Windows"],
  [/CrOS/, "ChromeOS"],
  [/Macintosh|Mac OS X/, "macOS"],
  [/Linux/, "Linux"],
] as const;

const BROWSERS = [
  [/FBAN|FBAV|FB_IAB/, "Facebook app"],
  [/Instagram/, "Instagram app"],
  [/TikTok|musical_ly|BytedanceWebview/, "TikTok app"],
  [/Edg(?:A|iOS)?\//, "Edge"],
  [/OPR\/|OPT\/|Opera/, "Opera"],
  [/SamsungBrowser\//, "Samsung Internet"],
  [/YaBrowser\//, "Yandex Browser"],
  [/FxiOS\/|Firefox\//, "Firefox"],
  [/CriOS\/|Chrome\//, "Chrome"],
  [/Safari\//, "Safari"],
] as const;

const REGION_NAMES = new Intl.DisplayNames(["en"], { type: "region" });

type RatingNotification = {
  acceptLanguage: null | string;
  country: null | string;
  host: string;
  locale: AppLocale;
  pages: unknown;
  path: string;
  rating: number;
  referrer: unknown;
  seconds: unknown;
  userAgent: null | string;
};

export function formatRatingNotification({
  acceptLanguage,
  country,
  host,
  locale,
  pages,
  path,
  rating,
  referrer,
  seconds,
  userAgent,
}: RatingNotification) {
  const browserLanguage = describeBrowserLanguage(acceptLanguage, locale);
  const visit = [describeDuration(seconds), describePages(pages)].filter(
    Boolean,
  );
  const place = describeCountry(country);
  const device = describeDevice(userAgent);
  const source = describeReferrer(referrer, host);

  return [
    `${"★".repeat(rating)}${"☆".repeat(5 - rating)} ${rating}/5`,
    absoluteUrl(path),
    `🌐 ${locale}${browserLanguage ? ` · browser ${browserLanguage}` : ""}`,
    place ? `📍 ${place}` : "",
    device ? `📱 ${device}` : "",
    visit.length > 0 ? `⏱ ${visit.join(" · ")}` : "",
    source ? `↩ ${source}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function boundedInteger(value: unknown, min: number, max: number) {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
    ? value
    : null;
}

function describeBrowserLanguage(header: null | string, locale: AppLocale) {
  const tag = header?.split(",")[0]?.split(";")[0]?.trim() ?? "";
  if (!LANGUAGE_TAG.test(tag)) return "";
  return tag.split("-")[0]?.toLowerCase() === locale ? "" : tag;
}

function describeCountry(code: null | string) {
  if (!code || !/^[A-Z]{2}$/.test(code) || code === "XX") return "";
  const flag = String.fromCodePoint(
    ...[...code].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65),
  );
  return `${flag} ${REGION_NAMES.of(code) ?? code}`;
}

function describeDevice(userAgent: null | string) {
  if (!userAgent) return "";
  return [SYSTEMS, BROWSERS]
    .map((table) => table.find(([pattern]) => pattern.test(userAgent))?.[1])
    .filter(Boolean)
    .join(" · ");
}

function describeDuration(value: unknown) {
  const seconds = boundedInteger(value, 1, MAX_SECONDS);
  if (seconds === null) return "";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest} s on site`;
  return `${minutes} min${rest > 0 ? ` ${rest} s` : ""} on site`;
}

function describePages(value: unknown) {
  const pages = boundedInteger(value, 1, MAX_PAGES);
  if (pages === null) return "";
  return pages === 1 ? "1 page" : `${pages} pages`;
}

function describeReferrer(value: unknown, host: string) {
  if (typeof value !== "string" || value.length > MAX_REFERRER_LENGTH) {
    return "";
  }
  return REFERRER_HOST.test(value) && value !== host ? value : "";
}
