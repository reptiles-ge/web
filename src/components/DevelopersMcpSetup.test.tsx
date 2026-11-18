import { act, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DevelopersMcpSetup } from "@/components/DevelopersMcpSetup";

import en from "../../messages/en.json";

const SERVER_URL = "https://api.reptiles.ge/v1/mcp";

function renderSetup() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <DevelopersMcpSetup serverUrl={SERVER_URL} />
    </NextIntlClientProvider>,
  );
}

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

afterEach(() => {
  vi.useRealTimers();
});

describe("DevelopersMcpSetup", () => {
  it("shows the server address and the Claude steps first", () => {
    renderSetup();
    expect(screen.getByText(SERVER_URL)).toBeTruthy();
    const panel = screen.getByRole("tabpanel");
    expect(panel.textContent).toContain("Add custom connector");
    expect(
      screen.getByRole("tab", { name: "Claude" }).getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("switches clients by click and arrow keys", () => {
    renderSetup();
    fireEvent.click(screen.getByRole("tab", { name: "Claude Code" }));
    expect(screen.getByRole("tabpanel").textContent).toContain(
      `claude mcp add --transport http reptiles ${SERVER_URL}`,
    );
    fireEvent.keyDown(screen.getByRole("tab", { name: "Claude Code" }), {
      key: "ArrowRight",
    });
    expect(screen.getByRole("tabpanel").textContent).toContain(`"mcpServers"`);
    fireEvent.keyDown(screen.getByRole("tab", { name: "Cursor" }), {
      key: "ArrowRight",
    });
    expect(screen.getByRole("tabpanel").textContent).toContain(
      "Add custom connector",
    );
    fireEvent.keyDown(screen.getByRole("tab", { name: "Claude" }), {
      key: "ArrowLeft",
    });
    expect(screen.getByRole("tabpanel").textContent).toContain(`"url"`);
    fireEvent.keyDown(screen.getByRole("tab", { name: "Cursor" }), {
      key: "Enter",
    });
    expect(screen.getByRole("tabpanel").textContent).toContain(`"url"`);
    fireEvent.click(screen.getByRole("tab", { name: "ChatGPT" }));
    expect(screen.getByRole("tabpanel").textContent).toContain(
      "Developer mode",
    );
  });

  it("copies the address and resets the label", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(async () => {});
    stubClipboard(writeText);
    renderSetup();
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Copy the server address" }),
      );
    });
    expect(writeText).toHaveBeenCalledWith(SERVER_URL);
    expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copied" }));
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(
      screen.getByRole("button", { name: "Copy the server address" }),
    ).toBeTruthy();
  });

  it("says so when the copy fails", async () => {
    stubClipboard(async () => {
      throw new Error("denied");
    });
    renderSetup();
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Copy the server address" }),
      );
    });
    expect(screen.getByRole("button", { name: "Could not copy" })).toBeTruthy();
  });
});
