import { expect, test } from "@playwright/test";

function locationPath(headers: Record<string, string>) {
  const location = headers.location ?? headers.Location;
  expect(location).toBeTruthy();
  return new URL(location, "http://127.0.0.1").pathname;
}

test("giurza profile is indexable with Taxon JSON-LD", async ({ page }) => {
  const response = await page.goto("/gvelebi/giurza");
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toContainText("გიურზა");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/gvelebi\/giurza\/?$/,
  );
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(jsonLd.some((block) => block.includes('"Taxon"'))).toBe(true);
  const nodes = jsonLd.flatMap((block) => {
    const parsed = JSON.parse(block) as unknown;
    return (Array.isArray(parsed) ? parsed : [parsed]) as Record<
      string,
      unknown
    >[];
  });
  const article = nodes.find((block) => block["@type"] === "Article");
  expect(article).toBeTruthy();
  const author = article?.author as Record<string, unknown>;
  expect(author["@type"]).toBe("Organization");
  expect(JSON.stringify(author)).not.toContain("Person");
  expect(article).not.toHaveProperty("reviewedBy");
  expect(typeof article?.datePublished).toBe("string");
  expect(String(article?.datePublished)).toMatch(/^\d{4}-\d{2}-\d{2}/);
  expect(String(article?.datePublished)).not.toContain("Invalid");
  expect(typeof article?.dateModified).toBe("string");
});

test("English species page advertises KA as x-default", async ({ page }) => {
  await page.goto("/en/snakes/macrovipera-lebetina");
  await expect(
    page.locator('link[rel="alternate"][hreflang="x-default"]'),
  ).toHaveAttribute("href", /\/gvelebi\/giurza\/?$/);
});

test("/ka prefix 301s to the unprefixed default locale", async ({
  request,
}) => {
  const home = await request.get("/ka", { maxRedirects: 0 });
  expect(home.status()).toBe(301);
  expect(locationPath(home.headers())).toBe("/");

  const hub = await request.get("/ka/gvelebi", { maxRedirects: 0 });
  expect(hub.status()).toBe(301);
  expect(locationPath(hub.headers())).toBe("/gvelebi");
});

test("legacy /species/{id} 301s to the hub slug", async ({ request }) => {
  const response = await request.get("/species/macrovipera-lebetina", {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(301);
  expect(locationPath(response.headers())).toBe("/gvelebi/giurza");
});

test("unpublished caspius 302s to the snake hub", async ({ request }) => {
  const response = await request.get("/species/dolichophis-caspius", {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(302);
  expect(locationPath(response.headers())).toBe("/gvelebi");
});

test("filtered atlas is noindex", async ({ page }) => {
  const response = await page.goto("/species?type=snake");
  expect(response?.status()).toBe(200);
  const robots = await page
    .locator('meta[name="robots"]')
    .getAttribute("content");
  expect(robots ?? "").toMatch(/noindex/i);
});

test("quiz landing is indexable and play stays on the same URL", async ({
  page,
}) => {
  await page.goto("/quiz/romeli-gvelia");
  const robots = await page
    .locator('meta[name="robots"]')
    .getAttribute("content");
  expect(robots ?? "").not.toMatch(/noindex/i);
  await page.getByRole("button", { name: "დაწყება" }).click();
  await expect(page).toHaveURL(/\/quiz\/romeli-gvelia\/?$/);
  expect(page.url()).not.toMatch(/result/);
});

test("404 is noindex", async ({ page }) => {
  const response = await page.goto("/this-path-is-not-on-the-map-xyz");
  expect(response?.status()).toBe(404);
  const contents = await page
    .locator('meta[name="robots"]')
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("content") ?? ""),
    );
  expect(contents.length).toBeGreaterThan(0);
  expect(contents.every((value) => /noindex/i.test(value))).toBe(true);
});

test("Darevskia guide is distinct from lizard identify", async ({ page }) => {
  await page.goto("/xvlikebi/darevskia");
  await expect(page.locator("h1")).toContainText("Darevskia");
  await expect(page.locator("h1")).not.toHaveText("ეს რა ხვლიკია?");

  await page.goto("/xvlikebi/identifikacia");
  await expect(page.locator("h1")).toContainText("ეს რა ხვლიკია?");
});

test("Russian region page does not render English FAQ", async ({ page }) => {
  await page.goto("/ru/regions/adjara");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(
    "Which snakes occur in Adjara?",
  );
});

test.describe("JS-disabled shells", () => {
  test.use({ javaScriptEnabled: false });

  test("hub, species, about, and contact still render H1", async ({ page }) => {
    await page.goto("/gvelebi");
    await expect(page.locator("h1")).toBeVisible();

    await page.goto("/gvelebi/giurza");
    await expect(page.locator("h1")).toContainText("გიურზა");

    await page.goto("/about");
    await expect(page.locator("h1")).toBeVisible();

    await page.goto("/contact");
    await expect(page.locator("h1")).toBeVisible();
  });
});
