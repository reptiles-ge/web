import { api } from "./apiClient";
import { SessionExpiredError } from "./species";

export async function clearSiteCache(): Promise<string[]> {
  const response = await api.v1.admin.site.revalidate.$post();
  const status: number = response.status;
  if (status === 401 || status === 403) throw new SessionExpiredError();
  if (!response.ok) throw new Error(`Site cache clear failed: ${status}`);
  return (await response.json()).data.species;
}
