import { GUIDE_ARTICLE_PATHS } from "../data/guideArticlePaths";
import { pathnames } from "./pathnames";

export function guideArticleRedirects() {
  const ka: Record<string, string> = {};
  const prefixed: Record<string, string> = {};

  for (const path of GUIDE_ARTICLE_PATHS) {
    const { en: latin, ka: kaPath }: Record<"en" | "ka", string> =
      pathnames[path];
    for (const from of [path, latin]) {
      if (from !== kaPath) ka[from] = kaPath;
    }
    for (const from of [path, kaPath]) {
      if (from !== latin) prefixed[from] = latin;
    }
  }

  return { ka, prefixed };
}
