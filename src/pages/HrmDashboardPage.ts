import { expect, type Page } from "@playwright/test";

export class HrmDashboardPage {
  constructor(private readonly page: Page) {}

  async signIn(): Promise<void> {
    await this.page.goto(process.env.HRM_URL ?? "https://hrm.anhtester.com/");
    await this.page.locator("#iusername").fill(
      process.env.HRM_USERNAME ?? "admin_example",
    );
    await this.page.locator("#ipassword").fill(
      process.env.HRM_PASSWORD ?? "123456",
    );
    await this.page.locator('button[type="submit"]').click();
    await expect(
      this.page.getByText("Home", { exact: true }).first(),
    ).toBeVisible();
  }

  async openMenu(menu: "Projects" | "Tasks"): Promise<void> {
    await this.page
      .locator("span")
      .filter({ hasText: menu })
      .first()
      .click();
    await expect(
      this.page.locator("#smartwizard-2 ul li.nav-item.active a"),
    ).toContainText(menu);
  }
}
