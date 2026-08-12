import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const cases = [
  { name: "1536", width: 1536, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1024", width: 1024, height: 800 },
  { name: "768", width: 768, height: 1024 },
  { name: "430", width: 430, height: 900 },
  { name: "390", width: 390, height: 844 },
  { name: "375", width: 375, height: 812 },
  { name: "360", width: 360, height: 800 },
  { name: "320", width: 320, height: 760 },
  { name: "900", width: 900, height: 800 },
  { name: "600", width: 600, height: 900 },
  { name: "500", width: 500, height: 900 },
];

const screenshotDir = path.resolve(process.cwd(), "qa-artifacts", "screenshots");

test.describe.configure({ mode: "serial" });

test("narrow viewport layout remains one responsive composition", async ({ browser }) => {
  fs.mkdirSync(screenshotDir, { recursive: true });

  for (const viewport of cases) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    const runtimeErrors: string[] = [];
    const isBlockedExternalFont = (value: string) => value.includes("fonts.googleapis.com") || value.includes("ERR_NETWORK_ACCESS_DENIED");
    page.on("pageerror", error => runtimeErrors.push(error.message));
    page.on("console", message => { if (message.type() === "error" && !isBlockedExternalFont(message.text())) runtimeErrors.push(message.text()); });

    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts?.ready);

    const global = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>('[data-testid="site-nav"]');
      const rect = nav?.getBoundingClientRect();
      return {
        viewport: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        navLeft: rect?.left ?? -1,
        navRight: rect?.right ?? -1,
        navHeight: rect?.height ?? 0,
      };
    });
    expect(global.scrollWidth, `horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(viewport.width + 2);
    expect(global.navLeft, `header has a left gutter at ${viewport.width}px`).toBeLessThanOrEqual(0.5);
    expect(global.navRight, `header has a right gutter at ${viewport.width}px`).toBeGreaterThanOrEqual(viewport.width - 0.5);
    expect(global.navHeight, `header is unexpectedly tall at ${viewport.width}px`).toBeLessThanOrEqual(viewport.width <= 760 ? 76 : 120);

    const panels = await page.locator("[data-deck-panel]").evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width };
    }));
    expect(panels.length).toBeGreaterThanOrEqual(5);
    const reference = panels[0];
    for (const [index, panel] of panels.entries()) {
      expect(panel.width, `section panel ${index} collapsed at ${viewport.width}px`).toBeGreaterThan(viewport.width * 0.75);
      expect(Math.abs(panel.left - reference.left), `section left grid diverged at ${viewport.width}px`).toBeLessThanOrEqual(2);
      expect(Math.abs(panel.right - reference.right), `section right grid diverged at ${viewport.width}px`).toBeLessThanOrEqual(2);
    }

    const menu = page.getByRole("button", { name: "Open navigation menu" });
    if (viewport.width <= 1100) {
      await expect(menu).toBeVisible();
      await menu.click();
      await expect(page.locator("#compact-navigation-menu")).toBeVisible();
      expect((await page.evaluate(() => document.documentElement.scrollWidth))).toBeLessThanOrEqual(viewport.width + 2);
      await page.getByRole("button", { name: "Close navigation menu" }).click();
    } else {
      await expect(menu).toBeHidden();
      await expect(page.locator('[data-testid="site-nav"] .nav-links')).toBeVisible();
    }

    if (viewport.width <= 600) {
      const work = page.getByTestId("work-section");
      await work.scrollIntoViewIfNeeded();
      const row = work.getByTestId("work-row").first();
      await row.getByRole("button").click();
      await expect(row.getByTestId("work-panel")).toBeVisible();
      const rowBox = await row.boundingBox();
      const panelBox = await row.getByTestId("work-panel").boundingBox();
      expect(rowBox).not.toBeNull();
      expect(panelBox).not.toBeNull();
      if (rowBox && panelBox) expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(viewport.width + 2);
    }

    if (viewport.width <= 1100) {
      const firstWorkSummary = page.getByTestId("work-row").first().locator(".experience-index-summary");
      await expect(firstWorkSummary).toBeVisible();
      expect(await firstWorkSummary.evaluate(element => Number.parseFloat(getComputedStyle(element).opacity))).toBeGreaterThan(0.8);

      const compactState = await page.evaluate(() => {
        const section = document.querySelector<HTMLElement>('[data-testid="education-section"]');
        const compact = section?.querySelector<HTMLElement>(".academic-journey-responsive-ui");
        const desktop = section?.querySelector<HTMLElement>(".academic-journey-desktop-scene");
        const years = section?.querySelector<HTMLElement>(".academic-responsive-years");
        const polyu = section?.querySelector<HTMLElement>(".academic-path-card--polyu");
        const recognition = section?.querySelector<HTMLElement>(".academic-highlights-compact");
        const bridge = section?.querySelector<HTMLElement>(".academic-responsive-bridge");
        const hkust = section?.querySelector<HTMLElement>(".academic-path-card--hkust");
        const visible = (element: HTMLElement | null) => Boolean(element && getComputedStyle(element).display !== "none" && element.getBoundingClientRect().height > 0);
        return {
          compactVisible: visible(compact),
          desktopHidden: desktop ? getComputedStyle(desktop).display === "none" : false,
          yearRailHidden: years ? getComputedStyle(years).display === "none" : false,
          order: [polyu, recognition, bridge, hkust].map(element => element?.getBoundingClientRect().top ?? -1),
          heroPortrait: document.querySelector<HTMLElement>('[data-testid="hero-portrait"]')?.getBoundingClientRect().toJSON(),
          hero: document.querySelector<HTMLElement>('[data-testid="hero"]')?.getBoundingClientRect().toJSON(),
          reading: document.querySelector<HTMLElement>("#reading > .section-wrap")?.getBoundingClientRect().toJSON(),
        };
      });
      expect(compactState.compactVisible, `compact Academic UI missing at ${viewport.width}px`).toBe(true);
      expect(compactState.desktopHidden, `desktop Academic scene remains at ${viewport.width}px`).toBe(true);
      expect(compactState.yearRailHidden, `decorative year rail remains at ${viewport.width}px`).toBe(true);
      expect(compactState.order.every((value, index, values) => index === 0 || value > values[index - 1]), `Academic order is not vertical at ${viewport.width}px`).toBe(true);
      if (compactState.heroPortrait && compactState.hero) {
        expect(compactState.heroPortrait.x).toBeGreaterThanOrEqual(compactState.hero.x - 1);
        expect(compactState.heroPortrait.right).toBeLessThanOrEqual(compactState.hero.right + 1);
      }
      if (compactState.reading) {
        expect(compactState.reading.x).toBeGreaterThanOrEqual(-1);
        expect(compactState.reading.right).toBeLessThanOrEqual(viewport.width + 1);
      }
    }

    expect(runtimeErrors.filter(error => !isBlockedExternalFont(error)), `runtime errors at ${viewport.width}px`).toEqual([]);
    if ([1536, 1280, 1024, 768, 900, 600, 500, 430, 390, 375, 360, 320].includes(viewport.width)) {
      await page.screenshot({ path: path.join(screenshotDir, `responsive-${viewport.name}.png`), fullPage: true });
    }
    await context.close();
  }
});
