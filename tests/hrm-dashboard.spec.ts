import { test } from "@playwright/test";
import { HrmDashboardPage } from "../src/pages/HrmDashboardPage";

for (const menu of ["Projects", "Tasks"] as const) {
  test(`HRM dashboard opens the ${menu} menu`, async ({ page }) => {
    const dashboard = new HrmDashboardPage(page);

    await dashboard.signIn();
    await dashboard.openMenu(menu);
  });
}
