import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SpeciesShareButton } from "@/components/SpeciesShareButton";

import ka from "../../messages/ka.json";

const SHARE = {
  displayUrl: "reptiles.ge/gvelebi/giurza",
  heading: "გიურზა (Macrovipera lebetinus) - შხამიანი სახეობაა.",
  text: "გიურზა (Macrovipera lebetinus) - შხამიანი სახეობაა.\n\n🔗 დეტალები: https://reptiles.ge/gvelebi/giurza",
  url: "https://reptiles.ge/gvelebi/giurza",
};

async function openDialog() {
  fireEvent.click(screen.getByRole("button", { name: "გაზიარება" }));
  return waitFor(() => screen.getByRole("dialog", { name: "გაზიარება" }));
}

function renderButton() {
  return render(
    <NextIntlClientProvider locale="ka" messages={ka}>
      <SpeciesShareButton
        ogImage="https://cdn.reptiles.ge/og/giurza.jpg"
        share={SHARE}
        speciesId="macrovipera-lebetina"
      />
    </NextIntlClientProvider>,
  );
}

describe("SpeciesShareButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = "";
  });

  it("opens the share dialog with the card preview, the url and six targets", async () => {
    renderButton();
    expect(screen.queryByRole("dialog")).toBeNull();

    const dialog = await openDialog();

    expect(dialog.querySelector("img")?.getAttribute("src")).toBe(
      "https://cdn.reptiles.ge/og/giurza.jpg",
    );
    expect(dialog.textContent).toContain("reptiles.ge/gvelebi/giurza");
    expect(dialog.textContent).toContain(ka.profile.shareHint);
    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Facebook",
      "Messenger",
      "WhatsApp",
      "Telegram",
      "Viber",
      "X",
    ]);
    expect(links[0].getAttribute("href")).toContain(
      encodeURIComponent(SHARE.url),
    );
    expect(links[0].getAttribute("target")).toBe("_blank");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("copies the url and shows the copied state", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    renderButton();
    await openDialog();

    fireEvent.click(screen.getByRole("button", { name: "კოპირება" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "დაკოპირდა" })).toBeTruthy(),
    );
    expect(writeText).toHaveBeenCalledWith(SHARE.url);
  });

  it("closes when the dialog closes and restores the scroll", async () => {
    renderButton();
    await openDialog();

    fireEvent(screen.getByRole("dialog"), new Event("close"));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.body.style.overflow).toBe("");

    await openDialog();
    fireEvent.click(screen.getAllByRole("button", { name: "დახურვა" })[1]);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
