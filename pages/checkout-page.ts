import { expect, Locator, Page } from "@playwright/test";
import { CartItem } from "../components/cart-item";
import { MOCK_ADDRESS } from "../utils/constants";

/**
 * Represents the checkout page of the e-commerce application.
 * This class handles all interactions with the multi-step checkout process:
 * 1. Cart Review - View and modify cart items
 * 2. Sign In - User authentication
 * 3. Billing Address - Address information collection
 * 4. Payment - Payment method selection and confirmation
 */
export class CheckoutPage {
  // Cart step locators
  /** Locator for all product rows in cart */
  private readonly productRows: Locator;
  /** Locator for the product titles in cart */
  private readonly productTitles: Locator;
  /** Locator for the product quantities */
  private readonly productQuantities: Locator;
  /** Locator for the product prices */
  private readonly productPrices: Locator;
  /** Locator for the line item totals */
  private readonly linePrices: Locator;
  /** Locator for the cart total amount */
  private readonly cartTotal: Locator;
  /** Locator for the remove item buttons */
  private readonly removeItemBtns: Locator;
  /** Locator for the proceed button */
  private readonly proceedBtn: Locator;

  // Login step locators
  /** Locator for the email input field */
  private readonly emailInput: Locator;
  /** Locator for the password input field */
  private readonly passwordInput: Locator;
  /** Locator for the login submit button */
  private readonly loginSubmitBtn: Locator;
  /** Locator for the register new account link */
  private readonly registerLink: Locator;
  /** Locator for the forgot password link */
  private readonly forgotPasswordLink: Locator;

  // Billing Address locators
  /** Locator for the street address input */
  private readonly streetInput: Locator;
  /** Locator for the city input */
  private readonly cityInput: Locator;
  /** Locator for the state/province input */
  private readonly stateInput: Locator;
  /** Locator for the country input */
  private readonly countryInput: Locator;
  /** Locator for the postal code input */
  private readonly postalCodeInput: Locator;
  /** Locator for the proceed to payment button */
  private readonly proceedToPaymentBtn: Locator;

  // Payment step locators
  /** Locator for the payment method dropdown */
  private readonly paymentMethodSelect: Locator;
  /** Locator for the confirm payment button */
  private readonly confirmPaymentBtn: Locator;

  /** Locator for success toast messages */
  private readonly successToast: Locator;

  private readonly cartItems: Locator;

  /** Locator for the proceed to next step after login button */
  private readonly proceedAfterLoginBtn: Locator;
  /** Locator for the logged in message */
  private readonly loggedInMessage: Locator;

  /**
   * Creates an instance of CheckoutPage.
   * Initializes all locators needed for the checkout process.
   * @param page - The Playwright Page object
   */
  constructor(private page: Page) {
    // Cart locators
    this.productRows = page.locator("tbody tr");
    this.productTitles = page.locator('[data-test="product-title"]');
    this.productQuantities = page.locator('[data-test="product-quantity"]');
    this.productPrices = page.locator('[data-test="product-price"]');
    this.linePrices = page.locator('[data-test="line-price"]');
    this.cartTotal = page.locator('[data-test="cart-total"]');
    this.removeItemBtns = page.locator(".btn-danger");
    this.proceedBtn = page.locator('[data-test="proceed-1"]');
    this.proceedAfterLoginBtn = page.locator('[data-test="proceed-2"]');

    // Login locators
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginSubmitBtn = page.locator('[data-test="login-submit"]');
    this.registerLink = page.locator('[data-test="register-link"]');
    this.forgotPasswordLink = page.locator(
      '[data-test="forgot-password-link"]'
    );

    // Billing Address locators
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.countryInput = page.locator('[data-test="country"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.proceedToPaymentBtn = page.locator('[data-test="proceed-3"]');

    // Payment locators
    this.paymentMethodSelect = page.locator('[data-test="payment-method"]');
    this.confirmPaymentBtn = page.locator('[data-test="finish"]');

    this.successToast = page.locator(".toast-success .toast-message");

    this.cartItems = page.locator("tbody tr");

    // Add new locators
    this.proceedAfterLoginBtn = page.locator('[data-test="proceed-2"]');
    this.loggedInMessage = page.locator(".login-form-1 p");
  }

  async getCartItem(index: number): Promise<CartItem> {
    return new CartItem(this.cartItems.nth(index));
  }

  async getAllCartItems(): Promise<CartItem[]> {
    await this.cartItems.first().waitFor({ state: "visible" });
    const count = await this.cartItems.count();
    return Array.from(
      { length: count },
      (_, i) => new CartItem(this.cartItems.nth(i))
    );
  }

  /**
   * Updates quantity for a specific cart item
   * @param index - The index of the item in cart (0-based)
   * @param quantity - The new quantity to set
   */
  async updateQuantity(index: number, quantity: number): Promise<void> {
    await this.productQuantities.nth(index).fill(quantity.toString());
    await this.productQuantities.nth(index).press("Enter");
    await this.successToast.waitFor({ state: "visible" });
  }

  /**
   * Gets the total quantity of all items in cart
   * @returns Promise<number> Sum of all item quantities
   */
  async getTotalItemCount(): Promise<number> {
    const cartItems = await this.getAllCartItems();
    const quantities = await Promise.all(
      cartItems.map(async (item) => (await item.getDetails()).quantity)
    );
    return quantities.reduce((sum, qty) => sum + qty, 0);
  }

  /**
   * Removes a specific item from cart
   * @param index - The index of the item to remove (0-based)
   */
  async removeItem(index: number): Promise<void> {
    const cartItem = await this.getCartItem(index);
    const itemDetails = await cartItem.getDetails();
    const initialTotal = await this.getTotalItemCount();

    await cartItem.remove();

    // Wait for item to be removed and total count to update
    await expect
      .poll(async () => await this.getTotalItemCount())
      .toBe(initialTotal - itemDetails.quantity);
  }

  /**
   * Proceeds to the next step in the checkout process.
   * Order: Cart -> Sign In -> Billing Address -> Payment
   */
  async proceedToNextStep(index: number): Promise<void> {
    if (index === 0) {
      await this.proceedBtn.click();
    } else if (index === 1) {
      await this.proceedAfterLoginBtn.click();
    } else if (index === 2) {
      await this.proceedToPaymentBtn.click();
    }
  }

  /**
   * Fills in the billing address form.
   * @param address - Object containing address details:
   * - street: Street address
   * - city: City name
   * - state: State/province
   * - country: Country name
   * - postalCode: Postal/ZIP code
   */
  async fillBillingAddress(address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }): Promise<void> {
    await this.streetInput.fill(address.street);
    await this.cityInput.fill(address.city);
    await this.stateInput.fill(address.state);
    await this.countryInput.fill(address.country);
    await this.postalCodeInput.fill(address.postalCode);
  }

  /**
   * Selects the payment method for the order.
   * @param method - The payment method to select:
   * - bank-transfer: Bank Transfer
   * - cash-on-delivery: Cash on Delivery
   * - credit-card: Credit Card
   * - buy-now-pay-later: Buy Now Pay Later
   * - gift-card: Gift Card
   */
  async selectPaymentMethod(
    method:
      | "bank-transfer"
      | "cash-on-delivery"
      | "credit-card"
      | "buy-now-pay-later"
      | "gift-card"
  ): Promise<void> {
    await this.paymentMethodSelect.selectOption(method);
  }

  /**
   * Confirms the payment and completes the checkout process.
   * This is the final step of checkout.
   */
  async confirmPayment(): Promise<void> {
    await this.confirmPaymentBtn.click();
  }

  /**
   * Checks if the proceed to payment button is enabled.
   * Button is enabled when all required billing address fields are filled.
   * @returns Promise<boolean> True if button is enabled, false otherwise
   */
  async isProceedToPaymentEnabled(): Promise<boolean> {
    return !(await this.proceedToPaymentBtn.isDisabled());
  }

  /**
   * Checks if the confirm payment button is enabled.
   * Button is enabled when a valid payment method is selected.
   * @returns Promise<boolean> True if button is enabled, false otherwise
   */
  async isConfirmPaymentEnabled(): Promise<boolean> {
    return !(await this.confirmPaymentBtn.isDisabled());
  }

  /**
   * Checks if a success toast message is visible
   * @returns Promise<boolean> True if success toast is visible
   */
  async hasSuccessToast(): Promise<boolean> {
    return await this.successToast.isVisible();
  }

  /**
   * Gets the text content of the success toast message
   * @returns Promise<string> The success message text
   */
  async getSuccessToastMessage(): Promise<string> {
    await this.successToast.waitFor({ state: "visible" });
    return (await this.successToast.textContent()) || "";
  }

  /**
   * Logs in during checkout process
   * @param email - User's email
   * @param password - User's password
   * @returns Promise<void>
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmitBtn.click();

    // Wait for successful login
    await expect(this.loggedInMessage).toBeVisible();
    await expect(this.loggedInMessage).toContainText(
      "you are already logged in"
    );
    await expect(this.proceedAfterLoginBtn).toBeEnabled();
  }

  /**
   * Checks if user is logged in
   * @returns Promise<boolean> True if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    return await this.loggedInMessage.isVisible();
  }
}
