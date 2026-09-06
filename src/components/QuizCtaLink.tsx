"use client";

import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { type QuizCtaSource, trackEvent } from "@/lib/analytics";
import { quizHref } from "@/lib/quizzes";

export function QuizCtaLink({
  children,
  className,
  href,
  quizId,
  source,
  speciesId,
}: {
  children: ReactNode;
  className?: string;
  href: ReturnType<typeof quizHref>;
  quizId: string;
  source: QuizCtaSource;
  speciesId?: string;
}) {
  return (
    <Link
      className={className}
      href={href}
      onClick={() =>
        trackEvent("quiz_cta_click", {
          quiz_id: quizId,
          source,
          species_id: speciesId,
        })
      }
    >
      {children}
    </Link>
  );
}
