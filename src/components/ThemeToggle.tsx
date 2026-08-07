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
      ? "border-white/18 bg-white/10 text-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:border-white/35 hover:bg-white/14 hover:text-white"
      : "border-border/80 bg-card/90 text-muted-foreground shadow-[0_8px_28px_rgba(14,20,17,0.06)] backdrop-blur-xl hover:border-primary/35 hover:text-foreground hover:shadow-[0_10px_36px_rgba(47,107,79,0.12)]";

  return (
    <button
      type="button"
      aria-label={isDark ? t("toLight") : t("toDark")}
      title={isDark ? t("toLight") : t("toDark")}
      onClick={toggleTheme}
      className={`inline-flex size-10 items-center justify-center rounded-full border transition-all duration-300 ${buttonClass}`}
    >
      {isDark ? (
        <Sun className="size-3.5" aria-hidden="true" />
      ) : (
        <Moon className="size-3.5" aria-hidden="true" />
      )}
    </button>
  );
}
