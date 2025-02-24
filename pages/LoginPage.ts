import { Page } from "@playwright/test";
import { NavBar } from "../components/NavBar";

export class LoginPage {
  private page: Page;
  private navBar: NavBar;

  constructor(page: Page) {
    this.page = page;
    this.navBar = new NavBar(page);
  }

  // Locators
  private emailInput = () => this.page.locator('[data-test="email"]');
  private passwordInput = () => this.page.locator('[data-test="password"]');
  private loginButton = () => this.page.locator('[data-test="login-submit"]');
  private emailError = () => this.page.locator('[data-test="email-error"]');
  private passwordError = () =>
    this.page.locator('[data-test="password-error"]');
  private loginError = () => this.page.locator('[data-test="login-error"]');

  // Methods
  async navigate() {
    await this.page.goto("/auth/login");
  }
  async goToLoginFromNav() {
    await this.navBar.clickSignIn();
  }

  async login(username: string, password: string) {
    await this.emailInput().fill(username);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async getLoginError() {
    return await this.loginError().textContent();
  }

  async getEmailError() {
    return await this.emailError().textContent();
  }

  async getPasswordError() {
    return await this.passwordError().textContent();
  }
}
