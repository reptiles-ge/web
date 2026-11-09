const COUNTRY_NAMES = new Intl.DisplayNames(["en"], { type: "region" });

const FLAG_OFFSET = 0x1f1e6 - "A".charCodeAt(0);

export function countryLabel(code: null | string) {
  if (!code) return "Unknown";
  const flag = String.fromCodePoint(
    ...[...code].map((letter) => letter.charCodeAt(0) + FLAG_OFFSET),
  );
  return `${flag} ${COUNTRY_NAMES.of(code) ?? code}`;
}
