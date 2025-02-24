import { Page } from "@playwright/test";

export class NavBar {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private brand = () => this.page.locator("a.navbar-brand");

  private home = () => this.page.locator('[data-test="nav-home"]');
  private categories = () => this.page.locator('[data-test="nav-categories"]');
  private contact = () => this.page.locator('[data-test="nav-contact"]');
  private signInButton = () => this.page.locator('[data-test="nav-sign-in"]');
  private userMenu = () => this.page.locator('[data-test="nav-menu"]');
  private languageSelect = () =>
    this.page.locator('[data-test="language-select"]');

  //Options under categories
  private handToolsButton = () =>
    this.page.locator('[data-test="nav-hand-tools"]');
  private powerToolsButton = () =>
    this.page.locator('[data-test="nav-power-tools"]');
  private otherButton = () => this.page.locator('[data-test="nav-other"]');
  private specialToolsButton = () =>
    this.page.locator('[data-test="nav-special-tools"]');
  private rentalsButton = () => this.page.locator('[data-test="nav-rentals"]');

  //Options under userMenu
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

  //Options under languageSelect
  private deButton = () => this.page.locator('[data-test="lang-de"]');
  private enButton = () => this.page.locator('[data-test="lang-en"]');
  private esButton = () => this.page.locator('[data-test="lang-es"]');
  private frButton = () => this.page.locator('[data-test="lang-fr"]');
  private nlButton = () => this.page.locator('[data-test="lang-nl"]');
  private trButton = () => this.page.locator('[data-test="lang-tr"]');

  async clickBrand() {
    await this.brand().click();
  }

  async clickHome() {
    await this.home().click();
  }

  async clickCategories() {
    await this.categories().click();
  }

  async clickContact() {
    await this.contact().click();
  }

  async clickSignIn() {
    await this.signInButton().click();
  }

  async openNavMenu() {
    await this.userMenu().click();
  }

  async selectLanguage(language: "de" | "en" | "es" | "fr" | "nl" | "tr") {
    // Click to open the language dropdown
    await this.languageSelect().click();

    // Click the specific language option
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

  async getSelectedLanguage(): Promise<string> {
    const text = await this.languageSelect().textContent();
    if (!text) throw new Error("Language select button has no text");
    // Extract language code (e.g., "EN" -> "en"), trimming icon and caret
    return text.replace(/[^a-zA-Z]/g, "").toLowerCase();
  }

  async debugBrand() {
    const brandLocator = this.brand();
    console.log(await brandLocator.boundingBox());
  }
  async getBrandVisibility() {
    this.debugBrand();
    return await this.brand().isVisible();
  }

  async getUserMenuText() {
    return await this.userMenu().textContent();
  }

  async logout() {
    this.openNavMenu(); // Expand menu
    await this.logoutButton().click();
  }
}
