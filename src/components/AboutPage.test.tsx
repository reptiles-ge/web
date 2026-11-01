import { render, screen } from "@testing-library/react";
import { createTranslator, NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { AboutEditorial } from "@/components/AboutPage";

import en from "../../messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ namespace }: { namespace: "about" }) =>
    createTranslator({ locale: "en", messages: en, namespace }),
}));

describe("AboutEditorial", () => {
  it("renders the editorial policy with a corrections link to the contact page", async () => {
    const node = await AboutEditorial({ locale: "en" });
    const { container } = render(
      <NextIntlClientProvider locale="en" messages={en}>
        {node}
      </NextIntlClientProvider>,
    );

    expect(container.querySelector("section#editorial")).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: en.about.editorialTitle }),
    ).toBeInTheDocument();
    for (const title of [
      en.about.workflowTitle,
      en.about.correctionsTitle,
      en.about.independenceTitle,
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("link", { name: en.about.correctionsCta }),
    ).toHaveAttribute("href", "/contact");
  });
});
