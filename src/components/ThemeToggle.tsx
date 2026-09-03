"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

import { useTheme } from "@/components/ThemeProvider";
import {
  chromeIconButtonBase,
  chromeIconButtonClass,
} from "@/lib/chromeStyles";
import { cn } from "@/lib/cn";

type ThemeToggleProps = {
  variant?: "dark" | "light";
};

export function ThemeToggle({ variant = "light" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("theme");
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? t("toLight") : t("toDark")}
      className={cn(chromeIconButtonBase, chromeIconButtonClass(variant))}
      onClick={toggleTheme}
      title={isDark ? t("toLight") : t("toDark")}
      type="button"
    >
      {isDark ? (
        <Sun aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
      ) : (
        <Moon aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
      )}
    </button>
  );
}
