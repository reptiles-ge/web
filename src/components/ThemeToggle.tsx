"use client";

import { useTheme } from "@/components/ThemeProvider";
import {
  chromeIconButtonBase,
  chromeIconButtonClass,
} from "@/lib/chromeStyles";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

type ThemeToggleProps = {
  variant?: "light" | "dark";
};

export function ThemeToggle({ variant = "light" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("theme");
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? t("toLight") : t("toDark")}
      title={isDark ? t("toLight") : t("toDark")}
      onClick={toggleTheme}
      className={`${chromeIconButtonBase} ${chromeIconButtonClass(variant)}`}
    >
      {isDark ? (
        <Sun className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Moon className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  );
}
