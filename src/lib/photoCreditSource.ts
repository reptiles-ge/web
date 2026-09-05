const PHOTO_CREDIT_HOSTS: Array<{ match: RegExp; name: string }> = [
  { match: /(^|\.)commons\.wikimedia\.org$/i, name: "Wikimedia Commons" },
  { match: /(^|\.)wikipedia\.org$/i, name: "Wikipedia" },
  { match: /(^|\.)(facebook|fb)\.com$/i, name: "Facebook" },
  { match: /(^|\.)instagram\./i, name: "Instagram" },
  { match: /(^|\.)inaturalist\.org$/i, name: "iNaturalist" },
  { match: /(^|\.)xeno-canto\.org$/i, name: "xeno-canto" },
  { match: /(^|\.)flickr\./i, name: "Flickr" },
  { match: /(^|\.)ebird\.org$/i, name: "eBird" },
];

export function photoCreditSourceLabel(url?: string): string | undefined {
  const value = url?.trim();
  if (!value) return undefined;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return undefined;
    }
    const host = parsed.hostname.replace(/^www\./i, "");
    if (!host) return undefined;
    for (const entry of PHOTO_CREDIT_HOSTS) {
      if (entry.match.test(host)) return entry.name;
    }
    return host;
  } catch {
    return undefined;
  }
}
