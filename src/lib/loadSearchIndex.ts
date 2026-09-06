import type { AppLocale } from "@/i18n/routing";
import type { SearchDocument } from "@/lib/siteSearch";

export async function loadSearchDocuments(
  locale: AppLocale,
): Promise<SearchDocument[]> {
  switch (locale) {
    case "en":
      return (await import("@/data/search-index.en.generated")).searchDocuments;
    case "ru":
      return (await import("@/data/search-index.ru.generated")).searchDocuments;
    case "tr":
      return (await import("@/data/search-index.tr.generated")).searchDocuments;
    default:
      return (await import("@/data/search-index.ka.generated")).searchDocuments;
  }
}
