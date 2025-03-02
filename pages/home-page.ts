import { Page } from "@playwright/test";
import { NavBar } from "../components/nav-bar";
import { Banner } from "../components/banner";
import { Filters } from "../components/filters";
import { ProductContainer } from "../components/product-container";
import { BASE_URL } from "../utils/constants";

/**
 * Represents the Home Page of the practice software testing website.
 * Handles all interactions and operations available on the main page.
 */
export class HomePage {
  private page: Page;
  public navBar: NavBar;
  public banner: Banner;
  public filters: Filters;
  public products: ProductContainer;

  /**
   * Creates an instance of HomePage.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
    this.navBar = new NavBar(page);
    this.banner = new Banner(page);
    this.filters = new Filters(page);
    this.products = new ProductContainer(page);
  }

  /**
   * Navigates to the home page of the application.
   * @returns Promise<void>
   */
  async visit(): Promise<void> {
    await this.page.goto(BASE_URL);
  }

  /**
   * Performs product search and applies sorting.
   * @param query - The search term to look for
   * @param sortOption - The sorting option to apply
   * @returns Promise<void>
   */
  async searchAndSort(
    query: string,
    sortOption: "name,asc" | "name,desc" | "price,asc" | "price,desc"
  ): Promise<void> {
    await this.filters.searchProduct(query);
    await this.filters.selectSortOption(sortOption);
  }

  /**
   * Filters products by price range.
   * @param min - Minimum price value
   * @param max - Maximum price value
   * @returns Promise<void>
   */
  async filterByPriceRange(min: number, max: number): Promise<void> {
    await this.filters.setPriceRange(min, max);
  }

  /**
   * Navigates to a specific product category.
   * @param category - The category to navigate to
   * @returns Promise<void>
   */
  async goToCategory(
    category:
      | "hand-tools"
      | "power-tools"
      | "other"
      | "special-tools"
      | "rentals"
  ): Promise<void> {
    await this.navBar.clickCategories();
    switch (category) {
      case "hand-tools":
        await this.navBar.handToolsButton.click();
        break;
      case "power-tools":
        await this.navBar.powerToolsButton.click();
        break;
      case "other":
        await this.navBar.otherButton.click();
        break;
      case "special-tools":
        await this.navBar.specialToolsButton.click();
        break;
      case "rentals":
        await this.navBar.rentalsButton.click();
        break;
    }
  }

  /**
   * Changes the website language.
   * @param language - The language code to switch to
   * @returns Promise<void>
   */
  async changeLanguage(
    language: "de" | "en" | "es" | "fr" | "nl" | "tr"
  ): Promise<void> {
    await this.navBar.selectLanguage(language);
  }

  /**
   * Navigates to the home page of the application.
   * @returns Promise<void>
   * @deprecated Use visit() instead for consistency
   */
  async goto(): Promise<void> {
    await this.visit();
  }
}
