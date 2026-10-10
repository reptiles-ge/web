export const SPECIES_COLOR_TONES = {
  black: "#30302e",
  blue: "#5983a4",
  brown: "#7d5f43",
  gray: "#8f8c82",
  green: "#668452",
  olive: "#86834c",
  orange: "#d79047",
  pink: "#cc909a",
  purple: "#87688e",
  red: "#aa5045",
  sand: "#c4ab7e",
  white: "#eeeae1",
  yellow: "#d3b750",
} as const;

export type SpeciesColor = keyof typeof SPECIES_COLOR_TONES;

export const SPECIES_COLORS = Object.keys(SPECIES_COLOR_TONES) as [
  SpeciesColor,
  ...SpeciesColor[],
];
