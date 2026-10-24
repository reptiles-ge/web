export function containsPattern(text: string | undefined) {
  return text ? `%${text.replace(/[\\%_]/g, "\\$&")}%` : null;
}
