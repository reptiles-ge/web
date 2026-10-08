import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ClusterGuideLead } from "@/components/ClusterGuideLead";

describe("ClusterGuideLead", () => {
  it("renders the eyebrow and title", () => {
    render(
      <ClusterGuideLead
        eyebrow="Guide"
        paragraphs={["One"]}
        title="Lead title"
      />,
    );
    expect(screen.getByText("Guide")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Lead title" }),
    ).toBeInTheDocument();
  });

  it("renders each paragraph as its own <p>", () => {
    const { container } = render(
      <ClusterGuideLead
        eyebrow="e"
        paragraphs={["One", "Two", "Three"]}
        title="t"
      />,
    );
    expect(
      [...container.querySelectorAll("p")]
        .map((p) => p.textContent)
        .filter((text) => ["One", "Three", "Two"].includes(text ?? "")),
    ).toEqual(["One", "Two", "Three"]);
  });

  it("skips empty paragraphs", () => {
    render(
      <ClusterGuideLead
        eyebrow="e"
        paragraphs={["One", null, "Three"]}
        title="t"
      />,
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Three")).toBeInTheDocument();
  });

  it("prefers explicit body content over paragraphs", () => {
    render(
      <ClusterGuideLead
        body={<span>Custom body</span>}
        eyebrow="e"
        paragraphs={["Ignored"]}
        title="t"
      />,
    );
    expect(screen.getByText("Custom body")).toBeInTheDocument();
    expect(screen.queryByText("Ignored")).not.toBeInTheDocument();
  });

  it("links an emergency number inside a paragraph", () => {
    render(
      <ClusterGuideLead eyebrow="e" paragraphs={["Call 112."]} title="t" />,
    );
    expect(screen.getByRole("link", { name: "112" })).toHaveAttribute(
      "href",
      "tel:112",
    );
  });
});
