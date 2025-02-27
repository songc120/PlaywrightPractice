import { Page } from "@playwright/test";

/**
 * Represents the navigation bar component.
 * Handles all navigation-related operations and menu interactions.
 */
export class NavBar {
  private page: Page;

  /**
   * Creates an instance of NavBar component.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Locators for main navigation elements
   */
  private brand = () => this.page.locator("a.navbar-brand");
  private home = () => this.page.locator('[data-test="nav-home"]');
  private categories = () => this.page.locator('[data-test="nav-categories"]');
  private contact = () => this.page.locator('[data-test="nav-contact"]');
  private signInButton = () => this.page.locator('[data-test="nav-sign-in"]');
  private userMenu = () => this.page.locator('[data-test="nav-menu"]');
  private languageSelect = () =>
    this.page.locator('[data-test="language-select"]');

  /**
   * Locators for category navigation options
   */
  private handToolsButton = () =>
    this.page.locator('[data-test="nav-hand-tools"]');
  private powerToolsButton = () =>
    this.page.locator('[data-test="nav-power-tools"]');
  private otherButton = () => this.page.locator('[data-test="nav-other"]');
  private specialToolsButton = () =>
    this.page.locator('[data-test="nav-special-tools"]');
  private rentalsButton = () => this.page.locator('[data-test="nav-rentals"]');

  /**
   * Locators for user menu options
   */
  private myAccountButton = () =>
    this.page.locator('[data-test="nav-my-account"]');
  private myFavoritesButton = () =>
    this.page.locator('[data-test="nav-my-favorites"]');
  private myProfileButton = () =>
    this.page.locator('[data-test="nav-my-profile"]');
  private myInvoicesButton = () =>
    this.page.locator('[data-test="nav-my-invoices"]');
  private myMessagesButton = () =>
    this.page.locator('[data-test="nav-my-messages"]');
  private logoutButton = () => this.page.locator('[data-test="nav-sign-out"]');

  /**
   * Locators for language selection options
   */
  private deButton = () => this.page.locator('[data-test="lang-de"]');
  private enButton = () => this.page.locator('[data-test="lang-en"]');
  private esButton = () => this.page.locator('[data-test="lang-es"]');
  private frButton = () => this.page.locator('[data-test="lang-fr"]');
  private nlButton = () => this.page.locator('[data-test="lang-nl"]');
  private trButton = () => this.page.locator('[data-test="lang-tr"]');

  /**
   * Clicks the brand logo/link
   * @returns Promise<void>
   */
  async clickBrand() {
    await this.brand().click();
  }

  /**
   * Navigates to home page
   * @returns Promise<void>
   */
  async clickHome() {
    await this.home().click();
  }

  /**
   * Opens categories dropdown menu
   * @returns Promise<void>
   */
  async clickCategories() {
    await this.categories().click();
  }

  /**
   * Navigates to contact page
   * @returns Promise<void>
   */
  async clickContact() {
    await this.contact().click();
  }

  /**
   * Clicks sign in button
   * @returns Promise<void>
   */
  async clickSignIn() {
    await this.signInButton().click();
  }

  /**
   * Opens user navigation menu
   * @returns Promise<void>
   */
  async openNavMenu() {
    await this.userMenu().click();
  }

  /**
   * Changes website language
   * @param language - Language code to switch to
   * @returns Promise<void>
   * @throws Error if language is not supported
   */
  async selectLanguage(language: "de" | "en" | "es" | "fr" | "nl" | "tr") {
    await this.languageSelect().click();
    switch (language) {
      case "de":
        await this.deButton().click();
        break;
      case "en":
        await this.enButton().click();
        break;
      case "es":
        await this.esButton().click();
        break;
      case "fr":
        await this.frButton().click();
        break;
      case "nl":
        await this.nlButton().click();
        break;
      case "tr":
        await this.trButton().click();
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  /**
   * Gets currently selected language
   * @returns Promise<string> The current language code
   * @throws Error if language select has no text
   */
  async getSelectedLanguage(): Promise<string> {
    const text = await this.languageSelect().textContent();
    if (!text) throw new Error("Language select button has no text");
    return text.replace(/[^a-zA-Z]/g, "").toLowerCase();
  }

  /**
   * Checks if brand element is visible
   * @returns Promise<boolean>
   */
  async getBrandVisibility() {
    const brandLocator = this.brand();
    await brandLocator.waitFor({ state: "visible", timeout: 5000 });
    return await this.brand().isVisible();
  }

  /**
   * Gets user menu text content
   * @returns Promise<string | null>
   */
  async getUserMenuText() {
    return await this.userMenu().textContent();
  }

  /**
   * Performs logout operation
   * @returns Promise<void>
   */
  async logout() {
    this.openNavMenu();
    await this.logoutButton().click();
  }
}
