import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import type { GroupHubId } from "@/lib/groupHubs";

import { isPrefixedLocale, type PrefixedLocale } from "@/i18n/localeMeta";
import { type AppLocale, routing } from "@/i18n/routing";
import { legacyPhotographerRedirectPath } from "@/lib/photographerRedirects";
import { hasRoutePlaceholder } from "@/lib/routePlaceholder";
import {
  getSpeciesHubId,
  getSpeciesPublicSlug,
  resolveSpeciesId,
  resolveSpeciesIdInHub,
} from "@/lib/speciesSlugTable";

const intlMiddleware = createMiddleware(routing);

const KA_HUB: Record<GroupHubId, string> = {
  amphibians: "amfibiebi",
  birds: "prinvelebi",
  insects: "mtserebi",
  lizards: "xvlikebi",
  mammals: "dzuzumtsovrebi",
  scorpions: "morieli",
  snakes: "gvelebi",
  spiders: "obobebi",
  turtles: "kuebi",
};

const KA_PREFIX_TO_HUB: Record<string, GroupHubId> = {
  amfibiebi: "amphibians",
  dzuzumtsovrebi: "mammals",
  gvelebi: "snakes",
  kuebi: "turtles",
  moriebi: "scorpions",
  morieli: "scorpions",
  mtserebi: "insects",
  obobebi: "spiders",
  prinvelebi: "birds",
  xvlikebi: "lizards",
};

const HUB_SEGMENT =
  "snakes|lizards|turtles|amphibians|birds|mammals|scorpions|spiders|insects";
const KA_HUB_SEGMENT =
  "gvelebi|xvlikebi|kuebi|amfibiebi|prinvelebi|dzuzumtsovrebi|morieli|moriebi|obobebi|mtserebi";
const PREFIX_SEGMENT = "en|ru|tr";

const PERMANENT_REDIRECTS: Record<string, string> = {
  "/amphibians": "/amfibiebi",
  "/amphibians/bayayi": "/amfibiebi/bayayi",
  "/amphibians/bayayi/saxeoebebi": "/amfibiebi/bayayi/saxeoebebi",
  "/amphibians/frogs": "/amfibiebi/bayayi",
  "/amphibians/frogs/species": "/amfibiebi/bayayi/saxeoebebi",
  "/amphibians/newts": "/amfibiebi/tritoni-salamandra",
  "/amphibians/saxeoebebi": "/amfibiebi/saxeoebebi",
  "/amphibians/species": "/amfibiebi/saxeoebebi",
  "/amphibians/tritoni-salamandra": "/amfibiebi/tritoni-salamandra",
  "/authors": "/kontributorebi",
  "/contributors": "/kontributorebi",
  "/fotografebi": "/kontributorebi",
  "/gvelebi/sakartvelos-gvelebi": "/gvelebi/saxeoebebi",
  "/gvelebi/vipera-ammodytes": "/gvelebi/tsxvirrkosani-gvelgesla",
  "/identify": "/species",
  "/lizards": "/xvlikebi",
  "/lizards/darevskia": "/xvlikebi/darevskia",
  "/lizards/identifikacia": "/xvlikebi/identifikacia",
  "/lizards/identify": "/xvlikebi/identifikacia",
  "/lizards/in-the-house": "/xvlikebi/xvliki-saxlshi",
  "/lizards/lizard-or-glass-lizard":
    "/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba",
  "/lizards/saxeoebebi": "/xvlikebi/saxeoebebi",
  "/lizards/species": "/xvlikebi/saxeoebebi",
  "/lizards/xvliki-saxlshi": "/xvlikebi/xvliki-saxlshi",
  "/lizards/xvlikis-da-gvelxokeras-gansxvaveba":
    "/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba",
  "/mammals/bear-encounter": "/dzuzumtsovrebi/datvi-shekhvedra",
  "/mammals/datvi-shekhvedra": "/dzuzumtsovrebi/datvi-shekhvedra",
  "/mammals/jackal-in-the-yard": "/dzuzumtsovrebi/tura-ezoshi",
  "/mammals/saxeoebebi": "/dzuzumtsovrebi/saxeoebebi",
  "/mammals/species": "/dzuzumtsovrebi/saxeoebebi",
  "/mammals/tura-ezoshi": "/dzuzumtsovrebi/tura-ezoshi",
  "/photographers": "/kontributorebi",
  "/quiz/gvelis-identifikacia": "/quiz/romeli-gvelia",
  "/quiz/which-lizard": "/quiz/romeli-xvlikia",
  "/quiz/which-snake": "/quiz/romeli-gvelia",
  "/regions/samegrelo": "/regions/samegrelo-zemo-svaneti",
  "/regions/zemo-svaneti": "/regions/samegrelo-zemo-svaneti",
  "/snakes": "/gvelebi",
  "/snakes-in-the-yard": "/gvelebi/gveli-ezoshi",
  "/snakes/bite": "/gvelebi/gvelis-nakbeni",
  "/snakes/didi-gvelebi": "/gvelebi/didi-gvelebi",
  "/snakes/gavrtseleba": "/gvelebi/gavrtseleba",
  "/snakes/gveli-ezoshi": "/gvelebi/gveli-ezoshi",
  "/snakes/gvelis-nakbeni": "/gvelebi/gvelis-nakbeni",
  "/snakes/identify-venomous": "/gvelebi/shxamiani-gvelis-amocnoba",
  "/snakes/largest": "/gvelebi/didi-gvelebi",
  "/snakes/range": "/gvelebi/gavrtseleba",
  "/snakes/sakartvelos-gvelebi": "/gvelebi/saxeoebebi",
  "/snakes/saxeoebebi": "/gvelebi/saxeoebebi",
  "/snakes/shxamiani-gvelis-amocnoba": "/gvelebi/shxamiani-gvelis-amocnoba",
  "/snakes/species": "/gvelebi/saxeoebebi",
  "/snakes/venomous": "/gvelebi/shxamiani-gvelebi",
  "/snakes/vipera-ammodytes": "/gvelebi/tsxvirrkosani-gvelgesla",
  "/species/vipera-ammodytes": "/gvelebi/tsxvirrkosani-gvelgesla",
  "/spiders/bite": "/obobebi/obobis-nakbeni",
  "/spiders/obobis-nakbeni": "/obobebi/obobis-nakbeni",
  "/spiders/saxeoebebi": "/obobebi/saxeoebebi",
  "/spiders/shxamiani-obobebi": "/obobebi/shxamiani-obobebi",
  "/spiders/species": "/obobebi/saxeoebebi",
  "/spiders/venomous": "/obobebi/shxamiani-obobebi",
  "/terms": "/terms-and-conditions",
  "/turtles": "/kuebi",
  "/turtles/freshwater": "/kuebi/tsqlis-kuebi",
  "/turtles/identifikacia": "/kuebi/identifikacia",
  "/turtles/identify": "/kuebi/identifikacia",
  "/turtles/land": "/kuebi/xmelis-kuebi",
  "/turtles/saxeoebebi": "/kuebi/saxeoebebi",
  "/turtles/species": "/kuebi/saxeoebebi",
  "/turtles/tsqlis-kuebi": "/kuebi/tsqlis-kuebi",
  "/turtles/xmelis-kuebi": "/kuebi/xmelis-kuebi",
  "/venomous-snakes": "/gvelebi/shxamiani-gvelebi",
};

const TEMPORARY_REDIRECTS: Record<string, string> = {
  "/gvelebi/dolichophis-caspius": "/gvelebi",
  "/gvelebi/qvitelmutsela-mtsuravi": "/gvelebi",
  "/snakes/dolichophis-caspius": "/gvelebi",
  "/species/dolichophis-caspius": "/gvelebi",
};

const PREFIXED_PERMANENT_REDIRECTS: Record<string, string> = {
  "/amfibiebi": "/amphibians",
  "/amfibiebi/bayayi": "/amphibians/frogs",
  "/amfibiebi/bayayi/saxeoebebi": "/amphibians/frogs/species",
  "/amfibiebi/saxeoebebi": "/amphibians/species",
  "/amfibiebi/tritoni-salamandra": "/amphibians/newts",
  "/amphibians/bayayi": "/amphibians/frogs",
  "/amphibians/bayayi/saxeoebebi": "/amphibians/frogs/species",
  "/amphibians/saxeoebebi": "/amphibians/species",
  "/amphibians/tritoni-salamandra": "/amphibians/newts",
  "/authors": "/contributors",
  "/avtorebi": "/contributors",
  "/dzuzumtsovrebi": "/mammals",
  "/dzuzumtsovrebi/datvi-shekhvedra": "/mammals/bear-encounter",
  "/dzuzumtsovrebi/saxeoebebi": "/mammals/species",
  "/dzuzumtsovrebi/tura-ezoshi": "/mammals/jackal-in-the-yard",
  "/fotografebi": "/contributors",
  "/gvelebi": "/snakes",
  "/gvelebi/didi-gvelebi": "/snakes/largest",
  "/gvelebi/gavrtseleba": "/snakes/range",
  "/gvelebi/gveli-ezoshi": "/snakes-in-the-yard",
  "/gvelebi/gvelis-nakbeni": "/snakes/bite",
  "/gvelebi/sakartvelos-gvelebi": "/snakes/species",
  "/gvelebi/saxeoebebi": "/snakes/species",
  "/gvelebi/shxamiani-gvelebi": "/venomous-snakes",
  "/gvelebi/shxamiani-gvelis-amocnoba": "/snakes/identify-venomous",
  "/gvelebi/vipera-ammodytes": "/snakes/vipera-transcaucasiana",
  "/identify": "/species",
  "/kontributorebi": "/contributors",
  "/kuebi": "/turtles",
  "/kuebi/identifikacia": "/turtles/identify",
  "/kuebi/saxeoebebi": "/turtles/species",
  "/kuebi/tsqlis-kuebi": "/turtles/freshwater",
  "/kuebi/xmelis-kuebi": "/turtles/land",
  "/lizards/identifikacia": "/lizards/identify",
  "/lizards/saxeoebebi": "/lizards/species",
  "/lizards/xvliki-saxlshi": "/lizards/in-the-house",
  "/lizards/xvlikis-da-gvelxokeras-gansxvaveba":
    "/lizards/lizard-or-glass-lizard",
  "/mammals/datvi-shekhvedra": "/mammals/bear-encounter",
  "/mammals/saxeoebebi": "/mammals/species",
  "/mammals/tura-ezoshi": "/mammals/jackal-in-the-yard",
  "/obobebi": "/spiders",
  "/obobebi/obobis-nakbeni": "/spiders/bite",
  "/obobebi/saxeoebebi": "/spiders/species",
  "/obobebi/shxamiani-obobebi": "/spiders/venomous",
  "/photographers": "/contributors",
  "/prinvelebi": "/birds",
  "/prinvelebi/saxeoebebi": "/birds/species",
  "/regions/samegrelo": "/regions/samegrelo-zemo-svaneti",
  "/regions/zemo-svaneti": "/regions/samegrelo-zemo-svaneti",
  "/snakes/didi-gvelebi": "/snakes/largest",
  "/snakes/gavrtseleba": "/snakes/range",
  "/snakes/gvelis-nakbeni": "/snakes/bite",
  "/snakes/sakartvelos-gvelebi": "/snakes/species",
  "/snakes/saxeoebebi": "/snakes/species",
  "/snakes/shxamiani-gvelis-amocnoba": "/snakes/identify-venomous",
  "/snakes/vipera-ammodytes": "/snakes/vipera-transcaucasiana",
  "/species/vipera-ammodytes": "/snakes/vipera-transcaucasiana",
  "/spiders/obobis-nakbeni": "/spiders/bite",
  "/spiders/saxeoebebi": "/spiders/species",
  "/spiders/shxamiani-obobebi": "/spiders/venomous",
  "/terms": "/terms-and-conditions",
  "/turtles/identifikacia": "/turtles/identify",
  "/turtles/saxeoebebi": "/turtles/species",
  "/turtles/tsqlis-kuebi": "/turtles/freshwater",
  "/turtles/xmelis-kuebi": "/turtles/land",
  "/xvlikebi": "/lizards",
  "/xvlikebi/darevskia": "/lizards/darevskia",
  "/xvlikebi/identifikacia": "/lizards/identify",
  "/xvlikebi/saxeoebebi": "/lizards/species",
  "/xvlikebi/xvliki-saxlshi": "/lizards/in-the-house",
  "/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba":
    "/lizards/lizard-or-glass-lizard",
};

const PREFIXED_TEMPORARY_REDIRECTS: Record<string, string> = {
  "/gvelebi/qvitelmutsela-mtsuravi": "/snakes",
  "/snakes/dolichophis-caspius": "/snakes",
  "/species/dolichophis-caspius": "/snakes",
};

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  if (request.nextUrl.hostname === "www.reptiles.ge") {
    const url = request.nextUrl.clone();
    url.hostname = "reptiles.ge";
    return NextResponse.redirect(url, 301);
  }

  if (hasRoutePlaceholder(pathname)) {
    return new NextResponse("Not found", {
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
      },
      status: 404,
    });
  }

  if (pathname === "/ka" || pathname.startsWith("/ka/")) {
    return redirectTo(request, pathname.slice(3) || "/");
  }

  const configuredRedirect = configuredRedirectPath(pathname);
  if (configuredRedirect) {
    return redirectTo(request, configuredRedirect[0], configuredRedirect[1]);
  }

  const photographer = legacyPhotographerRedirectPath(pathname);
  if (photographer) return redirectTo(request, photographer);

  if (pathname === "/moriebi") return redirectTo(request, "/morieli");

  const legacy = pathname.match(
    new RegExp(`^(\\/(${PREFIX_SEGMENT}))?\\/species\\/([^/]+)$`),
  );
  if (legacy) {
    const id = resolveSpeciesId(legacy[3]);
    if (id) {
      const locale = (legacy[2] ?? "ka") as AppLocale;
      return redirectTo(request, speciesPath(locale, id));
    }
  }

  const unprefixedLatinHub = pathname.match(
    new RegExp(`^\\/(${HUB_SEGMENT})\\/([^/]+)$`),
  );
  if (unprefixedLatinHub) {
    const id = resolveSpeciesIdInHub(
      unprefixedLatinHub[1] as GroupHubId,
      unprefixedLatinHub[2],
    );
    if (id) {
      const next = speciesPath("ka", id);
      if (next !== pathname) return redirectTo(request, next);
    }
  }

  const prefixedKaHub = pathname.match(
    new RegExp(`^\\/(${PREFIX_SEGMENT})\\/(${KA_HUB_SEGMENT})\\/([^/]+)$`),
  );
  if (prefixedKaHub && isPrefixedLocale(prefixedKaHub[1])) {
    const locale = prefixedKaHub[1] as PrefixedLocale;
    const id = resolveSpeciesIdInHub(
      KA_PREFIX_TO_HUB[prefixedKaHub[2]],
      prefixedKaHub[3],
    );
    if (id) {
      const next = speciesPath(locale, id);
      if (next !== pathname) return redirectTo(request, next);
    }
  }

  const prefixedHub = pathname.match(
    new RegExp(`^\\/(${PREFIX_SEGMENT})\\/(${HUB_SEGMENT})\\/([^/]+)$`),
  );
  if (prefixedHub && isPrefixedLocale(prefixedHub[1])) {
    const locale = prefixedHub[1] as PrefixedLocale;
    const id = resolveSpeciesIdInHub(
      prefixedHub[2] as GroupHubId,
      prefixedHub[3],
    );
    if (id) {
      const next = speciesPath(locale, id);
      if (next !== pathname) return redirectTo(request, next);
    }
  }

  const kaHub = pathname.match(
    new RegExp(`^\\/(${KA_HUB_SEGMENT})\\/([^/]+)$`),
  );
  if (kaHub) {
    const id = resolveSpeciesIdInHub(KA_PREFIX_TO_HUB[kaHub[1]], kaHub[2]);
    if (id) {
      const next = speciesPath("ka", id);
      if (next !== pathname) return redirectTo(request, next);
    }
  }

  return intlMiddleware(request);
}

function configuredRedirectPath(pathname: string): [string, 301 | 302] | null {
  const temporary = TEMPORARY_REDIRECTS[pathname];
  if (temporary) return [temporary, 302];

  const permanent = PERMANENT_REDIRECTS[pathname];
  if (permanent) return [permanent, 301];

  const contributor = pathname.match(
    /^\/(?:avtorebi|authors|contributors|fotografebi|photographers)\/([^/]+)$/,
  );
  if (contributor) return [`/kontributorebi/${contributor[1]}`, 301];

  const prefixed = pathname.match(
    new RegExp(`^\\/(${PREFIX_SEGMENT})(\\/.*)$`),
  );
  if (prefixed && isPrefixedLocale(prefixed[1])) {
    const quiz = prefixedQuizRedirectPath(prefixed[1], prefixed[2]);
    if (quiz) return [quiz, 301];

    const temporary = PREFIXED_TEMPORARY_REDIRECTS[prefixed[2]];
    if (temporary) return [`/${prefixed[1]}${temporary}`, 302];

    const permanent = PREFIXED_PERMANENT_REDIRECTS[prefixed[2]];
    if (permanent) return [`/${prefixed[1]}${permanent}`, 301];

    const contributor = prefixed[2].match(
      /^\/(?:avtorebi|authors|fotografebi|kontributorebi|photographers)\/([^/]+)$/,
    );
    if (contributor)
      return [`/${prefixed[1]}/contributors/${contributor[1]}`, 301];
  }

  return null;
}

function prefixedQuizRedirectPath(
  locale: PrefixedLocale,
  pathname: string,
): null | string {
  if (
    pathname === "/quiz/gvelis-identifikacia" ||
    pathname === "/quiz/romeli-gvelia" ||
    pathname === "/quiz/which-snake"
  ) {
    if (locale === "ru") return "/ru/quiz/kakaya-zmeya";
    if (locale === "tr") return "/tr/quiz/hangi-yilan";
    return "/en/quiz/which-snake";
  }

  if (
    pathname === "/quiz/romeli-xvlikia" ||
    pathname === "/quiz/which-lizard"
  ) {
    if (locale === "ru") return "/ru/quiz/kakaya-yashcheritsa";
    if (locale === "tr") return "/tr/quiz/hangi-kertenkele";
    return "/en/quiz/which-lizard";
  }

  return null;
}

function redirectTo(
  request: NextRequest,
  pathname: string,
  status: 301 | 302 = 301,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, status);
}

function speciesPath(locale: AppLocale, id: string) {
  const hub = getSpeciesHubId(id);
  const slug = getSpeciesPublicSlug(id, locale);
  if (locale === "ka") return `/${KA_HUB[hub]}/${slug}`;
  return `/${locale}/${hub}/${slug}`;
}

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
