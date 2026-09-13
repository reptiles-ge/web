export type SpeciesInlinePart =
  | { id: string; key: string; label: string; type: "species" }
  | { key: string; type: "text"; value: string };

const SPECIES_INLINE_LINK = /\[([^\]]+)\]\(([a-z0-9-]+)\)/g;

export function splitSpeciesInlineLinks(text: string): SpeciesInlinePart[] {
  const parts: SpeciesInlinePart[] = [];
  const pattern = new RegExp(SPECIES_INLINE_LINK.source, "g");
  let lastIndex = 0;
  let match: null | RegExpExecArray;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        key: `t:${lastIndex}`,
        type: "text",
        value: text.slice(lastIndex, match.index),
      });
    }
    parts.push({
      id: match[2],
      key: `s:${match.index}:${match[2]}`,
      label: match[1],
      type: "species",
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({
      key: `t:${lastIndex}`,
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  return parts.length > 0 ? parts : [{ key: "t:0", type: "text", value: text }];
}

export function stripSpeciesInlineLinks(text: string) {
  return text.replace(SPECIES_INLINE_LINK, "$1");
}
