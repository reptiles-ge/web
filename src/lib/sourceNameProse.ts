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

export type SourceNameHit = {
  field: string;
  label: string;
  match: string;
};

export function findSourceNames(text: string) {
  const hits: Array<Omit<SourceNameHit, "field">> = [];
  for (const { label, pattern } of SOURCE_NAME_PATTERNS) {
    const match = text.match(pattern);
    if (match) hits.push({ label, match: match[0] });
  }
  return hits;
}

export function findSourceNamesInFields(
  value: unknown,
  field = "",
): SourceNameHit[] {
  if (typeof value === "string") {
    return findSourceNames(value).map((hit) => ({ ...hit, field }));
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      findSourceNamesInFields(item, `${field}[${index}]`),
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      field === "" && NON_TEXT_KEYS.has(key)
        ? []
        : findSourceNamesInFields(item, field ? `${field}.${key}` : key),
    );
  }
  return [];
}
