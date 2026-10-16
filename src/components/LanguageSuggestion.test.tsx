import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { LanguageSuggestion } from "@/components/LanguageSuggestion";
import { LANGUAGE_SUGGESTION_KEY } from "@/lib/languageSuggestion";

const replace = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace }),
}));

function addAlternate(hreflang: string, href: string) {
  const link = document.createElement("link");
  link.rel = "alternate";
  link.hreflang = hreflang;
  link.href = href;
  document.head.append(link);
}

function renderSuggestion(locale: AppLocale) {
  return render(
    <NextIntlClientProvider locale={locale} messages={{}}>
      <LanguageSuggestion />
    </NextIntlClientProvider>,
  );
}

function setBrowser(languages: string[], userAgent = "Mozilla/5.0 Safari") {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(languages);
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(userAgent);
  vi.spyOn(navigator, "webdriver", "get").mockReturnValue(false);
}

beforeEach(() => {
  addAlternate("ka", "http://localhost/gvelebi");
  addAlternate("en", "http://localhost/en/snakes");
  addAlternate("ru", "http://localhost/ru/snakes");
});

afterEach(() => {
  replace.mockReset();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.localStorage.clear();
  document.head.innerHTML = "";
});

describe("LanguageSuggestion", () => {
  it("offers the browser language in that language and switches to it", async () => {
    setBrowser(["ru-RU"]);
    renderSuggestion("en");

    const action = await screen.findByRole("button", {
      name: "Перейти на русский",
    });
    expect(
      screen.getByText("Эта страница есть и на русском языке."),
    ).toBeTruthy();

    expect(
      screen
        .getByRole("region", { name: "Эта страница есть и на русском языке." })
        .hasAttribute("data-nosnippet"),
    ).toBe(true);

    fireEvent.click(action);
    expect(replace).toHaveBeenCalledWith("/ru/snakes");
    expect(window.localStorage.getItem(LANGUAGE_SUGGESTION_KEY)).toBe("1");
    expect(screen.queryByRole("button", { name: "Закрыть" })).toBeNull();
  });

  it("remembers a dismissal", async () => {
    setBrowser(["ru-RU"]);
    renderSuggestion("en");

    fireEvent.click(await screen.findByRole("button", { name: "Закрыть" }));
    expect(window.localStorage.getItem(LANGUAGE_SUGGESTION_KEY)).toBe("1");
    expect(replace).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: "Перейти на русский" }),
    ).toBeNull();
  });

  it("asks for the country on Georgian pages and stays quiet in Georgia", async () => {
    setBrowser(["en-US"]);
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ country: "GE" }));
    vi.stubGlobal("fetch", fetchMock);
    renderSuggestion("ka");

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith("/api/geo", {
        cache: "no-store",
        signal: expect.any(AbortSignal),
      }),
    );
    expect(
      screen.queryByRole("button", { name: "Switch to English" }),
    ).toBeNull();
  });

  it("suggests English on Georgian pages for readers abroad", async () => {
    setBrowser(["en-US"]);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ country: "DE" })),
    );
    renderSuggestion("ka");

    expect(
      await screen.findByRole("button", { name: "Switch to English" }),
    ).toBeTruthy();
  });

  it("shows nothing without a translation of the page", async () => {
    setBrowser(["tr-TR"]);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    renderSuggestion("en");

    await Promise.resolve();
    expect(screen.queryByRole("button", { name: "Türkçeye geç" })).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows nothing to crawlers or after an earlier choice", async () => {
    setBrowser(["ru-RU"], "Mozilla/5.0 (compatible; Googlebot/2.1)");
    const { unmount } = renderSuggestion("en");
    await Promise.resolve();
    expect(
      screen.queryByRole("button", { name: "Перейти на русский" }),
    ).toBeNull();
    unmount();

    setBrowser(["ru-RU"]);
    window.localStorage.setItem(LANGUAGE_SUGGESTION_KEY, "1");
    renderSuggestion("en");
    await Promise.resolve();
    expect(
      screen.queryByRole("button", { name: "Перейти на русский" }),
    ).toBeNull();
  });
});
