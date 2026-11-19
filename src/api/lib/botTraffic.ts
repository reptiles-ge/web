import { isbot } from "isbot";

const EXTRA_BOT_USER_AGENT =
  /crawl|spider|preview|fetch|headless|lighthouse|page ?speed|gtmetrix|pingdom|uptime|monitor|scan|audit|validator|checker|curl|wget|python|httpclient|okhttp|axios|node-fetch|undici|go-http|java\/|puppeteer|playwright|selenium|phantomjs|google-|-google|googleother|chatgpt|openai|perplexity|claude|anthropic|facebookexternalhit|meta-external|whatsapp|telegrambot|discordbot|slack|skype|vkshare|ia_archiver|archive\.org/i;

const DATACENTER_ASNS: ReadonlySet<number> = new Set([
  8075, 12876, 13238, 14061, 14618, 15169, 16276, 16509, 19527, 20473, 24940,
  31898, 32934, 45102, 51167, 55967, 63949, 132203, 136907, 396982,
]);

export type BotSignals = {
  asn: null | number;
  userAgent: string | undefined;
};

export function isBotTraffic({ asn, userAgent }: BotSignals) {
  return (
    isBotUserAgent(userAgent) || (asn !== null && DATACENTER_ASNS.has(asn))
  );
}

export function isBotUserAgent(userAgent: string | undefined) {
  if (!userAgent?.trim()) return true;
  return isbot(userAgent) || EXTRA_BOT_USER_AGENT.test(userAgent);
}

export function requestAsn(request: Request) {
  const cf: unknown = Reflect.get(request, "cf");
  if (typeof cf !== "object" || cf === null) return null;
  const asn: unknown = Reflect.get(cf, "asn");
  return typeof asn === "number" && Number.isInteger(asn) ? asn : null;
}
