export function countryCode(value: string | undefined) {
  return value && /^[A-Z]{2}$/.test(value) && value !== "XX" ? value : null;
}
