import { Locator, Page } from "@playwright/test";

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
  /** Locator for the product title in cart */
  private readonly productTitle: Locator;
  /** Locator for the product quantity input */
  private readonly productQuantity: Locator;
  /** Locator for the product unit price */
  private readonly productPrice: Locator;
  /** Locator for the line item total price */
  private readonly linePrice: Locator;
  /** Locator for the cart total amount */
  private readonly cartTotal: Locator;
  /** Locator for the remove item button */
  private readonly removeItemBtn: Locator;
  /** Locator for the proceed to next step button */
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

  /**
   * Creates an instance of CheckoutPage.
   * Initializes all locators needed for the checkout process.
   * @param page - The Playwright Page object
   */
  constructor(private page: Page) {
    // Cart locators
    this.productTitle = page.locator('[data-test="product-title"]');
    this.productQuantity = page.locator('[data-test="product-quantity"]');
    this.productPrice = page.locator('[data-test="product-price"]');
    this.linePrice = page.locator('[data-test="line-price"]');
    this.cartTotal = page.locator('[data-test="cart-total"]');
    this.removeItemBtn = page.locator(".btn-danger");
    this.proceedBtn = page.locator('[data-test="proceed-1"]');

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
  }

  /**
   * Retrieves details of the current cart item.
   * @returns Promise<Object> containing:
   * - title: The product title
   * - quantity: The current quantity
   * - price: The unit price
   * - total: The line item total
   */
  async getCartItemDetails(): Promise<{
    title: string;
    quantity: number;
    price: number;
    total: number;
  }> {
    return {
      title: (await this.productTitle.textContent())?.trim() || "",
      quantity: parseInt((await this.productQuantity.inputValue()) || "0"),
      price: parseFloat(
        (await this.productPrice.textContent())?.replace("$", "") || "0"
      ),
      total: parseFloat(
        (await this.linePrice.textContent())?.replace("$", "") || "0"
      ),
    };
  }

  /**
   * Gets the total amount for all items in the cart.
   * @returns Promise<number> The cart total amount
   */
  async getCartTotal(): Promise<number> {
    const total = (await this.cartTotal.textContent())?.replace("$", "") || "0";
    return parseFloat(total);
  }

  /**
   * Updates the quantity of the current cart item.
   * @param quantity - The new quantity to set
   */
  async updateQuantity(quantity: number): Promise<void> {
    await this.productQuantity.fill(quantity.toString());
    await this.productQuantity.press("Enter");
    await this.successToast.waitFor({ state: "visible" });
  }

  /**
   * Removes the current item from the cart.
   */
  async removeItem(): Promise<void> {
    await this.removeItemBtn.click();
  }

  /**
   * Proceeds to the next step in the checkout process.
   * Order: Cart -> Sign In -> Billing Address -> Payment
   */
  async proceedToNextStep(): Promise<void> {
    await this.proceedBtn.click();
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
}
