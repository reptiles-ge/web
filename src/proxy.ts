import { getSpeciesHubId, getSpeciesPublicSlug, resolveSpecies, resolveSpeciesInHub } from "@/lib/speciesRoutes";
import type { GroupHubId } from "@/lib/groupHubs";
import { isPrefixedLocale, type PrefixedLocale } from "@/i18n/localeMeta";
import { routing, type AppLocale } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const KA_HUB: Record<GroupHubId, string> = {
  snakes: "gvelebi",
  lizards: "xvlikebi",
  turtles: "kuebi",
  amphibians: "amfibiebi",
  birds: "prinvelebi",
  mammals: "dzuzumtsovrebi",
  spiders: "obobebi",
};

const KA_PREFIX_TO_HUB: Record<string, GroupHubId> = {
  gvelebi: "snakes",
  xvlikebi: "lizards",
  kuebi: "turtles",
  amfibiebi: "amphibians",
  prinvelebi: "birds",
  dzuzumtsovrebi: "mammals",
  obobebi: "spiders",
};

const HUB_SEGMENT = "snakes|lizards|turtles|amphibians|birds|mammals|spiders";
const KA_HUB_SEGMENT =
  "gvelebi|xvlikebi|kuebi|amfibiebi|prinvelebi|dzuzumtsovrebi|obobebi";
const PREFIX_SEGMENT = "en|ru|tr";

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, 301);
}

function speciesPath(locale: AppLocale, id: string) {
  const hub = getSpeciesHubId(id);
  const slug = getSpeciesPublicSlug(id, locale);
  if (locale === "ka") return `/${KA_HUB[hub]}/${slug}`;
  return `/${locale}/${hub}/${slug}`;
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  if (pathname === "/ka" || pathname.startsWith("/ka/")) {
    return redirectTo(request, pathname.slice(3) || "/");
  }

  const legacy = pathname.match(
    new RegExp(`^(\\/(${PREFIX_SEGMENT}))?\\/species\\/([^/]+)$`),
  );
  if (legacy) {
    const species = resolveSpecies(legacy[3]);
    if (species) {
      const locale = (legacy[2] ?? "ka") as AppLocale;
      return redirectTo(request, speciesPath(locale, species.id));
    }
  }

  const unprefixedLatinHub = pathname.match(
    new RegExp(`^\\/(${HUB_SEGMENT})\\/([^/]+)$`),
  );
  if (unprefixedLatinHub) {
    const species = resolveSpeciesInHub(
      unprefixedLatinHub[1] as GroupHubId,
      unprefixedLatinHub[2],
    );
    if (species) {
      const next = speciesPath("ka", species.id);
      if (next !== pathname) return redirectTo(request, next);
    }
  }

  const prefixedKaHub = pathname.match(
    new RegExp(`^\\/(${PREFIX_SEGMENT})\\/(${KA_HUB_SEGMENT})\\/([^/]+)$`),
  );
  if (prefixedKaHub && isPrefixedLocale(prefixedKaHub[1])) {
    const locale = prefixedKaHub[1] as PrefixedLocale;
    const species = resolveSpeciesInHub(
      KA_PREFIX_TO_HUB[prefixedKaHub[2]],
      prefixedKaHub[3],
    );
    if (species) {
      const next = speciesPath(locale, species.id);
      if (next !== pathname) return redirectTo(request, next);
    }
  }

  const prefixedHub = pathname.match(
    new RegExp(`^\\/(${PREFIX_SEGMENT})\\/(${HUB_SEGMENT})\\/([^/]+)$`),
  );
  if (prefixedHub && isPrefixedLocale(prefixedHub[1])) {
    const locale = prefixedHub[1] as PrefixedLocale;
    const species = resolveSpeciesInHub(
      prefixedHub[2] as GroupHubId,
      prefixedHub[3],
    );
    if (species) {
      const next = speciesPath(locale, species.id);
      if (next !== pathname) return redirectTo(request, next);
    }
  }

  const kaHub = pathname.match(
    new RegExp(`^\\/(${KA_HUB_SEGMENT})\\/([^/]+)$`),
  );
  if (kaHub) {
    const species = resolveSpeciesInHub(
      KA_PREFIX_TO_HUB[kaHub[1]],
      kaHub[2],
    );
    if (species) {
      const next = speciesPath("ka", species.id);
      if (next !== pathname) return redirectTo(request, next);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
