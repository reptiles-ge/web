export type FaqEntry = { answer: string; question: string };

const MARKDOWN_LINK = /!?\[([^\]]*)\]\([^)]*\)/g;
const MARKDOWN_BOLD = /(\*\*|__)(?=\S)([\s\S]*?\S)\1/g;
const MARKDOWN_ITALIC_STAR =
  /(^|[^\p{L}\p{N}*])\*(?=\S)([^*\n]*?\S)\*(?![\p{L}\p{N}*])/gu;
const MARKDOWN_ITALIC_UNDERSCORE =
  /(^|[^\p{L}\p{N}_])_(?=\S)([^_\n]*?\S)_(?![\p{L}\p{N}_])/gu;
const MARKDOWN_CODE = /`([^`]*)`/g;

const FIRST_AID_STEP = new RegExp(
  [
    String.raw`\blie (?:them )?down\b`,
    String.raw`\bas still as possible\b`,
    String.raw`\bkeep (?:them|the person) from moving\b`,
    String.raw`\bdo not cut\b`,
    String.raw`\bsuck (?:out|the)\b`,
    String.raw`\btourniquet`,
    String.raw`\btie anything\b`,
    String.raw`\btight bandage\b`,
    String.raw`\bwash the (?:wound|bite)\b`,
    "დააწვინეთ",
    "ნაკლებად იმოძრაოს",
    "არ გაჭრათ",
    "ამოწოვ",
    "გამოწოვ",
    "ლახტ",
    "სახვევ",
    "ჭრილობა[^.]*(?:ჩამოიბანეთ|დაიბანეთ)",
    "уложите",
    "меньше двигал",
    "не разрезайте",
    "отсас",
    "высас",
    "жгут",
    "тугую повязку",
    "промойте рану",
    "yatırın",
    "az hareket etmesini",
    "kesmeyin",
    "zehri em",
    "turnike",
    "bandaj",
    "yarayı[^.]*yıkayın",
  ].join("|"),
  "iu",
);

export function faqPageJsonLd(entries: readonly FaqEntry[]) {
  const mainEntity = schemaFaqEntries(entries).map((entry) => ({
    "@type": "Question" as const,
    acceptedAnswer: { "@type": "Answer" as const, text: entry.answer },
    name: entry.question,
  }));
  if (mainEntity.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export function givesFirstAidSteps(answer: string) {
  return FIRST_AID_STEP.test(answer);
}

export function schemaFaqEntries(entries: readonly FaqEntry[]) {
  return entries.flatMap((entry) => {
    const question = schemaPlainText(entry.question);
    const answer = schemaPlainText(entry.answer);
    if (!question || !answer || givesFirstAidSteps(answer)) return [];
    return [{ answer, question }];
  });
}

export function schemaPlainText(text: string) {
  return text
    .replace(MARKDOWN_LINK, "$1")
    .replace(MARKDOWN_BOLD, "$2")
    .replace(MARKDOWN_ITALIC_STAR, "$1$2")
    .replace(MARKDOWN_ITALIC_UNDERSCORE, "$1$2")
    .replace(MARKDOWN_CODE, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
