import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

type ViewportCase = { name: string; width: number; height: number; dpr: number };

const viewports: ViewportCase[] = [
  { name: "1920", width: 1920, height: 1080, dpr: 1 },
  { name: "1440", width: 1440, height: 900, dpr: 1 },
  { name: "1280", width: 1280, height: 800, dpr: 1 },
  { name: "768", width: 768, height: 1024, dpr: 1 },
  { name: "390", width: 390, height: 844, dpr: 2 },
];

const screenshotDir = path.resolve(process.cwd(), "qa-artifacts", "screenshots");
const reportPath = path.resolve(process.cwd(), "qa-artifacts", "self-audit-report.json");

function ensureArtifactDirectory() {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function settle(page: import("@playwright/test").Page, milliseconds = 300) {
  await page.waitForTimeout(milliseconds);
  await page.evaluate(() => document.fonts?.ready);
}

async function readDeckState(page: import("@playwright/test").Page, testId: string) {
  return page.getByTestId(testId).evaluate((element) => {
    const entrance = element.parentElement;
    const panel = entrance?.parentElement;
    const rect = panel?.getBoundingClientRect();
    const style = entrance ? getComputedStyle(entrance) : null;
    return {
      entered: entrance?.dataset.deckEntered ?? "missing",
      opacity: Number(style?.opacity ?? 0),
      transform: style?.transform ?? "none",
      width: rect?.width ?? 0,
      left: rect?.left ?? 0,
      right: rect?.right ?? 0,
    };
  });
}

async function triggerSectionEntrance(page: import("@playwright/test").Page, testId: string, screenshotName: string) {
  const section = page.getByTestId(testId);
  await section.scrollIntoViewIfNeeded();
  const before = await readDeckState(page, testId);
  await page.evaluate((id) => {
    const element = document.querySelector(`[data-testid="${id}"]`);
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, top - window.innerHeight * 0.72));
  }, testId);
  await settle(page, 750);
  const after = await readDeckState(page, testId);
  await page.screenshot({ path: path.join(screenshotDir, screenshotName), fullPage: false });
  expect(after.entered, `${testId} did not enter`).toBe("true");
  expect(after.opacity, `${testId} remained hidden`).toBeGreaterThan(0.85);
  expect(after.width, `${testId} has no measurable outer sheet`).toBeGreaterThan(0);
  return { before, after };
}

async function imageAudit(page: import("@playwright/test").Page, dpr: number) {
  return page.locator("img").evaluateAll((images, devicePixelRatio) => images.map((image) => {
    const rect = image.getBoundingClientRect();
      return {
        src: image.getAttribute("src") || "",
        currentSrc: image.currentSrc,
        sourceWidth: Number(new URL(image.currentSrc || image.src, window.location.href).searchParams.get("w") || 0),
        naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      clientWidth: Math.round(rect.width),
      clientHeight: Math.round(rect.height),
      devicePixelRatio,
    };
  }), dpr);
}

function isQualityCandidate(image: Record<string, string | number>) {
  const source = `${image.currentSrc || ""} ${image.src || ""}`;
  return /genevieve-hero|photography|project-media|credentials|brand\//i.test(source);
}

test.describe.configure({ mode: "serial" });

test("portfolio full-site self-audit", async ({ browser }) => {
  ensureArtifactDirectory();
  const audit = { startedAt: new Date().toISOString(), viewports: [] as Array<Record<string, unknown>>, issues: [] as string[] };

  for (const viewport of viewports) {
    await test.step(`global audit at ${viewport.name}px`, async () => {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.dpr,
      });
      const page = await context.newPage();
      const runtimeErrors: string[] = [];
      const isBlockedExternalFont = (value: string) => value.includes("fonts.googleapis.com") || value.includes("Failed to load resource: net::ERR_NETWORK_ACCESS_DENIED");

      page.on("console", (message) => {
        if (message.type() === "error" && !isBlockedExternalFont(message.text())) runtimeErrors.push(`console: ${message.text()}`);
      });
      page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
      page.on("requestfailed", (request) => {
        if (!request.url().includes("favicon")) runtimeErrors.push(`requestfailed: ${request.url()} · ${request.failure()?.errorText || "unknown"}`);
      });

      await page.goto("/", { waitUntil: "networkidle" });
      await settle(page, 500);
      await expect(page.getByTestId("site-nav")).toBeVisible();
      await expect(page.getByTestId("hero")).toBeVisible();

      const viewportAudit = await page.evaluate(() => ({
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        devicePixelRatio: window.devicePixelRatio,
      }));
      expect(viewportAudit.scrollWidth, `horizontal overflow at ${viewport.name}px`).toBeLessThanOrEqual(viewport.width + 3);

      const sectionIds = ["work-section", "projects-section", "education-section", "beyond-work-section", "contact-section"];
      for (const sectionId of sectionIds) await expect(page.getByTestId(sectionId)).toHaveCount(1);

      await page.evaluate(() => {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, root.scrollHeight);
        root.style.scrollBehavior = previousScrollBehavior;
      });
      await settle(page, 500);
      const images = viewport.name === "1440" || viewport.name === "390" ? await imageAudit(page, viewport.dpr) : [];
      const imageIssues = images.filter((image) => isQualityCandidate(image) && image.currentSrc && image.clientWidth >= 80 && image.clientHeight >= 40 && (image.naturalWidth === 0 || (image.sourceWidth > 0 ? image.sourceWidth < image.clientWidth * image.devicePixelRatio * 0.85 : image.naturalWidth < image.clientWidth * 0.85)));
      for (const image of imageIssues) audit.issues.push(`${viewport.name}px image quality: ${image.currentSrc || image.src}`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await settle(page, 350);

      await page.screenshot({ path: path.join(screenshotDir, `full-${viewport.name}.png`), fullPage: true });
      (audit.viewports as Array<Record<string, unknown>>).push({ name: viewport.name, viewportAudit, images, runtimeErrors });
      for (const error of runtimeErrors) {
        if (!isBlockedExternalFont(error)) audit.issues.push(`${viewport.name}px ${error}`);
      }

      if (viewport.width >= 1280) {
        const hero = page.getByTestId("hero");
        const spotlight = page.getByTestId("hero-spotlight");
        const heroBox = await hero.boundingBox();
        expect(heroBox).not.toBeNull();
        if (heroBox) {
          await page.mouse.move(heroBox.x + heroBox.width * 0.18, heroBox.y + heroBox.height * 0.45);
          await settle(page, 180);
          const leftState = await spotlight.evaluate((element) => getComputedStyle(element).getPropertyValue("--mountain-x"));
          await page.screenshot({ path: path.join(screenshotDir, viewport.name === "1440" ? "hero-pointer-left.png" : `hero-pointer-left-${viewport.name}.png`), fullPage: false });
          await page.mouse.move(heroBox.x + heroBox.width * 0.82, heroBox.y + heroBox.height * 0.45);
          await settle(page, 180);
          const rightState = await spotlight.evaluate((element) => getComputedStyle(element).getPropertyValue("--mountain-x"));
          await page.screenshot({ path: path.join(screenshotDir, viewport.name === "1440" ? "hero-pointer-right.png" : `hero-pointer-right-${viewport.name}.png`), fullPage: false });
          expect(leftState).not.toBe(rightState);
          if (viewport.name === "1440") {
            await page.mouse.move(heroBox.x + heroBox.width * 0.5, heroBox.y + heroBox.height * 0.45);
            await settle(page, 180);
            await page.screenshot({ path: path.join(screenshotDir, "hero-pointer-center.png"), fullPage: false });
          }
        }
      }

      const shellWidths = await page.evaluate(() => ["work-section", "projects-section", "education-section", "beyond-work-section", "contact-section"].map((id) => {
        const section = document.querySelector(`[data-testid="${id}"]`);
        const panel = section?.closest<HTMLElement>("[data-deck-panel]");
        const rect = panel?.getBoundingClientRect();
        return { id, width: rect?.width ?? 0, left: rect?.left ?? 0, right: rect?.right ?? 0 };
      }));
      for (const shell of shellWidths) {
        expect(shell.width, `${shell.id} shell is missing`).toBeGreaterThan(viewport.width * 0.62);
        expect(shell.left, `${shell.id} shell is outside left edge`).toBeGreaterThanOrEqual(-2);
        expect(shell.right, `${shell.id} shell is outside right edge`).toBeLessThanOrEqual(viewport.width + 2);
      }

      if (viewport.name === "1440") {
        for (const [testId, name] of [["work-section", "work"], ["projects-section", "projects"], ["education-section", "education"], ["beyond-work-section", "beyond-work"], ["contact-section", "contact"]] as const) {
          await triggerSectionEntrance(page, testId, `enter-${name}.png`);
        }

        const work = page.getByTestId("work-section");
        await work.scrollIntoViewIfNeeded();
        const workRows = work.getByTestId("work-row");
        await expect(workRows).toHaveCount(6);
        const firstWork = workRows.first();
        await firstWork.getByRole("button").click();
        await expect(firstWork).toHaveClass(/is-open/);
        await expect(firstWork.getByTestId("work-panel")).toBeVisible();
        await settle(page, 500);
        const workOverlap = await workRows.evaluateAll((rows) => rows.slice(0, -1).map((row, index) => {
          const current = row.getBoundingClientRect();
          const next = rows[index + 1].getBoundingClientRect();
          return current.bottom > next.top + 1;
        }));
        expect(workOverlap, "expanded work rows overlap").not.toContain(true);
        await page.screenshot({ path: path.join(screenshotDir, "work-expanded.png"), fullPage: false });
        await workRows.nth(1).getByRole("button").click();
        await settle(page, 550);
        await expect(workRows.nth(1)).toHaveClass(/is-open/);
        await expect(workRows.first().getByTestId("work-panel")).toHaveCount(0);

        const projects = page.getByTestId("projects-section");
        await projects.scrollIntoViewIfNeeded();
        const projectRows = projects.getByTestId("project-row");
        await expect(projectRows).toHaveCount(7);
        await projects.getByRole("tab", { name: "MACHINE LEARNING" }).click();
        await expect(projects.getByTestId("project-row")).toHaveCount(5);
        const projectTitleAccents = await projects.getByTestId("project-row").evaluateAll(rows => rows.map(row => {
          const summary = row.querySelector(".experience-index-summary");
          return summary ? getComputedStyle(summary, "::before").display : "missing";
        }));
        expect(projectTitleAccents, "project title accent rules should be removed").toEqual(["none", "none", "none", "none", "none"]);
        const projectFirst = projects.getByTestId("project-row").first();
        await projectFirst.getByRole("button").click();
        await expect(projectFirst).toHaveClass(/is-open/);
        await expect(projectFirst.getByTestId("project-panel")).toBeVisible();
        await expect(projectFirst.locator("img").first()).toBeVisible();

        const education = page.getByTestId("education-section");
        await education.scrollIntoViewIfNeeded();
        await expect(education.getByText("BSc Biomedical Engineering")).toBeVisible();
        await expect(education.getByText("Artificial Intelligence & Data Analytics")).toBeVisible();
        await expect(education.getByText("MSc Artificial Intelligence")).toBeVisible();
        await education.getByRole("button", { name: "View degree credential" }).click();
        await expect(page.locator(".credential-lightbox")).toBeVisible();
        await page.getByRole("button", { name: "Close credential viewer" }).click();

        const beyond = page.getByTestId("beyond-work-section");
        await beyond.scrollIntoViewIfNeeded();
        const gallery = page.getByTestId("travel-gallery");
        await expect(gallery).toBeVisible();
        const galleryRail = gallery.getByTestId("travel-gallery-rail");
        const galleryBox = await gallery.boundingBox();
        expect(galleryBox).not.toBeNull();
        if (galleryBox) {
          await galleryRail.evaluate((element) => element.scrollTo({ left: 0 }));
          await page.mouse.move(galleryBox.x + galleryBox.width * 0.9, galleryBox.y + galleryBox.height * 0.5);
          await settle(page, 550);
          const rightScroll = await galleryRail.evaluate((element) => element.scrollLeft);
          await page.mouse.move(galleryBox.x + galleryBox.width * 0.1, galleryBox.y + galleryBox.height * 0.5);
          await settle(page, 550);
          const leftScroll = await galleryRail.evaluate((element) => element.scrollLeft);
          expect(rightScroll).toBeGreaterThan(0);
          expect(leftScroll).toBeLessThan(rightScroll);
        }

        const firstCard = beyond.getByTestId("travel-card").first();
        const veil = firstCard.getByTestId("travel-card-veil");
        await page.mouse.move(0, 0);
        await settle(page, 500);
        const veilBefore = await veil.evaluate((element) => getComputedStyle(element).opacity);
        const firstCardBox = await firstCard.boundingBox();
        expect(firstCardBox).not.toBeNull();
        if (firstCardBox) {
          await page.mouse.move(firstCardBox.x + firstCardBox.width / 2, firstCardBox.y + firstCardBox.height / 2);
        }
        await settle(page, 450);
        const veilAfter = await veil.evaluate((element) => getComputedStyle(element).opacity);
        const cardFilter = await firstCard.evaluate((element) => getComputedStyle(element).filter);
        expect(Number(veilAfter)).toBeLessThan(Number(veilBefore));
        expect(cardFilter).toBe("none");
        await page.mouse.move(0, 0);
        await settle(page, 500);
        await page.screenshot({ path: path.join(screenshotDir, "travel-before-hover.png"), fullPage: false });
        if (firstCardBox) {
          await page.mouse.move(firstCardBox.x + firstCardBox.width / 2, firstCardBox.y + firstCardBox.height / 2);
        }
        await settle(page, 450);
        await page.screenshot({ path: path.join(screenshotDir, "travel-hover.png"), fullPage: false });

        await firstCard.click();
        const lightbox = page.getByTestId("travel-lightbox");
        await expect(lightbox).toBeVisible();
        const modalAudit = await lightbox.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          const topElement = document.elementFromPoint(10, 10);
          return {
            rect: { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom },
            position: getComputedStyle(element).position,
            zIndex: getComputedStyle(element).zIndex,
            bodyOverflow: document.body.style.overflow,
            topCovered: topElement?.closest('[data-testid="travel-lightbox"]') !== null,
            navAtTop: topElement?.closest('[data-testid="site-nav"]') !== null,
          };
        });
        expect(modalAudit.position).toBe("fixed");
        expect(modalAudit.rect.top).toBeLessThanOrEqual(1);
        expect(modalAudit.rect.left).toBeLessThanOrEqual(1);
        expect(modalAudit.rect.right).toBeGreaterThanOrEqual(1439);
        expect(modalAudit.rect.bottom).toBeGreaterThanOrEqual(899);
        expect(modalAudit.bodyOverflow).toBe("hidden");
        expect(modalAudit.topCovered).toBe(true);
        expect(modalAudit.navAtTop).toBe(false);
        await expect(lightbox.getByTestId("travel-lightbox-image")).toBeVisible();
        await page.screenshot({ path: path.join(screenshotDir, "lightbox-open.png"), fullPage: false });
        await lightbox.getByRole("button", { name: "Next artwork" }).click();
        await expect(lightbox.locator("figcaption")).toContainText("02 / 08");
        await page.keyboard.press("Escape");
        await expect(lightbox).toHaveCount(0);
        expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
        await expect(firstCard).toBeFocused();
        await firstCard.click();
        await page.getByTestId("travel-lightbox-backdrop").click({ position: { x: 10, y: 10 } });
        await expect(page.getByTestId("travel-lightbox")).toHaveCount(0);

        const contact = page.getByTestId("contact-section");
        await contact.scrollIntoViewIfNeeded();
        await expect(page.getByTestId("contact-email")).toBeVisible();
        await expect(page.getByTestId("contact-phone")).toBeVisible();
        await expect(page.getByTestId("contact-linkedin")).toHaveAttribute("href", /^https:\/\//);
        await expect(page.getByTestId("contact-jobsdb")).toHaveAttribute("href", /^https:\/\//);
        const cat = page.getByTestId("interactive-cat");
        await expect(cat).toBeVisible();
        await expect(page.getByText("玄玄")).toHaveCount(0);
        const catBox = await contact.boundingBox();
        expect(catBox).not.toBeNull();
        if (catBox) {
          await page.mouse.move(catBox.x + catBox.width * 0.2, catBox.y + catBox.height * 0.75);
          await settle(page, 180);
          const gazeLeft = await cat.evaluate((element) => getComputedStyle(element).getPropertyValue("--pet-gaze-x"));
          await page.mouse.move(catBox.x + catBox.width * 0.8, catBox.y + catBox.height * 0.75);
          await settle(page, 180);
          const gazeRight = await cat.evaluate((element) => getComputedStyle(element).getPropertyValue("--pet-gaze-x"));
          expect(gazeLeft).not.toBe(gazeRight);
        }

        for (const [href, testId] of [["#work", "work-section"], ["#projects", "projects-section"], ["#education", "education-section"], ["#beyond-work-journal", "beyond-work-section"], ["#contact", "contact-section"]] as const) {
          await page.locator(`[data-testid="site-nav"] a[href="${href}"]`).click();
          const target = page.getByTestId(testId);
          await expect(target, `${href} did not land on a visible section`).toBeInViewport({ ratio: 0.01 });
        }
      }

      await page.close();
      await context.close();
    });
  }

  audit.finishedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(audit, null, 2));
  expect(audit.issues, `Portfolio self-audit found objective issues:\n${audit.issues.join("\n")}`).toEqual([]);
});
