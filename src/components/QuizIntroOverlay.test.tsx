import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import type { QuizCopyNamespace } from "@/lib/quizzes";

import { QuizCopyProvider } from "@/components/QuizCopyContext";
import { QuizIntroOverlay } from "@/components/QuizIntroOverlay";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";

const messages = { en, ka, ru, tr };

function renderOverlay(
  locale: keyof typeof messages,
  quizId: string,
  namespace: QuizCopyNamespace,
  onStart = () => {},
) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      <QuizCopyProvider namespace={namespace}>
        <QuizIntroOverlay
          headingId="quiz-heading"
          onStart={onStart}
          quizId={quizId}
        />
      </QuizCopyProvider>
    </NextIntlClientProvider>,
  );
}

describe("QuizIntroOverlay", () => {
  it.each(["ka", "en", "ru", "tr"] as const)(
    "renders the snake quiz 112 call as a full-width tel button in %s",
    (locale) => {
      renderOverlay(locale, "snake", "snakeQuiz");
      const call = screen.getByRole("link", {
        name: messages[locale].snakeQuiz.startEmergency,
      });
      expect(call).toHaveAttribute("href", "tel:112");
      expect(call).toHaveClass("min-h-12", "w-full");
    },
  );

  it.each(["ka", "en", "ru", "tr"] as const)(
    "links the snake quiz intro to the ID guide and species index in %s",
    (locale) => {
      const { container } = renderOverlay(locale, "snake", "snakeQuiz");
      const hrefs = Array.from(container.querySelectorAll("p a")).map((link) =>
        link.getAttribute("href"),
      );
      expect(hrefs).toHaveLength(2);
      expect(hrefs.every(Boolean)).toBe(true);
      expect(new Set(hrefs).size).toBe(2);
    },
  );

  it("keeps the ID links off the lizard quiz intro", () => {
    const { container } = renderOverlay("en", "lizard", "lizardQuiz");
    expect(container.querySelectorAll("p a")).toHaveLength(0);
  });

  it("starts the quiz from the start button", () => {
    const onStart = vi.fn();
    renderOverlay("en", "snake", "snakeQuiz", onStart);
    fireEvent.click(screen.getByRole("button", { name: en.snakeQuiz.start }));
    expect(onStart).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("heading", { level: 1, name: en.snakeQuiz.title }),
    ).toHaveAttribute("id", "quiz-heading");
  });

  it("keeps the snake safety links off the lizard quiz", () => {
    renderOverlay("en", "lizard", "lizardQuiz");
    expect(screen.queryByRole("link", { name: /112/ })).toBeNull();
  });
});
