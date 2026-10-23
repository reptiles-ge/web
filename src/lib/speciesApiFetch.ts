const SPECIES_REVALIDATE_SECONDS = 3600;

export function speciesFetchOptions(tags: string[]) {
  return {
    init: { next: { revalidate: SPECIES_REVALIDATE_SECONDS, tags } },
  };
}
