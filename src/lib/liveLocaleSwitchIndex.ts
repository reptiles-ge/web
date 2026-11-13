import { cache } from "react";

import type { LocaleSwitchIndex } from "@/lib/localeSwitch";

import { getLocaleSwitchIndex } from "@/lib/localeSwitchData";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";
import { publishedSpeciesSlugRows } from "@/lib/speciesSlugTable";

export const getLiveLocaleSwitchIndex = cache(
  async (): Promise<LocaleSwitchIndex> => {
    try {
      return getLocaleSwitchIndex(await getSpeciesCatalog("ka"));
    } catch (error) {
      console.error(
        "Locale switch index fell back to the build-time slug table",
        error,
      );
      return getLocaleSwitchIndex(publishedSpeciesSlugRows());
    }
  },
);
