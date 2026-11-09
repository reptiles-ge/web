import { describe, expect, it } from "vitest";

import { LIVE_QUIZ_IDS } from "@/lib/quizIds";
import { liveQuizzes } from "@/lib/quizzes";

describe("LIVE_QUIZ_IDS", () => {
  it("lists every live quiz and nothing else", () => {
    expect([...LIVE_QUIZ_IDS].sort()).toEqual(
      liveQuizzes()
        .map((quiz) => quiz.id)
        .sort(),
    );
  });
});
