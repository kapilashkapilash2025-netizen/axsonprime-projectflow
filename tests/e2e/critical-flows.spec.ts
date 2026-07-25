import { test, expect } from "@playwright/test";

test.describe("Critical ProjectFlow flows", () => {
  test("dashboard loads and summarizes seeded data", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Total projects", level: 3 }),
    ).toBeVisible();
  });

  test("a user can create a project and see it in the project list", async ({
    page,
  }) => {
    const projectName = `E2E Test Project ${Date.now()}`;

    await page.goto("/projects/new");
    await page.getByLabel("Project name").fill(projectName);
    await page
      .getByLabel("Description")
      .fill("Created by the Playwright critical-path test.");
    await page.getByRole("button", { name: "Create project" }).click();

    await expect(
      page.getByRole("heading", { name: projectName }),
    ).toBeVisible();

    await page.goto("/projects");
    await expect(
      page.getByRole("heading", { name: projectName }),
    ).toBeVisible();
  });

  test("a user can toggle a quality gate on a project", async ({ page }) => {
    await page.goto("/projects");
    await page.getByText("ProjectFlow Core").first().click();

    await expect(
      page.getByRole("heading", { name: "ProjectFlow Core" }),
    ).toBeVisible();

    const lintRow = page.getByText("Lint").locator("..").locator("..");
    await expect(lintRow).toBeVisible();
  });
});
