import { expect, type Page, test } from "@playwright/test";
import path from "node:path";

const axeSource = path.join(process.cwd(), "node_modules/axe-core/axe.min.js");

async function axeInclude(page: Page, include: string) {
  await page.addScriptTag({ path: axeSource });
  return page.evaluate(async (selector) => {
    const axe = (
      window as unknown as {
        axe: {
          run: (
            context: string,
            options: { reporter: string },
          ) => Promise<{
            violations: Array<{ help: string; id: string }>;
          }>;
        };
      }
    ).axe;
    return axe.run(selector, { reporter: "v2" });
  }, include);
}

test("species gallery has no axe violations", async ({ page }) => {
  await page.goto("/gvelebi/giurza");
  await page.locator("#gallery").scrollIntoViewIfNeeded();
  const results = await axeInclude(page, "#gallery");
  expect(results.violations).toEqual([]);
});

test("gallery lightbox uses a modal dialog and restores focus", async ({
  page,
}) => {
  await page.goto("/gvelebi/giurza");
  const gallery = page
    .locator("section")
    .filter({ has: page.locator("#gallery") });
  const thumb = gallery.locator("button").first();
  await thumb.scrollIntoViewIfNeeded();
  await thumb.click();
  const dialog = page.locator("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(thumb).toBeFocused();
});

test("header search overlay has no axe violations", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+K");
  const search = page.getByRole("combobox", { name: "ძებნა" });
  await expect(search).toBeVisible();
  await search.fill("გიურზა");
  await expect(
    page.getByRole("option", { name: /გიურზა/ }).first(),
  ).toBeVisible();
  const results = await axeInclude(page, '[role="listbox"]');
  expect(results.violations).toEqual([]);
});
