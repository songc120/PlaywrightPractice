import { Page } from "@playwright/test";

/**
 * Represents the product container component.
 * Handles operations related to product display and interaction.
 */
export class ProductContainer {
  private page: Page;

  /**
   * Creates an instance of ProductContainer component.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Locators for product elements
   */
  private products = () => this.page.locator('a.card[data-test^="product-"]');
  private productByName = (name: string) =>
    this.products().locator(`:has-text("${name}")`);

  /**
   * Gets the total number of products displayed
   * @returns Promise<number> The count of products
   */
  async getProductCount(): Promise<number> {
    return await this.products().count();
  }

  /**
   * Gets the name of a product by its index
   * @param index - The index of the product
   * @returns Promise<string | null> The product name
   */
  async getProductName(index: number): Promise<string | null> {
    return await this.products()
      .nth(index)
      .locator('[data-test="product-name"]')
      .textContent();
  }

  /**
   * Gets the price of a product by its index
   * @param index - The index of the product
   * @returns Promise<string | null> The product price
   */
  async getProductPriceByIndex(index: number): Promise<string | null> {
    return await this.products()
      .nth(index)
      .locator('[data-test="product-price"]')
      .textContent();
  }

  /**
   * Gets the price of a product by its name
   * @param name - The name of the product
   * @returns Promise<string | null> The product price
   */
  async getProductPriceByName(name: string): Promise<string | null> {
    return await this.productByName(name)
      .locator('[data-test="product-price"]')
      .textContent();
  }

  /**
   * Checks if a product is out of stock by its index
   * @param index - The index of the product
   * @returns Promise<boolean> True if product is out of stock
   */
  async isProductOutOfStockByIndex(index: number): Promise<boolean> {
    return await this.products()
      .nth(index)
      .locator('[data-test="out-of-stock"]')
      .isVisible();
  }

  /**
   * Checks if a product is out of stock by its name
   * @param name - The name of the product
   * @returns Promise<boolean> True if product is out of stock
   */
  async isProductOutOfStockByName(name: string): Promise<boolean> {
    return await this.productByName(name)
      .locator('[data-test="out-of-stock"]')
      .isVisible();
  }

  /**
   * Checks if a product is displayed by its name
   * @param name - The name of the product
   * @returns Promise<boolean> True if product is visible
   */
  async isProductDisplayed(name: string): Promise<boolean> {
    return await this.productByName(name).isVisible();
  }

  /**
   * Clicks on a product by its index
   * @param index - The index of the product
   * @returns Promise<void>
   */
  async clickProduct(index: number): Promise<void> {
    await this.products().nth(index).click();
  }

  /**
   * Clicks on a product by its name
   * @param name - The name of the product
   * @returns Promise<void>
   */
  async clickProductByName(name: string): Promise<void> {
    await this.productByName(name).click();
  }
}
