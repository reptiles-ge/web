import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("admin App", () => {
  it("greets the admin", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Hello Admin" }),
    ).toBeInTheDocument();
  });
});
