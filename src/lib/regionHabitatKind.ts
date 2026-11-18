export type RegionHabitatKind =
  "forest" | "mountain" | "open" | "settlement" | "water";

const KIND_PATTERNS: readonly (readonly [RegionHabitatKind, RegExp])[] = [
  ["settlement", /suburban|urban|park/i],
  ["forest", /forest|wooded/i],
  ["mountain", /mountain|foothill|gorge|rocky|plateau|karst/i],
  ["water", /coast|river|lake|basin/i],
  ["open", /valley|plain|lowland|meadow|arid/i],
];

export function regionHabitatKind(english: string): null | RegionHabitatKind {
  for (const [kind, pattern] of KIND_PATTERNS) {
    if (pattern.test(english)) return kind;
  }
  return null;
}
