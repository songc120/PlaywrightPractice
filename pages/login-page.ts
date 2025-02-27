import { Page } from "@playwright/test";
import { NavBar } from "../components/nav-bar";

/**
 * Represents the Login Page of the practice software testing website.
 * Handles user authentication and login-related operations.
 */
export class LoginPage {
  private page: Page;
  private navBar: NavBar;

  /**
   * Creates an instance of LoginPage.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
    this.navBar = new NavBar(page);
  }

  // Locators
  /**
   * @returns Locator for email input field
   */
  private emailInput = () => this.page.locator('[data-test="email"]');

  /**
   * @returns Locator for password input field
   */
  private passwordInput = () => this.page.locator('[data-test="password"]');

  /**
   * @returns Locator for login submit button
   */
  private loginButton = () => this.page.locator('[data-test="login-submit"]');

  /**
   * @returns Locator for email error message
   */
  private emailError = () => this.page.locator('[data-test="email-error"]');

  /**
   * @returns Locator for password error message
   */
  private passwordError = () =>
    this.page.locator('[data-test="password-error"]');

  /**
   * @returns Locator for login error message
   */
  private loginError = () => this.page.locator('[data-test="login-error"]');

  /**
   * Navigates directly to the login page.
   * @returns Promise<void>
   */
  async navigate() {
    await this.page.goto("/auth/login");
  }

  /**
   * Navigates to login page through navigation bar.
   * @returns Promise<void>
   */
  async goToLoginFromNav() {
    await this.navBar.clickSignIn();
  }

  /**
   * Performs login with provided credentials.
   * @param username - User's email address
   * @param password - User's password
   * @returns Promise<void>
   */
  async login(username: string, password: string) {
    await this.emailInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  /**
   * Retrieves login error message.
   * @returns Promise<string | null> The error message text
   */
  async getLoginError() {
    return await this.loginError().textContent();
  }

  /**
   * Retrieves email field error message.
   * @returns Promise<string | null> The error message text
   */
  async getEmailError() {
    return await this.emailError().textContent();
  }

  /**
   * Retrieves password field error message.
   * @returns Promise<string | null> The error message text
   */
  async getPasswordError() {
    return await this.passwordError().textContent();
  }
}
