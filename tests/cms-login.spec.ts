import { test } from "@playwright/test";
import { CmsLoginPage } from "../src/pages/CmsLoginPage";

test("CMS admin can sign in, reach the dashboard, and sign out", async ({ page }, testInfo) => {
  const loginPage = new CmsLoginPage(page);

  await loginPage.open();
  await testInfo.attach("before-login", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
  await loginPage.signIn(
    process.env.CMS_EMAIL ?? "admin@example.com",
    process.env.CMS_PASSWORD ?? "123456",
  );
  await loginPage.expectDashboard();
  await testInfo.attach("after-login", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
  await loginPage.signOut();
  await testInfo.attach("after-logout", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
});
