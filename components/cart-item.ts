import { Locator } from "@playwright/test";
import { BaseComponent } from "../utils/base-component";

/**
 * Represents a cart item component in the checkout page.
 * Handles interactions with individual cart items including:
 * - Reading item details (title, quantity, price, total)
 * - Updating quantity
 * - Removing item from cart
 */
export class CartItem extends BaseComponent {
  /** Locator for the product title */
  private readonly title: Locator;
  /** Locator for the quantity input */
  private readonly quantity: Locator;
  /** Locator for the unit price */
  private readonly price: Locator;
  /** Locator for the line total */
  private readonly total: Locator;
  /** Locator for the remove button */
  private readonly removeButton: Locator;

  /**
   * Creates an instance of CartItemComponent.
   * @param root - The root Locator for this cart item row
   */
  constructor(private root: Locator) {
    super(root.page());
    this.title = root.locator('[data-test="product-title"]');
    this.quantity = root.locator('[data-test="product-quantity"]');
    this.price = root.locator('[data-test="product-price"]');
    this.total = root.locator('[data-test="line-price"]');
    this.removeButton = root.locator(".btn-danger");
  }

  /**
   * Gets all details for this cart item
   * @returns Promise<Object> containing:
   * - title: The product title
   * - quantity: Current quantity
   * - price: Unit price
   * - total: Line total (price * quantity)
   */
  async getDetails(): Promise<{
    title: string;
    quantity: number;
    price: number;
    total: number;
  }> {
    return {
      title: (await this.title.textContent())?.trim() || "",
      quantity: parseInt((await this.quantity.inputValue()) || "0"),
      price: parseFloat(
        (await this.price.textContent())?.replace("$", "") || "0"
      ),
      total: parseFloat(
        (await this.total.textContent())?.replace("$", "") || "0"
      ),
    };
  }

  /**
   * Updates the quantity for this cart item
   * @param value - The new quantity to set
   */
  async updateQuantity(newQuantity: number) {
    await this.quantity.fill(String(newQuantity));
    await this.quantity.press("Enter");
    // Wait for quantity update
    await this.expect(async () =>
      parseInt((await this.quantity.inputValue()) || "0")
    ).toBe(newQuantity);
    // Wait for price update
    const initialPrice = parseFloat(
      (await this.price.textContent())?.replace("$", "") || "0"
    );
    await this.expect(async () =>
      parseFloat((await this.total.textContent())?.replace("$", "") || "0")
    ).toBe(initialPrice * newQuantity);
  }

  /**
   * Removes this item from the cart
   */
  async remove() {
    await this.waitAndClick(this.removeButton);
  }
}
