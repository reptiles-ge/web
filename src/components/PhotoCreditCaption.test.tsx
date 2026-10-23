import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { ContributorsProvider } from "@/components/ContributorsProvider";
import { PhotoCreditCaption } from "@/components/PhotoCreditCaption";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: unknown }) => (
    <a href={String(href)}>{children}</a>
  ),
}));

function caption(
  props: Parameters<typeof PhotoCreditCaption>[0],
  locale: "en" | "ka" = "en",
) {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "en" ? en : ka}
    >
      <PhotoCreditCaption variant="lightbox" {...props} />
    </NextIntlClientProvider>,
  ).container;
}

describe("PhotoCreditCaption lightbox license note", () => {
  it("marks a photo used with permission", () => {
    expect(
      caption({ credit: { photographer: "Someone" }, usedWithPermission: true })
        .textContent,
    ).toBe("Photo: Someone · Used with permission");
    expect(
      caption(
        { credit: { photographer: "Someone" }, usedWithPermission: true },
        "ka",
      ).textContent,
    ).toBe("ფოტო: Someone · ნებართვით");
  });

  it("adds no note to other photos", () => {
    const text = caption({
      credit: {
        photographer: "Vojtěch Víta",
        url: "https://www.inaturalist.org/observations/238226101",
      },
    }).textContent;
    expect(text).toBe("Photo: Vojtěch Víta · iNaturalist");
    expect(text).not.toContain("permission");
  });

  it("shows nothing for an uncredited photo without place or date", () => {
    expect(caption({ credit: {} }).innerHTML).toBe("");
  });
});

describe("PhotoCreditCaption contributor link", () => {
  const directory = {
    byAlias: { "ზაური ხაჩიძე": "zauri-khachidze" },
    byId: {
      "zauri-khachidze": { kind: "person" as const, name: "Zauri Khachidze" },
    },
  };

  function linked(credit: Parameters<typeof PhotoCreditCaption>[0]["credit"]) {
    return render(
      <NextIntlClientProvider locale="en" messages={en}>
        <ContributorsProvider directory={directory}>
          <PhotoCreditCaption credit={credit} variant="lightbox" />
        </ContributorsProvider>
      </NextIntlClientProvider>,
    ).container;
  }

  it("links a credit to its contributor by author id", () => {
    const container = linked({
      authorId: "zauri-khachidze",
      photographer: "Zauri Khachidze",
    });
    expect(container.querySelector("a")?.textContent).toBe("Zauri Khachidze");
  });

  it("links a credit without an author id by its spelling, in the page locale", () => {
    const container = linked({ photographer: "ზაური ხაჩიძე" });
    expect(container.querySelector("a")?.textContent).toBe("Zauri Khachidze");
  });

  it("does not link someone who has no contributor page", () => {
    expect(
      linked({ authorId: "someone", photographer: "Someone" }).querySelector(
        "a",
      ),
    ).toBeNull();
  });
});
