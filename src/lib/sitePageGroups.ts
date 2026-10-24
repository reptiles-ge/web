export type SitePageGroup = {
  description: string;
  id: string;
  label: string;
  routes: SitePageRoute[];
};

type SitePageRoute = { path: string; type: "layout" | "page" };

const page = (path: string): SitePageRoute => ({ path, type: "page" });

const section = (path: string): SitePageRoute => ({ path, type: "layout" });

const animalSection = (
  id: string,
  label: string,
  folder: string,
): SitePageGroup => ({
  description: `Every page under ${label.toLowerCase()}: the hub, the species index, the guides and every species profile.`,
  id,
  label,
  routes: [section(`/[locale]/${folder}`)],
});

export const SITE_PAGE_GROUPS: SitePageGroup[] = [
  {
    description: "The landing page.",
    id: "home",
    label: "Home",
    routes: [page("/[locale]")],
  },
  {
    description: "The about page.",
    id: "about",
    label: "About",
    routes: [page("/[locale]/about")],
  },
  {
    description: "The contact page.",
    id: "contact",
    label: "Contact",
    routes: [page("/[locale]/contact")],
  },
  {
    description: "Privacy, terms and conditions, and photo use.",
    id: "legal",
    label: "Privacy, terms and photo use",
    routes: [
      page("/[locale]/privacy"),
      page("/[locale]/terms-and-conditions"),
      page("/[locale]/photo-use"),
    ],
  },
  {
    description: "The species atlas with its filters.",
    id: "atlas",
    label: "Species atlas",
    routes: [page("/[locale]/species")],
  },
  animalSection("snakes", "Snakes", "snakes"),
  animalSection("lizards", "Lizards", "lizards"),
  animalSection("turtles", "Turtles", "turtles"),
  animalSection("amphibians", "Amphibians", "amphibians"),
  animalSection("birds", "Birds", "birds"),
  animalSection("mammals", "Mammals", "mammals"),
  animalSection("insects", "Insects", "insects"),
  animalSection("spiders", "Spiders", "spiders"),
  animalSection("scorpions", "Scorpions", "scorpions"),
  {
    description:
      "Venomous snakes, snakes in the yard, dangerous animals and the risk levels page.",
    id: "safety",
    label: "Safety guides",
    routes: [
      page("/[locale]/venomous-snakes"),
      page("/[locale]/snakes-in-the-yard"),
      page("/[locale]/dangerous-animals"),
      page("/[locale]/risk-to-humans"),
    ],
  },
  {
    description: "The news index, the archive pages and every article.",
    id: "news",
    label: "News",
    routes: [section("/[locale]/news")],
  },
  {
    description: "The contributor index and every contributor page.",
    id: "contributors",
    label: "Contributors",
    routes: [section("/[locale]/authors")],
  },
  {
    description: "The regions index and every region page.",
    id: "regions",
    label: "Regions",
    routes: [section("/[locale]/regions")],
  },
  {
    description: "The quiz index and every quiz.",
    id: "quizzes",
    label: "Quizzes",
    routes: [section("/[locale]/quiz")],
  },
  {
    description:
      "Every page on reptiles.ge, in every language. The next visit to each page renders it fresh.",
    id: "site",
    label: "Whole site",
    routes: [section("/")],
  },
];

export const SITE_PAGE_GROUP_IDS = SITE_PAGE_GROUPS.map(({ id }) => id);

export function findSitePageGroup(id: string) {
  return SITE_PAGE_GROUPS.find((group) => group.id === id);
}
