"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

type ThemeToggleProps = {
  variant?: "light" | "dark";
};

export function ThemeToggle({ variant = "light" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("theme");
  const isDark = theme === "dark";

  const buttonClass =
    variant === "dark"
      ? "border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
      : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground";

  return (
    <button
      type="button"
      aria-label={isDark ? t("toLight") : t("toDark")}
      title={isDark ? t("toLight") : t("toDark")}
      onClick={toggleTheme}
      className={`inline-flex size-10 items-center justify-center rounded-full border transition-colors ${buttonClass}`}
    >
      {isDark ? (
        <Sun className="size-3.5" aria-hidden="true" />
      ) : (
        <Moon className="size-3.5" aria-hidden="true" />
      )}
    </button>
  );
}
