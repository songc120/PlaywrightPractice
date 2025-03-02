import { Page, Locator } from "@playwright/test";
import { NavBar } from "../components/nav-bar";

/**
 * Represents the Login Page of the practice software testing website.
 * Handles user authentication and login-related operations.
 */
export class LoginPage {
  private page: Page;
  private navBar: NavBar;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly emailError: Locator;
  private readonly passwordError: Locator;
  private readonly loginError: Locator;

  /**
   * Creates an instance of LoginPage.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
    this.navBar = new NavBar(page);
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-submit"]');
    this.emailError = page.locator('[data-test="email-error"]');
    this.passwordError = page.locator('[data-test="password-error"]');
    this.loginError = page.locator('[data-test="login-error"]');
  }

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
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Retrieves login error message.
   * @returns Promise<string | null> The error message text
   */
  async getLoginError(): Promise<string | null> {
    return await this.loginError.textContent();
  }

  /**
   * Retrieves email field error message.
   * @returns Promise<string | null> The error message text
   */
  async getEmailError(): Promise<string | null> {
    return await this.emailError.textContent();
  }

  /**
   * Retrieves password field error message.
   * @returns Promise<string | null> The error message text
   */
  async getPasswordError(): Promise<string | null> {
    return await this.passwordError.textContent();
  }
}
