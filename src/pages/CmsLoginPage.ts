import { expect, type Page } from "@playwright/test";

export class CmsLoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(
      process.env.CMS_LOGIN_URL ?? "https://cms.anhtester.com/login",
    );
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.page.locator("#email").fill(email);
    await this.page.locator("#password").fill(password);
    await this.page.getByRole("button", { name: "Login" }).click();
  }

  async expectDashboard(): Promise<void> {
    await expect(
      this.page.getByText("Products", { exact: true }).first(),
    ).toBeVisible();
  }

  async signOut(): Promise<void> {
    await this.page
      .locator('.dropdown:has(a[href$="/logout"]) > a[data-toggle="dropdown"]')
      .click();
    await this.page.getByRole("link", { name: "Logout" }).click();
    await expect(this.page.locator("#email")).toBeVisible();
  }
}
