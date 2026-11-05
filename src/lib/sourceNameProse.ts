const NON_TEXT_KEYS = new Set([
  "audio",
  "danger",
  "dateModified",
  "datePublished",
  "family",
  "fieldRecords",
  "gallery",
  "genus",
  "id",
  "image",
  "imageCredit",
  "mobileImage",
  "mobileImageCredit",
  "scientificName",
  "sources",
]);

const NOT_SOURCE_WORDS =
  "IUCN|CITES|CR|EN|VU|NT|LC|DD|Concern|Threatened|Endangered|Vulnerable|List|Liste|Listesi|Red|Range|Sırası|Vashlovani|Kvabiskhevi|Abkhazia";

const SOURCE_NAME_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "et al.", pattern: /\bet al\b/i },
  { label: "ve ark.", pattern: /\bve (?:ark|diğ)\./i },
  { label: "и др.", pattern: /[А-ЯЁA-Z][\p{L}-]+ и др\./u },
  {
    label: "X და სხვ.",
    pattern: /[A-Z][\p{L}-]+(?:-ი)? და (?:სხვ(?:\.|ებ)|თანაავტორ)/u,
  },
  {
    label: "X and co-authors",
    pattern:
      /[A-ZА-ЯЁ][\p{L}-]+ (?:and (?:co-?authors|colleagues)|и (?:соавтор|коллеги)|ve (?:ekibi|ortak yazar|çalışma arkadaş|arkadaşları|meslektaşları))/u,
  },
  {
    label: "Surname (YYYY)",
    pattern: new RegExp(
      `\\b(?!(?:${NOT_SOURCE_WORDS})(?![\\p{L}]))[A-Z][\\p{L}'’-]+(?: (?:and|&|и|ve|და) [A-Z][\\p{L}'’-]+)?,? \\(\\d{4}[a-z]?\\)`,
      "u",
    ),
  },
  {
    label: "Surname YYYY",
    pattern: new RegExp(
      `\\b(?!(?:${NOT_SOURCE_WORDS})(?![\\p{L}]))[A-Z][\\p{Ll}'’-]+(?:-სა)? (?:and|и|ve|და) [A-Z][\\p{Ll}'’-]+(?:-ის)? \\d{4}\\b`,
      "u",
    ),
  },
  {
    label: "named organisation",
    pattern:
      /\b(?:SABUKO|NPLG|NFA|NACRES|BirdLife|AmphibiaWeb|EPPO|NCDC|BRC|IOC|eBird|Reptile Database|Amphibian Species of the World|Mammal Species of the World|Owl Pages|Peregrine Fund|Birds of the World|Avibase)\b/,
  },
  {
    label: "annotated checklist",
    pattern:
      /\bannotated checklist\b|ანოტირებული ჩამონათვალ|[Аа]ннотированн\p{L}* чек-лист|açıklamalı kontrol listesi/u,
  },
  {
    label: "checklist code",
    pattern:
      /\bYR-R\b|\b(?:BB|M|WV); (?:M|WV)\b|\((?:BB|M|WV|Cas|ND)\)|(?:\bcodes?|კოდი|\bкод|\bkod) [A-H]\b|\((?:A|H)\)/u,
  },
  {
    label: "checklist quality grade",
    pattern:
      /\b(?:occurrence|data|seasonality) quality\b|(?:არსებობის|მონაცემის|მონაცემთა|სეზონურობის მონაცემის) ხარისხი|качество (?:данных|встречаемости|сезонности)|(?:veri|bulunuş|görülme|oluşum|mevsimsellik) (?:niteliği|kalitesi)/iu,
  },
  {
    label: "according to X",
    pattern:
      /\b(?:according to|as reported by|as noted by|as described by) (?!IUCN\b)[A-Z]/,
  },
  {
    label: "по данным X",
    pattern:
      /(?:по данным|согласно|как указывает|как отмечает) (?!IUCN\b)[A-ZА-ЯЁ]/,
  },
  {
    label: "X'e göre",
    pattern: new RegExp(
      `\\b(?!(?:${NOT_SOURCE_WORDS})(?![\\p{L}]))[A-Z][\\p{L}.]*(?: \\d{4})?['’][\\p{Ll}]+ göre\\b(?! daha)`,
      "u",
    ),
  },
  {
    label: "X-ის მიხედვით",
    pattern: new RegExp(
      `(?<![\\p{L}])(?!(?:${NOT_SOURCE_WORDS})(?![\\p{L}]))[A-Z][\\p{L}.]*(?: \\d{4})?(?:-ის|-ს)? (?:მიხედვით|მონაცემებით)`,
      "u",
    ),
  },
  {
    label: "IUCN lists",
    pattern:
      /\b(?:[Aa]ccording to|[Pp]er) (?:the )?(?:\d{4} )?IUCN\b|\bIUCN (?:data\b|Cat Specialist|(?:currently |globally |also |now |still )?(?:lists|listed|assesses|assessed|classifies|classified|gives|gave|cites|accepts?|considers|treats|records|maps|ranks|rates|notes|says|has|have|puts|places|counts|describes|includes|shows)\b)/,
  },
  {
    label: "IUCN-ის მიხედვით",
    pattern:
      /IUCN(?:-ის)?(?: [^\s,.;:()]+){0,3} (?:მიხედვით|მონაცემებით|შეფასებით)|IUCN-ის მონაცემებ|IUCN-(?:ით|ს|მა)(?![\p{L}])|IUCN (?!წითელ)(?:[^\s.;:]+ ){0,5}?(?:აფასებს|ასახელებს|უთითებს|მიუთითებს|იღებს|მიიჩნევს|აღნიშნავს|წერს)/u,
  },
  {
    label: "МСОП относит",
    pattern:
      /(?<![\p{L}])(?:[Пп]о|[Сс]огласно) (?:(?:глобальной |мировой )?оценк[еи] |данным )?(?:МСОП|IUCN)|данн\p{L}* (?:МСОП|IUCN)|(?:МСОП|IUCN)(?: \p{Ll}+){0,3}? (?:не )?(?:относит|отнёс|отнес|указывает|указал|оценивает|оценивал|оценил|принимают|принимает|даёт|дает|считает|приводит|включает|рассматривает|картирует|говорит)(?![\p{L}])|IUCN Cat Specialist/u,
  },
  {
    label: "IUCN’ye göre",
    pattern:
      /IUCN['’](?:y?e) göre|IUCN['’]n[iı]n (?:[\p{L}\d]+ ){0,3}değerlendirmesine göre|IUCN (?:[\p{L}\d]+ ){0,2}(?:değerlendirmesine|verilerine) göre|IUCN verilerinde|\bIUCN(?: ise)?,? (?!Kırmızı|[Kk]ategori|statü|tarafından|değerlendirme(?:si|leri|sinde|lerin))(?:(?:[^\s.;:]|\.(?=\d))+ ){0,12}?(?:listeler|değerlendir(?!il|mes)\p{L}*|gösterir|kabul eder|sınıflandırır|verir|belirtir|anar|haritalar|diyor\p{L}*)(?![\p{L}])/u,
  },
  {
    label: "as of YYYY",
    pattern:
      /\b(?:[Aa]ccording to|[Aa]s of) \d{4} data\b|\d{4} წლის მონაცემებით|[Пп]о данным (?:на )?\d{4}|\b\d{4}(?: yılı)? verilerine göre/u,
  },
  {
    label: "X აღნიშნავს",
    pattern: new RegExp(
      `(?<![\\p{L}])(?!(?:${NOT_SOURCE_WORDS})(?![\\p{L}]))[A-Z][\\p{L}.]*(?: \\d{4})? (?:აღნიშნავს|წერს|მიუთითებს|ასახელებს)`,
      "u",
    ),
  },
];

// Framing that makes a study, list, source or photo the subject of the
// sentence. Live records still carry many of these, so only drafts are
// stopped from adding new ones (addedSourceFraming).
const SOURCE_FRAMING_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  {
    label: "according to studies",
    pattern:
      /\b(?:according to|as shown by) (?:the )?(?:studies|research|surveys|sources|data)\b|(?:კვლევების|წყაროების) მიხედვით|(?:[Пп]о данным|[Сс]огласно) (?:исследовани|источник|опрос)\p{L}*|(?:araştırmalara|çalışmalara|kaynaklara) göre/iu,
  },
  {
    label: "sources mention",
    pattern:
      /\b[Ss]ources?\b(?: [^\s.;:]+){0,5} (?:also )?(?:mention|mentions|report|reports|note|notes|say|says|state|states|describe|describes)\b|წყაროებ(?:ი|ში)(?: [^\s.;:]+){0,5} (?:ასევე )?(?:მოიხსენიებ|იხსენიებ|აღნიშნავ|აღნიშნულ|ასახელებ)|(?:(?<![\p{L}])[Вв] (?:\p{L}+ ){0,2}источниках|(?<![\p{L}])[Ии]сточник(?:и)?(?![\p{L}]))(?: [^\s.;:]+){0,5} (?:также )?(?:упомина|сообща|отмеча|указыва)\p{L}*|[Kk]aynak\p{L}*(?: [^\s.;:]+){0,5} (?:da )?(?:anılır|anar|anıyor|bahsed\p{L}*|belirt\p{L}*|söz ed\p{L}*)(?![\p{L}])/u,
  },
  {
    label: "a list identifies",
    pattern:
      /\b[Aa] (?:\d{4} )?(?:list|checklist|study|survey|report) (?:identifies|names|lists|records|reports|notes|mentions|confirms)\b|\d{4} წლის (?:სია|ჩამონათვალი|კვლევა)(?:ში)? (?:ასახელებს|აღნიშნავს|ადასტურებს)|(?:[Сс]писок|[Чч]ек-лист|[Ии]сследование) \d{4} года (?:называет|указывает|отмечает|подтверждает)|\d{4} (?:listesi|kontrol listesi|çalışması) [^\s.;:]+(?:yı|yi|yu|yü|ı|i|u|ü) (?:belirtir|adlandırır|listeler|doğrular)/u,
  },
  {
    label: "a photograph confirms",
    pattern:
      /\b[Aa] (?:photo|photograph|recording) confirms\b|\bconfirmed by a (?:photo|photograph|recording)\b|ფოტოთი(?:ც)? (?:არის )?დადასტურებ|подтвержден\p{L}* фотографией|fotoğrafla (?:da )?doğrulan/u,
  },
];

export type SourceNameHit = {
  field: string;
  label: string;
  match: string;
};

type SpeciesTexts = {
  base: unknown;
  translations?: Partial<Record<string, unknown>>;
};

export function addedSourceFraming(
  previous: null | SpeciesTexts,
  next: SpeciesTexts,
): SourceNameHit[] {
  // List positions are left out, so deleting or reordering FAQ items, facts
  // or traits does not turn framing already there into "added" framing.
  const key = (hit: SourceNameHit) =>
    `${hit.field.replace(/\[\d+\]/g, "[]")} ${hit.match}`;
  const before = new Map<string, number>();
  for (const hit of previous ? sourceFramingInRecord(previous) : []) {
    before.set(key(hit), (before.get(key(hit)) ?? 0) + 1);
  }
  return sourceFramingInRecord(next).filter((hit) => {
    const left = before.get(key(hit)) ?? 0;
    if (left === 0) return true;
    before.set(key(hit), left - 1);
    return false;
  });
}

export function findSourceFraming(text: string) {
  return SOURCE_FRAMING_PATTERNS.flatMap(({ label, pattern }) =>
    [...text.matchAll(new RegExp(pattern.source, `${pattern.flags}g`))].map(
      (match) => ({ label, match: match[0] }),
    ),
  );
}

export function findSourceNames(text: string) {
  return matchPatterns(SOURCE_NAME_PATTERNS, text);
}

export function findSourceNamesInFields(
  value: unknown,
  field = "",
): SourceNameHit[] {
  return walkFields(value, field, findSourceNames);
}

export function findSourceNamesInRecord(record: SpeciesTexts) {
  return [
    ["ka", record.base] as const,
    ...Object.entries(record.translations ?? {}),
  ].flatMap(([locale, texts]) =>
    findSourceNamesInFields(texts).map((hit) => ({
      ...hit,
      field: `${locale}.${hit.field}`,
    })),
  );
}

export function sourceFramingInRecord(record: SpeciesTexts) {
  return [
    ["ka", record.base] as const,
    ...Object.entries(record.translations ?? {}),
  ].flatMap(([locale, texts]) =>
    walkFields(texts, "", findSourceFraming).map((hit) => ({
      ...hit,
      field: `${locale}.${hit.field}`,
    })),
  );
}

function matchPatterns(
  patterns: Array<{ label: string; pattern: RegExp }>,
  text: string,
) {
  const hits: Array<Omit<SourceNameHit, "field">> = [];
  for (const { label, pattern } of patterns) {
    const match = text.match(pattern);
    if (match) hits.push({ label, match: match[0] });
  }
  return hits;
}

function walkFields(
  value: unknown,
  field: string,
  find: (text: string) => Array<Omit<SourceNameHit, "field">>,
): SourceNameHit[] {
  if (typeof value === "string") {
    return find(value).map((hit) => ({ ...hit, field }));
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      walkFields(item, `${field}[${index}]`, find),
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      field === "" && NON_TEXT_KEYS.has(key)
        ? []
        : walkFields(item, field ? `${field}.${key}` : key, find),
    );
  }
  return [];
}
