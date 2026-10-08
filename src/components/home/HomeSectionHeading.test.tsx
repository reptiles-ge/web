import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomeSectionHeading } from "@/components/home/HomeSectionHeading";

describe("HomeSectionHeading", () => {
  it("renders the eyebrow, an h2 title and the subtitle", () => {
    render(
      <HomeSectionHeading
        eyebrow="Eyebrow"
        subtitle="Subtitle"
        title="Title"
      />,
    );
    expect(screen.getByText("Eyebrow")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
  });
});
