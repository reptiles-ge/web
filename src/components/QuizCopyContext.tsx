"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useTranslations } from "next-intl";

import type { QuizCopyNamespace } from "@/lib/quizzes";

const QuizCopyNsContext = createContext<QuizCopyNamespace>("snakeQuiz");

export function QuizCopyProvider({
  children,
  namespace,
}: {
  children: ReactNode;
  namespace: QuizCopyNamespace;
}) {
  return (
    <QuizCopyNsContext.Provider value={namespace}>
      {children}
    </QuizCopyNsContext.Provider>
  );
}

export function useQuizCopy() {
  return useTranslations(useContext(QuizCopyNsContext));
}
