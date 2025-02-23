import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { USER1_EMAIL, USER1_PASSWORD } from "../utils/constants";

test("login test", async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to the login page
  await loginPage.navigate();

  // Perform login
  await loginPage.login(USER1_EMAIL, USER1_PASSWORD);

  // Assertions for successful login
  await expect(page.locator('[data-test="nav-menu"]')).toContainText(
    "Jane Doe"
  );
  await expect(page.locator('[data-test="page-title"]')).toContainText(
    "My account"
  );
});

test("login invalid test", async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await loginPage.navigate();

  // Perform login with invalid credentials
  await loginPage.login(
    "notcustomer@practicesoftwaretesting.com",
    "welcomes01"
  );

  // Assertions: Check for error messages
  await expect(loginPage.getLoginError()).resolves.toContain(
    "Invalid email or password"
  );
  await expect(page.locator("app-login")).toContainText(
    "Not yet an account? Register your accountForgot your Password?"
  );
});
