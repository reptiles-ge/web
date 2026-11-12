import type { ReactNode } from "react";

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { SavedSpeciesCard } from "@/lib/savedSpeciesCards";

import { SavedHeaderButton } from "@/components/SavedHeaderButton";
import { SavedPage } from "@/components/SavedPage";
import { SpeciesSaveButton } from "@/components/SpeciesSaveButton";
import { resetSavedCardsCache } from "@/components/useSavedCards";
import {
  getSavedEntries,
  resetSavedSpeciesCache,
  SAVED_STORAGE_KEY,
} from "@/lib/savedSpecies";
import { printDate, savedAgoMessage } from "@/lib/savedSpeciesFormat";

import ka from "../../messages/ka.json";
import { server } from "../../tests/msw/server";

const pathname = vi.hoisted(() => ({ current: "/snakes/[slug]" }));

vi.mock("@/i18n/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/i18n/navigation")>()),
  usePathname: () => pathname.current,
}));

const CARDS: SavedSpeciesCard[] = [
  {
    commonName: "გიურზა",
    danger: "High",
    href: { params: { slug: "giurza" }, pathname: "/snakes/[slug]" },
    id: "macrovipera-lebetina",
    publicUrl: "reptiles.ge/gvelebi/giurza",
    regions: ["ქვემო ქართლი", "კახეთი"],
    scientificName: "Macrovipera lebetinus",
    thumb: "https://cdn.reptiles.ge/giurza.webp",
  },
  {
    commonName: "წყლის ანკარა",
    danger: "Harmless",
    href: { params: { slug: "tsklis-ankara" }, pathname: "/snakes/[slug]" },
    id: "natrix-tessellata",
    publicUrl: "reptiles.ge/gvelebi/tsklis-ankara",
    regions: [],
    scientificName: "Natrix tessellata",
    thumb: "https://cdn.reptiles.ge/natrix.webp",
  },
];

function seed(ids: string[]) {
  const now = Date.now();
  window.localStorage.setItem(
    SAVED_STORAGE_KEY,
    JSON.stringify(
      ids.map((id, index) => ({ id, savedAt: now - index * 1000 })),
    ),
  );
  resetSavedSpeciesCache();
}

function wrap(node: ReactNode) {
  return render(
    <NextIntlClientProvider locale="ka" messages={ka}>
      {node}
    </NextIntlClientProvider>,
  );
}

async function wrapAsync(node: ReactNode) {
  await act(async () => {
    wrap(node);
  });
}

describe("saved species UI", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetSavedSpeciesCache();
    resetSavedCardsCache();
    pathname.current = "/snakes/[slug]";
    server.use(http.get("*/api/saved/:locale", () => HttpResponse.json(CARDS)));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("saves from the species page, shows the toast and undoes", async () => {
    wrap(<SpeciesSaveButton name="გიურზა" speciesId="macrovipera-lebetina" />);

    fireEvent.click(screen.getByRole("button", { name: "შენახვა" }));
    expect(getSavedEntries().map((entry) => entry.id)).toEqual([
      "macrovipera-lebetina",
    ]);
    const toast = await screen.findByRole("status");
    expect(within(toast).getByText("გიურზა შენახულია")).toBeTruthy();
    expect(
      screen
        .getByRole("button", { name: "შენახულიდან ამოღება" })
        .getAttribute("aria-pressed"),
    ).toBe("true");

    fireEvent.click(within(toast).getByRole("button", { name: "გაუქმება" }));
    expect(getSavedEntries()).toEqual([]);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("shows the count and the saved list in the header menu", async () => {
    seed(["macrovipera-lebetina", "natrix-tessellata"]);
    wrap(<SavedHeaderButton variant="dark" />);

    const button = screen.getByRole("button", { name: "შენახული (2)" });
    await act(async () => {
      fireEvent.click(button);
    });
    const menu = await screen.findByRole("dialog", { name: "შენახული" });
    expect(await within(menu).findByText("გიურზა")).toBeTruthy();
    expect(within(menu).getByText("ყველას ნახვა")).toBeTruthy();

    fireEvent.click(
      within(menu).getByRole("button", { name: "წაშლა: წყლის ანკარა" }),
    );
    expect(getSavedEntries().map((entry) => entry.id)).toEqual([
      "macrovipera-lebetina",
    ]);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("links to the saved page when nothing is saved and marks it current", () => {
    pathname.current = "/saved";
    wrap(<SavedHeaderButton variant="light" />);
    const link = screen.getByRole("link", { name: "შენახული" });
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(link.getAttribute("href")).toBe("/saved");
  });

  it("lists, filters, removes and restores saved species", async () => {
    seed(["macrovipera-lebetina", "natrix-tessellata"]);
    await wrapAsync(
      <SavedPage
        emptyImages={["/a.jpg", "/b.jpg"]}
        pageUrl="https://reptiles.ge/saved"
      />,
    );

    expect(
      screen.getByText("2 სახეობა · ბოლოს შენახული პირველია"),
    ).toBeTruthy();
    expect((await screen.findAllByText("გიურზა")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("2 რეგიონი").length).toBe(1);

    fireEvent.click(screen.getByRole("tab", { name: /შხამიანი/ }));
    expect(screen.queryAllByText("წყლის ანკარა")).toHaveLength(0);
    fireEvent.click(screen.getByRole("tab", { name: /ყველა/ }));

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "შენახულიდან ამოღება: წყლის ანკარა",
      })[0]!,
    );
    const toast = await screen.findByRole("status");
    expect(within(toast).getByText("წყლის ანკარა — ამოღებულია")).toBeTruthy();
    fireEvent.click(within(toast).getByRole("button", { name: "დაბრუნება" }));
    expect(getSavedEntries()).toHaveLength(2);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "az" } });
    const names = screen
      .getAllByRole("link", { name: /გიურზა|წყლის ანკარა/ })
      .map((link) => link.textContent);
    expect(names[0]).toContain("გიურზა");

    fireEvent.click(screen.getByRole("button", { name: "სიის გასუფთავება" }));
    expect(screen.getByText("ჯერ არაფერი შეგინახავს")).toBeTruthy();
  });

  it("imports a shared list from the address", async () => {
    window.history.replaceState(
      null,
      "",
      "/saved?ids=natrix-tessellata,bad%20id",
    );
    await wrapAsync(
      <SavedPage
        emptyImages={["/a.jpg", "/b.jpg"]}
        pageUrl="https://reptiles.ge/saved"
      />,
    );
    expect(await screen.findByText("სიას დაემატა 1 სახეობა")).toBeTruthy();
    expect(window.location.search).toBe("");
    expect(getSavedEntries().map((entry) => entry.id)).toEqual([
      "natrix-tessellata",
    ]);
  });

  it("copies a share link and prints the field list", async () => {
    seed(["macrovipera-lebetina", "natrix-tessellata"]);
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    const print = vi.fn();
    Object.defineProperty(window, "print", {
      configurable: true,
      value: print,
    });
    await wrapAsync(
      <SavedPage
        emptyImages={["/a.jpg", "/b.jpg"]}
        pageUrl="https://reptiles.ge/saved"
      />,
    );
    await screen.findAllByText("გიურზა");

    fireEvent.click(screen.getByRole("button", { name: "გაზიარება" }));
    await screen.findByText("ბმული დაკოპირდა");
    expect(writeText).toHaveBeenCalledWith(
      "https://reptiles.ge/saved?ids=macrovipera-lebetina%2Cnatrix-tessellata",
    );

    const sheetImages = () =>
      document.querySelectorAll<HTMLImageElement>("[data-print-sheet] img");
    fireEvent.click(screen.getByRole("button", { name: /საველე სია/ }));
    const sheet = document.querySelector("[data-print-sheet]");
    expect(sheet?.textContent).toContain("საველე სია");
    expect(sheet?.textContent).toContain("2 სახეობა · 1 შხამიანი · 1 უვნებელი");
    expect(sheet?.textContent).toContain("reptiles.ge/gvelebi/giurza");
    for (const image of sheetImages()) {
      act(() => {
        image.dispatchEvent(new Event("load"));
      });
    }
    await waitFor(() => expect(print).toHaveBeenCalled());
    act(() => {
      window.dispatchEvent(new Event("afterprint"));
    });
    expect(document.querySelector("[data-print-sheet]")).toBeNull();
  });

  it("formats relative save times and the print date", () => {
    const now = 10 * 24 * 3600 * 1000;
    expect(savedAgoMessage(now, now)).toEqual({ count: 0, key: "agoNow" });
    expect(savedAgoMessage(now - 2 * 24 * 3600 * 1000, now)).toEqual({
      count: 2,
      key: "agoDays",
    });
    expect(savedAgoMessage(now - 9 * 24 * 3600 * 1000, now)).toEqual({
      count: 1,
      key: "agoWeeks",
    });
    expect(printDate("en", new Date(Date.UTC(2026, 10, 12, 12)))).toContain(
      "2026",
    );
  });
});
