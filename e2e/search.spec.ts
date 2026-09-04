import { expect, test } from "@playwright/test";

test("Cmd+K finds გიურზა", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+K");
  const search = page.getByRole("combobox", { name: "ძებნა" });
  await expect(search).toBeVisible();
  await search.fill("გიურზა");
  await expect(page.getByRole("option", { name: /გიურზა/ }).first()).toBeVisible();
});
