import { routing, type AppLocale } from "@/i18n/routing";
import { QUIZ_LENGTH } from "@/lib/snakeQuiz";

export type QuizStatus = "live" | "soon";
export type QuizId = "snake" | "lizard" | "turtle";
export type QuizMessageKey = QuizId;
export type QuizGenerator = "snake";
export type QuizGroup = "snake" | "lizard" | "turtle";

export type QuizHref = {
  pathname: "/quiz/[slug]";
  params: { slug: string };
};

export type QuizDefinition = {
  id: QuizId;
  status: QuizStatus;
    slugs?: Record<AppLocale, string>;
  group: QuizGroup;
  heroSpeciesId: string;
  messageKey: QuizMessageKey;
  messageNamespace: "snakeQuiz";
  ogImage: string;
  generator?: QuizGenerator;
  questions?: number;
};

export const SNAKE_QUIZ_ID = "snake" satisfies QuizId;

export const QUIZ_INDEX = [
  {
    id: "snake",
    status: "live",
    slugs: {
      ka: "romeli-gvelia",
      en: "which-snake",
      ru: "kakaya-zmeya",
      tr: "hangi-yilan",
    },
    group: "snake",
    heroSpeciesId: "natrix-natrix",
    messageKey: "snake",
    messageNamespace: "snakeQuiz",
    ogImage: "/images/guides/snake-quiz-og.jpg",
    generator: "snake",
    questions: QUIZ_LENGTH,
  },
  {
    id: "lizard",
    status: "soon",
    group: "lizard",
    heroSpeciesId: "pseudopus-apodus",
    messageKey: "lizard",
    messageNamespace: "snakeQuiz",
    ogImage: "/images/guides/snake-quiz-og.jpg",
  },
  {
    id: "turtle",
    status: "soon",
    group: "turtle",
    heroSpeciesId: "testudo-graeca",
    messageKey: "turtle",
    messageNamespace: "snakeQuiz",
    ogImage: "/images/guides/snake-quiz-og.jpg",
  },
] as const satisfies readonly QuizDefinition[];

export type LiveQuizDefinition = Extract<
  (typeof QUIZ_INDEX)[number],
  { status: "live" }
>;

export function getQuizById(id: string) {
  return QUIZ_INDEX.find((quiz) => quiz.id === id);
}

export function liveQuizzes() {
  return QUIZ_INDEX.filter(
    (quiz): quiz is LiveQuizDefinition =>
      quiz.status === "live" && Boolean(quiz.slugs),
  );
}

export function resolveQuizBySlug(locale: AppLocale, slug: string) {
  return liveQuizzes().find((quiz) => quiz.slugs[locale] === slug);
}

export function quizHref(id: string, locale: AppLocale): QuizHref {
  const quiz = getQuizById(id);
  const slug = quiz?.status === "live" ? quiz.slugs[locale] : undefined;
  if (!slug) {
    return { pathname: "/quiz/[slug]", params: { slug: "romeli-gvelia" } };
  }
  return { pathname: "/quiz/[slug]", params: { slug } };
}

export function quizStaticParams() {
  return routing.locales.flatMap((locale) =>
    liveQuizzes().map((quiz) => ({
      locale,
      slug: quiz.slugs[locale],
    })),
  );
}
