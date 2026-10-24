import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SITE_PAGE_GROUPS } from "@/lib/sitePageGroups";

import { CachePage } from "./CachePage";
import { clearPageGroupCache, fetchPageGroups } from "./site";
import { SessionExpiredError } from "./species";

vi.mock("./site", () => ({
  clearPageGroupCache: vi.fn(),
  fetchPageGroups: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(fetchPageGroups).mockReset().mockResolvedValue(SITE_PAGE_GROUPS);
  vi.mocked(clearPageGroupCache).mockReset();
});

async function clearRow(label: string) {
  const row = (await screen.findByText(label)).closest("tr")!;
  await userEvent.click(
    within(row).getByRole("button", { name: "Clear cache" }),
  );
  const popup = (
    await screen.findByText(`Clear the cache of ${label}?`)
  ).closest(".ant-popover") as HTMLElement;
  await userEvent.click(
    within(popup).getByRole("button", { name: "Clear cache" }),
  );
  return row;
}

describe("CachePage", () => {
  it("lists every page group with its routes", async () => {
    render(<CachePage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("About")).toBeInTheDocument();
    expect(screen.getByText("/[locale]/about")).toBeInTheDocument();
    expect(
      screen.getByText("/[locale]/snakes (all pages under it)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${SITE_PAGE_GROUPS.length} of ${SITE_PAGE_GROUPS.length} page groups`,
      ),
    ).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Search page groups"), "snake");
    expect(screen.queryByText("About")).toBeNull();
  });

  it("clears one group after confirmation", async () => {
    vi.mocked(clearPageGroupCache).mockResolvedValue();
    render(<CachePage onSessionExpired={vi.fn()} />);
    await clearRow("About");
    expect(clearPageGroupCache).toHaveBeenCalledExactlyOnceWith("about");
    expect(
      await screen.findByText("Cache cleared: About."),
    ).toBeInTheDocument();
  });

  it("marks the whole-site clear as dangerous", async () => {
    render(<CachePage onSessionExpired={vi.fn()} />);
    const row = (await screen.findByText("Whole site")).closest("tr")!;
    expect(
      within(row).getByRole("button", { name: "Clear cache" }),
    ).toHaveClass("ant-btn-dangerous");
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(fetchPageGroups).mockRejectedValue(new SessionExpiredError());
    const expired = vi.fn();
    render(<CachePage onSessionExpired={expired} />);
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });
});
