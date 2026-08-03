export type DangerLevel = "Harmless" | "Moderate" | "High";

export type Species = {
  id: string;
  commonName: string;
  scientificName: string;
  genus: string;
  location: string;
  description: string;
  danger: DangerLevel;
  image: string;
};

export const species: Species[] = [
  {
    id: "vipera",
    commonName: "Dinnik's Viper",
    scientificName: "Vipera dinniki",
    genus: "Vipera",
    location: "Caucasus Mountains",
    description:
      "A rare alpine viper found only on isolated high-altitude slopes.",
    danger: "Moderate",
    image:
      "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=1024&q=80",
  },
  {
    id: "komodo",
    commonName: "Komodo Dragon",
    scientificName: "Varanus komodoensis",
    genus: "Varanus",
    location: "Lesser Sunda Islands",
    description:
      "The largest living lizard, a solitary hunter of the dry savanna.",
    danger: "High",
    image:
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1024&q=80",
  },
  {
    id: "anaconda",
    commonName: "Green Anaconda",
    scientificName: "Eunectes murinus",
    genus: "Eunectes",
    location: "Amazon Basin",
    description:
      "The heaviest snake on Earth, an ambush predator of slow water.",
    danger: "High",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1024&q=80",
  },
  {
    id: "chameleon",
    commonName: "Panther Chameleon",
    scientificName: "Furcifer pardalis",
    genus: "Furcifer",
    location: "Madagascar",
    description:
      "Colour shifts signal mood and temperature, not camouflage alone.",
    danger: "Harmless",
    image:
      "https://images.unsplash.com/photo-1504450874802-0ba0bcd9e6b2?auto=format&fit=crop&w=1024&q=80",
  },
  {
    id: "frog",
    commonName: "Blue Poison Dart Frog",
    scientificName: "Dendrobates tinctorius",
    genus: "Dendrobates",
    location: "Southern Suriname",
    description:
      "Its brilliance is a warning: alkaloid toxins from a wild diet.",
    danger: "Moderate",
    image:
      "https://images.unsplash.com/photo-1496074732535-1023808c2951?auto=format&fit=crop&w=1024&q=80",
  },
  {
    id: "turtle",
    commonName: "Green Sea Turtle",
    scientificName: "Chelonia mydas",
    genus: "Chelonia",
    location: "Tropical oceans",
    description: "Navigates thousands of kilometres back to its natal beach.",
    danger: "Harmless",
    image:
      "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1024&q=80",
  },
];

export const images = {
  hero: "/images/hero-img.png",
  detail:
    "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=1200&q=80",
  cta: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
};

export function dangerClass(danger: DangerLevel) {
  switch (danger) {
    case "High":
      return "bg-destructive/15 text-destructive";
    case "Moderate":
      return "bg-gold/20 text-gold";
    default:
      return "bg-primary/15 text-primary";
  }
}
