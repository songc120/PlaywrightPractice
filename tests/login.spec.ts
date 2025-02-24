import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { NavBar } from "../pages/NavBar";
import {
  USER1_EMAIL,
  USER1_PASSWORD,
  NOT_USER_EMAIL,
  NOT_USER_PASSWORD,
  INVALID_EMAIL,
  INVALID_PASSWORD,
} from "../utils/constants";
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

  test("login wrong email test ", async ({}) => {
    // Perform login with invalid credentials
    await loginPage.login(NOT_USER_EMAIL, USER1_PASSWORD);

    // Assertions: Check for error messages
    await expect(loginPage.getLoginError()).resolves.toContain(
      "Invalid email or password"
    );
  });

  test("login wrong password test ", async ({}) => {
    // Perform login with invalid credentials
    await loginPage.login(USER1_EMAIL, NOT_USER_PASSWORD);

    // Assertions: Check for error messages
    await expect(loginPage.getLoginError()).resolves.toContain(
      "Invalid email or password"
    );
  });

  test("login empty email test", async ({}) => {
    // Perform login with empty email
    await loginPage.login("", USER1_PASSWORD);

    // Assertions: Check for error messages
    await expect(loginPage.getEmailError()).resolves.toContain(
      "Email is required"
    );
  });

  test("login empty password test", async ({}) => {
    // Perform login with empty password
    await loginPage.login(USER1_EMAIL, "");

    // Assertions: Check for error messages
    await expect(loginPage.getPasswordError()).resolves.toContain(
      "Password is required"
    );
  });

  test("login invalid email format test", async ({}) => {
    // Perform login with invalid email format
    await loginPage.login(INVALID_EMAIL, USER1_PASSWORD);

    // Assertions: Check for error messages
    await expect(loginPage.getEmailError()).resolves.toContain(
      "Email format is invalid"
    );
  });

  test("login invalid password format test", async ({}) => {
    // Perform login with invalid password format
    await loginPage.login(USER1_EMAIL, INVALID_PASSWORD);

    // Assertions: Check for error messages
    await expect(loginPage.getPasswordError()).resolves.toContain(
      "Password length is invalid"
    );
  });
});
