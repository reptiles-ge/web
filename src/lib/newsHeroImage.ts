import type { OptimizedImageEntry } from "@/lib/optimizedImageSources";

const NEWS_HERO_MIN_WIDTH = 1200;
export const NEWS_HERO_RULE_SINCE = "2026-10-21";
export const NEWS_HERO_MAX_EXCEPTIONS = 3;

export type NewsHeroImage = { height?: number; src: string; width?: number };

export type NewsHeroInput = {
  exception?: string;
  image?: NewsHeroImage;
  publishedAt: string;
  slug: string;
};

export type NewsHeroResult = { error?: string; warning?: string };

type OptimizedLookup = Readonly<Record<string, OptimizedImageEntry>>;

export function checkNewsHero(
  input: NewsHeroInput,
  optimized: OptimizedLookup,
): NewsHeroResult {
  const problem = newsHeroProblem(input.image, optimized);
  if (input.exception) {
    return problem
      ? {
          warning: `${input.slug}: heroImageException (${input.exception}): ${problem}`,
        }
      : {
          error: `${input.slug}: heroImageException is set but the hero now passes; remove it`,
        };
  }
  if (!problem) return {};
  if (input.publishedAt.slice(0, 10) < NEWS_HERO_RULE_SINCE)
    return { warning: `${input.slug}: ${problem}` };
  return {
    error: `${input.slug}: ${problem}. Use a landscape hero at least ${NEWS_HERO_MIN_WIDTH} px wide, or add heroImageException with the reason`,
  };
}

export function checkNewsHeroes(
  inputs: readonly NewsHeroInput[],
  optimized: OptimizedLookup,
) {
  const errors: string[] = [];
  const warnings: string[] = [];
  for (const input of inputs) {
    const result = checkNewsHero(input, optimized);
    if (result.error) errors.push(result.error);
    if (result.warning) warnings.push(result.warning);
  }
  const excepted = inputs.filter((input) => input.exception);
  if (excepted.length > NEWS_HERO_MAX_EXCEPTIONS)
    errors.push(
      `${excepted.length} articles use heroImageException (${excepted.map((input) => input.slug).join(", ")}); at most ${NEWS_HERO_MAX_EXCEPTIONS} at a time, so replace a hero first`,
    );
  return { errors, warnings };
}

export function newsHeroProblem(
  image: NewsHeroImage | undefined,
  optimized: OptimizedLookup,
): string | undefined {
  if (!image) return "no hero image in the ka.mdx frontmatter";
  const size = newsHeroSize(image, optimized);
  if (!size)
    return `hero size is unknown for ${image.src}; add width and height`;
  const label = `${size.width}×${size.height}`;
  if (size.width <= size.height) return `hero is ${label}, not landscape`;
  if (size.width < NEWS_HERO_MIN_WIDTH)
    return `hero is ${label}, narrower than ${NEWS_HERO_MIN_WIDTH} px`;
  return undefined;
}

export function newsHeroSize(
  image: NewsHeroImage,
  optimized: OptimizedLookup,
): undefined | { height: number; width: number } {
  const entry = Object.hasOwn(optimized, image.src)
    ? optimized[image.src]
    : undefined;
  if (entry) {
    const width = Math.max(...entry.widths);
    return {
      height: Math.round((entry.height * width) / entry.width),
      width,
    };
  }
  if (image.width && image.height)
    return { height: image.height, width: image.width };
  return undefined;
}
