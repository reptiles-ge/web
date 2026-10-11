import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BackToTop, FooterLanguageSwitch } from "@/components/FooterControls";

import en from "../../messages/en.json";

afterEach(() => {
  vi.restoreAllMocks();
  document.head.innerHTML = "";
});

function mockReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches,
  } as MediaQueryList);
  return vi.spyOn(window, "scrollTo").mockImplementation(() => {});
}

describe("BackToTop", () => {
  it("scrolls to the top smoothly", () => {
    const scrollTo = mockReducedMotion(false);
    render(<BackToTop label="Back to top" text="Top" />);
    fireEvent.click(screen.getByRole("button", { name: "Back to top" }));
    expect(scrollTo).toHaveBeenCalledWith({ behavior: "smooth", top: 0 });
  });

  it("jumps without animation when reduced motion is preferred", () => {
    const scrollTo = mockReducedMotion(true);
    render(<BackToTop label="Back to top" text="Top" />);
    fireEvent.click(screen.getByRole("button", { name: "Back to top" }));
    expect(scrollTo).toHaveBeenCalledWith({ behavior: "auto", top: 0 });
  });
});

describe("FooterLanguageSwitch", () => {
  it("renders one radio per locale and marks the active one", () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <FooterLanguageSwitch />
      </NextIntlClientProvider>,
    );
    const group = screen.getByRole("radiogroup", { name: en.language.switch });
    expect(group).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(4);
    expect(screen.getByRole("radio", { name: en.language.en })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: en.language.ka })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByText("ქა")).toBeInTheDocument();
  });

  it("ignores a locale without an alternate link", () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <FooterLanguageSwitch />
      </NextIntlClientProvider>,
    );
    fireEvent.click(screen.getByRole("radio", { name: en.language.ka }));
    fireEvent.click(screen.getByRole("radio", { name: en.language.en }));
    expect(screen.getByRole("radio", { name: en.language.en })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });
});
