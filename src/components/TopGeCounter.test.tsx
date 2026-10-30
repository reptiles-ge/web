import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { secureTopGeLinks, TopGeCounter } from "@/components/TopGeCounter";

vi.mock("next/script", () => ({ default: () => null }));

function counterLink(href: string) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  return link;
}

describe("TopGeCounter", () => {
  it("rewrites the link counter.js adds to https", async () => {
    const { container } = render(<TopGeCounter />);
    const counter = container.querySelector("#top-ge-counter-container")!;
    const link = counterLink("http://www.top.ge/index.php?h=118888#118888");
    counter.appendChild(link);

    await waitFor(() =>
      expect(link.getAttribute("href")).toBe(
        "https://www.top.ge/index.php?h=118888#118888",
      ),
    );
    expect(link.getAttribute("rel")).toBe("nofollow noopener");
  });
});

describe("secureTopGeLinks", () => {
  it("upgrades top.ge links and leaves other hosts alone", () => {
    const container = document.createElement("div");
    const topGe = counterLink("http://top.ge/index.php?h=1");
    const other = counterLink("http://example.com/");
    container.append(topGe, other);

    secureTopGeLinks(container);

    expect(topGe.getAttribute("href")).toBe("https://top.ge/index.php?h=1");
    expect(other.getAttribute("href")).toBe("http://example.com/");
    expect(other.getAttribute("rel")).toBe("nofollow noopener");
  });
});
