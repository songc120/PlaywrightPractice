import { Page } from "@playwright/test";

export class ProductContainer {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  private products = () => this.page.locator('a.card[data-test^="product-"]');
  private productByName = (name: string) =>
    this.products().locator(`:has-text("${name}")`);

  // Methods
  async getProductCount(): Promise<number> {
    return await this.products().count();
  }

  async getProductName(index: number): Promise<string | null> {
    return await this.products()
      .nth(index)
      .locator('[data-test="product-name"]')
      .textContent();
  }

  async getProductPriceByIndex(index: number): Promise<string | null> {
    return await this.products()
      .nth(index)
      .locator('[data-test="product-price"]')
      .textContent();
  }

  async getProductPriceByName(name: string): Promise<string | null> {
    return await this.productByName(name)
      .locator('[data-test="product-price"]')
      .textContent();
  }

  async isProductOutOfStockByIndex(index: number): Promise<boolean> {
    return await this.products()
      .nth(index)
      .locator('[data-test="out-of-stock"]')
      .isVisible();
  }

  async isProductOutOfStockByName(name: string): Promise<boolean> {
    return await this.productByName(name)
      .locator('[data-test="out-of-stock"]')
      .isVisible();
  }

  async isProductDisplayed(name: string): Promise<boolean> {
    return await this.productByName(name).isVisible();
  }

  async clickProduct(index: number): Promise<void> {
    await this.products().nth(index).click();
  }

  async clickProductByName(name: string): Promise<void> {
    await this.productByName(name).click();
  }
}
