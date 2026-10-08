import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";
import {
  liveQuizzes,
  quizHref,
  quizStaticParams,
  resolveQuizBySlug,
} from "@/lib/quizzes";

describe("quizzes", () => {
  it("has exactly the snake and lizard quizzes live", () => {
    expect(liveQuizzes().map((quiz) => quiz.id)).toEqual(["snake", "lizard"]);
  });

  it("has a unique slug per locale for every live quiz", () => {
    for (const locale of routing.locales) {
      const slugs = liveQuizzes().map((quiz) => quiz.slugs[locale]);
      expect(slugs.every(Boolean)).toBe(true);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("builds an href with the locale slug", () => {
    expect(quizHref("snake", "en")).toEqual({
      params: { slug: "which-snake" },
      pathname: "/quiz/[slug]",
    });
    expect(quizHref("lizard", "ka").params.slug).toBe("romeli-xvlikia");
  });

  it("falls back to the snake quiz for a quiz that is not live", () => {
    expect(quizHref("turtle", "en").params.slug).toBe("romeli-gvelia");
    expect(quizHref("unknown", "ru").params.slug).toBe("romeli-gvelia");
  });

  it("resolves a quiz only under its own locale", () => {
    expect(resolveQuizBySlug("en", "which-snake")?.id).toBe("snake");
    expect(resolveQuizBySlug("ka", "romeli-xvlikia")?.id).toBe("lizard");
    expect(resolveQuizBySlug("en", "romeli-gvelia")).toBeUndefined();
    expect(resolveQuizBySlug("en", "which-turtle")).toBeUndefined();
  });

  it("generates one static param per locale and live quiz", () => {
    const params = quizStaticParams();
    expect(params).toHaveLength(routing.locales.length * liveQuizzes().length);
    expect(params).toContainEqual({ locale: "tr", slug: "hangi-yilan" });
  });
});
