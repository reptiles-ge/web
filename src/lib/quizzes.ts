import { type AppLocale, routing } from "@/i18n/routing";
import { QUIZ_LENGTH } from "@/lib/snakeQuiz";

export type QuizDefinition = {
  generator?: QuizGenerator;
  group: QuizGroup;
  heroSpeciesId: string;
  id: QuizId;
  messageKey: QuizMessageKey;
  messageNamespace: "snakeQuiz";
  ogImage: string;
  questions?: number;
  slugs?: Record<AppLocale, string>;
  status: QuizStatus;
};
export type QuizGenerator = "snake";
export type QuizGroup = "lizard" | "snake" | "turtle";
export type QuizHref = {
  params: { slug: string };
  pathname: "/quiz/[slug]";
};
export type QuizId = "lizard" | "snake" | "turtle";

export type QuizMessageKey = QuizId;

export type QuizStatus = "live" | "soon";

export const QUIZ_INDEX = [
  {
    generator: "snake",
    group: "snake",
    heroSpeciesId: "natrix-natrix",
    id: "snake",
    messageKey: "snake",
    messageNamespace: "snakeQuiz",
    ogImage: "/images/guides/snake-quiz-og.jpg",
    questions: QUIZ_LENGTH,
    slugs: {
      en: "which-snake",
      ka: "romeli-gvelia",
      ru: "kakaya-zmeya",
      tr: "hangi-yilan",
    },
    status: "live",
  },
  {
    group: "lizard",
    heroSpeciesId: "pseudopus-apodus",
    id: "lizard",
    messageKey: "lizard",
    messageNamespace: "snakeQuiz",
    ogImage: "/images/guides/snake-quiz-og.jpg",
    status: "soon",
  },
  {
    group: "turtle",
    heroSpeciesId: "testudo-graeca",
    id: "turtle",
    messageKey: "turtle",
    messageNamespace: "snakeQuiz",
    ogImage: "/images/guides/snake-quiz-og.jpg",
    status: "soon",
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

export function quizHref(id: string, locale: AppLocale): QuizHref {
  const quiz = getQuizById(id);
  const slug = quiz?.status === "live" ? quiz.slugs[locale] : undefined;
  if (!slug) {
    return { params: { slug: "romeli-gvelia" }, pathname: "/quiz/[slug]" };
  }
  return { params: { slug }, pathname: "/quiz/[slug]" };
}

export function quizStaticParams() {
  return routing.locales.flatMap((locale) =>
    liveQuizzes().map((quiz) => ({
      locale,
      slug: quiz.slugs[locale],
    })),
  );
}

export function resolveQuizBySlug(locale: AppLocale, slug: string) {
  return liveQuizzes().find((quiz) => quiz.slugs[locale] === slug);
}
