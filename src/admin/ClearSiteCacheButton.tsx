import { ClearCacheButton } from "./ClearCacheButton";
import { clearSiteCache } from "./site";

export function ClearSiteCacheButton({
  onSessionExpired,
}: {
  onSessionExpired: () => void;
}) {
  return (
    <ClearCacheButton
      description="Species pages on reptiles.ge render fresh on their next visit. Species edited in the last 24 hours are refetched from the API."
      failure="The site cache could not be cleared. Try again in a minute."
      label="Clear site cache"
      onSessionExpired={onSessionExpired}
      run={async () => {
        const species = await clearSiteCache();
        return species.length === 0
          ? "Site cache cleared."
          : `Site cache cleared. ${species.length} recently edited species refetched.`;
      }}
      title="Clear the site cache?"
    />
  );
}
