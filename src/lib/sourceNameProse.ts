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
      /\b(?:SABUKO|NPLG|NFA|NACRES|BirdLife|AmphibiaWeb|EPPO|NCDC|BRC|IOC|eBird|Reptile Database|Amphibian Species of the World|Mammal Species of the World)\b/,
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
