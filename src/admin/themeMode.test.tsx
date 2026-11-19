import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { ThemeModeProvider, ThemeModeSwitch, useThemeMode } from "./themeMode";

function Probe() {
  const { dark } = useThemeMode();
  return <output>{dark ? "dark" : "light"}</output>;
}

function renderSwitch() {
  return render(
    <ThemeModeProvider>
      <ThemeModeSwitch />
      <Probe />
    </ThemeModeProvider>,
  );
}

describe("theme mode", () => {
  afterEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("follows the system by default", () => {
    renderSwitch();
    expect(screen.getByRole("status")).toHaveTextContent("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("switches to dark and remembers it", async () => {
    renderSwitch();
    await userEvent.click(screen.getByText("Dark"));
    expect(screen.getByRole("status")).toHaveTextContent("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("admin:theme")).toBe("dark");
  });

  it("reads the stored mode and forgets it on Auto", async () => {
    window.localStorage.setItem("admin:theme", "dark");
    renderSwitch();
    expect(screen.getByRole("status")).toHaveTextContent("dark");
    await userEvent.click(screen.getByText("Auto"));
    expect(screen.getByRole("status")).toHaveTextContent("light");
    expect(window.localStorage.getItem("admin:theme")).toBeNull();
  });

  it("ignores an unknown stored value", () => {
    window.localStorage.setItem("admin:theme", "sepia");
    renderSwitch();
    expect(screen.getByRole("status")).toHaveTextContent("light");
  });
});
