const TOP_LEVEL_KEY = /^[A-Za-z][A-Za-z0-9]*:/;

export type FrontmatterRange = { end: number; start: number };

export function topLevelRangeFrom(
  lines: string[],
  start: number,
): FrontmatterRange | null {
  if (start === -1) return null;
  let end = start + 1;
  while (end < lines.length) {
    const line = lines[end];
    if (line.trim() === "") {
      end += 1;
      continue;
    }
    if (TOP_LEVEL_KEY.test(line) || /^---\s*$/.test(line)) break;
    end += 1;
  }
  return { end, start };
}
