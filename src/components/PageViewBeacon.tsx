"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import type { TrafficEntry } from "@/lib/pageViewInput";

import { useLocaleSwitchIndex } from "@/components/LocaleSwitchProvider";
import { usePathname } from "@/i18n/navigation";
import { sendPageView } from "@/lib/pageViewBeacon";
import { contentViewForPath } from "@/lib/pageViewPath";
import { pageViewPath } from "@/lib/pageViewTarget";
import { siteDay } from "@/lib/siteTime";
import { readTrafficEntry } from "@/lib/trafficEntry";

const PAGE_PREFIX = "reptiles:page-viewed:";
const ENTRY_PREFIX = "reptiles:entry:";

let landingRead = false;

export function PageViewBeacon({ apiOrigin }: { apiOrigin: string }) {
  const switchIndex = useLocaleSwitchIndex();
  const pathname = usePathname();
  const locale = useLocale();
  const params = useParams();
  const slug = stringParam(params.slug);
  const id = stringParam(params.id);
  const page = stringParam(params.page);

  useEffect(() => {
    if (navigator.webdriver) return;
    const path = pageViewPath(switchIndex, pathname, locale, {
      id,
      page,
      slug,
    });
    if (!path) return;
    const entry = takeLandingEntry();
    const today = siteDay(new Date());
    const counted = contentViewForPath(path) !== undefined;
    const pageKey = `${PAGE_PREFIX}${path}`;
    const entryKey = entry ? `${ENTRY_PREFIX}${JSON.stringify(entry)}` : null;
    const pageSeen = !counted || readStored(pageKey) === today;
    const entrySeen = entryKey === null || readStored(entryKey) === today;
    if (pageSeen && entrySeen) return;
    if (counted) writeStored(pageKey, today);
    if (entryKey) writeStored(entryKey, today);
    sendPageView(apiOrigin, {
      ...(entry && !entrySeen ? { entry } : {}),
      locale,
      path,
    });
  }, [apiOrigin, id, locale, page, pathname, slug, switchIndex]);

  return null;
}

function readStored(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function stringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function takeLandingEntry(): TrafficEntry | undefined {
  if (landingRead) return undefined;
  landingRead = true;
  return readTrafficEntry({
    referrer: document.referrer,
    search: window.location.search,
    siteHost: window.location.hostname,
  });
}

function writeStored(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}
