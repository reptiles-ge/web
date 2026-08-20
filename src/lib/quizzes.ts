import { QUIZ_LENGTH } from "@/lib/snakeQuiz";
import type { AppPathnames } from "@/i18n/routing";

export type QuizStatus = "live" | "soon";
export type QuizMessageKey = "snake" | "lizard" | "turtle";

export type QuizDefinition = {
  id: QuizMessageKey;
  status: QuizStatus;
  href?: Extract<AppPathnames, "/quiz/gvelis-identifikacia">;
  questions?: number;
  heroSpeciesId: string;
};

export const QUIZ_INDEX = [
  {
    id: "snake",
    status: "live",
    href: "/quiz/gvelis-identifikacia",
    questions: QUIZ_LENGTH,
    heroSpeciesId: "natrix-natrix",
  },
  {
    id: "lizard",
    status: "soon",
    heroSpeciesId: "pseudopus-apodus",
  },
  {
    id: "turtle",
    status: "soon",
    heroSpeciesId: "testudo-graeca",
  },
] as const satisfies readonly QuizDefinition[];
