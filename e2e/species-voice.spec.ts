import { expect, test } from "@playwright/test";

test("the hero voice button is clickable on desktop", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/en/birds/bubo-bubo");
  const play = page.locator("#voice").getByRole("button", { name: "Play" });
  await expect(play).toBeVisible();
  await play.click({ timeout: 5_000, trial: true });
  await expect(
    page.locator("[data-species-gallery-src]").first(),
  ).toBeVisible();
});
