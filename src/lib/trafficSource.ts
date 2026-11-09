export type TrafficChannel =
  "ai" | "direct" | "email" | "paid" | "referral" | "search" | "social";

type SourceDefinition = {
  channel: TrafficChannel;
  clickIds?: readonly string[];
  hosts?: readonly string[];
  id: string;
  utm?: readonly string[];
};

const SOURCES = [
  {
    channel: "paid",
    clickIds: ["gclid", "gbraid", "wbraid"],
    id: "google-ads",
  },
  { channel: "paid", clickIds: ["msclkid"], id: "microsoft-ads" },
  {
    channel: "ai",
    hosts: ["gemini.google.com", "bard.google.com"],
    id: "gemini",
    utm: ["gemini", "gemini.google.com"],
  },
  {
    channel: "ai",
    hosts: ["chatgpt.com", "chat.openai.com", "openai.com"],
    id: "chatgpt",
    utm: ["chatgpt", "chatgpt.com", "openai"],
  },
  {
    channel: "ai",
    hosts: ["perplexity.ai"],
    id: "perplexity",
    utm: ["perplexity", "perplexity.ai"],
  },
  {
    channel: "ai",
    hosts: ["claude.ai"],
    id: "claude",
    utm: ["claude", "claude.ai"],
  },
  {
    channel: "ai",
    hosts: ["copilot.microsoft.com", "copilot.com"],
    id: "copilot",
    utm: ["copilot", "copilot.com"],
  },
  {
    channel: "email",
    hosts: ["mail.google.com", "com.google.android.gm"],
    id: "gmail",
    utm: ["gmail"],
  },
  {
    channel: "email",
    hosts: ["outlook.live.com", "outlook.office.com", "outlook.office365.com"],
    id: "outlook",
    utm: ["outlook"],
  },
  {
    channel: "search",
    hosts: ["google.*", "com.google.android.googlequicksearchbox"],
    id: "google",
    utm: ["google"],
  },
  { channel: "search", hosts: ["bing.com"], id: "bing", utm: ["bing"] },
  {
    channel: "search",
    clickIds: ["yclid"],
    hosts: ["yandex.*", "ya.ru"],
    id: "yandex",
    utm: ["yandex"],
  },
  {
    channel: "search",
    hosts: ["duckduckgo.com"],
    id: "duckduckgo",
    utm: ["duckduckgo"],
  },
  { channel: "search", hosts: ["yahoo.*"], id: "yahoo", utm: ["yahoo"] },
  { channel: "search", hosts: ["ecosia.org"], id: "ecosia", utm: ["ecosia"] },
  {
    channel: "search",
    hosts: ["search.brave.com"],
    id: "brave",
    utm: ["brave"],
  },
  {
    channel: "social",
    clickIds: ["fbclid"],
    hosts: ["facebook.com", "fb.com", "fb.me", "messenger.com"],
    id: "facebook",
    utm: ["facebook", "fb", "facebook.com", "messenger"],
  },
  {
    channel: "social",
    hosts: ["instagram.com"],
    id: "instagram",
    utm: ["instagram", "ig", "instagram.com"],
  },
  {
    channel: "social",
    hosts: ["threads.net", "threads.com"],
    id: "threads",
    utm: ["threads"],
  },
  {
    channel: "social",
    clickIds: ["twclid"],
    hosts: ["x.com", "twitter.com", "t.co"],
    id: "x",
    utm: ["x", "twitter"],
  },
  {
    channel: "social",
    clickIds: ["li_fat_id"],
    hosts: ["linkedin.com", "lnkd.in"],
    id: "linkedin",
    utm: ["linkedin"],
  },
  {
    channel: "social",
    hosts: ["youtube.com", "youtu.be"],
    id: "youtube",
    utm: ["youtube"],
  },
  { channel: "social", hosts: ["reddit.com"], id: "reddit", utm: ["reddit"] },
  {
    channel: "social",
    hosts: ["pinterest.*", "pin.it"],
    id: "pinterest",
    utm: ["pinterest"],
  },
  {
    channel: "social",
    clickIds: ["ttclid"],
    hosts: ["tiktok.com"],
    id: "tiktok",
    utm: ["tiktok"],
  },
  {
    channel: "social",
    hosts: ["t.me", "telegram.org", "telegram.me"],
    id: "telegram",
    utm: ["telegram"],
  },
  {
    channel: "social",
    hosts: ["whatsapp.com", "wa.me"],
    id: "whatsapp",
    utm: ["whatsapp"],
  },
  { channel: "social", hosts: ["vk.com"], id: "vk", utm: ["vk"] },
  {
    channel: "referral",
    hosts: ["wikipedia.org"],
    id: "wikipedia",
    utm: ["wikipedia"],
  },
  {
    channel: "referral",
    hosts: ["inaturalist.org"],
    id: "inaturalist",
    utm: ["inaturalist"],
  },
  { channel: "referral", id: "other" },
  { channel: "direct", id: "direct" },
] as const satisfies readonly SourceDefinition[];

export type TrafficSourceId = (typeof SOURCES)[number]["id"];

export const TRAFFIC_SOURCE_IDS = SOURCES.map(({ id }) => id) as [
  TrafficSourceId,
  ...TrafficSourceId[],
];

export type TrafficEntryInput = {
  clickId?: string;
  referrer?: string;
  utmSource?: string;
};

export type TrafficSourceMatch = {
  referrer: string;
  source: TrafficSourceId;
};

const SITE_HOST = "reptiles.ge";

const DEFINITIONS: readonly SourceDefinition[] = SOURCES;

const CHANNEL_BY_SOURCE = new Map<string, TrafficChannel>(
  DEFINITIONS.map(({ channel, id }) => [id, channel]),
);

export function classifyTrafficEntry(
  entry: TrafficEntryInput,
): TrafficSourceMatch {
  const referrer = entry.referrer ? normalizeHost(entry.referrer) : "";
  const utm = entry.utmSource?.trim().toLowerCase();
  const { clickId } = entry;
  if (clickId) {
    const byClick = DEFINITIONS.find((source) =>
      source.clickIds?.includes(clickId),
    );
    if (byClick) return { referrer, source: byClick.id as TrafficSourceId };
  }
  if (utm) {
    const byUtm = DEFINITIONS.find((source) => source.utm?.includes(utm));
    if (byUtm) return { referrer, source: byUtm.id as TrafficSourceId };
  }
  if (referrer) {
    const byHost = DEFINITIONS.find((source) =>
      source.hosts?.some((pattern) => hostMatches(referrer, pattern)),
    );
    return {
      referrer,
      source: (byHost?.id as TrafficSourceId | undefined) ?? "other",
    };
  }
  if (utm) return { referrer: `utm:${utm}`, source: "other" };
  return { referrer: "", source: "direct" };
}

export function isSiteHost(host: string) {
  const normalized = normalizeHost(host);
  return normalized === SITE_HOST || normalized.endsWith(`.${SITE_HOST}`);
}

export function normalizeHost(host: string) {
  return host
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
}

export function trafficChannel(source: string): TrafficChannel {
  return CHANNEL_BY_SOURCE.get(source) ?? "referral";
}

function hostMatches(host: string, pattern: string) {
  if (pattern.endsWith(".*")) {
    const base = pattern.slice(0, -2).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|\\.)${base}(\\.[a-z]{2,3}){1,2}$`).test(host);
  }
  return host === pattern || host.endsWith(`.${pattern}`);
}
