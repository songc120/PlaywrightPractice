import { Locator, Page } from "@playwright/test";

/**
 * Represents the product details page.
 * Handles interactions with product information, quantity controls, and related actions.
 */
export class ProductDetailsPage {
  private readonly name: Locator;
  private readonly price: Locator;
  private readonly description: Locator;
  private readonly quantity: Locator;
  private readonly decreaseQuantityBtn: Locator;
  private readonly increaseQuantityBtn: Locator;
  private readonly addToCartBtn: Locator;
  private readonly addToFavoritesBtn: Locator;
  private readonly categoryBadge: Locator;
  private readonly brandBadge: Locator;
  private readonly image: Locator;
  private readonly relatedProducts: Locator;
  private readonly toastMessage: Locator;
  private readonly successToast: Locator;
  private readonly errorToast: Locator;

  constructor(private page: Page) {
    this.name = page.locator('[data-test="product-name"]');
    this.price = page.locator('[data-test="unit-price"]');
    this.description = page.locator('[data-test="product-description"]');
    this.quantity = page.locator('[data-test="quantity"]');
    this.decreaseQuantityBtn = page.locator('[data-test="decrease-quantity"]');
    this.increaseQuantityBtn = page.locator('[data-test="increase-quantity"]');
    this.addToCartBtn = page.locator('[data-test="add-to-cart"]');
    this.addToFavoritesBtn = page.locator('[data-test="add-to-favorites"]');
    this.categoryBadge = page.locator(
      '[class^="badge rounded-pill bg-secondary"][aria-label="category"]'
    );
    this.brandBadge = page.locator(
      '[class^="badge rounded-pill bg-secondary"][aria-label="brand"]'
    );
    this.image = page.locator(".figure-img");
    this.relatedProducts = page.locator(".card");
    this.toastMessage = this.page.locator(".toast-message");
    this.successToast = this.page.locator(".toast-success .toast-message");
    this.errorToast = this.page.locator(".toast-error .toast-message");
  }

  /**
   * Gets the product name
   * @returns Promise<string> The product name
   */
  async getName(): Promise<string> {
    await this.name.waitFor({ state: "visible", timeout: 5000 });
    return (await this.name.textContent()) || "";
  }

  /**
   * Gets the product price
   * @returns Promise<number> The product price
   */
  async getPrice(): Promise<number> {
    await this.price.waitFor({ state: "visible", timeout: 5000 });
    const price = (await this.price.textContent()) || "0";
    return parseFloat(price);
  }

  /**
   * Gets the product description
   * @returns Promise<string> The product description
   */
  async getDescription(): Promise<string> {
    await this.description.waitFor({ state: "visible", timeout: 5000 });
    return (await this.description.textContent()) || "";
  }

  /**
   * Gets the current quantity value
   * @returns Promise<number> The current quantity
   */
  async getQuantity(): Promise<number> {
    await this.quantity.waitFor({ state: "visible", timeout: 5000 });
    const value = await this.quantity.inputValue();
    return parseInt(value);
  }

  /**
   * Sets the quantity to a specific value
   * @param value - The quantity to set
   */
  async setQuantity(value: number): Promise<void> {
    await this.quantity.waitFor({ state: "visible", timeout: 5000 });
    await this.quantity.fill(value.toString());
  }

  /**
   * Increases the quantity by clicking the plus button
   */
  async increaseQuantity(): Promise<void> {
    await this.increaseQuantityBtn.waitFor({ state: "visible", timeout: 5000 });
    await this.increaseQuantityBtn.click();
  }

  /**
   * Decreases the quantity by clicking the minus button
   */
  async decreaseQuantity(): Promise<void> {
    await this.decreaseQuantityBtn.waitFor({ state: "visible", timeout: 5000 });
    await this.decreaseQuantityBtn.click();
  }

  /**
   * Adds the product to cart
   */
  async addToCart(): Promise<void> {
    await this.addToCartBtn.waitFor({ state: "visible", timeout: 5000 });
    await this.addToCartBtn.click();
  }

  /**
   * Adds the product to favorites
   */
  async addToFavorites(): Promise<void> {
    await this.addToFavoritesBtn.waitFor({ state: "visible", timeout: 5000 });
    await this.addToFavoritesBtn.click();
  }

  /**
   * Gets the product categories
   * @returns Promise<string[]> Array of category names
   */
  async getCategories(): Promise<string[]> {
    await this.categoryBadge
      .first()
      .waitFor({ state: "visible", timeout: 5000 });
    const badges = await this.categoryBadge.all();
    console.log("badges:", badges);
    return Promise.all(
      badges.map(async (badge) => (await badge.textContent()) || "")
    );
  }

  /**
   * Gets the product brand
   * @returns Promise<string> The product brand name
   */
  async getBrand(): Promise<string> {
    await this.brandBadge.waitFor({ state: "visible", timeout: 5000 });
    return (await this.brandBadge.textContent()) || "";
  }

  /**
   * Gets the product image URL
   * @returns Promise<string> The product image URL
   */
  async getImageUrl(): Promise<string> {
    await this.image.waitFor({ state: "visible", timeout: 5000 });
    return (await this.image.getAttribute("src")) || "";
  }

  /**
   * Gets related products information
   * @returns Promise<{name: string, url: string}[]> Array of related product info
   */
  async getRelatedProducts(): Promise<Array<{ name: string; url: string }>> {
    await this.relatedProducts
      .first()
      .waitFor({ state: "visible", timeout: 5000 });
    const products = await this.relatedProducts.all();
    return Promise.all(
      products.map(async (product) => {
        const name = (await product.locator("h5").textContent()) || "";
        const url = (await product.getAttribute("href")) || "";
        return { name: name.trim(), url };
      })
    );
  }

  async getToastMessages(): Promise<string[]> {
    await this.toastMessage
      .first()
      .waitFor({ state: "visible", timeout: 5000 });
    const toasts = await this.toastMessage.all();
    return Promise.all(
      toasts.map(async (toast) => (await toast.textContent()) || "")
    );
  }

  async getSuccessToastMessages(): Promise<string[]> {
    await this.successToast
      .first()
      .waitFor({ state: "visible", timeout: 5000 });
    const toasts = await this.successToast.all();
    return Promise.all(
      toasts.map(async (toast) => (await toast.textContent()) || "")
    );
  }

  async getErrorToastMessages(): Promise<string[]> {
    await this.errorToast.first().waitFor({ state: "visible", timeout: 5000 });
    const toasts = await this.errorToast.all();
    return Promise.all(
      toasts.map(async (toast) => (await toast.textContent()) || "")
    );
  }

  async hasSuccessToast(): Promise<boolean> {
    await this.successToast
      .first()
      .waitFor({ state: "visible", timeout: 5000 });
    return await this.successToast.first().isVisible();
  }

  async hasErrorToast(): Promise<boolean> {
    await this.errorToast.first().waitFor({ state: "visible", timeout: 5000 });
    return await this.errorToast.first().isVisible();
  }
}
