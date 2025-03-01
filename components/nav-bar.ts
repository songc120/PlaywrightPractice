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
  private cart = () => this.page.locator('[data-test="nav-cart"]');
  private cartQuantity = () => this.page.locator('[data-test="cart-quantity"]');
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
   * Helper method to wait for and click an element
   * @param locator - Function that returns a locator
   */
  private async waitAndClick(locator: () => any): Promise<void> {
    const element = locator();
    await element.waitFor({ state: "visible", timeout: 5000 });
    await element.click();
  }

  /**
   * Clicks the brand logo/link
   * @returns Promise<void>
   */
  async clickBrand(): Promise<void> {
    await this.waitAndClick(this.brand);
  }

  /**
   * Navigates to home page
   * @returns Promise<void>
   */
  async clickHome(): Promise<void> {
    await this.waitAndClick(this.home);
  }

  /**
   * Opens categories dropdown menu
   * @returns Promise<void>
   */
  async clickCategories(): Promise<void> {
    await this.waitAndClick(this.categories);
  }

  /**
   * Navigates to contact page
   * @returns Promise<void>
   */
  async clickContact(): Promise<void> {
    await this.waitAndClick(this.contact);
  }

  /**
   * Clicks sign in button
   * @returns Promise<void>
   */
  async clickSignIn(): Promise<void> {
    await this.waitAndClick(this.signInButton);
  }

  /**
   * Opens user navigation menu
   * @returns Promise<void>
   */
  async openNavMenu(): Promise<void> {
    await this.waitAndClick(this.userMenu);
  }

  /**
   * Changes website language
   * @param language - Language code to switch to
   * @returns Promise<void>
   * @throws Error if language is not supported
   */
  async selectLanguage(
    language: "de" | "en" | "es" | "fr" | "nl" | "tr"
  ): Promise<void> {
    await this.waitAndClick(this.languageSelect);

    const languageButtons = {
      de: this.deButton,
      en: this.enButton,
      es: this.esButton,
      fr: this.frButton,
      nl: this.nlButton,
      tr: this.trButton,
    };

    const buttonLocator = languageButtons[language];
    if (!buttonLocator) {
      throw new Error(`Unsupported language: ${language}`);
    }

    await this.waitAndClick(buttonLocator);
  }

  /**
   * Gets currently selected language
   * @returns Promise<string> The current language code
   * @throws Error if language select has no text
   */
  async getSelectedLanguage(): Promise<string> {
    const element = this.languageSelect();
    await element.waitFor({ state: "visible", timeout: 5000 });
    const text = await element.textContent();
    if (!text) throw new Error("Language select button has no text");
    return text.replace(/[^a-zA-Z]/g, "").toLowerCase();
  }

  /**
   * Checks if brand element is visible
   * @returns Promise<boolean>
   */
  async getBrandVisibility(): Promise<boolean> {
    const element = this.brand();
    await element.waitFor({ state: "visible", timeout: 5000 });
    return await element.isVisible();
  }

  /**
   * Gets user menu text content
   * @returns Promise<string | null>
   */
  async getUserMenuText(): Promise<string | null> {
    const element = this.userMenu();
    await element.waitFor({ state: "visible", timeout: 5000 });
    return await element.textContent();
  }

  /**
   * Performs logout operation
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    await this.openNavMenu();
    await this.waitAndClick(this.logoutButton);
  }
}
