import type { AppLocale } from "@/i18n/routing";
import type { SearchDocument } from "@/lib/siteSearch";

export async function loadSearchDocuments(
  locale: AppLocale,
): Promise<SearchDocument[]> {
  const response = await fetch(`/api/search/${locale}`);
  if (!response.ok) {
    throw new Error(`Search index answered ${response.status}`);
  }
  return (await response.json()) as SearchDocument[];
}
