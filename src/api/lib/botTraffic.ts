import { isbot } from "isbot";

const EXTRA_BOT_USER_AGENT =
  /crawl|spider|preview|fetch|headless|lighthouse|page ?speed|gtmetrix|pingdom|uptime|monitor|scan|audit|validator|checker|curl|wget|python|httpclient|okhttp|axios|node-fetch|undici|go-http|java\/|puppeteer|playwright|selenium|phantomjs|google-|-google|googleother|chatgpt|openai|perplexity|claude|anthropic|facebookexternalhit|meta-external|telegrambot|discordbot|vkshare|ia_archiver|archive\.org/i;

const DATACENTER_ASNS: ReadonlySet<number> = new Set([
  7203, 8075, 8100, 9009, 12876, 13238, 14061, 14618, 15169, 16276, 16509,
  19527, 20473, 22612, 24940, 26496, 28753, 30633, 31898, 32934, 35916, 36352,
  40021, 43350, 45102, 46562, 49981, 50673, 51167, 51396, 54290, 55967, 59253,
  60781, 62240, 63949, 132203, 136907, 197540, 206264, 212238, 396982,
]);

const CHROME_ANCHOR = { major: 157, time: Date.UTC(2026, 10, 17) };
const CHROME_RELEASE_MS = 28 * 24 * 60 * 60 * 1000;
const STALE_CHROME_MAJORS = 20;
const DESKTOP_CHROME =
  /(?:Windows NT 1\d|Macintosh|X11; Linux x86_64)[^)]*\).*?Chrome\/(\d+)\./;

export type BotSignals = {
  asn: null | number;
  now: Date;
  userAgent: string | undefined;
};

export function isBotTraffic({ asn, now, userAgent }: BotSignals) {
  return (
    isBotUserAgent(userAgent) ||
    (asn !== null && DATACENTER_ASNS.has(asn)) ||
    isStaleDesktopChrome(userAgent ?? "", now)
  );
}

export function isBotUserAgent(userAgent: string | undefined) {
  if (!userAgent?.trim()) return true;
  return isbot(userAgent) || EXTRA_BOT_USER_AGENT.test(userAgent);
}

export function isStaleDesktopChrome(userAgent: string, now: Date) {
  if (/Electron\//.test(userAgent)) return false;
  const major = DESKTOP_CHROME.exec(userAgent)?.[1];
  if (!major) return false;
  const released = Math.floor(
    (now.getTime() - CHROME_ANCHOR.time) / CHROME_RELEASE_MS,
  );
  return Number(major) < CHROME_ANCHOR.major + released - STALE_CHROME_MAJORS;
}

export function requestAsn(request: Request) {
  const cf: unknown = Reflect.get(request, "cf");
  if (typeof cf !== "object" || cf === null) return null;
  const asn: unknown = Reflect.get(cf, "asn");
  return typeof asn === "number" && Number.isInteger(asn) ? asn : null;
}
