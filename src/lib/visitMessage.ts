import {
  sanitizeVisitPath,
  visitDeviceLabel,
  visitPlaceLabel,
  visitReferrerSource,
} from "@/lib/visitNotify";
import {
  displayVisitPath,
  visitLocaleFromPath,
  visitPageLabel,
} from "@/lib/visitPageLabel";

export function formatVisitMessage(input: {
  city?: null | string;
  country?: null | string;
  path: string;
  referrer?: string;
  userAgent?: null | string;
}) {
  const cleaned = sanitizeVisitPath(input.path) ?? displayVisitPath(input.path);
  const pathname = displayVisitPath(cleaned);
  const locale = visitLocaleFromPath(pathname).toUpperCase();
  const page = visitPageLabel(cleaned);
  const source = visitReferrerSource(input.referrer, cleaned);
  const lines = [`${visitSourceMark(source)} ახალი ვიზიტი · ${locale}`, ""];
  if (page) lines.push(`გვერდი: ${page}`);
  lines.push(`URL: ${pathname}`);
  const extra = [
    source ? `წყარო: ${source}` : undefined,
    placeLine(input.country, input.city),
    deviceLine(input.userAgent),
  ].filter((line): line is string => Boolean(line));
  if (extra.length) {
    lines.push("");
    lines.push(...extra);
  }
  return lines.join("\n");
}

function deviceLine(userAgent?: null | string) {
  const device = visitDeviceLabel(userAgent);
  return device ? `მოწყობილობა: ${device}` : undefined;
}

function placeLine(country?: null | string, city?: null | string) {
  const place = visitPlaceLabel(country, city);
  return place ? `ადგილი: ${place}` : undefined;
}

function visitSourceMark(source?: string) {
  if (!source) return "🔴";
  if (source === "Facebook") return "🔵";
  return "🟢";
}
