import { expect, type Page } from "@playwright/test";

export class CrmSignInPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(
      process.env.CRM_SIGNIN_URL ?? "https://rise.fairsketch.com/signin",
    );
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.page.locator("#email").fill(email);
    await this.page.locator("#password").fill(password);
    await this.page.getByRole("button", { name: "Sign in" }).click();
  }

  async hasCaptchaChallenge(): Promise<boolean> {
    return this.page
      .getByRole("alert")
      .getByText(/Please select the reCAPTCHA/i)
      .isVisible();
  }

  async expectSignedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/);
    await expect(
      this.page.getByText("Dashboard", { exact: true }).first(),
    ).toBeVisible();
  }

  async expectAuthenticationFailure(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/dashboard/);
    await expect(this.page.getByRole("alert")).toHaveText(
      "Authentication failed!",
    );
  }
}
