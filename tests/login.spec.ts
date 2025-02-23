import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { NavBar } from "../pages/NavBar";
import { USER1_EMAIL, USER1_PASSWORD } from "../utils/constants";
test.describe("Login Tests", () => {
  let loginPage: LoginPage;
  let navBar: NavBar;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    navBar = new NavBar(page);
    await loginPage.navigate();
  });

  test("login test", async ({}) => {
    // Perform login
    await loginPage.login(USER1_EMAIL, USER1_PASSWORD);

    // Assertions for successful login
    await expect(await navBar.getUserMenuText()).toContain("Jane Doe");
  });

  test("login invalid test", async ({}) => {
    // Perform login with invalid credentials
    await loginPage.login(
      "notcustomer@practicesoftwaretesting.com",
      USER1_PASSWORD
    );

    // Assertions: Check for error messages
    await expect(loginPage.getLoginError()).resolves.toContain(
      "Invalid email or password"
    );
  });
});
