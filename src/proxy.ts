import { routing } from "@/i18n/routing";
import type { GroupHubId } from "@/lib/groupHubs";
import {
  getSpeciesHubId,
  getSpeciesPublicSlug,
  resolveSpecies,
  resolveSpeciesInHub,
} from "@/lib/speciesRoutes";
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
};

const KA_PREFIX_TO_HUB: Record<string, GroupHubId> = {
  gvelebi: "snakes",
  xvlikebi: "lizards",
  kuebi: "turtles",
  amfibiebi: "amphibians",
  prinvelebi: "birds",
  dzuzumtsovrebi: "mammals",
};

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, 301);
}

function kaSpeciesPath(id: string) {
  const hub = getSpeciesHubId(id);
  return `/${KA_HUB[hub]}/${getSpeciesPublicSlug(id, "ka")}`;
}

function enSpeciesPath(id: string) {
  const hub = getSpeciesHubId(id);
  return `/en/${hub}/${getSpeciesPublicSlug(id, "en")}`;
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  if (pathname === "/ka" || pathname.startsWith("/ka/")) {
    return redirectTo(request, pathname.slice(3) || "/");
  }

  const legacy = pathname.match(/^(\/en)?\/species\/([^/]+)$/);
  if (legacy) {
    const species = resolveSpecies(legacy[2]);
    if (species) {
      return redirectTo(
        request,
        legacy[1] ? enSpeciesPath(species.id) : kaSpeciesPath(species.id),
      );
    }
  }

  const enHub = pathname.match(
    /^\/(snakes|lizards|turtles|amphibians|birds|mammals)\/([^/]+)$/,
  );
  if (enHub) {
    const species = resolveSpeciesInHub(enHub[1] as GroupHubId, enHub[2]);
    if (species) {
      const next = kaSpeciesPath(species.id);
      if (next !== pathname) return redirectTo(request, next);
    }
  }

  const enKa = pathname.match(
    /^\/en\/(gvelebi|xvlikebi|kuebi|amfibiebi|prinvelebi|dzuzumtsovrebi)\/([^/]+)$/,
  );
  if (enKa) {
    const species = resolveSpeciesInHub(KA_PREFIX_TO_HUB[enKa[1]], enKa[2]);
    if (species) {
      const next = enSpeciesPath(species.id);
      if (next !== pathname) return redirectTo(request, next);
    }
  }

  const kaHub = pathname.match(
    /^\/(gvelebi|xvlikebi|kuebi|amfibiebi|prinvelebi|dzuzumtsovrebi)\/([^/]+)$/,
  );
  if (kaHub) {
    const species = resolveSpeciesInHub(KA_PREFIX_TO_HUB[kaHub[1]], kaHub[2]);
    if (species) {
      const next = kaSpeciesPath(species.id);
      if (next !== pathname) return redirectTo(request, next);
    }
  }

  const enWrongSlug = pathname.match(
    /^\/en\/(snakes|lizards|turtles|amphibians|birds|mammals)\/([^/]+)$/,
  );
  if (enWrongSlug) {
    const species = resolveSpeciesInHub(
      enWrongSlug[1] as GroupHubId,
      enWrongSlug[2],
    );
    if (species) {
      const next = enSpeciesPath(species.id);
      if (next !== pathname) return redirectTo(request, next);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
