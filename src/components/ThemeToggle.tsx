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
  variant?: "dark" | "light" | "menu";
};

export function ThemeToggle({ variant = "light" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("theme");
  const isDark = theme === "dark";
  const iconClass = variant === "menu" ? "size-[18px]" : "size-3.5";

  return (
    <button
      aria-label={isDark ? t("toLight") : t("toDark")}
      className={
        variant === "menu"
          ? "inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/35"
          : cn(chromeIconButtonBase, chromeIconButtonClass(variant))
      }
      onClick={toggleTheme}
      title={isDark ? t("toLight") : t("toDark")}
      type="button"
    >
      {isDark ? (
        <Sun aria-hidden="true" className={iconClass} strokeWidth={1.75} />
      ) : (
        <Moon aria-hidden="true" className={iconClass} strokeWidth={1.75} />
      )}
    </button>
  );
}
