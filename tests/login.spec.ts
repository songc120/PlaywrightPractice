import { test, expect } from "@playwright/test";
import { USER1_EMAIL, USER1_PASSWORD } from "../utils/constants";

test("login test", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.locator('[data-test="nav-sign-in"]').click();
  await page.locator('[data-test="email"]').fill(USER1_EMAIL);
  await page.locator('[data-test="password"]').fill("welcome01");
  await page.locator('[data-test="login-submit"]').click();
  await expect(page.locator('[data-test="nav-menu"]')).toContainText(
    "Jane Doe"
  );
  await expect(page.locator('[data-test="page-title"]')).toContainText(
    "My account"
  );
});

test("login invalid test", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.locator('[data-test="nav-sign-in"]').click();
  await page
    .locator('[data-test="email"]')
    .fill("notcustomer@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("welcomes01");
  await page.locator('[data-test="login-submit"]').click();
  await expect(page.locator('[data-test="login-error"]')).toContainText(
    "Invalid email or password"
  );
  await expect(page.locator("app-login")).toContainText(
    "Not yet an account? Register your accountForgot your Password?"
  );
});
