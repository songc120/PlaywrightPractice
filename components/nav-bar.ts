import { Page, Locator } from "@playwright/test";
import { BaseComponent } from "../utils/base-component";

/**
 * Represents the navigation bar component.
 * Handles all navigation-related operations and menu interactions.
 */
export class NavBar extends BaseComponent {
  private readonly brand: Locator;
  private readonly home: Locator;
  private readonly categories: Locator;
  private readonly contact: Locator;
  private readonly signInButton: Locator;
  private readonly cart: Locator;
  private readonly cartQuantity: Locator;
  private readonly userMenu: Locator;
  private readonly languageSelect: Locator;

  // Make these public so HomePage can access them
  public readonly handToolsButton: Locator;
  public readonly powerToolsButton: Locator;
  public readonly otherButton: Locator;
  public readonly specialToolsButton: Locator;
  public readonly rentalsButton: Locator;

  // Add language button locators
  private readonly deButton: Locator;
  private readonly enButton: Locator;
  private readonly esButton: Locator;
  private readonly frButton: Locator;
  private readonly nlButton: Locator;
  private readonly trButton: Locator;
  private readonly logoutButton: Locator;

  /**
   * Creates an instance of NavBar component.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    super(page);
    this.brand = page.locator("a.navbar-brand");
    this.home = page.locator('[data-test="nav-home"]');
    this.categories = page.locator('[data-test="nav-categories"]');
    this.contact = page.locator('[data-test="nav-contact"]');
    this.signInButton = page.locator('[data-test="nav-sign-in"]');
    this.cart = page.locator('[data-test="nav-cart"]');
    this.cartQuantity = page.locator('[data-test="cart-quantity"]');
    this.userMenu = page.locator('[data-test="nav-menu"]');
    this.languageSelect = page.locator('[data-test="language-select"]');
    this.handToolsButton = page.locator('[data-test="nav-hand-tools"]');
    this.powerToolsButton = page.locator('[data-test="nav-power-tools"]');
    this.otherButton = page.locator('[data-test="nav-other"]');
    this.specialToolsButton = page.locator('[data-test="nav-special-tools"]');
    this.rentalsButton = page.locator('[data-test="nav-rentals"]');

    // Add language buttons
    this.deButton = page.locator('[data-test="lang-de"]');
    this.enButton = page.locator('[data-test="lang-en"]');
    this.esButton = page.locator('[data-test="lang-es"]');
    this.frButton = page.locator('[data-test="lang-fr"]');
    this.nlButton = page.locator('[data-test="lang-nl"]');
    this.trButton = page.locator('[data-test="lang-tr"]');
    this.logoutButton = page.locator('[data-test="nav-sign-out"]');
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
    await this.languageSelect.waitFor({ state: "visible", timeout: 5000 });
    const text = await this.languageSelect.textContent();
    if (!text) throw new Error("Language select button has no text");
    return text.replace(/[^a-zA-Z]/g, "").toLowerCase();
  }

  /**
   * Checks if brand element is visible
   * @returns Promise<boolean>
   */
  async getBrandVisibility(): Promise<boolean> {
    await this.brand.waitFor({ state: "visible", timeout: 5000 });
    return await this.brand.isVisible();
  }

  /**
   * Gets user menu text content
   * @returns Promise<string | null>
   */
  async getUserMenuText(): Promise<string | null> {
    await this.userMenu.waitFor({ state: "visible", timeout: 5000 });
    return await this.userMenu.textContent();
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
