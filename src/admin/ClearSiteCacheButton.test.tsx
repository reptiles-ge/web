import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClearSiteCacheButton } from "./ClearSiteCacheButton";
import { clearSiteCache } from "./site";
import { SessionExpiredError } from "./species";

vi.mock("./site", () => ({ clearSiteCache: vi.fn() }));

beforeEach(() => {
  vi.mocked(clearSiteCache).mockReset();
});

async function confirm(onSessionExpired = vi.fn()) {
  const user = userEvent.setup();
  render(<ClearSiteCacheButton onSessionExpired={onSessionExpired} />);
  await user.click(screen.getByRole("button", { name: "Clear site cache" }));
  expect(clearSiteCache).not.toHaveBeenCalled();
  expect(await screen.findByText("Clear the site cache?")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Clear cache" }));
  return onSessionExpired;
}

describe("ClearSiteCacheButton", () => {
  it("clears the cache after confirmation and says how many species were refetched", async () => {
    vi.mocked(clearSiteCache).mockResolvedValue([
      "bubo-bubo",
      "macrovipera-lebetina",
    ]);
    await confirm();
    expect(clearSiteCache).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText(
        "Site cache cleared. 2 recently edited species refetched.",
      ),
    ).toBeTruthy();
  });

  it("confirms a clear with no recent edits", async () => {
    vi.mocked(clearSiteCache).mockResolvedValue([]);
    await confirm();
    expect(await screen.findByText("Site cache cleared.")).toBeTruthy();
  });

  it("reports a failure", async () => {
    vi.mocked(clearSiteCache).mockImplementation(async () => {
      throw new Error("502");
    });
    const onSessionExpired = await confirm();
    expect(
      await screen.findByText(
        "The site cache could not be cleared. Try again in a minute.",
      ),
    ).toBeTruthy();
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(clearSiteCache).mockImplementation(async () => {
      throw new SessionExpiredError();
    });
    const onSessionExpired = await confirm();
    await vi.waitFor(() => expect(onSessionExpired).toHaveBeenCalledTimes(1));
  });
});
