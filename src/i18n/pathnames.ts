function kaLatin<K extends `/${string}`, L extends `/${string}`>(
  ka: K,
  latin: L,
) {
  return { en: latin, ka, ru: latin, tr: latin } as const;
}

export const pathnames = {
  "/": "/",
  "/about": "/about",
  "/amphibians": kaLatin("/amfibiebi", "/amphibians"),
  "/amphibians/[slug]": kaLatin("/amfibiebi/[slug]", "/amphibians/[slug]"),
  "/amphibians/bayayi": kaLatin("/amfibiebi/bayayi", "/amphibians/frogs"),
  "/amphibians/bayayi/saxeoebebi": kaLatin(
    "/amfibiebi/bayayi/saxeoebebi",
    "/amphibians/frogs/species",
  ),
  "/amphibians/saxeoebebi": kaLatin(
    "/amfibiebi/saxeoebebi",
    "/amphibians/species",
  ),
  "/amphibians/tritoni-salamandra": kaLatin(
    "/amfibiebi/tritoni-salamandra",
    "/amphibians/newts",
  ),
  "/birds": kaLatin("/prinvelebi", "/birds"),
  "/birds/[slug]": kaLatin("/prinvelebi/[slug]", "/birds/[slug]"),
  "/contact": "/contact",
  "/lizards": kaLatin("/xvlikebi", "/lizards"),
  "/lizards/[slug]": kaLatin("/xvlikebi/[slug]", "/lizards/[slug]"),
  "/lizards/identifikacia": kaLatin(
    "/xvlikebi/identifikacia",
    "/lizards/identify",
  ),
  "/lizards/saxeoebebi": kaLatin("/xvlikebi/saxeoebebi", "/lizards/species"),
  "/lizards/xvlikis-da-gvelxokeras-gansxvaveba": kaLatin(
    "/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba",
    "/lizards/lizard-or-glass-lizard",
  ),
  "/mammals": kaLatin("/dzuzumtsovrebi", "/mammals"),
  "/mammals/[slug]": kaLatin("/dzuzumtsovrebi/[slug]", "/mammals/[slug]"),
  "/news": "/news",
  "/news/[slug]": "/news/[slug]",
  "/quiz": "/quiz",
  "/quiz/[slug]": "/quiz/[slug]",
  "/regions": "/regions",
  "/regions/[id]": "/regions/[id]",
  "/risk-to-humans": kaLatin("/riskis-doneebi", "/risk-to-humans"),
  "/snakes": kaLatin("/gvelebi", "/snakes"),
  "/snakes-in-the-yard": kaLatin(
    "/gvelebi/gveli-ezoshi",
    "/snakes-in-the-yard",
  ),
  "/snakes/[slug]": kaLatin("/gvelebi/[slug]", "/snakes/[slug]"),
  "/snakes/didi-gvelebi": kaLatin("/gvelebi/didi-gvelebi", "/snakes/largest"),
  "/snakes/gavrtseleba": kaLatin("/gvelebi/gavrtseleba", "/snakes/range"),
  "/snakes/gvelis-nakbeni": kaLatin("/gvelebi/gvelis-nakbeni", "/snakes/bite"),
  "/snakes/saxeoebebi": kaLatin("/gvelebi/saxeoebebi", "/snakes/species"),
  "/snakes/shxamiani-gvelis-amocnoba": kaLatin(
    "/gvelebi/shxamiani-gvelis-amocnoba",
    "/snakes/identify-venomous",
  ),
  "/species": "/species",
  "/species/[id]": "/species/[id]",
  "/spiders": kaLatin("/obobebi", "/spiders"),
  "/spiders/[slug]": kaLatin("/obobebi/[slug]", "/spiders/[slug]"),
  "/turtles": kaLatin("/kuebi", "/turtles"),
  "/turtles/[slug]": kaLatin("/kuebi/[slug]", "/turtles/[slug]"),
  "/turtles/identifikacia": kaLatin(
    "/kuebi/identifikacia",
    "/turtles/identify",
  ),
  "/turtles/saxeoebebi": kaLatin("/kuebi/saxeoebebi", "/turtles/species"),
  "/turtles/tsqlis-kuebi": kaLatin(
    "/kuebi/tsqlis-kuebi",
    "/turtles/freshwater",
  ),
  "/turtles/xmelis-kuebi": kaLatin("/kuebi/xmelis-kuebi", "/turtles/land"),
  "/venomous-snakes": kaLatin("/gvelebi/shxamiani-gvelebi", "/venomous-snakes"),
} as const;
