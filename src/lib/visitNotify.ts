import { georgiaPlaceName } from "@/i18n/localeMeta";
import {
  displayVisitPath,
  visitLocaleFromPath,
  visitPageLabel,
} from "@/lib/visitPageLabel";

export const VISIT_COOKIE = "rp_v";
export const VISIT_STORAGE_KEY = "reptiles-visit";

const PATH_MAX = 200;
const REFERRER_MAX = 300;
const CITY_MAX = 80;
const UA_MAX = 512;

const SOURCE_HOSTS: Array<{ match: RegExp; name: string }> = [
  { match: /(^|\.)google\./i, name: "Google" },
  { match: /(^|\.)bing\./i, name: "Bing" },
  { match: /(^|\.)yandex\./i, name: "Yandex" },
  { match: /(^|\.)duckduckgo\./i, name: "DuckDuckGo" },
  { match: /(^|\.)(facebook|fb)\.com$/i, name: "Facebook" },
  { match: /(^|\.)instagram\./i, name: "Instagram" },
  { match: /(^|\.)(t\.me|telegram\.(org|me))$/i, name: "Telegram" },
  { match: /(^|\.)(twitter\.com|x\.com|t\.co)$/i, name: "X" },
  { match: /(^|\.)reddit\./i, name: "Reddit" },
  { match: /(^|\.)(youtube\.com|youtu\.be)$/i, name: "YouTube" },
  { match: /(^|\.)tiktok\./i, name: "TikTok" },
  { match: /(^|\.)baidu\./i, name: "Baidu" },
  { match: /(^|\.)yahoo\./i, name: "Yahoo" },
  { match: /(^|\.)wikipedia\./i, name: "Wikipedia" },
];

const SOURCE_TOKENS: Record<string, string> = {
  baidu: "Baidu",
  bing: "Bing",
  duckduckgo: "DuckDuckGo",
  facebook: "Facebook",
  fb: "Facebook",
  google: "Google",
  ig: "Instagram",
  instagram: "Instagram",
  reddit: "Reddit",
  t: "Telegram",
  telegram: "Telegram",
  tiktok: "TikTok",
  twitter: "X",
  wikipedia: "Wikipedia",
  x: "X",
  yahoo: "Yahoo",
  yandex: "Yandex",
  youtube: "YouTube",
};

const CITY_KA: Record<string, string> = {
  akhaltsikhe: "ახალციხე",
  batumi: "ბათუმი",
  gori: "გორი",
  kobuleti: "ქობულეთი",
  kutaisi: "ქუთაისი",
  marneuli: "მარნეული",
  ozurgeti: "ოზურგეთი",
  poti: "ფოთი",
  rustavi: "რუსთავი",
  tbilisi: "თბილისი",
  telavi: "თელავი",
  zugdidi: "ზუგდიდი",
};

export function createVisitLimiter(windowMs: number) {
  const lastByKey = new Map<string, number>();

  return {
    take(key: string, now = Date.now()) {
      const last = lastByKey.get(key);
      if (last !== undefined && now - last < windowMs) return false;
      lastByKey.set(key, now);
      if (lastByKey.size > 8_000) {
        for (const [entry, at] of lastByKey) {
          if (now - at > windowMs) lastByKey.delete(entry);
        }
      }
      return true;
    },
  };
}

export const visitLimiter = createVisitLimiter(60_000);

export function formatVisitMessage(input: {
  city?: null | string;
  country?: null | string;
  path: string;
  referrer?: string;
  userAgent?: null | string;
}) {
  const pathname = displayVisitPath(input.path);
  const locale = visitLocaleFromPath(pathname).toUpperCase();
  const page = visitPageLabel(input.path);
  const lines = [`ახალი ვიზიტი · ${locale}`, ""];
  if (page) lines.push(`გვერდი: ${page}`);
  lines.push(`URL: ${pathname}`);
  const extra = [
    sourceLine(input.referrer, input.path),
    placeLine(input.country, input.city),
    deviceLine(input.userAgent),
  ].filter((line): line is string => Boolean(line));
  if (extra.length) {
    lines.push("");
    lines.push(...extra);
  }
  return lines.join("\n");
}

export function readVisitPath(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const path = sanitizeVisitPath(record.path);
  if (!path) return null;
  return {
    path,
    referrer: sanitizeVisitReferrer(record.referrer),
  };
}

export function sanitizeVisitPath(value: unknown) {
  if (typeof value !== "string") return null;
  const path = value.trim();
  if (!path.startsWith("/")) return null;
  if (path.length > PATH_MAX) return null;
  if (path.includes("://")) return null;
  if (/[\u0000-\u001f\u007f]/.test(path)) return null;
  return path;
}

export function sanitizeVisitReferrer(value: unknown) {
  if (typeof value !== "string") return undefined;
  const raw = value.trim();
  if (!raw || raw.length > REFERRER_MAX) return undefined;
  if (/[\u0000-\u001f\u007f]/.test(raw)) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function visitClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  return "unknown";
}

export function visitDeviceLabel(userAgent?: null | string) {
  if (!userAgent) return undefined;
  const ua = userAgent.slice(0, UA_MAX);
  const device = visitDeviceName(ua);
  const browser = visitBrowserName(ua);
  if (device && browser) return `${device} · ${browser}`;
  return device ?? browser;
}

export function visitGeo(request: Request) {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");
  const city =
    request.headers.get("x-vercel-ip-city") ??
    request.headers.get("cf-ipcity");
  return {
    city: sanitizeVisitCity(city),
    country: sanitizeVisitCountry(country),
  };
}

export function visitOriginAllowed(request: Request, originUrl: URL) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).origin === originUrl.origin;
    } catch {
      return false;
    }
  }
  return request.headers.get("sec-fetch-site") === "same-origin";
}

export function visitPlaceLabel(country?: null | string, city?: null | string) {
  const countryName = countryDisplay(country);
  const cityName = cityDisplay(city);
  if (countryName && cityName) return `${countryName}, ${cityName}`;
  return countryName ?? cityName;
}

export function visitReferrerSource(referrer?: string, path?: string) {
  if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./i, "");
      if (isOwnHost(host)) return undefined;
      const named = namedSourceFromHost(host);
      if (named) return named;
      if (host) return host.slice(0, 80);
    } catch {
      return undefined;
    }
  }
  if (!path) return undefined;
  const query = path.split("?")[1];
  if (!query) return undefined;
  const utm = new URLSearchParams(query).get("utm_source")?.trim();
  if (!utm) return undefined;
  return namedSourceFromToken(utm) ?? sanitizeUtmSource(utm);
}

function cityDisplay(city?: null | string) {
  const value = sanitizeVisitCity(city);
  if (!value) return undefined;
  return CITY_KA[value.toLowerCase()] ?? value;
}

function countryDisplay(country?: null | string) {
  const code = sanitizeVisitCountry(country);
  if (!code) return undefined;
  if (code === "GE") return georgiaPlaceName("ka");
  try {
    const name = new Intl.DisplayNames(["ka"], { type: "region" }).of(code);
    return name ?? code;
  } catch {
    return code;
  }
}

function deviceLine(userAgent?: null | string) {
  const device = visitDeviceLabel(userAgent);
  return device ? `მოწყობილობა: ${device}` : undefined;
}

function isOwnHost(host: string) {
  const h = host.toLowerCase();
  return h === "reptiles.ge" || h.endsWith(".reptiles.ge") || h === "localhost";
}

function namedSourceFromHost(host: string) {
  for (const { match, name } of SOURCE_HOSTS) {
    if (match.test(host)) return name;
  }
  return undefined;
}

function namedSourceFromToken(value: string) {
  return SOURCE_TOKENS[value.trim().toLowerCase()];
}

function placeLine(country?: null | string, city?: null | string) {
  const place = visitPlaceLabel(country, city);
  return place ? `ადგილი: ${place}` : undefined;
}

function sanitizeUtmSource(value: string) {
  const token = value.trim().slice(0, 40);
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(token)) return undefined;
  return token;
}

function sanitizeVisitCity(value?: null | string) {
  if (!value) return undefined;
  let city = value.trim();
  try {
    city = decodeURIComponent(city.replace(/\+/g, " "));
  } catch {
    return undefined;
  }
  city = city.trim();
  if (!city || city.length > CITY_MAX) return undefined;
  if (/[\u0000-\u001f\u007f]/.test(city)) return undefined;
  return city;
}

function sanitizeVisitCountry(value?: null | string) {
  if (!value) return undefined;
  const code = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || code === "XX") return undefined;
  return code;
}

function sourceLine(referrer?: string, path?: string) {
  const source = visitReferrerSource(referrer, path);
  return source ? `წყარო: ${source}` : undefined;
}

function visitBrowserName(ua: string) {
  if (/Edg(?:e|A|iOS)?\//i.test(ua)) return "Edge";
  if (/OPR\/|Opera/i.test(ua)) return "Opera";
  if (/SamsungBrowser/i.test(ua)) return "Samsung";
  if (/Firefox|FxiOS/i.test(ua)) return "Firefox";
  if (/CriOS|Chrome|Chromium/i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua)) return "Safari";
  return undefined;
}

function visitDeviceName(ua: string) {
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android";
  if (/Macintosh|Mac OS X/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";
  if (/CrOS/i.test(ua)) return "Chromebook";
  if (/Linux/i.test(ua)) return "Linux";
  return undefined;
}
