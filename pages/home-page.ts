import { Page } from "@playwright/test";
import { NavBar } from "../components/nav-bar";
import { Banner } from "../components/banner";
import { Filters } from "../components/filters";
import { ProductContainer } from "../components/product-container";

export class HomePage {
  private page: Page;
  public navBar: NavBar;
  public banner: Banner;
  public filters: Filters;
  public products: ProductContainer;

  constructor(page: Page) {
    this.page = page;
    this.navBar = new NavBar(page);
    this.banner = new Banner(page);
    this.filters = new Filters(page);
    this.products = new ProductContainer(page);
  }

  async visit(): Promise<void> {
    await this.page.goto("https://practicesoftwaretesting.com/");
  }

  async searchAndSort(
    query: string,
    sortOption: "name,asc" | "name,desc" | "price,asc" | "price,desc"
  ): Promise<void> {
    await this.filters.searchProduct(query);
    await this.filters.selectSortOption(sortOption);
  }

  async filterByPriceRange(min: number, max: number): Promise<void> {
    await this.filters.setPriceRange(min, max);
  }

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
        await this.navBar["handToolsButton"]().click();
        break;
      case "power-tools":
        await this.navBar["powerToolsButton"]().click();
        break;
      case "other":
        await this.navBar["otherButton"]().click();
        break;
      case "special-tools":
        await this.navBar["specialToolsButton"]().click();
        break;
      case "rentals":
        await this.navBar["rentalsButton"]().click();
        break;
    }
  }

  async changeLanguage(
    language: "de" | "en" | "es" | "fr" | "nl" | "tr"
  ): Promise<void> {
    await this.navBar.selectLanguage(language);
  }
}
