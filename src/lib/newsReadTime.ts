import type { NewsMark, NewsSection } from "@/data/newsTypes";

const NEWS_WORDS_PER_MINUTE = 150;

export function newsCopyReadMinutes(copy: {
  lead: string;
  sections: readonly NewsSection[];
  title: string;
}) {
  const texts = [copy.title, copy.lead];
  for (const section of copy.sections) {
    texts.push(section.heading);
    for (const block of section.blocks) {
      if (block.type === "p") texts.push(...block.parts.map(newsMarkText));
    }
  }
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / NEWS_WORDS_PER_MINUTE));
}

function newsMarkText(mark: NewsMark) {
  if (typeof mark === "string") return mark;
  return "label" in mark ? mark.label : mark.name;
}
