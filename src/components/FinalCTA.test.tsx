import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { FinalCTA } from "@/components/FinalCTA";

import en from "../../messages/en.json";

vi.mock("@/i18n/navigation", () => ({
  getPathname: ({ href, locale }: { href: string; locale: string }) =>
    `/${locale}${href}`,
  Link: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ namespace }: { namespace: "search" }) =>
    createTranslator({ locale: "en", messages: en, namespace }),
}));

describe("FinalCTA", () => {
  it("exposes the atlas search form as the read-only search_species WebMCP tool", async () => {
    render(await FinalCTA({ locale: "en" }));

    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("action", "/en/species");
    expect(form).toHaveAttribute("toolname", "search_species");
    expect(form).toHaveAttribute("tooldescription", en.search.toolDescription);
    expect(screen.getByRole("searchbox")).toHaveAttribute(
      "toolparamdescription",
      en.search.toolParamDescription,
    );
    expect(screen.getByRole("searchbox")).toHaveAttribute("name", "q");
  });
});
