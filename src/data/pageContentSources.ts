export const PAGE_MESSAGE_NAMESPACES: Readonly<
  Record<string, readonly string[]>
> = {
  "/": ["home"],
  "/about": ["about"],
  "/authors": ["author"],
  "/contact": ["contact"],
  "/dangerous-animals": ["dangerousAnimals"],
  "/developers": ["developers"],
  "/photo-use": ["photoUse"],
  "/privacy": ["legal.privacy"],
  "/quiz": ["quizzes"],
  "/regions": ["regions"],
  "/risk-to-humans": ["riskToHumans"],
  "/snakes-in-the-yard": ["snakesInYard"],
  "/species": ["speciesAtlas"],
  "/terms-and-conditions": ["legal.terms"],
  "/venomous-snakes": ["venomousSnakes"],
};

export const PAGE_CONTENT_FILES: Readonly<Record<string, readonly string[]>> = {
  "/privacy": ["src/content/privacyPolicy.ts"],
  "/terms-and-conditions": ["src/content/termsOfUse.ts"],
};

export const AUTHOR_MESSAGE_NAMESPACES = ["author"] as const;

export const REGION_MESSAGE_NAMESPACES = ["regions"] as const;

export function nestedMessageNamespaces(): string[] {
  return [
    ...new Set(
      Object.values(PAGE_MESSAGE_NAMESPACES)
        .flat()
        .filter((namespace) => namespace.includes(".")),
    ),
  ].sort();
}
