const SITE_LAST_MODIFIED = "2026-09-17T00:00:00+04:00";

export const SITEMAP_PATH_LAST_MODIFIED: Record<string, string> = {
  "/": SITE_LAST_MODIFIED,
  "/about": SITE_LAST_MODIFIED,
  "/amphibians": SITE_LAST_MODIFIED,
  "/amphibians/bayayi": SITE_LAST_MODIFIED,
  "/amphibians/bayayi/saxeoebebi": SITE_LAST_MODIFIED,
  "/amphibians/saxeoebebi": SITE_LAST_MODIFIED,
  "/amphibians/tritoni-salamandra": SITE_LAST_MODIFIED,
  "/authors": SITE_LAST_MODIFIED,
  "/birds": SITE_LAST_MODIFIED,
  "/birds/saxeoebebi": SITE_LAST_MODIFIED,
  "/contact": SITE_LAST_MODIFIED,
  "/lizards": SITE_LAST_MODIFIED,
  "/lizards/darevskia": SITE_LAST_MODIFIED,
  "/lizards/identifikacia": SITE_LAST_MODIFIED,
  "/lizards/saxeoebebi": SITE_LAST_MODIFIED,
  "/lizards/xvliki-saxlshi": SITE_LAST_MODIFIED,
  "/lizards/xvlikis-da-gvelxokeras-gansxvaveba": SITE_LAST_MODIFIED,
  "/mammals": SITE_LAST_MODIFIED,
  "/mammals/datvi-shekhvedra": SITE_LAST_MODIFIED,
  "/mammals/saxeoebebi": SITE_LAST_MODIFIED,
  "/mammals/tura-ezoshi": SITE_LAST_MODIFIED,
  "/news": SITE_LAST_MODIFIED,
  "/quiz": SITE_LAST_MODIFIED,
  "/regions": SITE_LAST_MODIFIED,
  "/risk-to-humans": SITE_LAST_MODIFIED,
  "/snakes": SITE_LAST_MODIFIED,
  "/snakes-in-the-yard": SITE_LAST_MODIFIED,
  "/snakes/didi-gvelebi": SITE_LAST_MODIFIED,
  "/snakes/gavrtseleba": SITE_LAST_MODIFIED,
  "/snakes/gvelis-nakbeni": SITE_LAST_MODIFIED,
  "/snakes/saxeoebebi": SITE_LAST_MODIFIED,
  "/snakes/shxamiani-gvelis-amocnoba": SITE_LAST_MODIFIED,
  "/species": SITE_LAST_MODIFIED,
  "/spiders": SITE_LAST_MODIFIED,
  "/spiders/obobis-nakbeni": SITE_LAST_MODIFIED,
  "/spiders/saxeoebebi": SITE_LAST_MODIFIED,
  "/spiders/shxamiani-obobebi": SITE_LAST_MODIFIED,
  "/turtles": SITE_LAST_MODIFIED,
  "/turtles/identifikacia": SITE_LAST_MODIFIED,
  "/turtles/saxeoebebi": SITE_LAST_MODIFIED,
  "/turtles/tsqlis-kuebi": SITE_LAST_MODIFIED,
  "/turtles/xmelis-kuebi": SITE_LAST_MODIFIED,
  "/venomous-snakes": SITE_LAST_MODIFIED,
};

export const SITEMAP_AUTHOR_LAST_MODIFIED: Record<string, string> = {
  "armen-seropian": SITE_LAST_MODIFIED,
  "david-tarkhnishvili": SITE_LAST_MODIFIED,
  "giorgi-iankoshvili": SITE_LAST_MODIFIED,
  "ioane-rostiashvili": SITE_LAST_MODIFIED,
  "lasha-gogodze": SITE_LAST_MODIFIED,
  "nika-melikishvili": SITE_LAST_MODIFIED,
  "saba-todua": SITE_LAST_MODIFIED,
  "sandro-khakhva": SITE_LAST_MODIFIED,
  "shota-zandukeli": SITE_LAST_MODIFIED,
  "velur-bunebastan-axlos": SITE_LAST_MODIFIED,
  "zakro-songulashvili": SITE_LAST_MODIFIED,
  "zauri-khachidze": SITE_LAST_MODIFIED,
};

export const SITEMAP_QUIZ_LAST_MODIFIED: Record<string, string> = {
  lizard: SITE_LAST_MODIFIED,
  snake: SITE_LAST_MODIFIED,
};

export const SITEMAP_REGION_LAST_MODIFIED: Record<string, string> = {
  abkhazia: SITE_LAST_MODIFIED,
  adjara: SITE_LAST_MODIFIED,
  guria: SITE_LAST_MODIFIED,
  imereti: SITE_LAST_MODIFIED,
  kakheti: SITE_LAST_MODIFIED,
  "kvemo-kartli": SITE_LAST_MODIFIED,
  "mtskheta-mtianeti": SITE_LAST_MODIFIED,
  racha: SITE_LAST_MODIFIED,
  "samegrelo-zemo-svaneti": SITE_LAST_MODIFIED,
  "samtskhe-javakheti": SITE_LAST_MODIFIED,
  "shida-kartli": SITE_LAST_MODIFIED,
  tbilisi: SITE_LAST_MODIFIED,
};

export function sitemapAuthorLastModified(slug: string) {
  return required(SITEMAP_AUTHOR_LAST_MODIFIED, slug);
}

export function sitemapPathLastModified(path: string) {
  return required(SITEMAP_PATH_LAST_MODIFIED, path);
}

export function sitemapQuizLastModified(id: string) {
  return required(SITEMAP_QUIZ_LAST_MODIFIED, id);
}

export function sitemapRegionLastModified(id: string) {
  return required(SITEMAP_REGION_LAST_MODIFIED, id);
}

function required(source: Record<string, string>, key: string) {
  const value = source[key];
  if (!value) throw new Error(`Missing sitemap lastModified: ${key}`);
  return value;
}
