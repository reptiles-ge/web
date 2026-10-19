import type { ComponentProps } from "react";

import { render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { NewsPagination } from "@/components/NewsPagination";

import en from "../../messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: async () =>
    createTranslator({ locale: "en", messages: en, namespace: "news" }),
}));

vi.mock("@/i18n/navigation", async () => {
  const { fakeGetPathname } = await import("../../tests/fixtures/manyNews");
  return {
    Link: ({
      href,
      ...props
    }: Omit<ComponentProps<"a">, "href"> & {
      href: Parameters<typeof fakeGetPathname>[0]["href"];
    }) => <a href={fakeGetPathname({ href, locale: "en" })} {...props} />,
  };
});

async function renderPagination(current: number, pageCount: number) {
  const node = await NewsPagination({ current, locale: "en", pageCount });
  return render(<>{node}</>);
}

describe("NewsPagination", () => {
  it("renders nothing while there is a single page", async () => {
    const { container } = await renderPagination(1, 1);
    expect(container).toBeEmptyDOMElement();
  });

  it("links page one to the older archive with plain anchors", async () => {
    await renderPagination(1, 3);
    expect(
      screen.getByRole("navigation", { name: "News pages" }),
    ).toBeVisible();
    expect(screen.queryByText("Newer articles")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Older articles" }),
    ).toHaveAttribute("href", "/en/news/page/2");
    expect(screen.getByLabelText("Page 1")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute(
      "href",
      "/en/news/page/3",
    );
  });

  it("links a middle page back to the index and on to older pages", async () => {
    await renderPagination(2, 9);
    expect(
      screen.getByRole("link", { name: "Newer articles" }),
    ).toHaveAttribute("href", "/en/news");
    expect(
      screen.getByRole("link", { name: "Older articles" }),
    ).toHaveAttribute("href", "/en/news/page/3");
    expect(screen.getByText("…")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Page 9" })).toBeInTheDocument();
  });

  it("drops the older link on the last page", async () => {
    await renderPagination(3, 3);
    expect(screen.queryByText("Older articles")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Newer articles" }),
    ).toHaveAttribute("href", "/en/news/page/2");
  });
});
