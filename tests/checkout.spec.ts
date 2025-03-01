import { test, expect } from "@playwright/test";
import { CheckoutPage } from "../pages/checkout-page";
import { ProductDetailsPage } from "../pages/product-details-page";
import { HomePage } from "../pages/home-page";
import {
  USER1_EMAIL,
  USER1_PASSWORD,
  MOCK_ADDRESS,
  MOCK_CREDIT_CARD,
  INVALID_CREDIT_CARD,
} from "../utils/constants";

test.describe("Checkout Page", () => {
  let checkoutPage: CheckoutPage;
  let homePage: HomePage;
  let productDetailsPage: ProductDetailsPage;

  test.beforeEach(async ({ page }) => {
    // Add two different products to cart
    homePage = new HomePage(page);
    await homePage.goto();

    // Add first product
    await homePage.products.clickProduct(0);
    productDetailsPage = new ProductDetailsPage(page);
    await productDetailsPage.addToCart();
    await productDetailsPage.hasSuccessToast();

    // Add second product
    await homePage.goto();
    await homePage.products.clickProduct(1);
    productDetailsPage = new ProductDetailsPage(page);
    await productDetailsPage.addToCart();
    await productDetailsPage.hasSuccessToast();

    // Navigate to checkout
    checkoutPage = new CheckoutPage(page);
    await page.goto("/checkout");
  });

  test("should display cart step elements", async ({ page }) => {
    const cartItems = await checkoutPage.getAllCartItems();
    expect(cartItems.length).toBe(2);

    // Check cart elements are visible
    const productTitles = page.locator('[data-test="product-title"]');
    await expect(productTitles).toHaveCount(2);
    await expect(productTitles.first()).toBeVisible();

    const quantities = page.locator('[data-test="product-quantity"]');
    await expect(quantities).toHaveCount(2);
    await expect(quantities.first()).toBeVisible();

    const prices = page.locator('[data-test="product-price"]');
    await expect(prices).toHaveCount(2);
    await expect(prices.first()).toBeVisible();

    const linePrices = page.locator('[data-test="line-price"]');
    await expect(linePrices).toHaveCount(2);
    await expect(linePrices.first()).toBeVisible();

    // These should be single elements
    await expect(page.locator('[data-test="cart-total"]')).toBeVisible();
    await expect(page.locator('[data-test="proceed-1"]')).toBeVisible();
  });

  test("should handle cart item quantity updates", async () => {
    const cartItem = await checkoutPage.getCartItem(0);
    const initialDetails = await cartItem.getDetails();
    await cartItem.updateQuantity(2);

    const updatedDetails = await cartItem.getDetails();
    expect(updatedDetails.quantity).toBe(2);
    expect(updatedDetails.total).toBe(initialDetails.price * 2);
  });

  test("should handle cart item removal", async () => {
    const cartItems = await checkoutPage.getAllCartItems();
    const initialCount = cartItems.length;

    await checkoutPage.removeItem(0);

    const remainingItems = await checkoutPage.getAllCartItems();
    expect(remainingItems.length).toBe(initialCount - 1);
  });

  test("should handle login during checkout", async ({ page }) => {
    await checkoutPage.proceedFromCartToSignIn();

    await checkoutPage.login(USER1_EMAIL, USER1_PASSWORD);
    expect(await checkoutPage.isLoggedIn()).toBe(true);

    // Verify we can proceed after login
    await expect(page.locator('[data-test="proceed-2"]')).toBeEnabled();
  });

  test("should proceed through checkout steps", async ({ page }) => {
    // Cart -> Login
    await checkoutPage.proceedFromCartToSignIn();
    await checkoutPage.login(USER1_EMAIL, USER1_PASSWORD);
    expect(await checkoutPage.isLoggedIn()).toBe(true);

    // Login -> Billing
    await checkoutPage.proceedFromSignInToBilling();
    await expect(page.locator('[data-test="street"]')).toBeVisible();

    // Fill billing address and proceed
    await checkoutPage.fillBillingAddress(MOCK_ADDRESS);
    await checkoutPage.proceedFromBillingToPayment();

    // Verify on payment step
    await expect(page.locator('[data-test="payment-method"]')).toBeVisible();

    // Fill payment method and proceed
    await checkoutPage.selectPaymentMethod("credit-card");
    await checkoutPage.fillCreditCardDetails(MOCK_CREDIT_CARD);
    await checkoutPage.confirmPayment();

    // Verify payment completed
    const successMsg = await checkoutPage.getPaymentSuccessMessage();
    expect(successMsg).toBe("Payment was successful");
  });

  test("should validate credit card details", async ({ page }) => {
    // Navigate to payment step
    await checkoutPage.proceedFromCartToSignIn();
    await checkoutPage.login(USER1_EMAIL, USER1_PASSWORD);
    await checkoutPage.proceedFromSignInToBilling();
    await checkoutPage.fillBillingAddress(MOCK_ADDRESS);
    await checkoutPage.proceedFromBillingToPayment();

    // Select credit card payment
    await checkoutPage.selectPaymentMethod("credit-card");

    // Try invalid card details
    await checkoutPage.fillCreditCardDetails(INVALID_CREDIT_CARD);
    const errors = await checkoutPage.getCreditCardErrors();
    expect(errors.number).toContain("Invalid card number format");
    expect(errors.expiryDate).toContain("Invalid date format");
    expect(errors.cvv).toContain("must be 3 or 4 digits");
    expect(await checkoutPage.isConfirmPaymentEnabled()).toBe(false);

    // Try valid card details
    await checkoutPage.fillCreditCardDetails(MOCK_CREDIT_CARD);
    expect(await checkoutPage.getCreditCardErrors()).toEqual({});
    expect(await checkoutPage.isConfirmPaymentEnabled()).toBe(true);
  });

  test("should complete credit card payment successfully", async ({ page }) => {
    // Navigate to payment step
    await checkoutPage.proceedFromCartToSignIn();
    await checkoutPage.login(USER1_EMAIL, USER1_PASSWORD);
    await checkoutPage.proceedFromSignInToBilling();
    await checkoutPage.fillBillingAddress(MOCK_ADDRESS);
    await checkoutPage.proceedFromBillingToPayment();

    // Complete credit card payment
    await checkoutPage.selectPaymentMethod("credit-card");
    await checkoutPage.fillCreditCardDetails(MOCK_CREDIT_CARD);
    await checkoutPage.confirmPayment();

    // Verify success message
    const successMsg = await checkoutPage.getPaymentSuccessMessage();
    expect(successMsg).toBe("Payment was successful");
  });
});
