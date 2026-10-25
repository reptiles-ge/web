import type { AppLocale } from "@/i18n/routing";

const PAGE_TALK_PATTERNS: Record<AppLocale, RegExp[]> = {
  en: [
    /\b(?:on|in|from|for) this (?:page|profile|atlas)\b/i,
    /\bthis (?:page|profile|atlas) (?:does|doesn't|has|is|lists|uses|shows|gives|treats|names)\b/i,
    /\bnot (?:given|listed|tabulated|published|reproduced|shown|mapped) (?:on this page|here)\b/i,
    /\bthe (?:atlas|page's|profile's) map\b/i,
    /\bthe map (?:on this page|below)\b/i,
    /\brecords?[- ]by[- ]region table\b/i,
    /\bthe records table\b/i,
    /\bsources used (?:on|for|in) this\b/i,
  ],
  ka: [
    /ამ (?:გვერდ|პროფილ|ატლას)/u,
    /(?:^|[\s„(])ეს (?:გვერდი|პროფილი|ატლასი)/u,
    /ატლასის რუკ/u,
    /რუკის „?ჩანაწერები რეგიონების მიხედვით/u,
    /რუკის ცხრილ/u,
  ],
  ru: [
    /(?:на|в|по|из) (?:этой|данной) страниц/iu,
    /(?:^|\s)эта страница/iu,
    /(?:в|на|по|из) этом(?:у)? (?:профил|атлас)/iu,
    /(?:^|\s)этот (?:профиль|атлас)/iu,
    /карт[аеуы] атласа/iu,
    /таблиц[аеуы] «?записи по регионам/iu,
  ],
  tr: [
    /\bbu (?:sayfa|profil|atlas)/iu,
    /haritanın kayıt tablosu/iu,
    /bölgelere göre kayıt(?:lar)? tablosu/iu,
  ],
};

const TEXT_FIELDS = [
  "behavior",
  "commonName",
  "conservation",
  "description",
  "diet",
  "facts",
  "faq",
  "habitat",
  "identification",
  "interaction",
  "location",
  "overview",
  "stats",
] as const;

export type PageTalkHit = {
  field: string;
  locale: AppLocale;
  match: string;
};

type LocaleTexts = Partial<Record<(typeof TEXT_FIELDS)[number], unknown>>;

type RecordTexts = {
  base: LocaleTexts;
  translations?: Partial<Record<Exclude<AppLocale, "ka">, LocaleTexts>>;
};

export function addedPageTalk(
  previous: null | RecordTexts,
  next: RecordTexts,
): PageTalkHit[] {
  const before = new Map<string, number>();
  for (const hit of previous ? findPageTalkInRecord(previous) : []) {
    const key = `${hit.locale} ${hit.field} ${hit.match}`;
    before.set(key, (before.get(key) ?? 0) + 1);
  }
  return findPageTalkInRecord(next).filter((hit) => {
    const key = `${hit.locale} ${hit.field} ${hit.match}`;
    const left = before.get(key) ?? 0;
    if (left === 0) return true;
    before.set(key, left - 1);
    return false;
  });
}

export function findPageTalk(text: string, locale: AppLocale) {
  const matches = PAGE_TALK_PATTERNS[locale]
    .flatMap((pattern) => [
      ...text.matchAll(new RegExp(pattern.source, `${pattern.flags}g`)),
    ])
    .map((match) => ({ end: match.index + match[0].length, match }))
    .sort((a, b) => a.match.index - b.match.index || b.end - a.end);
  const kept: string[] = [];
  let reached = -1;
  for (const { end, match } of matches) {
    if (match.index < reached) continue;
    kept.push(match[0].trim());
    reached = end;
  }
  return kept;
}

export function findPageTalkInRecord(record: RecordTexts): PageTalkHit[] {
  const locales: Array<[AppLocale, LocaleTexts | undefined]> = [
    ["ka", record.base],
    ["en", record.translations?.en],
    ["ru", record.translations?.ru],
    ["tr", record.translations?.tr],
  ];
  return locales.flatMap(([locale, texts]) =>
    TEXT_FIELDS.flatMap((field) =>
      textsIn(texts?.[field], field).flatMap(([path, text]) =>
        findPageTalk(text, locale).map((match) => ({
          field: path,
          locale,
          match,
        })),
      ),
    ),
  );
}

function textsIn(value: unknown, path: string): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => textsIn(item, `${path}.${index}`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      textsIn(item, `${path}.${key}`),
    );
  }
  return [];
}
