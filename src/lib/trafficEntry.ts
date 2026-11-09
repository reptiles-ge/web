import {
  CLICK_ID_PARAMS,
  type TrafficEntry,
  UTM_SOURCE_PATTERN,
} from "@/lib/pageViewInput";
import { isSiteHost, normalizeHost } from "@/lib/trafficSource";

const HOST_PATTERN = /^[a-z0-9-]+(?:\.[a-z0-9-]+)*$/;

export function readTrafficEntry({
  referrer,
  search,
  siteHost,
}: {
  referrer: string;
  search: string;
  siteHost: string;
}): TrafficEntry | undefined {
  const host = referrerHost(referrer);
  if (host && (isSiteHost(host) || host === normalizeHost(siteHost))) {
    return undefined;
  }
  const params = new URLSearchParams(search);
  const entry: TrafficEntry = {};
  if (host) entry.referrer = host;
  const utmSource = params
    .get("utm_source")
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  if (utmSource && UTM_SOURCE_PATTERN.test(utmSource)) {
    entry.utmSource = utmSource;
  }
  const clickId = CLICK_ID_PARAMS.find((name) => params.has(name));
  if (clickId) entry.clickId = clickId;
  return entry;
}

function referrerHost(referrer: string) {
  if (!referrer) return undefined;
  try {
    const host = normalizeHost(new URL(referrer).hostname);
    return HOST_PATTERN.test(host) && host.length <= 253 ? host : undefined;
  } catch {
    return undefined;
  }
}
