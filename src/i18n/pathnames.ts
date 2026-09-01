function kaLatin<K extends `/${string}`, L extends `/${string}`>(ka: K, latin: L) {
  return { ka, en: latin, ru: latin, tr: latin } as const;
}

export const pathnames = {
  "/": "/",
  "/about": "/about",
  "/contact": "/contact",
  "/species": "/species",
  "/species/[id]": "/species/[id]",
  "/snakes": kaLatin("/gvelebi", "/snakes"),
  "/snakes/saxeoebebi": kaLatin("/gvelebi/saxeoebebi", "/snakes/species"),
  "/snakes/shxamiani-gvelis-amocnoba": kaLatin(
    "/gvelebi/shxamiani-gvelis-amocnoba",
    "/snakes/identify-venomous",
  ),
  "/snakes/gvelis-nakbeni": kaLatin("/gvelebi/gvelis-nakbeni", "/snakes/bite"),
  "/snakes/gavrtseleba": kaLatin("/gvelebi/gavrtseleba", "/snakes/range"),
  "/snakes/didi-gvelebi": kaLatin("/gvelebi/didi-gvelebi", "/snakes/largest"),
  "/snakes/[slug]": kaLatin("/gvelebi/[slug]", "/snakes/[slug]"),
  "/lizards": kaLatin("/xvlikebi", "/lizards"),
  "/lizards/saxeoebebi": kaLatin("/xvlikebi/saxeoebebi", "/lizards/species"),
  "/lizards/identifikacia": kaLatin(
    "/xvlikebi/identifikacia",
    "/lizards/identify",
  ),
  "/lizards/xvlikis-da-gvelxokeras-gansxvaveba": kaLatin(
    "/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba",
    "/lizards/lizard-or-glass-lizard",
  ),
  "/lizards/[slug]": kaLatin("/xvlikebi/[slug]", "/lizards/[slug]"),
  "/turtles": kaLatin("/kuebi", "/turtles"),
  "/turtles/saxeoebebi": kaLatin("/kuebi/saxeoebebi", "/turtles/species"),
  "/turtles/xmelis-kuebi": kaLatin("/kuebi/xmelis-kuebi", "/turtles/land"),
  "/turtles/tsqlis-kuebi": kaLatin("/kuebi/tsqlis-kuebi", "/turtles/freshwater"),
  "/turtles/identifikacia": kaLatin(
    "/kuebi/identifikacia",
    "/turtles/identify",
  ),
  "/turtles/[slug]": kaLatin("/kuebi/[slug]", "/turtles/[slug]"),
  "/amphibians": kaLatin("/amfibiebi", "/amphibians"),
  "/amphibians/saxeoebebi": kaLatin(
    "/amfibiebi/saxeoebebi",
    "/amphibians/species",
  ),
  "/amphibians/bayayi": kaLatin("/amfibiebi/bayayi", "/amphibians/frogs"),
  "/amphibians/bayayi/saxeoebebi": kaLatin(
    "/amfibiebi/bayayi/saxeoebebi",
    "/amphibians/frogs/species",
  ),
  "/amphibians/tritoni-salamandra": kaLatin(
    "/amfibiebi/tritoni-salamandra",
    "/amphibians/newts",
  ),
  "/amphibians/[slug]": kaLatin("/amfibiebi/[slug]", "/amphibians/[slug]"),
  "/birds": kaLatin("/prinvelebi", "/birds"),
  "/birds/[slug]": kaLatin("/prinvelebi/[slug]", "/birds/[slug]"),
  "/mammals": kaLatin("/dzuzumtsovrebi", "/mammals"),
  "/mammals/[slug]": kaLatin("/dzuzumtsovrebi/[slug]", "/mammals/[slug]"),
  "/venomous-snakes": kaLatin(
    "/gvelebi/shxamiani-gvelebi",
    "/venomous-snakes",
  ),
  "/snakes-in-the-yard": kaLatin("/gvelebi/gveli-ezoshi", "/snakes-in-the-yard"),
  "/risk-to-humans": kaLatin("/riskis-doneebi", "/risk-to-humans"),
  "/quiz": "/quiz",
  "/quiz/[slug]": "/quiz/[slug]",
  "/regions": "/regions",
  "/regions/[id]": "/regions/[id]",
  "/news": "/news",
  "/news/[slug]": "/news/[slug]",
} as const;
