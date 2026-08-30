export type SpeciesInlinePart =
  | { type: "text"; value: string }
  | { type: "species"; id: string; label: string };

const SPECIES_INLINE_LINK = /\[([^\]]+)\]\(([a-z0-9-]+)\)/g;

export function stripSpeciesInlineLinks(text: string) {
  return text.replace(SPECIES_INLINE_LINK, "$1");
}

export function splitSpeciesInlineLinks(text: string): SpeciesInlinePart[] {
  const parts: SpeciesInlinePart[] = [];
  const pattern = new RegExp(SPECIES_INLINE_LINK.source, "g");
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: "species", id: match[2], label: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}
