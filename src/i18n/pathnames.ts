export const pathnames = {
  "/": "/",
  "/about": "/about",
  "/contact": "/contact",
  "/species": "/species",
  "/species/[id]": "/species/[id]",
  "/snakes": {
    ka: "/gvelebi",
    en: "/snakes",
  },
  "/snakes/[slug]": {
    ka: "/gvelebi/[slug]",
    en: "/snakes/[slug]",
  },
  "/lizards": {
    ka: "/xvlikebi",
    en: "/lizards",
  },
  "/lizards/[slug]": {
    ka: "/xvlikebi/[slug]",
    en: "/lizards/[slug]",
  },
  "/turtles": {
    ka: "/kuebi",
    en: "/turtles",
  },
  "/turtles/[slug]": {
    ka: "/kuebi/[slug]",
    en: "/turtles/[slug]",
  },
  "/amphibians": {
    ka: "/amfibiebi",
    en: "/amphibians",
  },
  "/amphibians/bayayi": {
    ka: "/amfibiebi/bayayi",
    en: "/amphibians/frogs",
  },
  "/amphibians/[slug]": {
    ka: "/amfibiebi/[slug]",
    en: "/amphibians/[slug]",
  },
  "/venomous-snakes": {
    ka: "/gvelebi/shxamiani-gvelebi",
    en: "/venomous-snakes",
  },
  "/snakes-in-the-yard": {
    ka: "/gvelebi/gveli-ezoshi",
    en: "/snakes-in-the-yard",
  },
  "/regions": "/regions",
  "/regions/[id]": "/regions/[id]",
} as const;
