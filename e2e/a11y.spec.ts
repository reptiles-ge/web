import { createRequire } from "node:module";

import { expect, test, type Page } from "@playwright/test";

const require = createRequire(import.meta.url);
const axeSource = require.resolve("axe-core/axe.min.js");

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
            violations: Array<{ id: string; help: string }>;
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
