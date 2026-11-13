export function defined<T>(value: null | T | undefined, label = "value"): T {
  if (value === undefined || value === null) {
    throw new Error(`Expected ${label} to be defined`);
  }
  return value;
}
