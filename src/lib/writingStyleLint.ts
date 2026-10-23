import matter from "gray-matter";

export interface StyleIssue {
  field: string;
  locale: StyleLocale;
  message: string;
  rule: string;
}

export type StyleLocale = "en" | "ka" | "ru" | "tr";

const BODY_FIELDS = [
  "interaction",
  "overview",
  "habitat",
  "diet",
  "behavior",
  "conservation",
];

const BANNED: Record<StyleLocale, string[]> = {
  en: [
    "it is worth noting",
    "it's worth noting",
    "it is important to note",
    "it's important to note",
    "interestingly",
    "notably",
    "plays a crucial role",
    "plays a vital role",
    "plays an important role",
    "fascinating",
    "remarkable",
    "delve",
    "in conclusion",
    "this atlas",
    "on this page",
  ],
  ka: [
    "მნიშვნელოვანია აღინიშნოს",
    "უნდა ითქვას",
    "უნდა აღინიშნოს",
    "აღსანიშნავია",
    "საინტერესოა, რომ",
    "თავის მხრივ",
    "როგორც უკვე აღვნიშნეთ",
    "როგორც ზემოთ ითქვა",
    "ზემოხსენებულ",
    "გააჩნია",
    "წარმოადგენს",
    "ხასიათდება",
    "ახასიათებს",
    "შეინიშნება",
    "ფიქსირდება",
    "მნიშვნელოვან როლს ასრულებს",
    "ერთ-ერთი ყველაზე საინტერესო",
    "ამ ატლასში",
    "ამ ატლასის",
    "ამ გვერდზე",
    "რუკაზე აღნიშნულია",
    "ჩანაწერებში მითითებულია",
  ],
  ru: [
    "стоит отметить",
    "важно отметить",
    "интересно, что",
    "играет важную роль",
    "в этом атласе",
    "на этой странице",
  ],
  tr: [
    "belirtmek gerekir ki",
    "ilginç bir şekilde",
    "önemli bir rol oynar",
    "büyüleyici",
    "bu atlasta",
    "bu sayfada",
  ],
};

const HEDGES: Partial<Record<StyleLocale, string[]>> = {
  en: ["usually", "often", "may", "sometimes", "about", "mostly", "mainly"],
  ka: [
    "ჩვეულებრივ",
    "ხშირად",
    "შეიძლება",
    "ზოგჯერ",
    "დაახლოებით",
    "უმეტესად",
    "ძირითადად",
  ],
};

const KA_HEDGES = [
  "ჩვეულებრივ",
  "შეიძლება",
  "დაახლოებით",
  "ზოგჯერ",
  "უმეტესად",
  "ძირითადად",
  "როგორც წესი",
  "სავარაუდოდ",
];

export function formatStyleIssues(issues: StyleIssue[]) {
  return issues
    .map(
      (issue) =>
        `- ${issue.locale} ${issue.field} [${issue.rule}]: ${issue.message}`,
    )
    .join("\n");
}

export function lintFieldStyle(
  text: string,
  field: string,
  locale: StyleLocale,
  commonName = "",
): StyleIssue[] {
  const issues: StyleIssue[] = [];
  const add = (rule: string, message: string) =>
    issues.push({ field, locale, message, rule });
  const lower = plain(text).toLowerCase();

  for (const phrase of BANNED[locale])
    if (lower.includes(phrase.toLowerCase()))
      add("R13", `banned phrase „${phrase}“`);

  if (locale !== "en" && /\d,\d{3}(?!\d)/.test(text))
    add("R14", "thousands written with a comma, e.g. 1,500; write 1500");

  if (/!/.test(plain(text).replace(/!\[/g, "")))
    add("R12", "exclamation mark in prose");

  if (field === "description" && /^[^\s:]{2,40}:\s/.test(plain(text)))
    add("R13", "description opens with a label and a colon");

  const paragraphs = text.split(/\n\s*\n|\n/).filter((p) => p.trim());
  const sentences = splitSentences(text);

  for (const sentence of sentences)
    if (wordCount(sentence) > 30)
      add("R3", `sentence over 30 words: „${sentence.slice(0, 80)}…“`);

  if (locale === "ka") {
    const stem = nameStem(commonName);
    if (stem) {
      const starts = sentences.map((sentence) => sentence.startsWith(stem));
      if (starts.some((start, index) => start && starts[index - 1]))
        add("R4", "two consecutive sentences start with the species name");
      const count = starts.filter(Boolean).length;
      if (sentences.length >= 4 && count * 3 > sentences.length + 2)
        add(
          "R4",
          `${count} of ${sentences.length} sentences start with the species name`,
        );
    }
    const hedges = KA_HEDGES.reduce(
      (sum, hedge) => sum + countOccurrences(text, hedge),
      0,
    );
    const budget = Math.max(2, Math.ceil(wordCount(text) / 30));
    if (hedges > budget)
      add("R5", `${hedges} hedge words for ${wordCount(text)} words`);
    for (const sentence of sentences) {
      const inSentence = KA_HEDGES.reduce(
        (sum, hedge) => sum + countOccurrences(sentence, hedge),
        0,
      );
      if (inSentence >= 3)
        add("R5", `stacked hedges: „${sentence.slice(0, 80)}…“`);
    }
  }

  if (BODY_FIELDS.includes(field) && paragraphs.length > 1)
    for (const paragraph of paragraphs)
      if (splitSentences(paragraph).length < 2)
        add("R8", `one-sentence paragraph: „${paragraph.slice(0, 80)}…“`);

  if (/^faq\.\d+\.answer$/.test(field) && sentences.length < 2)
    add("R8", "FAQ answer is a single sentence");

  return issues;
}

export function lintHedgeLoss(
  before: string,
  after: string,
  field: string,
  locale: StyleLocale,
): StyleIssue[] {
  const hedges = HEDGES[locale];
  if (!hedges) return [];
  const count = (text: string, hedge: string) =>
    locale === "en"
      ? (plain(text)
          .toLowerCase()
          .match(new RegExp(`\\b${hedge}\\b`, "g"))?.length ?? 0)
      : countOccurrences(plain(text), hedge);
  return hedges
    .filter((hedge) => count(after, hedge) < count(before, hedge))
    .map((hedge) => ({
      field,
      locale,
      message: `hedge „${hedge}“ was removed; keep it unless that claim carried it twice or it was stacked`,
      rule: "R5",
    }));
}

export function lintSpeciesStyle(raw: string, locale: StyleLocale) {
  const data = matter(raw).data as Record<string, unknown>;
  const commonName = typeof data.commonName === "string" ? data.commonName : "";
  return styleFields(data).flatMap((field) =>
    lintFieldStyle(fieldValue(data, field), field, locale, commonName),
  );
}

export function splitSentences(text: string) {
  const sentences: string[] = [];
  let current = "";
  const words = plain(text).split(/\s+/).filter(Boolean);
  for (const word of words) {
    current = current ? `${current} ${word}` : word;
    if (/[.!?]["“”»)]*$/.test(word) && !/^\p{Lu}\.$/u.test(word)) {
      sentences.push(current);
      current = "";
    }
  }
  if (current) sentences.push(current);
  return sentences;
}

function countOccurrences(text: string, phrase: string) {
  return text.split(phrase).length - 1;
}

function fieldValue(data: Record<string, unknown>, field: string) {
  let value: unknown = data;
  for (const key of field.split(".")) {
    if (value === null || typeof value !== "object") return "";
    value = (value as Record<string, unknown>)[key];
  }
  return typeof value === "string" ? value : "";
}

function nameStem(commonName: string) {
  const first = commonName.trim().split(/\s+/)[0] ?? "";
  return first.length > 3 ? first.replace(/[აეიოუ]$/, "") : first;
}

function plain(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
}

function styleFields(data: Record<string, unknown>) {
  const identification = data.identification as
    undefined | { traits?: unknown[] };
  const faq = Array.isArray(data.faq) ? data.faq : [];
  return [
    "description",
    ...BODY_FIELDS,
    "identification.summary",
    "identification.coloration",
    ...(identification?.traits ?? []).map(
      (_, index) => `identification.traits.${index}`,
    ),
    ...faq.map((_, index) => `faq.${index}.answer`),
  ].filter((field) => fieldValue(data, field).trim());
}

function wordCount(text: string) {
  return plain(text).split(/\s+/).filter(Boolean).length;
}
