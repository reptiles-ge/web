export function speciesNameWithScientific(
  commonName: string,
  scientificName: string,
) {
  const common = commonName.trim();
  const scientific = scientificName.trim();
  if (!common) return scientific;
  if (!scientific || common.toLowerCase() === scientific.toLowerCase()) {
    return common;
  }
  return `${common} (${scientific})`;
}
