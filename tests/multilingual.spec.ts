import { expect, test } from "@playwright/test";

const locales = [
  { code: "en", switchText: "EN" },
  { code: "zh-CN", switchText: "简" },
  { code: "zh-HK", switchText: "繁" },
] as const;

const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
];

test.describe.configure({ mode: "serial" });

test("all portfolio locales share one responsive interaction system", async ({ browser }) => {
  for (const locale of locales) {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport });
      await context.addInitScript((value) => localStorage.setItem("portfolio-locale", value), locale.code);
      const page = await context.newPage();
      const navigations: string[] = [];
      page.on("framenavigated", frame => { if (frame === page.mainFrame()) navigations.push(frame.url()); });

      await page.goto("/", { waitUntil: "networkidle" });
      await expect(page.getByTestId("hero")).toBeVisible();
      await expect(page.getByTestId("site-nav")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", locale.code);
      await expect(page.locator("body")).not.toContainText("undefined");
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width + 3);

      const sections = ["work-section", "projects-section", "education-section", "beyond-work-section", "contact-section"];
      for (const section of sections) await expect(page.getByTestId(section)).toHaveCount(1);

      if (viewport.width <= 1100) {
        await page.getByRole("button", { name: /navigation menu|导航菜单|導覽選單/i }).click();
        await expect(page.locator(".compact-navigation-language .language-switcher")).toBeVisible();
      }

      const languageButton = page.locator(".language-switcher:visible button").filter({ hasText: locale.switchText });
      await expect(languageButton).toBeVisible();
      const navigationCountBeforeSwitch = navigations.length;
      await languageButton.click();
      await expect(page.locator("html")).toHaveAttribute("lang", locale.code);
      expect(navigations).toHaveLength(navigationCountBeforeSwitch);

      if (viewport.width <= 1100) await page.getByRole("button", { name: /navigation menu|导航菜单|導覽選單/i }).click();

      const work = page.getByTestId("work-section");
      await work.scrollIntoViewIfNeeded();
      const workRow = work.getByTestId("work-row").first();
      await workRow.getByRole("button").click();
      await expect(workRow.getByTestId("work-panel")).toBeVisible();

      const projects = page.getByTestId("projects-section");
      await projects.scrollIntoViewIfNeeded();
      const projectRow = projects.getByTestId("project-row").first();
      await projectRow.getByRole("button").click();
      await expect(projectRow.getByTestId("project-panel")).toBeVisible();

      if (viewport.width >= 1100) {
        const education = page.getByTestId("education-section");
        await education.scrollIntoViewIfNeeded();
        await education.getByRole("button", { name: /degree credential|学位证书|學位證書/i }).click();
        await expect(page.locator(".credential-lightbox")).toBeVisible();
        await page.locator(".credential-lightbox__close").click();

        const beyond = page.getByTestId("beyond-work-section");
        await beyond.scrollIntoViewIfNeeded();
        await beyond.getByTestId("travel-card").first().click();
        await expect(page.getByTestId("travel-lightbox")).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.getByTestId("travel-lightbox")).toHaveCount(0);
      }

      await context.close();
    }
  }
});
