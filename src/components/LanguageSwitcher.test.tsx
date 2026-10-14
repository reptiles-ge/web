import type { ReactNode } from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace }),
}));

vi.mock("@/components/OverlayPanel", () => ({
  OverlayPanel: ({
    closeLabel,
    desktopContent,
    onClose,
    open,
  }: {
    closeLabel: string;
    desktopContent: ReactNode;
    onClose: () => void;
    open: boolean;
  }) =>
    open ? (
      <div>
        {desktopContent}
        <button onClick={onClose} type="button">
          {closeLabel}
        </button>
      </div>
    ) : null,
}));

afterEach(() => {
  replace.mockReset();
  document.head.innerHTML = "";
});

function addAlternate(hreflang: string, href: string) {
  const link = document.createElement("link");
  link.rel = "alternate";
  link.hreflang = hreflang;
  link.href = href;
  document.head.append(link);
}

function renderSwitcher(
  locale: AppLocale,
  variant?: "dark" | "light" | "menu",
) {
  const messages = locale === "ka" ? ka : en;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LanguageSwitcher variant={variant} />
    </NextIntlClientProvider>,
  );
}

describe("LanguageSwitcher", () => {
  it.each(["dark", "light"] as const)(
    "shows a globe icon button in the %s mobile header",
    (variant) => {
      renderSwitcher("en", variant);
      const [chip] = screen.getAllByRole("button", {
        name: en.language.switch,
      });
      expect(chip.querySelector("svg.lucide-globe")).not.toBeNull();
      expect(chip).toHaveAttribute("aria-haspopup", "dialog");
      expect(chip).toHaveAttribute("aria-expanded", "false");
      expect(chip.className).toContain("lg:hidden");
      expect(chip.className).toContain("size-10");
    },
  );

  it("labels the globe button in Georgian on KA pages", () => {
    renderSwitcher("ka");
    const [chip] = screen.getAllByRole("button", { name: ka.language.switch });
    expect(chip).not.toHaveTextContent("ქა");
    expect(chip.querySelector("svg.lucide-globe")).not.toBeNull();
  });

  it("opens the locale list and switches through the hreflang alternate", async () => {
    addAlternate("ka", "https://reptiles.ge/gvelebi");
    renderSwitcher("en");
    const [chip] = screen.getAllByRole("button", { name: en.language.switch });
    fireEvent.click(chip);
    expect(chip).toHaveAttribute("aria-expanded", "true");

    const lists = await screen.findAllByRole("listbox", {
      name: en.language.switch,
    });
    fireEvent.click(
      within(lists[0]).getByRole("option", { name: /Georgian|ქართული/ }),
    );
    expect(replace).toHaveBeenCalledWith("/gvelebi");
  });

  it("does nothing for the active locale or a missing alternate", async () => {
    renderSwitcher("en");
    fireEvent.click(
      screen.getAllByRole("button", { name: en.language.switch })[0],
    );
    const [list] = await screen.findAllByRole("listbox", {
      name: en.language.switch,
    });
    const options = within(list).getAllByRole("option");
    expect(options).toHaveLength(4);
    for (const option of options) fireEvent.click(option);
    expect(replace).not.toHaveBeenCalled();
  });

  it("toggles the desktop pill and closes from the panel", async () => {
    renderSwitcher("en", "light");
    const pill = screen.getAllByRole("button", { name: en.language.switch })[1];
    expect(pill).toHaveTextContent(en.language.en);
    fireEvent.click(pill);
    expect(pill).toHaveAttribute("aria-expanded", "true");
    await screen.findAllByRole("listbox", { name: en.language.switch });
    fireEvent.click(screen.getByRole("button", { name: en.language.close }));
    expect(pill).toHaveAttribute("aria-expanded", "false");
  });

  it("renders the drawer variant as a full-width button", () => {
    renderSwitcher("en", "menu");
    const button = screen.getByRole("button", { name: en.language.switch });
    expect(button).toHaveTextContent(en.language.en);
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
