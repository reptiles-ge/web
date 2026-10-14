export const MIN_FEEDBACK_LENGTH = 3;
export const MAX_FEEDBACK_LENGTH = 1000;

export function needsFeedback(rating: number) {
  return rating < 5;
}

export function normalizeFeedback(value: unknown) {
  if (typeof value !== "string") return null;
  const text = value
    .replace(/\r\n?/g, "\n")
    .replace(
      /[\u0000-\u0009\u000B-\u001F\u007F-\u009F\u200B-\u200C\u200E\u200F\u2028-\u202E\u2060-\u2064\uFEFF]/g,
      "",
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if ([...text].length < MIN_FEEDBACK_LENGTH) return null;
  if ([...text].length > MAX_FEEDBACK_LENGTH) return null;
  return text;
}
