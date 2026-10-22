const GENERIC_SOURCE_NAMES = new Set(["scientific publications"]);

export function sourcesAreValid(
  sources: Array<{ name: string; url?: string }> | undefined,
): boolean {
  if (!sources || sources.length === 0) return false;
  const named = sources.filter((source) => source.name.trim());
  if (named.length === 0) return false;
  const allGenericWithoutUrl = named.every((source) => {
    const generic = GENERIC_SOURCE_NAMES.has(source.name.trim().toLowerCase());
    return generic && !source.url?.trim();
  });
  return !allGenericWithoutUrl;
}
