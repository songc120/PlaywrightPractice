import { Locator, Page } from "@playwright/test";

/**
 * Interface representing a product's basic information
 */
interface ProductInfo {
  name: string;
  price: string;
  isOutOfStock: boolean;
  id: string;
}

/**
 * Represents the product container component.
 * Handles operations related to product display, filtering, and interaction.
 */
export class ProductContainer {
  private page: Page;
  private readonly selectors = {
    productCard: 'a.card[data-test^="product-01"]',
    productName: '[data-test="product-name"]',
    productPrice: '[data-test="product-price"]',
    outOfStock: '[data-test="out-of-stock"]',
    productImage: "img.card-img-top",
  };

  /**
   * Creates an instance of ProductContainer component.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Private helper methods for locating elements
   */
  private get productsLocator(): Locator {
    return this.page.locator(this.selectors.productCard);
  }

  private getProductLocator(identifier: string | number): Locator {
    if (typeof identifier === "number") {
      return this.productsLocator.nth(identifier);
    }
    return this.page.locator(this.selectors.productCard).filter({
      has: this.page.locator(this.selectors.productName, {
        hasText: identifier,
      }),
    });
  }

  /**
   * Gets product information by data-test attribute
   * @param productId - The product ID from data-test attribute
   * @returns Promise<ProductInfo>
   */
  private async getProductByDataTest(productId: string): Promise<ProductInfo> {
    const product = this.page.locator(`[data-test="product-${productId}"]`);
    try {
      await product.waitFor({ state: "visible", timeout: 5000 });
      return {
        name:
          (await product.locator(this.selectors.productName).textContent()) ||
          "",
        price:
          (await product.locator(this.selectors.productPrice).textContent()) ||
          "",
        isOutOfStock: await product
          .locator(this.selectors.outOfStock)
          .isVisible(),
        id: productId,
      };
    } catch (error) {
      throw new Error(`Failed to find product with ID ${productId}`);
    }
  }

  /**
   * Gets all products currently displayed
   * @returns Promise<ProductInfo[]>
   */
  async getAllProducts(): Promise<ProductInfo[]> {
    await this.page.waitForSelector(this.selectors.productCard, {
      state: "visible",
    });
    const productElements = await this.page
      .locator(this.selectors.productCard)
      .all();

    const products: ProductInfo[] = [];
    for (const element of productElements) {
      const id = (await element.getAttribute("data-test")) || "";
      if (id) {
        products.push(
          await this.getProductByDataTest(id.replace("product-", ""))
        );
      }
    }
    return products;
  }

  /**
   * Gets the total number of products displayed
   * @returns Promise<number> The count of products
   */
  async getProductCount(): Promise<number> {
    await this.page.waitForSelector(this.selectors.productCard, {
      state: "visible",
    });
    return await this.productsLocator.count();
  }

  /**
   * Gets product information by name
   * @param name - The name of the product
   * @returns Promise<ProductInfo>
   */
  async getProductByName(name: string): Promise<ProductInfo> {
    const product = this.page.locator(this.selectors.productCard).filter({
      has: this.page.locator(this.selectors.productName, { hasText: name }),
    });

    try {
      await product.waitFor({ state: "visible", timeout: 5000 });
      const id = (await product.getAttribute("data-test")) || "";
      return await this.getProductByDataTest(id.replace("product-", ""));
    } catch (error) {
      throw new Error(`Failed to find product "${name}"`);
    }
  }

  /**
   * Gets all product prices
   * @returns Promise<number[]> Array of product prices
   */
  async getAllPrices(): Promise<number[]> {
    const products = await this.getAllProducts();
    return products.map((product) =>
      parseFloat(product.price.replace(/[^0-9.]/g, ""))
    );
  }

  /**
   * Verifies if products are sorted by price
   * @param order - 'asc' or 'desc'
   * @returns Promise<boolean>
   */
  async areProductsSortedByPrice(order: "asc" | "desc"): Promise<boolean> {
    const prices = await this.getAllPrices();
    const sortedPrices = [...prices].sort((a, b) =>
      order === "asc" ? a - b : b - a
    );
    return JSON.stringify(prices) === JSON.stringify(sortedPrices);
  }

  /**
   * Clicks on a product by its index
   * @param index - The index of the product
   * @returns Promise<void>
   * @throws Error if product not found
   */
  async clickProduct(index: number): Promise<void> {
    const product = this.getProductLocator(index);
    try {
      await product.waitFor({ state: "visible", timeout: 5000 }); // 5 second timeout
      await product.click();
    } catch (error) {
      throw new Error(
        `Failed to find or click product at index ${index}. Either the product doesn't exist or is not visible.`
      );
    }
  }

  /**
   * Clicks on a product by its name
   * @param name - The name of the product
   * @returns Promise<void>
   * @throws Error if product not found
   */
  async clickProductByName(name: string): Promise<void> {
    const product = this.getProductLocator(name);
    try {
      await product.waitFor({ state: "visible", timeout: 5000 }); // 5 second timeout
      await product.click();
    } catch (error) {
      throw new Error(
        `Failed to find or click product "${name}". Either the product doesn't exist or is not visible.`
      );
    }
  }

  /**
   * Gets all out of stock products
   * @returns Promise<ProductInfo[]>
   */
  async getOutOfStockProducts(): Promise<ProductInfo[]> {
    const allProducts = await this.getAllProducts();
    return allProducts.filter((product) => product.isOutOfStock);
  }

  /**
   * Verifies if all products are within a price range
   * @param min - Minimum price
   * @param max - Maximum price
   * @returns Promise<boolean>
   */
  async areProductsInPriceRange(min: number, max: number): Promise<boolean> {
    const prices = await this.getAllPrices();
    return prices.every((price) => price >= min && price <= max);
  }

  /**
   * Gets product image URL by name
   * @param name - The name of the product
   * @returns Promise<string> The image URL
   * @throws Error if product not found
   */
  async getProductImageUrl(name: string): Promise<string> {
    const product = this.getProductLocator(name);
    if (!(await product.isVisible())) {
      throw new Error(`Product "${name}" not found`);
    }
    return (
      (await product
        .locator(this.selectors.productImage)
        .getAttribute("src")) || ""
    );
  }

  async getProductByIndex(index: number): Promise<ProductInfo> {
    const product = this.getProductLocator(index);
    try {
      await product.waitFor({ state: "visible", timeout: 5000 });
      return {
        name:
          (await product.locator(this.selectors.productName).textContent()) ||
          "",
        price:
          (await product.locator(this.selectors.productPrice).textContent()) ||
          "",
        isOutOfStock: await product
          .locator(this.selectors.outOfStock)
          .isVisible(),
        id: (await product.getAttribute("data-test")) || "",
      };
    } catch (error) {
      throw new Error(
        `Failed to find product at index ${index}. Either the product doesn't exist or is not visible.`
      );
    }
  }
}
