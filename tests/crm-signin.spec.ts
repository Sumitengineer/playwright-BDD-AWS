import { test } from "@playwright/test";
import { CrmSignInPage } from "../src/pages/CrmSignInPage";

test("CRM accepts valid credentials", async ({ page }) => {
  const signInPage = new CrmSignInPage(page);

  await signInPage.open();
  await signInPage.signIn(
    process.env.CRM_VALID_EMAIL ?? "admin@demo.com",
    process.env.CRM_VALID_PASSWORD ?? "riseDemo",
  );
  test.skip(
    await signInPage.hasCaptchaChallenge(),
    "The CRM demo requires a manual reCAPTCHA interaction.",
  );
  await signInPage.expectSignedIn();
});

test("CRM rejects invalid credentials", async ({ page }) => {
  const signInPage = new CrmSignInPage(page);

  await signInPage.open();
  await signInPage.signIn(
    process.env.CRM_INVALID_EMAIL ?? "admin123@demo.com",
    process.env.CRM_INVALID_PASSWORD ?? "riseDemo",
  );
  test.skip(
    await signInPage.hasCaptchaChallenge(),
    "The CRM demo requires a manual reCAPTCHA interaction.",
  );
  await signInPage.expectAuthenticationFailure();
});
